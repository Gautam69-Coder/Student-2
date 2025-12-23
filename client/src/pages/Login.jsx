import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser } from '../api';
import { ArrowLeft } from 'lucide-react';
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'

const Login = ({ setUser }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user' // Default role
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            const res = isRegister ? await registerUser(formData) : await loginUser(formData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate(res.data.user.role === 'admin' ? '/admin' : '/');
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'An error occurred');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-secondary)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#888', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
                    {isRegister ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    {isRegister ? 'Join to access notes and code.' : 'Login to continue learning.'}
                </p>

                {error && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: 'var(--radius)', marginBottom: '24px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {isRegister && (
                        <input
                            className="input"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        className="input"
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="input"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {/* Simple Role Selection for Demo Purposes */}
                    {isRegister && (
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '0.9rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} /> User
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleChange} /> Admin
                            </label>
                        </div>
                    )}

                    {isRegister && formData.role === 'admin' && (
                        <input
                            className="input"
                            name="adminSecret"
                            type="password"
                            placeholder="Admin Secret Key"
                            value={formData.adminSecret || ''}
                            onChange={handleChange}
                            required
                        />
                    )}

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', width: '100%' }}>
                        {loading ? <TailChase
                            size="16"
                            speed="1.75"
                            color="white"
                        /> : (isRegister ? 'Sign Up' : 'Login')}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => { setIsRegister(!isRegister) }}
                        style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'underline' }}
                    >
                        {(isRegister ? 'Login' : 'Sign Up')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
