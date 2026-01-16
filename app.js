// Main Application JavaScript
class TourneyProApp {
    constructor() {
        this.currentUser = null;
        this.deferredPrompt = null;
        this.init();
    }

    async init() {
        // Check authentication
        await this.checkAuth();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial screen
        this.loadScreen('home');
        
        // Check for PWA install prompt
        this.setupPWAInstall();
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('app').style.display = 'block';
        }, 1000);
    }

    async checkAuth() {
        // Mock authentication for demo
        this.currentUser = {
            id: '12345678',
            name: 'Player_Alpha',
            balance: 1550,
            totalEarnings: 12500
        };
        
        this.updateUserInfo();
    }

    updateUserInfo() {
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userId').textContent = `ID: ${this.currentUser.id}`;
        document.getElementById('balanceDisplay').innerHTML = 
            `<i class="fas fa-coins"></i><span>${this.currentUser.balance.toLocaleString()}</span> COINS`;
    }

    setupEventListeners() {
        // Menu toggle
        document.querySelector('.menu-btn').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.add('show');
            document.querySelector('.sidebar-overlay').classList.add('show');
        });

        document.querySelector('.close-sidebar').addEventListener('click', () => {
            this.closeSidebar();
        });

        document.querySelector('.sidebar-overlay').addEventListener('click', () => {
            this.closeSidebar();
        });

        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const screen = item.getAttribute('href').substring(1);
                
                // Update active states
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Update sidebar menu
                document.querySelectorAll('.menu-item').forEach(menu => menu.classList.remove('active'));
                const menuItem = document.querySelector(`.menu-item[href="#${screen}"]`);
                if (menuItem) menuItem.classList.add('active');
                
                this.loadScreen(screen);
            });
        });

        // Sidebar menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const screen = item.getAttribute('href').substring(1);
                
                // Update active states
                document.querySelectorAll('.menu-item').forEach(menu => menu.classList.remove('active'));
                item.classList.add('active');
                
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                const navItem = document.querySelector(`.nav-item[href="#${screen}"]`);
                if (navItem) navItem.classList.add('active');
                
                this.loadScreen(screen);
                this.closeSidebar();
            });
        });

        // Join tournament buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('join-btn')) {
                this.joinTournament(e.target.closest('.tournament-card'));
            }
            
            if (e.target.classList.contains('copy-btn')) {
                this.copyToClipboard('FG45SD');
            }
            
            if (e.target.id === 'logoutBtn') {
                this.logout();
            }
        });

        // Install prompt
        document.getElementById('installBtn').addEventListener('click', () => {
            this.installPWA();
        });

        document.getElementById('closePrompt').addEventListener('click', () => {
            document.getElementById('installPrompt').style.display = 'none';
        });
    }

    closeSidebar() {
        document.querySelector('.sidebar').classList.remove('show');
        document.querySelector('.sidebar-overlay').classList.remove('show');
    }

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
            default:
                content.innerHTML = this.getHomeScreen();
        }
        
        // Update title
        const titles = {
            'home': 'Home',
            'tournaments': 'Tournaments',
            'live-matches': 'Live Matches',
            'wallet': 'Wallet'
        };
        
        if (titles[screenName]) {
            document.title = `${titles[screenName]} - TourneyPro`;
        }
    }

    getHomeScreen() {
        return `
            <div class="screen active" id="home-screen">
                <div class="welcome-banner">
                    <h2>Welcome, ${this.currentUser.name}!</h2>
                    <p>Join tournaments and win big prizes</p>
                </div>

                <div class="featured-tournaments">
                    <h3 class="section-title">FEATURED TOURNAMENTS</h3>
                    
                    <div class="tournament-card featured">
                        <div class="tournament-header">
                            <h4>GRAND FINALS: BERMUDA TRI-SERIES</h4>
                            <span class="tag">WEEKEND RU</span>
                        </div>
                        <div class="tournament-info">
                            <p><i class="fas fa-users"></i> KALAAHI CHA</p>
                            <button class="join-btn">JOIN NOW</button>
                        </div>
                    </div>

                    <div class="tournament-card">
                        <div class="tournament-header">
                            <h4>DAILY SCRIMS: PURGATORY CUP</h4>
                            <span class="tag">DAILY</span>
                        </div>
                        <div class="tournament-info">
                            <p><i class="fas fa-users"></i> Only 16 left!</p>
                            <button class="join-btn">JOIN NOW</button>
                        </div>
                    </div>

                    <div class="tournament-card">
                        <div class="tournament-header">
                            <h4>WEEKEND RU: KALAAHI CHA</h4>
                            <span class="tag">WEEKEND</span>
                        </div>
                        <div class="tournament-info">
                            <p><i class="fas fa-users"></i> Squad Matches</p>
                            <button class="join-btn">JOIN NOW</button>
                        </div>
                    </div>
                </div>

                <div class="quick-actions">
                    <h3 class="section-title">QUICK PLAY</h3>
                    <div class="action-buttons">
                        <button class="action-btn">
                            <i class="fas fa-user"></i>
                            <span>SOLO</span>
                        </button>
                        <button class="action-btn">
                            <i class="fas fa-user-friends"></i>
                            <span>DUO</span>
                        </button>
                        <button class="action-btn">
                            <i class="fas fa-users"></i>
                            <span>SQUAD</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getTournamentsScreen() {
        return `
            <div class="screen active" id="tournaments-screen">
                <h2 class="screen-title">All Tournaments</h2>
                
                <div class="tournament-list">
                    <div class="tournament-card detailed">
                        <div class="tournament-header">
                            <h4>DAILY SCRIMS: PURGATORY CUP</h4>
                            <span class="tag live">LIVE</span>
                        </div>
                        <div class="tournament-details">
                            <div class="detail">
                                <i class="fas fa-trophy"></i>
                                <span>PRIZE POOL: ₹ 2,000</span>
                            </div>
                            <div class="detail">
                                <i class="fas fa-skull"></i>
                                <span>PER KILL: ₹ 15</span>
                            </div>
                            <div class="detail">
                                <i class="fas fa-ticket-alt"></i>
                                <span>ENTRY FEE: ₹ 50</span>
                            </div>
                            <div class="detail">
                                <i class="fas fa-users"></i>
                                <span>Joined: 32/48</span>
                            </div>
                        </div>
                        <button class="join-btn full-width">JOIN NOW</button>
                    </div>
                    
                    <div class="tournament-card">
                        <div class="tournament-header">
                            <h4>WEEKLY SHOWDOWN</h4>
                            <span class="tag">WEEKLY</span>
                        </div>
                        <div class="tournament-info">
                            <p>Prize Pool: ₹ 5,000 | Entry: ₹ 100</p>
                            <button class="join-btn">JOIN NOW</button>
                        </div>
                    </div>
                    
                    <div class="tournament-card">
                        <div class="tournament-header">
                            <h4>MONTHLY GRAND TOURNAMENT</h4>
                            <span class="tag">MONTHLY</span>
                        </div>
                        <div class="tournament-info">
                            <p>Prize Pool: ₹ 25,000 | Entry: ₹ 500</p>
                            <button class="join-btn">JOIN NOW</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getLiveMatchesScreen() {
        return `
            <div class="screen active" id="live-matches-screen">
                <h2 class="screen-title">LIVE MATCHES</h2>
                
                <div class="live-match-card">
                    <div class="match-header">
                        <h3>AUANIG vs SUABS</h3>
                        <span class="match-id">ROOM ID: FG45SD</span>
                    </div>
                    
                    <div class="match-timer">
                        <div class="timer">00:09:45</div>
                        <div class="timer-label">Until Start Time</div>
                    </div>
                    
                    <div class="room-info">
                        <div class="info-item">
                            <i class="fas fa-key"></i>
                            <span>Password: *****</span>
                        </div>
                        <button class="copy-btn">
                            <i class="fas fa-copy"></i> Copy Room ID
                        </button>
                    </div>
                    
                    <div class="players-list">
                        <h4>Joined Players (40/48)</h4>
                        <div class="player">
                            <span>Player_Alpha</span>
                            <span class="status ready">Ready</span>
                        </div>
                        <div class="player">
                            <span>Player_Beta</span>
                            <span class="status ready">Ready</span>
                        </div>
                        <div class="player">
                            <span>Player_Rata</span>
                            <span class="status ready">Ready</span>
                        </div>
                        <div class="player">
                            <span>Player_Gamma</span>
                            <span class="status ready">Ready</span>
                        </div>
                        <div class="player">
                            <span>Player_Delta</span>
                            <span class="status ready">Ready</span>
                        </div>
                    </div>
                    
                    <button class="watch-btn">
                        <i class="fas fa-play-circle"></i> WATCH LIVE STREAM
                    </button>
                </div>
                
                <div class="live-match-card">
                    <div class="match-header">
                        <h3>TEAM RED vs TEAM BLUE</h3>
                        <span class="match-id">ROOM ID: AB23CD</span>
                    </div>
                    
                    <div class="match-timer">
                        <div class="timer">00:15:30</div>
                        <div class="timer-label">Match in Progress</div>
                    </div>
                    
                    <div class="room-info">
                        <div class="info-item">
                            <i class="fas fa-key"></i>
                            <span>Password: *****</span>
                        </div>
                        <button class="copy-btn">
                            <i class="fas fa-copy"></i> Copy Room ID
                        </button>
                    </div>
                    
                    <button class="watch-btn">
                        <i class="fas fa-play-circle"></i> WATCH LIVE STREAM
                    </button>
                </div>
            </div>
        `;
    }

    getMatchHistoryScreen() {
        return `
            <div class="screen active" id="match-history-screen">
                <h2 class="screen-title">Match History</h2>
                
                <div class="history-list">
                    <div class="history-card">
                        <div class="history-header">
                            <h4>MATCH 2012</h4>
                            <span class="history-date">Today, 14:30</span>
                        </div>
                        <div class="history-details">
                            <div class="detail">
                                <span>Rank:</span>
                                <strong>#1</strong>
                            </div>
                            <div class="detail">
                                <span>Kills:</span>
                                <strong>12</strong>
                            </div>
                            <div class="detail">
                                <span>Winnings:</span>
                                <strong class="winnings">212,000 COINS</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div class="history-card">
                        <div class="history-header">
                            <h4>MATCH 2024</h4>
                            <span class="history-date">Yesterday, 18:45</span>
                        </div>
                        <div class="history-details">
                            <div class="detail">
                                <span>Rank:</span>
                                <strong>#3</strong>
                            </div>
                            <div class="detail">
                                <span>Kills:</span>
                                <strong>8</strong>
                            </div>
                            <div class="detail">
                                <span>Winnings:</span>
                                <strong class="winnings">85,000 COINS</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div class="history-card">
                        <div class="history-header">
                            <h4>MATCH 2023</h4>
                            <span class="history-date">2 days ago</span>
                        </div>
                        <div class="history-details">
                            <div class="detail">
                                <span>Rank:</span>
                                <strong>#1</strong>
                            </div>
                            <div class="detail">
                                <span>Kills:</span>
                                <strong>15</strong>
                            </div>
                            <div class="detail">
                                <span>Winnings:</span>
                                <strong class="winnings">250,000 COINS</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getWalletScreen() {
        return `
            <div class="screen active" id="wallet-screen">
                <div class="wallet-summary">
                    <div class="player-id">
                        <span>PLAYER ID:</span>
                        <strong>${this.currentUser.id}</strong>
                    </div>
                    <div class="total-earning">
                        <span>TOTAL EARNINGS:</span>
                        <strong>${this.currentUser.totalEarnings.toLocaleString()} COINS</strong>
                    </div>
                </div>
                
                <div class="wallet-actions">
                    <h3>ADD COINS</h3>
                    <div class="action-icons">
                        <button class="icon-btn"><i class="fas fa-sync-alt"></i></button>
                        <button class="icon-btn"><i class="fas fa-shopping-cart"></i></button>
                        <button class="icon-btn"><i class="fas fa-university"></i></button>
                        <button class="icon-btn"><i class="fas fa-dice"></i></button>
                        <button class="icon-btn"><i class="fas fa-hat-wizard"></i></button>
                        <button class="icon-btn"><i class="fas fa-rocket"></i></button>
                    </div>
                    
                    <h3>WITHDRAW</h3>
                    <div class="withdraw-options">
                        <button class="withdraw-btn">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>₹ 500</span>
                        </button>
                        <button class="withdraw-btn">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>₹ 1000</span>
                        </button>
                        <button class="withdraw-btn">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>₹ 2000</span>
                        </button>
                        <button class="withdraw-btn">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>₹ 5000</span>
                        </button>
                    </div>
                </div>
                
                <div class="transaction-history">
                    <h3>Transaction History</h3>
                    <div class="transaction-list">
                        <div class="transaction">
                            <span>Deposited 500 COINS</span>
                            <span class="amount">5,50.00K</span>
                        </div>
                        <div class="transaction">
                            <span>Joined tournament</span>
                            <span class="amount">12,80.00K</span>
                        </div>
                        <div class="transaction">
                            <span>Joined tournament</span>
                            <span class="amount">24,00.00K</span>
                        </div>
                        <div class="transaction">
                            <span>Deposited 1,000 COINS</span>
                            <span class="amount">15,00.00K</span>
                        </div>
                        <div class="transaction">
                            <span>Withdrawn 2,000 COINS</span>
                            <span class="amount">2,15.000</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getLeaderboardScreen() {
        return `
            <div class="screen active" id="leaderboard-screen">
                <h2 class="screen-title">Leaderboard</h2>
                
                <div class="leaderboard-tabs">
                    <button class="tab-btn active">DAILY</button>
                    <button class="tab-btn">WEEKLY</button>
                    <button class="tab-btn">MONTHLY</button>
                </div>
                
                <div class="leaderboard-list">
                    <div class="leaderboard-item top">
                        <div class="rank">#1</div>
                        <div class="player-info">
                            <div class="avatar">T</div>
                            <div>
                                <h4>Top_Player</h4>
                                <p>Kills: 245 | Wins: 42</p>
                            </div>
                        </div>
                        <div class="points">12,450 PTS</div>
                    </div>
                    
                    <div class="leaderboard-item">
                        <div class="rank">#2</div>
                        <div class="player-info">
                            <div class="avatar">P</div>
                            <div>
                                <h4>Pro_Gamer</h4>
                                <p>Kills: 198 | Wins: 35</p>
                            </div>
                        </div>
                        <div class="points">10,850 PTS</div>
                    </div>
                    
                    <div class="leaderboard-item">
                        <div class="rank">#3</div>
                        <div class="player-info">
                            <div class="avatar">S</div>
                            <div>
                                <h4>Shooter_X</h4>
                                <p>Kills: 176 | Wins: 28</p>
                            </div>
                        </div>
                        <div class="points">9,720 PTS</div>
                    </div>
                </div>
            </div>
        `;
    }

    getFriendsScreen() {
        return `
            <div class="screen active" id="friends-screen">
                <h2 class="screen-title">Friends</h2>
                
                <div class="friends-list">
                    <div class="friend-item online">
                        <div class="friend-info">
                            <div class="avatar">B</div>
                            <div>
                                <h4>Player_Beta</h4>
                                <p>In Match: PURGATORY CUP</p>
                            </div>
                        </div>
                        <div class="friend-status">
                            <span class="status-dot"></span>
                            <span>Online</span>
                        </div>
                    </div>
                    
                    <div class="friend-item online">
                        <div class="friend-info">
                            <div class="avatar">R</div>
                            <div>
                                <h4>Player_Rata</h4>
                                <p>Available</p>
                            </div>
                        </div>
                        <div class="friend-status">
                            <span class="status-dot"></span>
                            <span>Online</span>
                        </div>
                    </div>
                    
                    <div class="friend-item offline">
                        <div class="friend-info">
                            <div class="avatar">G</div>
                            <div>
                                <h4>Player_Gamma</h4>
                                <p>Last seen 2 hours ago</p>
                            </div>
                        </div>
                        <div class="friend-status">
                            <span>Offline</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSettingsScreen() {
        return `
            <div class="screen active" id="settings-screen">
                <h2 class="screen-title">Settings</h2>
                
                <div class="settings-list">
                    <div class="setting-item">
                        <i class="fas fa-user-cog"></i>
                        <div>
                            <h4>Profile Settings</h4>
                            <p>Update your profile information</p>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    
                    <div class="setting-item">
                        <i class="fas fa-bell"></i>
                        <div>
                            <h4>Notifications</h4>
                            <p>Manage your notification preferences</p>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    
                    <div class="setting-item">
                        <i class="fas fa-shield-alt"></i>
                        <div>
                            <h4>Privacy & Security</h4>
                            <p>Change password and security settings</p>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    
                    <div class="setting-item">
                        <i class="fas fa-moon"></i>
                        <div>
                            <h4>Dark Mode</h4>
                            <p>Toggle dark/light theme</p>
                        </div>
                        <div class="toggle-switch">
                            <input type="checkbox" id="darkModeToggle" checked>
                            <label for="darkModeToggle"></label>
                        </div>
                    </div>
                    
                    <div class="setting-item">
                        <i class="fas fa-language"></i>
                        <div>
                            <h4>Language</h4>
                            <p>English (Default)</p>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    
                    <div class="setting-item">
                        <i class="fas fa-question-circle"></i>
                        <div>
                            <h4>Help & Support</h4>
                            <p>FAQ and contact support</p>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    
                    <div class="setting-item">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <h4>About</h4>
                            <p>App version 1.0.0</p>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
            </div>
        `;
    }

    joinTournament(tournamentCard) {
        const tournamentName = tournamentCard.querySelector('h4').textContent;
        
        if (this.currentUser.balance < 50) {
            alert('Insufficient balance! Please add more coins.');
            return;
        }
        
        if (confirm(`Join ${tournamentName} for 50 COINS?`)) {
            this.currentUser.balance -= 50;
            this.updateUserInfo();
            
            alert('Successfully joined the tournament! Room details will be shared soon.');
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Room ID copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }

    setupPWAInstall() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            
            // Show install prompt after 5 seconds
            setTimeout(() => {
                if (this.deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
                    document.getElementById('installPrompt').style.display = 'block';
                }
            }, 5000);
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            document.getElementById('installPrompt').style.display = 'none';
        });
    }

    async installPWA() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }
        
        this.deferredPrompt = null;
        document.getElementById('installPrompt').style.display = 'none';
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // In real app, call Firebase auth signOut
            window.location.reload();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TourneyProApp();
});

// Add CSS for new screens
const additionalCSS = `
    /* Match History */
    .history-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 15px;
        border-left: 4px solid #00ff88;
    }
    
    .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .history-date {
        color: #aaa;
        font-size: 0.9rem;
    }
    
    .history-details {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }
    
    .winnings {
        color: #00ff88;
    }
    
    /* Leaderboard */
    .leaderboard-tabs {
        display: flex;
        gap: 10px;
        margin: 20px 0;
    }
    
    .tab-btn {
        flex: 1;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 10px;
        color: #aaa;
        cursor: pointer;
    }
    
    .tab-btn.active {
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
    }
    
    .leaderboard-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        margin-bottom: 10px;
    }
    
    .leaderboard-item.top {
        background: linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
        border: 1px solid rgba(255, 215, 0, 0.3);
    }
    
    .rank {
        font-size: 1.5rem;
        font-weight: bold;
        width: 40px;
    }
    
    .player-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .player-info .avatar {
        width: 40px;
        height: 40px;
        background: linear-gradient(45deg, #00ccff, #00ff88);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    
    .points {
        color: #00ff88;
        font-weight: bold;
    }
    
    /* Friends */
    .friend-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        margin-bottom: 10px;
    }
    
    .friend-info {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .friend-info .avatar {
        width: 40px;
        height: 40px;
        background: rgba(0, 255, 136, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    
    .friend-status {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .status-dot {
        width: 8px;
        height: 8px;
        background: #00ff88;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }
    
    .friend-item.offline .friend-info .avatar {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .friend-item.offline .status-dot {
        background: #aaa;
    }
    
    /* Settings */
    .setting-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        margin-bottom: 10px;
    }
    
    .setting-item i:first-child {
        font-size: 1.2rem;
        color: #00ccff;
        width: 24px;
    }
    
    .setting-item > div {
        flex: 1;
    }
    
    .setting-item h4 {
        margin-bottom: 5px;
    }
    
    .setting-item p {
        color: #aaa;
        font-size: 0.9rem;
    }
    
    .toggle-switch {
        position: relative;
        width: 50px;
        height: 24px;
    }
    
    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .toggle-switch label {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 24px;
    }
    
    .toggle-switch label:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    
    .toggle-switch input:checked + label {
        background-color: #00ff88;
    }
    
    .toggle-switch input:checked + label:before {
        transform: translateX(26px);
    }
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);
