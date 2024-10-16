import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Button from "../components/Button";
import { GoogleIcon, LizardIcon } from "../assets/icons";
import PageWrapper from "./PageWrapper";
import { Authenticator } from './Authenticator';  // Import the Authenticator class
import { auth } from './firebase';  // Import Firebase config

export default function LoginPage() {
    const [user, loading, error] = useAuthState(auth);  // Handle user state from Firebase
    const [authenticator] = useState(new Authenticator());  // Instantiate Authenticator class
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordRequired, setPasswordRequired] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Validate the user when they log in
    useEffect(() => {
        if (user && !loading) {
            authenticator.validateUser(user).then((isValid) => {
                setIsAuthorized(isValid);
                setPasswordRequired(authenticator.passwordRequired);
            });
        }
    }, [user, loading]);

    // Handle login
    const handleLogin = async () => {
        await authenticator.login();
    };

    // Handle logout
    const handleLogout = () => {
        authenticator.logout();
        setIsAuthorized(false);
    };

    // Handle password submission when user needs authorization
    const handlePasswordSubmit = async () => {
        try {
            await authenticator.authorizeUser(user, password);
            setIsAuthorized(true);  // User is now authorized
            setPasswordRequired(false);  // Password no longer needed
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <PageWrapper>
            <div className="pt-10">
                <h1 className="title">Field Day</h1>
                <h2 className="subtitle">Data Management Tool</h2>
            </div>
            <div className='m-5 p-10 rounded-lg shadow-md bg-white dark:bg-neutral-950 mx-auto w-full md:w-96'>
                <div className="flex flex-col space-y-5">
                    <p>
                        {user ? 'Welcome!' : 'Click login to sign in with your ASURITE ID.'}
                    </p>

                    {/* Show password input if user is not authorized */}
                    {!isAuthorized && passwordRequired && (
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                className="p-2 border rounded"
                            />
                            <Button text="Submit" onClick={handlePasswordSubmit} />
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        </div>
                    )}

                    {/* Show login button if user is not logged in */}
                    {!user && (
                        <Button
                            text="Login"
                            onClick={handleLogin}
                            icon={
                                <div className="bg-white rounded-full p-1 dark:bg-black">
                                    <GoogleIcon />
                                </div>
                            }
                        />
                    )}

                    {/* Show logout button if user is authenticated */}
                    {isAuthorized && user && (
                        <div>
                            <p>Welcome, {user.displayName}!</p>
                            <Button text="Logout" onClick={handleLogout} />
                        </div>
                    )}
                </div>
            </div>
            <LizardIcon className="text-asu-maroon h-48 mx-auto rotate-45" />
        </PageWrapper>
    );
}
