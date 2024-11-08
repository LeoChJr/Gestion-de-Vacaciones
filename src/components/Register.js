import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './Register.css'; // Asegúrate de importar el archivo CSS

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Usuario registrado");
            // Aquí puedes redirigir a otra página o manejar el registro exitoso
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="register-container">
            <div className="card">
                <h2>REGISTER</h2>
                <p>Please enter your registration details!</p>
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
                    <button type="submit" className="register-button">REGISTER</button>
                </form>
                <p className="signin-link">
                    Already have an account? <a href="/login">Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
