import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/signup_Login.css';
import AuthWrapper from '../components/AuthWrapper';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent. Check your inbox.');
        } catch (error) {
            console.error('Error sending password reset email:', error.message);
            setMessage(error.message);
        }
    };

    return (
        <AuthWrapper>
            <div className="login-container">
                <h1>Reset Password</h1>
                <form onSubmit={handleResetPassword}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-button">Reset Password</button>
                </form>
                {message && <p className="message">{message}</p>}
                <button className="back-to-login-button" onClick={() => navigate('/login')}>
                    Back to Login
                </button>
            </div>
        </AuthWrapper>
    );
};

export default ForgotPassword;