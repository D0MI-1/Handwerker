import React from 'react';
import '../styles/components/AuthWrapper.css';

const AuthWrapper = ({ children }) => {
    return (
        <div className="auth-page">
            <div className="auth-content">
                {children}
            </div>
        </div>
    );
};

export default AuthWrapper;