import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Code } from 'lucide-react';

const PracticalCard = ({ practical, onShowCode }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="card" style={{ marginBottom: '24px', padding: '0', overflow: 'hidden' }}>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: isExpanded ? '#f9fafb' : '#fff'
                }}
            >
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Practical no. {practical.practicalNumber}</h3>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {isExpanded && (
                <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
                    {practical.questions.map((q, index) => (
                        <div key={index} style={{ marginBottom: index === practical.questions.length - 1 ? 0 : '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <h4 style={{ margin: 0, color: '#333' }}>Q{index + 1}: {q.question}</h4>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    className="btn"
                                    onClick={() => onShowCode({
                                        title: `Practical ${practical.practicalNumber} - Q${index + 1}`,
                                        description: q.question,
                                        code: q.code,
                                        language: 'code'
                                    })}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <Code size={16} /> Show Code
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => {
                                        navigator.clipboard.writeText(q.code);
                                        alert('Code Copied!');
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        fontSize: '0.9rem',
                                        backgroundColor: '#f3f4f6',
                                        color: '#333'
                                    }}
                                >
                                    <Copy size={16} /> Copy Code
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PracticalCard;
