import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';
import RegisterPage from './RegisterPage';

const LoginPage = () => {
    const [token, setToken] = useState(null);

    const handleSubmit = (token) => {
        console.log('Token data:', token);
        localStorage.setItem('token', token);
        setToken(token);
        window.location.href = '/profile';
    };

    return (
        <div>
            <h1>Login</h1>
            <LoginForm onSubmit={handleSubmit} />
            <p>Dont have an account? <Link to='/register'>Register here</Link></p>
        </div>
    );
};

export default LoginPage;
