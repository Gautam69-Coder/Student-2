import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Notes from '../components/Notes';
import link from "../assets/link.jpg"
import { fetchContent, fetchSections, fetchPracticals } from '../api';
import { Search } from 'lucide-react';
import PracticalCard from '../components/PracticalCard';

const Home = ({ user, logout }) => {
    const [content, setContent] = useState([]);
    const [practicals, setPracticals] = useState([]);
    const [sections, setSections] = useState([]);
    const [activeSection, setActiveSection] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadContent();
        loadSections();
        loadPracticals();
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
                const sectionNames = res.data.map(s => s.name);
                setSections(sectionNames);
                setActiveSection(sectionNames[0]);
            } else {
                // Default fallback if no sections in DB
                const defaults = ['DSA', 'JAVA', 'Scratch'];
                setSections(defaults);
                setActiveSection(defaults[0]);
            }
        } catch (err) {
            console.error(err);
            const defaults = ['DSA', 'JAVA', 'Scratch'];
            setSections(defaults);
            setActiveSection(defaults[0]);
        }
    };

    const loadPracticals = async () => {
        try {
            const res = await fetchPracticals();
            setPracticals(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredContent = content.filter(item => {
        const matchesSection = item.section === activeSection;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSection && matchesSearch;
    });

    const filteredPracticals = practicals.filter(item => {
        return item.section && activeSection && item.section.toLowerCase() === activeSection.toLowerCase();
    });

    // Debugging: Check if data is loaded
    // console.log('Practicals:', practicals);
    // console.log('Active Section:', activeSection);

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

                    {/* Search Bar */}
                    <div style={{ maxWidth: '500px', margin: '0 auto 32px auto', position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                        <input
                            type="text"
                            placeholder="Search snippets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px 12px 48px',
                                borderRadius: '30px',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

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

                {/* Practicals Section */}
                {filteredPracticals.length > 0 && (
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Practicals</h2>
                        <div>
                            {filteredPracticals.map(practical => (
                                <PracticalCard key={practical._id} practical={practical} onShowCode={handleShowCode} />
                            ))}
                        </div>
                    </div>
                )}

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

            <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={link} alt="" width={300} />
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "50px" }}>
                <p style={{ fontSize: "20px", fontWeight: "600" }}>Scan and come to my website</p>
            </div>


        </div>
    );
};

export default Home;
