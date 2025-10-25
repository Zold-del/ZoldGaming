/**
 * Menu de connexion/inscription
 */
class LoginMenu {
    constructor(container) {
        this.container = container;
        this.backToMenuCallback = null;
        this.onLoginCallback = null;
        this.mode = 'login'; // 'login' ou 'register'
    }

    /**
     * Définit le callback de retour au menu
     */
    setBackToMenuCallback(callback) {
        this.backToMenuCallback = callback;
    }

    /**
     * Définit le callback après connexion réussie
     */
    setOnLoginCallback(callback) {
        this.onLoginCallback = callback;
    }

    /**
     * Affiche le menu de connexion
     */
    render() {
        this.container.innerHTML = '';

        const menuContainer = Utilities.createElement('div', { class: 'menu-container' });
        
        // Titre
        const title = Utilities.createElement('h1', { class: 'menu-title' }, 
            this.mode === 'login' 
                ? (GameSettings.language === 'fr' ? 'CONNEXION' : 'LOGIN')
                : (GameSettings.language === 'fr' ? 'INSCRIPTION' : 'REGISTER')
        );
        menuContainer.appendChild(title);

        // Formulaire
        const form = this.createForm();
        menuContainer.appendChild(form);

        // Toggle login/register
        const toggleLink = Utilities.createElement('div', {
            style: 'text-align: center; margin-top: 1rem; cursor: pointer; color: var(--primary);'
        }, this.mode === 'login'
            ? (GameSettings.language === 'fr' ? 'Pas de compte ? Inscrivez-vous' : 'No account? Register')
            : (GameSettings.language === 'fr' ? 'Déjà un compte ? Connectez-vous' : 'Have an account? Login')
        );
        toggleLink.addEventListener('click', () => {
            this.mode = this.mode === 'login' ? 'register' : 'login';
            this.render();
        });
        menuContainer.appendChild(toggleLink);

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
     * Crée le formulaire de connexion/inscription
     */
    createForm() {
        const formContainer = Utilities.createElement('div', {
            class: 'login-form',
            style: 'max-width: 400px; margin: 2rem auto;'
        });

        // Champ username (inscription uniquement)
        if (this.mode === 'register') {
            const usernameGroup = this.createInputGroup(
                'username',
                GameSettings.language === 'fr' ? 'Nom d\'utilisateur' : 'Username',
                'text',
                GameSettings.language === 'fr' ? '3-30 caractères, lettres, chiffres, - et _' : '3-30 chars, letters, numbers, - and _'
            );
            formContainer.appendChild(usernameGroup);

            // Champ email
            const emailGroup = this.createInputGroup(
                'email',
                'Email',
                'email'
            );
            formContainer.appendChild(emailGroup);
        } else {
            // Champ login (email ou username)
            const loginGroup = this.createInputGroup(
                'login',
                GameSettings.language === 'fr' ? 'Email ou nom d\'utilisateur' : 'Email or username',
                'text'
            );
            formContainer.appendChild(loginGroup);
        }

        // Champ mot de passe
        const passwordGroup = this.createInputGroup(
            'password',
            GameSettings.language === 'fr' ? 'Mot de passe' : 'Password',
            'password',
            GameSettings.language === 'fr' ? 'Minimum 6 caractères' : 'Minimum 6 characters'
        );
        formContainer.appendChild(passwordGroup);

        // Message d'erreur
        const errorMsg = Utilities.createElement('div', {
            id: 'login-error',
            style: 'color: #ff6b6b; text-align: center; margin: 1rem 0; display: none;'
        });
        formContainer.appendChild(errorMsg);

        // Bouton de soumission
        const submitBtn = Utilities.createElement('button', {
            id: 'submit-login',
            style: 'width: 100%; margin-top: 1rem;'
        }, this.mode === 'login'
            ? (GameSettings.language === 'fr' ? 'Se connecter' : 'Login')
            : (GameSettings.language === 'fr' ? 'S\'inscrire' : 'Register')
        );

        submitBtn.addEventListener('click', () => this.handleSubmit());
        formContainer.appendChild(submitBtn);

        // Gestion de la touche Entrée
        formContainer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSubmit();
            }
        });

        return formContainer;
    }

    /**
     * Crée un groupe de champ de formulaire
     */
    createInputGroup(id, label, type, hint = '') {
        const group = Utilities.createElement('div', {
            style: 'margin-bottom: 1.5rem;'
        });

        const labelEl = Utilities.createElement('label', {
            for: id,
            style: 'display: block; margin-bottom: 0.5rem; color: var(--primary);'
        }, label);
        group.appendChild(labelEl);

        const input = Utilities.createElement('input', {
            id: id,
            type: type,
            style: `
                width: 100%;
                padding: 0.75rem;
                background: rgba(255,255,255,0.1);
                border: 2px solid var(--primary);
                border-radius: 4px;
                color: var(--light);
                font-family: 'Press Start 2P', monospace;
                font-size: 0.7rem;
                box-sizing: border-box;
            `
        });
        group.appendChild(input);

        if (hint) {
            const hintEl = Utilities.createElement('div', {
                style: 'font-size: 0.6rem; margin-top: 0.25rem; opacity: 0.7;'
            }, hint);
            group.appendChild(hintEl);
        }

        return group;
    }

    /**
     * Gère la soumission du formulaire
     */
    async handleSubmit() {
        const errorMsg = document.getElementById('login-error');
        const submitBtn = document.getElementById('submit-login');
        
        errorMsg.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = GameSettings.language === 'fr' ? 'Chargement...' : 'Loading...';

        try {
            if (this.mode === 'register') {
                const username = document.getElementById('username').value.trim();
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;

                if (!username || !email || !password) {
                    throw new Error(GameSettings.language === 'fr' 
                        ? 'Tous les champs sont requis' 
                        : 'All fields are required');
                }

                const result = await window.apiService.register(username, email, password);
                
                if (result.success) {
                    if (this.onLoginCallback) {
                        this.onLoginCallback(result.user);
                    }
                }
            } else {
                const login = document.getElementById('login').value.trim();
                const password = document.getElementById('password').value;

                if (!login || !password) {
                    throw new Error(GameSettings.language === 'fr' 
                        ? 'Tous les champs sont requis' 
                        : 'All fields are required');
                }

                const result = await window.apiService.login(login, password);
                
                if (result.success) {
                    if (this.onLoginCallback) {
                        this.onLoginCallback(result.user);
                    }
                }
            }
        } catch (error) {
            errorMsg.textContent = error.message || (GameSettings.language === 'fr' 
                ? 'Erreur de connexion' 
                : 'Connection error');
            errorMsg.style.display = 'block';
            
            submitBtn.disabled = false;
            submitBtn.textContent = this.mode === 'login'
                ? (GameSettings.language === 'fr' ? 'Se connecter' : 'Login')
                : (GameSettings.language === 'fr' ? 'S\'inscrire' : 'Register');
        }
    }
}
