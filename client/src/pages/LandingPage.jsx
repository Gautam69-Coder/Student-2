import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Book, Share2, Terminal, Cpu, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            <Navbar user={null} />

            {/* Hero Section */}
            <section style={{
                minHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 20px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Subtle Background Gradient */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        border: '1px solid #333',
                        marginBottom: '32px',
                        fontSize: '0.85rem',
                        color: '#888',
                        letterSpacing: '0.5px'
                    }}>
                        v1.0 Now Live
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(3rem, 8vw, 6rem)',
                        fontWeight: '800',
                        lineHeight: '1.1',
                        marginBottom: '32px',
                        letterSpacing: '-0.04em',
                        background: 'linear-gradient(180deg, #fff 0%, #666 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Code. Share. <br /> Master.
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                        color: '#888',
                        maxWidth: '500px',
                        margin: '0 auto 48px',
                        lineHeight: '1.6'
                    }}>
                        The minimalist ecosystem for developers to store snippets, manage notes, and accelerate learning.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Link to="/login" className="btn" style={{
                            padding: '16px 40px',
                            fontSize: '1rem',
                            backgroundColor: '#fff',
                            color: '#000',
                            fontWeight: '600',
                            borderRadius: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'transform 0.2s'
                        }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Start Coding <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Minimal Features Grid */}
            <section style={{ padding: '100px 20px', borderTop: '1px solid #111' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
                        <MinimalFeature
                            icon={<Terminal size={28} />}
                            title="Snippet Library"
                            desc="A centralized repository for your algorithms and code blocks."
                        />
                        <MinimalFeature
                            icon={<Cpu size={28} />}
                            title="Smart Management"
                            desc="Organize your knowledge base with intuitive sectioning."
                        />
                        <MinimalFeature
                            icon={<Globe size={28} />}
                            title="Global Access"
                            desc="Access your resources from anywhere, anytime. Always in sync."
                        />
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer style={{ padding: '40px 20px', textAlign: 'center', borderTop: '1px solid #111', color: '#444', fontSize: '0.9rem' }}>
                <p>&copy; 2025 Student Platform. Built for Developers.</p>
            </footer>
        </div>
    );
};

const MinimalFeature = ({ icon, title, desc }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            backgroundColor: '#111',
            color: '#fff'
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.5px' }}>{title}</h3>
        <p style={{ color: '#666', lineHeight: '1.6', fontSize: '1rem' }}>{desc}</p>
    </div>
);

export default LandingPage;
