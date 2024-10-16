import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export class Authenticator {
    constructor() {
        [this.user, this.loading, this.error] = useAuthState(auth);
        this.db = getFirestore();  // Initialize Firestore
        this.isAuthorized = false;
        this.passwordRequired = false;
    }
    async validateUser() {
        if (!this.user) return false;

        const email = this.user.email;

        // Step 1: Check if the user's email is from ASU
        if (email.slice(-7) !== 'asu.edu') {
            this.isAuthorized = false;
            return false;  // User is not using an ASU email
        }

        // Step 2: Check if the user's email exists in Firestore's authorized_users collection
        const userRef = doc(this.db, 'authorized_users', email);  // Reference to the user document in Firestore
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            this.isAuthorized = true;
            this.passwordRequired = false;
            return true;  // User exists in the database and has an ASU email
        } else {
            this.isAuthorized = false;
            this.passwordRequired = true;  // User not found in the database, password is required
            return false;
        }
    }

    login() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' }); // Force account selection
        signInWithPopup(auth, provider);
        return await this.validateUser();
    }

    logout() {
        signOut(auth).then(() => {
            // Clear cookies
            document.cookie.split(';').forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, '')
                    .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
            });
            // Clear local storage
            localStorage.clear();
            // Redirect to login page or homepage
            window.location.href = '/login';
        });
        return !this.user;
    }
}
