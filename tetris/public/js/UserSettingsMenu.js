// UserSettingsMenu.js - Menu des paramètres utilisateur avec RGPD

/**
 * Classe pour le menu des paramètres utilisateur
 */
class UserSettingsMenu {
    /**
     * Crée une nouvelle instance du menu des paramètres utilisateur
     * @param {HTMLElement} container - Conteneur où afficher les paramètres
     */
    constructor(container) {
        this.container = container || document.getElementById('app');
        this.onBackToMenuCallback = null;
        this.user = null;
    }

    /**
     * Définit l'utilisateur actuel
     * @param {Object} user - Données de l'utilisateur
     */
    setUser(user) {
        this.user = user;
    }

    /**
     * Affiche le menu des paramètres utilisateur
     */
    render() {
        // Vide le conteneur
        this.container.innerHTML = '';

        // Crée le conteneur des paramètres utilisateur
        const settingsContainer = Utilities.createElement('div', { class: 'user-settings-container' });

        // Ajoute le titre
        const title = Utilities.createElement('h1', { class: 'user-settings-title' }, 'Paramètres Utilisateur');
        settingsContainer.appendChild(title);

        // Section Informations utilisateur
        const userInfoSection = Utilities.createElement('div', { class: 'settings-section' });
        userInfoSection.appendChild(Utilities.createElement('h2', { class: 'settings-section-title' }, 'Informations du compte'));

        if (this.user) {
            const userInfo = Utilities.createElement('div', { class: 'user-info-display' });
            userInfo.innerHTML = `
                <div class="info-row"><strong>Nom d'utilisateur:</strong> ${this.user.username}</div>
                <div class="info-row"><strong>Email:</strong> ${this.user.email}</div>
                <div class="info-row"><strong>Date d'inscription:</strong> ${new Date(this.user.createdAt).toLocaleDateString('fr-FR')}</div>
                <div class="info-row"><strong>Dernière connexion:</strong> ${new Date(this.user.lastLogin).toLocaleDateString('fr-FR')}</div>
            `;
            userInfoSection.appendChild(userInfo);
        }

        settingsContainer.appendChild(userInfoSection);

        // Section RGPD
        const rgpdSection = Utilities.createElement('div', { class: 'settings-section' });
        rgpdSection.appendChild(Utilities.createElement('h2', { class: 'settings-section-title' }, 'RGPD - Vos droits'));

        const rgpdContent = Utilities.createElement('div', { class: 'rgpd-content' });

        // Informations RGPD
        const rgpdInfo = Utilities.createElement('div', { class: 'rgpd-info' });
        rgpdInfo.innerHTML = `
            <p><strong>Vos droits selon le RGPD :</strong></p>
            <ul>
                <li><strong>Droit d'accès :</strong> Consulter vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> Modifier vos informations</li>
                <li><strong>Droit à l'effacement :</strong> Supprimer votre compte et vos données</li>
                <li><strong>Droit à la portabilité :</strong> Exporter vos données</li>
                <li><strong>Droit d'opposition :</strong> Refuser certains traitements</li>
            </ul>
        `;
        rgpdContent.appendChild(rgpdInfo);

        // Boutons d'actions RGPD
        const rgpdActions = Utilities.createElement('div', { class: 'rgpd-actions' });

        // Bouton exporter données
        const exportButton = Utilities.createElement('button', {
            class: 'rgpd-action-btn export-btn'
        }, '📥 Exporter mes données');

        exportButton.addEventListener('click', () => {
            this.exportUserData();
        });

        rgpdActions.appendChild(exportButton);

        // Bouton supprimer compte
        const deleteButton = Utilities.createElement('button', {
            class: 'rgpd-action-btn delete-btn danger'
        }, '🗑️ Supprimer mon compte');

        deleteButton.addEventListener('click', () => {
            this.showDeleteConfirmation();
        });

        rgpdActions.appendChild(deleteButton);

        rgpdContent.appendChild(rgpdActions);
        rgpdSection.appendChild(rgpdContent);
        settingsContainer.appendChild(rgpdSection);

        // Section Confidentialité
        const privacySection = Utilities.createElement('div', { class: 'settings-section' });
        privacySection.appendChild(Utilities.createElement('h2', { class: 'settings-section-title' }, 'Confidentialité'));

        const privacyContent = Utilities.createElement('div', { class: 'privacy-content' });

        // Préférences de confidentialité
        const privacyPrefs = Utilities.createElement('div', { class: 'privacy-preferences' });

        // Partage des scores
        const scoreSharingRow = Utilities.createElement('div', { class: 'privacy-row' });
        const scoreSharingLabel = Utilities.createElement('label', { class: 'privacy-label' }, 'Afficher mes scores sur le leaderboard');
        const scoreSharingToggle = Utilities.createElement('input', {
            type: 'checkbox',
            id: 'score-sharing',
            checked: GameSettings.scoreSharingEnabled !== false
        });

        scoreSharingToggle.addEventListener('change', (e) => {
            GameSettings.scoreSharingEnabled = e.target.checked;
            GameSettings.save();
            this.updateScoreSharing(e.target.checked);
        });

        scoreSharingRow.appendChild(scoreSharingLabel);
        scoreSharingRow.appendChild(scoreSharingToggle);
        privacyPrefs.appendChild(scoreSharingRow);

        privacyContent.appendChild(privacyPrefs);
        privacySection.appendChild(privacyContent);
        settingsContainer.appendChild(privacySection);

        // Bouton retour
        const backButton = Utilities.createElement('button', {
            class: 'back-to-menu-btn'
        }, 'Retour au menu principal');

        backButton.addEventListener('click', () => {
            if (this.onBackToMenuCallback) {
                this.onBackToMenuCallback();
            }
        });

        settingsContainer.appendChild(backButton);
        this.container.appendChild(settingsContainer);
    }

    /**
     * Exporte les données de l'utilisateur
     */
    async exportUserData() {
        try {
            if (!this.user) {
                alert('Utilisateur non connecté');
                return;
            }

            // Récupère les scores de l'utilisateur
            const scoresResponse = await ApiService.request('/api/scores/user/' + this.user._id);
            const scores = scoresResponse.success ? scoresResponse.data : [];

            // Crée l'objet de données à exporter
            const exportData = {
                user: {
                    username: this.user.username,
                    email: this.user.email,
                    createdAt: this.user.createdAt,
                    lastLogin: this.user.lastLogin
                },
                scores: scores,
                exportDate: new Date().toISOString(),
                gameVersion: 'BlockDrop v1.0'
            };

            // Convertit en JSON et crée le fichier de téléchargement
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `blockdrop-data-${this.user.username}-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert('Vos données ont été exportées avec succès !');

        } catch (error) {
            console.error('Erreur lors de l\'export des données:', error);
            alert('Erreur lors de l\'export des données. Veuillez réessayer.');
        }
    }

    /**
     * Affiche la confirmation de suppression du compte
     */
    showDeleteConfirmation() {
        // Crée la modal de confirmation
        const modal = Utilities.createElement('div', { class: 'modal delete-confirmation-modal' });
        modal.innerHTML = `
            <div class="modal-content delete-confirmation">
                <h2>⚠️ Supprimer votre compte</h2>
                <div class="warning-content">
                    <p><strong>Cette action est irréversible !</strong></p>
                    <p>La suppression de votre compte entraînera :</p>
                    <ul>
                        <li>La suppression permanente de votre profil</li>
                        <li>La suppression de tous vos scores</li>
                        <li>La perte de vos récompenses débloquées</li>
                        <li>La perte de votre progression</li>
                    </ul>
                    <p>Pour confirmer la suppression, tapez <strong>"SUPPRIMER"</strong> ci-dessous :</p>
                    <input type="text" id="delete-confirmation-input" placeholder="Tapez SUPPRIMER" maxlength="9">
                </div>
                <div class="modal-buttons">
                    <button id="cancel-delete" class="cancel-btn">Annuler</button>
                    <button id="confirm-delete" class="danger-btn" disabled>Supprimer définitivement</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const input = modal.querySelector('#delete-confirmation-input');
        const confirmBtn = modal.querySelector('#confirm-delete');
        const cancelBtn = modal.querySelector('#cancel-delete');

        // Active le bouton seulement si le texte est correct
        input.addEventListener('input', (e) => {
            confirmBtn.disabled = e.target.value !== 'SUPPRIMER';
        });

        // Annule la suppression
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Confirme la suppression
        confirmBtn.addEventListener('click', () => {
            if (input.value === 'SUPPRIMER') {
                this.deleteAccount();
                document.body.removeChild(modal);
            }
        });

        // Ferme la modal en cliquant en dehors
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    /**
     * Supprime le compte utilisateur
     */
    async deleteAccount() {
        try {
            if (!this.user) {
                alert('Utilisateur non connecté');
                return;
            }

            // Affiche un message de chargement
            const loadingMsg = document.createElement('div');
            loadingMsg.innerHTML = '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px; z-index: 10000;">Suppression du compte en cours...</div>';
            document.body.appendChild(loadingMsg);

            // Supprime le compte via l'API
            const response = await ApiService.request('/api/users/delete-account', {
                method: 'DELETE'
            });

            document.body.removeChild(loadingMsg);

            if (response.success) {
                alert('Votre compte a été supprimé avec succès. Vous allez être déconnecté.');

                // Déconnecte l'utilisateur
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('user');

                // Redirige vers la page d'accueil
                window.location.reload();
            } else {
                alert('Erreur lors de la suppression du compte : ' + (response.message || 'Erreur inconnue'));
            }

        } catch (error) {
            console.error('Erreur lors de la suppression du compte:', error);
            alert('Erreur lors de la suppression du compte. Veuillez réessayer.');
        }
    }

    /**
     * Met à jour le partage des scores
     * @param {boolean} enabled - Si le partage est activé
     */
    async updateScoreSharing(enabled) {
        try {
            const response = await ApiService.request('/api/users/update-profile', {
                method: 'PUT',
                body: JSON.stringify({
                    scoreSharingEnabled: enabled
                })
            });

            if (response.success) {
                // Met à jour les données utilisateur locales
                this.user.scoreSharingEnabled = enabled;
                console.log('Partage des scores mis à jour:', enabled);
            } else {
                console.error('Erreur lors de la mise à jour du partage des scores');
                // Remet la case à cocher dans son état précédent
                document.getElementById('score-sharing').checked = !enabled;
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du partage des scores:', error);
            // Remet la case à cocher dans son état précédent
            document.getElementById('score-sharing').checked = !enabled;
        }
    }

    /**
     * Définit le callback pour retourner au menu principal
     * @param {Function} callback - Fonction à appeler pour retourner au menu
     */
    setBackToMenuCallback(callback) {
        this.onBackToMenuCallback = callback;
    }
}