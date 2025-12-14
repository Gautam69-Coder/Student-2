import React, { useState,useEffect } from 'react';
import { ChevronDown, ChevronUp, Copy, Code } from 'lucide-react';
import NormalCard from './NormalCard';

const PracticalCard = ({ practical, onShowCode }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
      console.log(practical)
    }, [])
    

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
                <div style={{ padding: '20px', borderTop: '1px solid #eee',display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px'  }}>
                    {practical.questions.map((q, index) => (
                        <NormalCard key={q._id} item={q} onShowCode={onShowCode} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PracticalCard;
