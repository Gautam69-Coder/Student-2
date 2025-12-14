import React from 'react';
import { X, Copy } from 'lucide-react';

const Modal = ({ isOpen, onClose, item }) => {
    if (!isOpen || !item) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(item.code);
        alert('Code copied to clipboard!');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', position : "absolute", right : "10px", top : "25px" }}>
                    <X size={20} />
                </button>

                <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#888', letterSpacing: '1px', marginBottom: '8px' }}>Question / Context</h4>
                    <p style={{ lineHeight: '1.6' }}>{item.question}</p>
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>Code ({item.language})</h4>
                        <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={handleCopy}>
                            <Copy size={14} /> Copy
                        </button>
                    </div>
                    <pre style={{
                        backgroundColor: '#f5f5f5',
                        padding: '16px',
                        borderRadius: 'var(--radius)',
                        overflowX: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        border: '1px solid var(--border)'
                    }}>
                        <code>{item.code}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default Modal;
