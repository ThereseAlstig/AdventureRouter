import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${backendUrl}/auth/password-reset/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    token,
                    newPassword: password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reset password.');
            }

            const data = await response.json();
            console.log('Password reset successful:', data);
            setMessage('Your password has been reset successfully.');

            // Navigera till förstasidan efter 2 sekunder
            setTimeout(() => navigate('/'), 2000);
        } catch (error: any) {
            console.error('Error resetting password:', error);
            setMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className='center reset-password'>
            <h1>Reset Password</h1>
        
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
