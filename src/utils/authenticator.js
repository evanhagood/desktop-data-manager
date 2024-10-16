import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from './firebase';  // Your Firebase config

export class Authenticator {
    constructor() {
        this.db = getFirestore();  // Initialize Firestore
        this.isAuthorized = false;
        this.passwordRequired = false;
    }

    // Validate if the user is in the Firestore authorized_users collection
    async validateUser(user) {
        if (!user) return false;

        const email = user.email;

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

    // Handle Google login
    async login() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });  // Force account selection
        await signInWithPopup(auth, provider);
    }

    // Add user to Firestore's authorized_users collection with password validation
    async authorizeUser(user, password) {
        const correctPassword = 'lizard';  // Set a secure password here

        // Check if the provided password is correct
        if (password !== correctPassword) {
            throw new Error('Incorrect password');
        }

        // If the password is correct, add the user to the database
        const email = user.email;
        const name = user.displayName;

        await setDoc(doc(this.db, 'authorized_users', email), {
            email,
            name,
            date_added: new Date(),
        });

        this.isAuthorized = true;
        this.passwordRequired = false;
    }

    // Handle logout
    logout() {
        signOut(auth).then(() => {
            document.cookie.split(';').forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, '')
                    .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
            });
            localStorage.clear();
            window.location.href = '/login';
        });
    }
}
