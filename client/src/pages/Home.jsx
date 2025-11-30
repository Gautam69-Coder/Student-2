import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Notes from '../components/Notes';
import link from  "../assets/link.jpg"
import { fetchContent, fetchSections } from '../api';

const Home = ({ user, logout }) => {
    const [content, setContent] = useState([]);
    const [sections, setSections] = useState(['All']);
    const [activeSection, setActiveSection] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadContent();
        loadSections();
    }, []);

    const loadContent = async () => {
        try {
            const res = await fetchContent();
            setContent(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadSections = async () => {
        try {
            const res = await fetchSections();
            if (res.data.length > 0) {
                setSections(['All', ...res.data.map(s => s.name)]);
            } else {
                // Default fallback if no sections in DB
                setSections(['All', 'DSA', 'JAVA', 'Scratch']);
            }
        } catch (err) {
            console.error(err);
            setSections(['All', 'DSA', 'JAVA', 'Scratch']);
        }
    };

    const filteredContent = activeSection === 'All'
        ? content
        : content.filter(item => item.section === activeSection);

    const handleShowCode = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    return (
        <div>
            <Navbar user={user} logout={logout} />

            <div className="container" style={{ paddingBottom: '80px' }}>
                {/* Hero / Sections */}
                <div style={{ margin: '40px 0', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '24px', letterSpacing: '-1px' }}>
                        Master Your Code
                    </h1>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        {sections.map(section => (
                            <button
                                key={section}
                                onClick={() => setActiveSection(section)}
                                style={{
                                    padding: '12px 32px',
                                    borderRadius: '30px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    backgroundColor: activeSection === section ? 'var(--accent)' : 'transparent',
                                    color: activeSection === section ? 'white' : 'var(--text-primary)',
                                    border: `1px solid ${activeSection === section ? 'var(--accent)' : 'var(--border)'}`,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {section}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
                    {filteredContent.map(item => (
                        <Card key={item._id} item={item} onShowCode={handleShowCode} />
                    ))}
                </div>

                {filteredContent.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                        <p>No content found for this section.</p>
                    </div>
                )}

                {/* User Notes Section */}
                <Notes user={user} />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedItem}
            />

            <div>
                <img src={link} alt="" />
            </div>
        </div>
    );
};

export default Home;
