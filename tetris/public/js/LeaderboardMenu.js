/**
 * Menu de classement en ligne
 */
class LeaderboardMenu {
    constructor(container) {
        this.container = container;
        this.backToMenuCallback = null;
        this.currentMode = 'classic';
        this.currentPeriod = 'all';
    }

    /**
     * Définit le callback de retour au menu
     */
    setBackToMenuCallback(callback) {
        this.backToMenuCallback = callback;
    }

    /**
     * Affiche le menu de classement
     */
    async render() {
        this.container.innerHTML = '';

        const menuContainer = Utilities.createElement('div', { class: 'menu-container' });
        
        // Titre
        const title = Utilities.createElement('h1', { class: 'menu-title' }, 
            GameSettings.language === 'fr' ? 'CLASSEMENT' : 'LEADERBOARD');
        menuContainer.appendChild(title);

        // Filtres
        const filtersContainer = Utilities.createElement('div', { 
            class: 'leaderboard-filters',
            style: 'display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap;'
        });

        // Mode
        const modes = [
            { value: 'classic', label: GameSettings.language === 'fr' ? 'Classique' : 'Classic' },
            { value: 'challenge', label: GameSettings.language === 'fr' ? 'Défi' : 'Challenge' }
        ];

        modes.forEach(mode => {
            const modeBtn = Utilities.createElement('button', {
                class: this.currentMode === mode.value ? 'active' : '',
                style: 'padding: 0.5rem 1rem; font-size: 0.8rem;'
            }, mode.label);
            
            modeBtn.addEventListener('click', () => {
                this.currentMode = mode.value;
                this.render();
            });
            
            filtersContainer.appendChild(modeBtn);
        });

        // Période
        const periods = [
            { value: 'all', label: GameSettings.language === 'fr' ? 'Tout' : 'All Time' },
            { value: 'monthly', label: GameSettings.language === 'fr' ? 'Mois' : 'Month' },
            { value: 'weekly', label: GameSettings.language === 'fr' ? 'Semaine' : 'Week' },
            { value: 'daily', label: GameSettings.language === 'fr' ? 'Jour' : 'Day' }
        ];

        periods.forEach(period => {
            const periodBtn = Utilities.createElement('button', {
                class: this.currentPeriod === period.value ? 'active' : '',
                style: 'padding: 0.5rem 1rem; font-size: 0.8rem;'
            }, period.label);
            
            periodBtn.addEventListener('click', () => {
                this.currentPeriod = period.value;
                this.render();
            });
            
            filtersContainer.appendChild(periodBtn);
        });

        menuContainer.appendChild(filtersContainer);

        // Affichage du classement
        const loadingMsg = Utilities.createElement('div', { 
            style: 'text-align: center; margin: 2rem 0;'
        }, GameSettings.language === 'fr' ? 'Chargement...' : 'Loading...');
        menuContainer.appendChild(loadingMsg);

        // Charge le classement
        try {
            console.log('Chargement du classement pour mode:', this.currentMode, 'période:', this.currentPeriod);
            const data = await window.apiService.getLeaderboard(
                this.currentMode, 
                50, 
                this.currentPeriod
            );
            
            console.log('Données du classement reçues:', data);

            menuContainer.removeChild(loadingMsg);

            if (data.success && data.leaderboard.length > 0) {
                console.log('Affichage de', data.leaderboard.length, 'scores dans le classement');
                const leaderboardContainer = this.createLeaderboardTable(data.leaderboard);
                menuContainer.appendChild(leaderboardContainer);
            } else {
                console.log('Aucun score trouvé dans le classement');
                const noDataMsg = Utilities.createElement('div', { 
                    style: 'text-align: center; margin: 2rem 0;'
                }, GameSettings.language === 'fr' 
                    ? 'Aucun score enregistré' 
                    : 'No scores recorded');
                menuContainer.appendChild(noDataMsg);
            }

            // Affiche le rang de l'utilisateur si connecté
            if (window.apiService.isAuthenticated()) {
                const rankData = await window.apiService.getMyRank(this.currentMode);
                if (rankData.success && rankData.rank) {
                    const myRank = Utilities.createElement('div', {
                        style: 'background: rgba(255,255,255,0.1); padding: 1rem; margin-top: 1rem; border-radius: 8px; text-align: center;'
                    }, `${GameSettings.language === 'fr' ? 'Votre rang' : 'Your rank'}: #${rankData.rank} - ${rankData.score} pts`);
                    menuContainer.appendChild(myRank);
                }
            }
        } catch (error) {
            menuContainer.removeChild(loadingMsg);
            const errorMsg = Utilities.createElement('div', { 
                style: 'color: #ff6b6b; text-align: center; margin: 2rem 0;'
            }, GameSettings.language === 'fr' 
                ? 'Erreur lors du chargement du classement' 
                : 'Error loading leaderboard');
            menuContainer.appendChild(errorMsg);
        }

        // Bouton retour
        const backButton = Utilities.createElement('button', { 
            style: 'margin-top: 2rem;' 
        }, Utilities.translate('backToMenu'));
        backButton.addEventListener('click', () => {
            if (this.backToMenuCallback) {
                this.backToMenuCallback();
            }
        });
        menuContainer.appendChild(backButton);

        this.container.appendChild(menuContainer);
    }

    /**
     * Crée le tableau de classement
     */
    createLeaderboardTable(leaderboard) {
        const table = Utilities.createElement('div', {
            class: 'leaderboard-table',
            style: 'max-height: 400px; overflow-y: auto; margin: 1rem 0;'
        });

        leaderboard.forEach((entry, index) => {
            const row = Utilities.createElement('div', {
                class: 'leaderboard-row',
                style: `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem;
                    margin-bottom: 0.5rem;
                    background: ${index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'};
                    border-radius: 4px;
                    ${index < 3 ? 'background: linear-gradient(90deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05));' : ''}
                `
            });

            // Rang
            const rank = Utilities.createElement('div', {
                style: 'min-width: 40px; font-weight: bold; color: var(--primary);'
            }, `#${index + 1}`);

            // Nom
            const name = Utilities.createElement('div', {
                style: 'flex: 1; margin: 0 1rem;'
            }, entry.username);

            // Score
            const score = Utilities.createElement('div', {
                style: 'min-width: 80px; text-align: right; font-weight: bold;'
            }, entry.score.toLocaleString());

            // Détails
            const details = Utilities.createElement('div', {
                style: 'min-width: 100px; text-align: right; font-size: 0.8rem; opacity: 0.7;'
            }, `L${entry.level} | ${entry.lines} ${GameSettings.language === 'fr' ? 'lignes' : 'lines'}`);

            row.appendChild(rank);
            row.appendChild(name);
            row.appendChild(score);
            row.appendChild(details);

            table.appendChild(row);
        });

        return table;
    }
}
