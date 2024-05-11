import React, { useState } from 'react';
import axios from 'axios';
import Button from './Button';

const LoginForm = ({ onSubmit }) => { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmitForm = async (e) => { 
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/login', { username, password });
            console.log(response.data);
            const token = response.data.token;
            onSubmit(token);
            setError('');
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <form onSubmit={handleSubmitForm}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Login</Button>
            {error && <p>{error}</p>}
        </form>
    );
}

export default LoginForm;
