import React from 'react';
import { Heart, Code, Copy, Download, Star } from 'lucide-react';

const Card = ({ item, onShowCode }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(item.code);
        alert('Code copied to clipboard!');
    };

    console.log(item)

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginRight:"10px" , marginLeft:"10px",marginBottom:"10px" }}>
            

            <p style={{ color: 'black', fontSize: '0.95rem', flex: 1 }}>
                {item.question && item.question.length > 80 ? item.question.substring(0, 80) + '...' : item.question}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < item.rating ? "currentColor" : "none"} stroke={i < item.rating ? "none" : "#ccc"} />
                ))}
                <span style={{ color: '#888', fontSize: '0.9rem', marginLeft: '4px' }}>({item.rating})</span>
            </div>

            

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.9rem' }} onClick={() => onShowCode(item)}>
                    <Code size={16} /> Show Code
                </button>
                <button className="btn btn-outline" title="Copy Code" onClick={handleCopy}>
                    <Copy size={16} />
                </button>
                {/* {item.downloads && (
                    <button className="btn btn-outline" title="Download">
                        <a href={item.downloads} download style={{ display: 'flex', alignItems: 'center' }}>
                            <Download size={16} />
                        </a>
                    </button>
                )} */}
            </div>
        </div>
    );
};

export default Card;
