import React, { useState } from 'react';


const RequestPasswordReset: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/auth/password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ email }), 
            });
    
            if (response.ok) {
                setMessage('A password reset link has been sent to your email.');
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className='center reset-password'>
            <h1>Request Password Reset</h1>
            <div className='form-reset-password'>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div></div>
    );
};

export default RequestPasswordReset;
