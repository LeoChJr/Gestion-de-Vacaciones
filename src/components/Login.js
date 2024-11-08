import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Asegúrate de importar el archivo CSS

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Usuario iniciado sesión");
            navigate('/vacation-form');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="login-container">
            <div className="card">
                <h2>LOGIN</h2>
                <p>Please enter your login and password!</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            className="input-field"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <p className="forgot-password">Forgot password?</p>
                    <button type="submit" className="login-button">LOGIN</button>
                </form>
                <p className="signup-link">
                    Don’t have an account? <a href="/register">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
