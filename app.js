// app.js ফাইলে getProfileScreen ফাংশন যোগ করুন
getProfileScreen() {
    const userData = this.currentUser || {
        name: 'Player_Alpha',
        id: '12345678',
        balance: 1550,
        totalEarnings: 12500,
        level: 15,
        matchesPlayed: 42,
        winRate: 68
    };

    return `
        <div class="screen active" id="profile-screen">
            <div class="profile-header">
                <div class="profile-avatar">
                    <div class="avatar-large">
                        <i class="fas fa-user"></i>
                    </div>
                    <button class="edit-avatar-btn">
                        <i class="fas fa-camera"></i>
                    </button>
                </div>
                
                <div class="profile-info">
                    <h2 class="player-name">${userData.name}</h2>
                    <div class="player-id-display">
                        <span>PLAYER ID:</span>
                        <strong id="profilePlayerId">${userData.id}</strong>
                        <button class="copy-id-btn" onclick="app.copyPlayerId('${userData.id}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    
                    <div class="player-stats">
                        <div class="stat-item">
                            <span class="stat-value">${userData.level}</span>
                            <span class="stat-label">Level</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${userData.matchesPlayed}</span>
                            <span class="stat-label">Matches</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${userData.winRate}%</span>
                            <span class="stat-label">Win Rate</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="wallet-summary profile-wallet">
                <div class="total-earning-display">
                    <span>TOTAL EARNING:</span>
                    <strong>${userData.totalEarnings.toLocaleString()} COINS</strong>
                </div>
                <div class="available-balance">
                    <span>Available Balance:</span>
                    <strong>${userData.balance.toLocaleString()} COINS</strong>
                </div>
            </div>
            
            <div class="action-buttons-container">
                <h3 class="section-title">ADD COINS</h3>
                <div class="action-icons-grid">
                    <button class="action-icon-btn" onclick="app.addCoins(100)">
                        <i class="fas fa-sync-alt"></i>
                        <span>🔄</span>
                    </button>
                    <button class="action-icon-btn" onclick="app.addCoins(500)">
                        <i class="fas fa-shopping-cart"></i>
                        <span>🛒</span>
                    </button>
                    <button class="action-icon-btn" onclick="app.addCoins(1000)">
                        <i class="fas fa-university"></i>
                        <span>🏦</span>
                    </button>
                    <button class="action-icon-btn" onclick="app.showLuckyDraw()">
                        <i class="fas fa-dice"></i>
                        <span>🎲</span>
                    </button>
                    <button class="action-icon-btn" onclick="app.showMagicBox()">
                        <i class="fas fa-hat-wizard"></i>
                        <span>🧙‍♂️</span>
                    </button>
                    <button class="action-icon-btn" onclick="app.showRocketBonus()">
                        <i class="fas fa-rocket"></i>
                        <span>🚀</span>
                    </button>
                </div>
                
                <h3 class="section-title">WITHDRAW</h3>
                <div class="withdraw-grid">
                    <button class="withdraw-amount-btn" onclick="app.withdrawCoins(500)">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>💰 500</span>
                    </button>
                    <button class="withdraw-amount-btn" onclick="app.withdrawCoins(1000)">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>💰 1000</span>
                    </button>
                    <button class="withdraw-amount-btn" onclick="app.withdrawCoins(2000)">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>💰 2000</span>
                    </button>
                    <button class="withdraw-amount-btn" onclick="app.withdrawCoins(5000)">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>💰 5000</span>
                    </button>
                </div>
            </div>
            
            <div class="transaction-history-section">
                <h3 class="section-title">Transaction History</h3>
                <div class="transaction-list-container" id="transactionList">
                    <!-- Transactions will be loaded dynamically -->
                </div>
            </div>
            
            <div class="profile-actions">
                <button class="profile-action-btn" onclick="app.loadScreen('settings')">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </button>
                <button class="profile-action-btn" onclick="app.loadScreen('match-history')">
                    <i class="fas fa-history"></i>
                    <span>Match History</span>
                </button>
                <button class="profile-action-btn" onclick="app.showAchievements()">
                    <i class="fas fa-trophy"></i>
                    <span>Achievements</span>
                </button>
                <button class="profile-action-btn" onclick="app.showInviteFriends()">
                    <i class="fas fa-share-alt"></i>
                    <span>Invite Friends</span>
                </button>
            </div>
        </div>
    `;
}

// প্রোফাইল পেজের জন্য অতিরিক্ত মেথড যোগ করুন
copyPlayerId(playerId) {
    navigator.clipboard.writeText(playerId)
        .then(() => {
            alert('Player ID copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy:', err);
        });
}

addCoins(amount) {
    if (confirm(`Add ${amount} coins to your wallet?`)) {
        // Firebase call to add coins
        if (window.firebaseService && window.firebaseService.currentUser) {
            firebaseService.addCoins(amount)
                .then(result => {
                    if (result.success) {
                        this.currentUser.balance += amount;
                        this.currentUser.totalEarnings += amount;
                        this.updateUserInfo();
                        alert(`Successfully added ${amount} coins!`);
                        this.loadScreen('profile'); // Refresh profile screen
                    } else {
                        alert('Error: ' + result.error);
                    }
                });
        } else {
            // Mock function for demo
            this.currentUser.balance += amount;
            this.currentUser.totalEarnings += amount;
            this.updateUserInfo();
            alert(`Successfully added ${amount} coins!`);
            this.loadScreen('profile');
        }
    }
}

withdrawCoins(amount) {
    if (this.currentUser.balance < amount) {
        alert('Insufficient balance!');
        return;
    }
    
    if (confirm(`Withdraw ${amount} coins to your bank account?`)) {
        // Firebase call to withdraw coins
        if (window.firebaseService && window.firebaseService.currentUser) {
            const bankDetails = prompt('Enter your bank account details:');
            if (bankDetails) {
                firebaseService.withdrawCoins(amount, bankDetails)
                    .then(result => {
                        if (result.success) {
                            this.currentUser.balance -= amount;
                            this.updateUserInfo();
                            alert(`Withdrawal request submitted! Transaction ID: ${result.withdrawalId}`);
                            this.loadScreen('profile');
                        } else {
                            alert('Error: ' + result.error);
                        }
                    });
            }
        } else {
            // Mock function for demo
            this.currentUser.balance -= amount;
            this.updateUserInfo();
            alert(`Withdrawal request submitted for ${amount} coins!`);
            this.loadScreen('profile');
        }
    }
}

// loadScreen ফাংশনে প্রোফাইল স্ক্রিন যোগ করুন
async loadScreen(screenName) {
    const content = document.getElementById('content');
    
    switch(screenName) {
        case 'home':
            content.innerHTML = this.getHomeScreen();
            break;
        case 'tournaments':
            content.innerHTML = this.getTournamentsScreen();
            break;
        case 'live-matches':
            content.innerHTML = this.getLiveMatchesScreen();
            break;
        case 'match-history':
            content.innerHTML = this.getMatchHistoryScreen();
            break;
        case 'wallet':
            content.innerHTML = this.getWalletScreen();
            break;
        case 'leaderboard':
            content.innerHTML = this.getLeaderboardScreen();
            break;
        case 'friends':
            content.innerHTML = this.getFriendsScreen();
            break;
        case 'settings':
            content.innerHTML = this.getSettingsScreen();
            break;
        case 'profile':
            content.innerHTML = this.getProfileScreen();
            this.loadTransactionHistory(); // Load transactions
            break;
        default:
            content.innerHTML = this.getHomeScreen();
    }
    
    // Update title
    const titles = {
        'home': 'Home',
        'tournaments': 'Tournaments',
        'live-matches': 'Live Matches',
        'wallet': 'Wallet',
        'profile': 'Profile'
    };
    
    if (titles[screenName]) {
        document.title = `${titles[screenName]} - TourneyPro`;
    }
}

// ট্রানজেকশন হিস্ট্রি লোড করার ফাংশন
loadTransactionHistory() {
    const transactionList = document.getElementById('transactionList');
    if (!transactionList) return;
    
    const transactions = [
        { id: 1, title: 'Deposited 500 COINS', date: 'Today, 14:30', amount: '5,50.00K', type: 'positive', status: 'success' },
        { id: 2, title: 'Joined tournament', date: 'Today, 13:15', amount: '-12,80.00K', type: 'negative', status: 'success' },
        { id: 3, title: 'Joined tournament', date: 'Yesterday', amount: '-24,00.00K', type: 'negative', status: 'success' },
        { id: 4, title: 'Deposited at Luens', date: '2 days ago', amount: '17,30.00K', type: 'positive', status: 'success' },
        { id: 5, title: 'Withdrawn from', date: '3 days ago', amount: '-2,15.000', type: 'negative', status: 'success' },
        { id: 6, title: 'Tournament Winning', date: 'Pending', amount: '+8,50.00K', type: 'pending', status: 'pending' }
    ];
    
    transactionList.innerHTML = transactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-icon ${transaction.status}">
                <i class="fas fa-${transaction.status === 'pending' ? 'clock' : 'check'}"></i>
            </div>
            <div class="transaction-details">
                <span class="transaction-title">${transaction.title}</span>
                <span class="transaction-date">${transaction.date}</span>
            </div>
            <div class="transaction-amount">
                <span class="amount-${transaction.type}">${transaction.amount}</span>
            </div>
        </div>
    `).join('');
}

// Firebase থেকে ট্রানজেকশন হিস্ট্রি লোড করার ফাংশন
async loadTransactionHistoryFromFirebase() {
    if (window.firebaseService && window.firebaseService.currentUser) {
        try {
            const transactions = await firebaseService.getTransactionHistory(10);
            const transactionList = document.getElementById('transactionList');
            
            if (transactionList && transactions.length > 0) {
                transactionList.innerHTML = transactions.map(transaction => `
                    <div class="transaction-item">
                        <div class="transaction-icon ${transaction.status}">
                            <i class="fas fa-${transaction.status === 'pending' ? 'clock' : 'check'}"></i>
                        </div>
                        <div class="transaction-details">
                            <span class="transaction-title">${transaction.type === 'deposit' ? 'Deposited' : transaction.type === 'withdrawal' ? 'Withdrawn' : transaction.type === 'tournament_entry' ? 'Joined tournament' : 'Tournament winning'} ${Math.abs(transaction.amount)} COINS</span>
                            <span class="transaction-date">${new Date(transaction.timestamp?.toDate()).toLocaleDateString()}</span>
                        </div>
                        <div class="transaction-amount">
                            <span class="amount-${transaction.amount > 0 ? 'positive' : 'negative'}">
                                ${transaction.amount > 0 ? '+' : ''}${transaction.amount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }
}
