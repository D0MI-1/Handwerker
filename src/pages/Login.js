import React, { useState } from 'react';
import {auth} from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/signup_Login.css'
import AuthWrapper from '../components/AuthWrapper';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        }catch (error){
            console.error('Error logging in:', error.message);
        }
    };

    return (
        <AuthWrapper>

        <div className="login-container">
            <h1>Mauerwerk</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="login-button">Login</button>
            </form>
            <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
            </Link>
            <Link to="/signup">
                <button className="signup-button">sign up</button>
            </Link>
        </div>
        </AuthWrapper>

    );
};

export default Login;
