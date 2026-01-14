import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = ({ user, logout }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav style={{
            borderBottom: '1px solid var(--border)',
            padding: '14px ',
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            //  paddingRight: "20px", paddingLeft: "20px"
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                <div style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="StudentHubLogo.png" style={{ height: '40px', width: '40px' }} alt="" />
                    </Link>

                    <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ display: 'none' }}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className={`nav-content ${isMenuOpen ? 'open' : ''}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: '0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '8px 16px',
                        borderRadius: 'var(--radius)',
                        width: '300px',
                        margin: '0 16px'
                    }} className="search-bar">
                        <Search size={18} color="#888" />
                        <input
                            type="text"
                            placeholder="Search notes, code..."
                            style={{
                                border: 'none',
                                background: 'transparent',
                                marginLeft: '8px',
                                width: '100%',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px', fontWeight: '500' }}>
                        <Link to="/" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Home</Link>
                        <Link to="/about" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>About</Link>
                        <Link to="/contact" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Contact</Link>
                        {['admin', 'superadmin'].includes(user?.role) && (
                            <Link to="/admin" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Admin</Link>
                        )}

                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {user.username[0].toUpperCase()}
                                    </div>
                                </Link>
                                <button onClick={logout} title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <User size={24} color="black" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
