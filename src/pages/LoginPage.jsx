import Button from "../components/Button";
import { GoogleIcon, LizardIcon } from "../assets/icons";
import PageWrapper from "./PageWrapper";
import { getAnalytics, logEvent } from 'firebase/analytics';  // Import firebase analytics

export default function LoginPage({ auth }) {
    const LOADING_MESSAGE = 'Loading Google\'s authentication.';
    const LOGIN_MESSAGE = 'Click login to sign in with your ASURITE ID.';

    const analytics = getAnalytics();  // Access firebase analytics

    // Function to log login event
    const logAnalyticsEvent = (user) => {
        logEvent(analytics, 'login', {
            method: 'Google',
            email: user.email,
            uid: user.uid
        });
    };

    // Handle login and log event
    const handleLogin = async () => {
        try {
            await auth.login();  // Execute login function
            const user = auth.currentUser; 
            if (user && user.email.slice(-7) === 'asu.edu') {
                logAnalyticsEvent(user); // Log it in firebase
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <PageWrapper>
            <div className="pt-10">
                <h1 className="title">Field Day</h1>
                <h2 className="subtitle">Data Management Tool</h2>
            </div>
            <div className='m-5 p-10 rounded-lg shadow-md bg-white dark:bg-neutral-950 mx-auto w-full md:w-96'>
                <div className="flex flex-col space-y-5">
                    <p>
                        {(auth.loading ? LOADING_MESSAGE : LOGIN_MESSAGE)}
                    </p>
                    <Button
                        disabled={auth.loading}
                        text={(!auth.loading ? 'Login' : 'Please wait.')}
                        onClick={() => auth.login()}
                        icon={
                            <div className="bg-white rounded-full p-1 dark:bg-black">
                                <GoogleIcon />
                            </div>
                        }
                    />
                </div>
            </div>
            <LizardIcon className="text-asu-maroon h-48 mx-auto rotate-45" />
        </PageWrapper>
    );
}
