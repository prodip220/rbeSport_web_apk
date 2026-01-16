// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
const auth = firebase.auth();

// Firebase Database Structure
/*
Collections:
1. users - User profiles
   - uid, name, email, balance, totalEarnings, joinedAt
   
2. tournaments - Tournament details
   - id, name, type, entryFee, prizePool, perKillPrize, maxPlayers, currentPlayers, status, startTime, roomId, password
   
3. matches - Match history
   - id, tournamentId, playerId, rank, kills, earnings, playedAt
   
4. transactions - Wallet transactions
   - id, userId, type, amount, balanceAfter, timestamp
   
5. live_matches - Current live matches
   - id, tournamentId, roomId, password, players, status, startedAt
   
6. leaderboard - Daily/weekly/monthly rankings
   - id, playerId, score, kills, wins, period
*/

class FirebaseService {
    constructor() {
        this.db = db;
        this.auth = auth;
        this.currentUser = null;
    }
    
    // User Authentication
    async register(email, password, name) {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            await this.db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                balance: 1000,
                totalEarnings: 0,
                joinedAt: new Date()
            });
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    async login(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            this.currentUser = userCredential.user;
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    async logout() {
        await this.auth.signOut();
        this.currentUser = null;
    }
    
    // Tournament Management
    async getTournaments() {
        const snapshot = await this.db.collection('tournaments')
            .where('status', '==', 'upcoming')
            .orderBy('startTime')
            .limit(10)
            .get();
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    
    async joinTournament(tournamentId, userId) {
        const tournamentRef = this.db.collection('tournaments').doc(tournamentId);
        const userRef = this.db.collection('users').doc(userId);
        
        // Run transaction to ensure data consistency
        return await this.db.runTransaction(async (transaction) => {
            const tournamentDoc = await transaction.get(tournamentRef);
            const userDoc = await transaction.get(userRef);
            
            if (!tournamentDoc.exists || !userDoc.exists) {
                throw new Error("Document does not exist!");
            }
            
            const tournament = tournamentDoc.data();
            const user = userDoc.data();
            
            // Check if tournament is full
            if (tournament.currentPlayers >= tournament.maxPlayers) {
                throw new Error("Tournament is full!");
            }
            
            // Check if user has enough balance
            if (user.balance < tournament.entryFee) {
                throw new Error("Insufficient balance!");
            }
            
            // Update tournament players
            transaction.update(tournamentRef, {
                currentPlayers: tournament.currentPlayers + 1
            });
            
            // Update user balance
            transaction.update(userRef, {
                balance: user.balance - tournament.entryFee
            });
            
            // Create transaction record
            const transactionRef = this.db.collection('transactions').doc();
            transaction.set(transactionRef, {
                userId: userId,
                type: 'tournament_entry',
                amount: -tournament.entryFee,
                balanceAfter: user.balance - tournament.entryFee,
                description: `Joined ${tournament.name}`,
                timestamp: new Date()
            });
            
            return {
                tournament: tournament,
                newBalance: user.balance - tournament.entryFee
            };
        });
    }
    
    // Live Matches
    async getLiveMatches() {
        const snapshot = await this.db.collection('live_matches')
            .where('status', '==', 'active')
            .limit(5)
            .get();
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    
    // User Data
    async getUserData(userId) {
        const doc = await this.db.collection('users').doc(userId).get();
        return doc.exists ? doc.data() : null;
    }
    
    async updateUserBalance(userId, amount, type) {
        const userRef = this.db.collection('users').doc(userId);
        
        return await this.db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            
            if (!userDoc.exists) {
                throw new Error("User does not exist!");
            }
            
            const user = userDoc.data();
            const newBalance = user.balance + amount;
            
            // Update user balance
            transaction.update(userRef, {
                balance: newBalance
            });
            
            // Create transaction record
            const transactionRef = this.db.collection('transactions').doc();
            transaction.set(transactionRef, {
                userId: userId,
                type: type,
                amount: amount,
                balanceAfter: newBalance,
                description: type === 'deposit' ? 'Added coins' : 'Withdrawn coins',
                timestamp: new Date()
            });
            
            return newBalance;
        });
    }
    
    // Real-time Listeners
    subscribeToTournaments(callback) {
        return this.db.collection('tournaments')
            .where('status', '==', 'upcoming')
            .onSnapshot((snapshot) => {
                const tournaments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(tournaments);
            });
    }
    
    subscribeToLiveMatches(callback) {
        return this.db.collection('live_matches')
            .where('status', '==', 'active')
            .onSnapshot((snapshot) => {
                const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(matches);
            });
    }
    
    subscribeToUserData(userId, callback) {
        return this.db.collection('users').doc(userId)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    callback(doc.data());
                }
            });
    }
}

// Export service
window.firebaseService = new FirebaseService();