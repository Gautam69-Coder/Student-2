import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Edit, Plus, Users, Code, Layout, Lock, FileText } from 'lucide-react';
import {
    verifyAdminAccess,
    fetchContent,
    createContent,
    updateContent,
    deleteContent,
    fetchSections,
    createSection,
    deleteSection,
    fetchUsers,
    deleteUser,
    fetchAllNotes,
    createNote,
    deleteNote
} from '../api';

const AdminPanel = ({ user }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('content'); // content, users, sections, notes
    const [content, setContent] = useState([]);
    const [users, setUsers] = useState([]);
    const [sections, setSections] = useState([]);
    const [allNotes, setAllNotes] = useState([]);
    const [newSection, setNewSection] = useState('');
    const [editContentId, setEditContentId] = useState(null);
    const [newContent, setNewContent] = useState({
        title: '', description: '', code: '', language: 'Code', section: 'JAVA', rating: 5, icon: ''
    });
    const [newGlobalNote, setNewGlobalNote] = useState({ title: '', content: '' });

    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
        } else {
            // If user is admin, auto-authenticate
            setIsAuthenticated(true);
        }
    }, [user, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            loadContent();
            loadSections();
            loadUsers();
            loadAllNotes();
        }
    }, [isAuthenticated]);

    const handleAccess = async (e) => {
        e.preventDefault();
        try {
            const res = await verifyAdminAccess(password);
            if (res.data.success) {
                setIsAuthenticated(true);
            }
        } catch (err) {
            alert('Incorrect Password');
        }
    };

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
            setSections(res.data);
            // If we have sections and the current section is 'DSA' (default) but 'DSA' is not in the list,
            // update it to the first available section.
            if (res.data.length > 0) {
                const currentSectionExists = res.data.some(s => s.name === newContent.section);
                if (!currentSectionExists) {
                    setNewContent(prev => ({ ...prev, section: res.data[0].name }));
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateContent = async (e) => {
        e.preventDefault();
        try {
            if (editContentId) {
                await updateContent(editContentId, newContent);
                setEditContentId(null);
                alert('Content Updated');
            } else {
                await createContent(newContent);
                alert('Content Added');
            }
            loadContent();
            setNewContent({
                title: '',
                description: '',
                code: '',
                language: 'javascript',
                section: sections.length > 0 ? sections[0].name : 'DSA',
                rating: 5,
                icon: ''
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditContent = (item) => {
        setNewContent(item);
        setEditContentId(item._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteContent = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await deleteContent(id);
            loadContent();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddSection = async (e) => {
        e.preventDefault();
        if (!newSection) return;
        try {
            await createSection({ name: newSection });
            loadSections();
            setNewSection('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteSection = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await deleteSection(id);
            loadSections();
        } catch (err) {
            console.error(err);
        }
    };

    const loadUsers = async () => {
        try {
            const res = await fetchUsers();
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadAllNotes = async () => {
        try {
            const res = await fetchAllNotes();
            setAllNotes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateGlobalNote = async (e) => {
        e.preventDefault();
        try {
            await createNote({ ...newGlobalNote, isGlobal: true });
            loadAllNotes();
            setNewGlobalNote({ title: '', content: '' });
            alert('Global Note Added');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await deleteNote(id);
            loadAllNotes();
        } catch (err) {
            console.error(err);
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
                <form onSubmit={handleAccess} className="card" style={{ width: '300px', textAlign: 'center' }}>
                    <Lock size={40} style={{ marginBottom: '16px' }} />
                    <h2 style={{ marginBottom: '16px' }}>Admin Access</h2>
                    <input
                        type="password"
                        className="input"
                        placeholder="Enter Admin Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Unlock</button>
                    <Link to="/" style={{ display: 'block', marginTop: '16px', fontSize: '0.9rem', color: '#888' }}>Back to Home</Link>
                </form>
            </div>
        );
    }

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div className="admin-sidebar" style={{ width: '250px', backgroundColor: '#111', color: '#fff', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ marginBottom: '40px', letterSpacing: '-1px' }}>Admin Panel</h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button
                        onClick={() => setActiveTab('content')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            color: activeTab === 'content' ? '#fff' : '#888',
                            fontWeight: activeTab === 'content' ? '600' : '400'
                        }}
                    >
                        <Code size={20} /> Content
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            color: activeTab === 'users' ? '#fff' : '#888',
                            fontWeight: activeTab === 'users' ? '600' : '400'
                        }}
                    >
                        <Users size={20} /> Users
                    </button>
                    <button
                        onClick={() => setActiveTab('sections')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            color: activeTab === 'sections' ? '#fff' : '#888',
                            fontWeight: activeTab === 'sections' ? '600' : '400'
                        }}
                    >
                        <Layout size={20} /> Sections
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            color: activeTab === 'notes' ? '#fff' : '#888',
                            fontWeight: activeTab === 'notes' ? '600' : '400'
                        }}
                    >
                        <FileText size={20} /> Notes
                    </button>
                </nav>
                <div style={{ marginTop: 'auto' }}>
                    <Link to="/" style={{ color: '#888', fontSize: '0.9rem' }}>Exit Panel</Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-content" style={{ flex: 1, padding: '40px', backgroundColor: 'var(--bg-secondary)', overflowY: 'auto' }}>
                <h1 style={{ marginBottom: '32px', textTransform: 'capitalize' }}>Manage {activeTab}</h1>

                {activeTab === 'content' && (
                    <div>
                        {/* Add Content Form */}
                        <div className="card" style={{ marginBottom: '40px' }}>
                            <h3 style={{ marginBottom: '24px' }}>{editContentId ? 'Edit Content' : 'Add New Content'}</h3>
                            <form onSubmit={handleCreateContent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <input className="input" placeholder="Title" value={newContent.title} onChange={e => setNewContent({ ...newContent, title: e.target.value })} required />
                                <select className="input" value={newContent.section} onChange={e => setNewContent({ ...newContent, section: e.target.value })}>
                                    {sections.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                                    {sections.length === 0 && <option value="DSA">DSA</option>}
                                </select>
                                <input
                                    className="input"
                                    placeholder="Icon URL (optional)"
                                    value={newContent.icon || ''}
                                    onChange={e => setNewContent({ ...newContent, icon: e.target.value })}
                                    style={{ gridColumn: '1 / -1' }}
                                />
                                <textarea
                                    className="input"
                                    placeholder="Description / Question"
                                    style={{ gridColumn: '1 / -1' }}
                                    rows={3}
                                    value={newContent.description}
                                    onChange={e => setNewContent({ ...newContent, description: e.target.value })}
                                />
                                <textarea
                                    className="input"
                                    placeholder="Code Snippet"
                                    style={{ gridColumn: '1 / -1', fontFamily: 'monospace' }}
                                    rows={6}
                                    value={newContent.code}
                                    onChange={e => setNewContent({ ...newContent, code: e.target.value })}
                                    required
                                />
                                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                        {editContentId ? 'Update Content' : 'Upload Content'}
                                    </button>
                                    {editContentId && (
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => {
                                                setEditContentId(null);
                                                setNewContent({
                                                    title: '', description: '', code: '', language: 'javascript', section: 'DSA', rating: 5, icon: ''
                                                });
                                            }}
                                            style={{ backgroundColor: '#eee', color: '#333' }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* List Content */}
                        <div className="card">
                            <h3 style={{ marginBottom: '24px' }}>Existing Content</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                        <th style={{ padding: '12px' }}>Title</th>
                                        <th style={{ padding: '12px' }}>Section</th>
                                        <th style={{ padding: '12px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {content.map(item => (
                                        <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px' }}>{item.title}</td>
                                            <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '0.8rem' }}>{item.section}</span></td>
                                            <td style={{ padding: '12px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => handleEditContent(item)} style={{ color: 'var(--accent)' }}><Edit size={18} /></button>
                                                    <button onClick={() => handleDeleteContent(item._id)} style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="card">
                        <h3 style={{ marginBottom: '24px' }}>Manage Users</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                    <th style={{ padding: '12px' }}>Username</th>
                                    <th style={{ padding: '12px' }}>Email</th>
                                    <th style={{ padding: '12px' }}>Role</th>
                                    <th style={{ padding: '12px' }}>Visits</th>
                                    <th style={{ padding: '12px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>{user.username}</td>
                                        <td style={{ padding: '12px' }}>{user.email}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                backgroundColor: user.role === 'admin' ? '#e0e7ff' : '#f5f5f5',
                                                color: user.role === 'admin' ? '#4338ca' : '#000',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>{user.visitCount || 0}</td>
                                        <td style={{ padding: '12px' }}>
                                            {user.role !== 'admin' && (
                                                <button onClick={() => handleDeleteUser(user._id)} style={{ color: '#ef4444' }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'sections' && (
                    <div className="card">
                        <h3 style={{ marginBottom: '24px' }}>Manage Sections</h3>
                        <form onSubmit={handleAddSection} style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                            <input
                                className="input"
                                placeholder="New Section Name (e.g., Python)"
                                value={newSection}
                                onChange={e => setNewSection(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                                <Plus size={18} /> Add Section
                            </button>
                        </form>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                            {sections.map(section => (
                                <div key={section._id} style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    border: '1px solid #eee'
                                }}>
                                    <span style={{ fontWeight: '600' }}>{section.name}</span>
                                    <button onClick={() => handleDeleteSection(section._id)} style={{ color: '#ef4444', display: 'flex' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div>
                        <div className="card" style={{ marginBottom: '40px' }}>
                            <h3 style={{ marginBottom: '24px' }}>Create Global Note</h3>
                            <form onSubmit={handleCreateGlobalNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input
                                    className="input"
                                    placeholder="Global Note Title"
                                    value={newGlobalNote.title}
                                    onChange={e => setNewGlobalNote({ ...newGlobalNote, title: e.target.value })}
                                    required
                                />
                                <textarea
                                    className="input"
                                    placeholder="Content visible to all users..."
                                    rows={4}
                                    value={newGlobalNote.content}
                                    onChange={e => setNewGlobalNote({ ...newGlobalNote, content: e.target.value })}
                                    required
                                />
                                <button type="submit" className="btn btn-primary">Post Global Note</button>
                            </form>
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '24px' }}>All User Notes & Global Notes</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                        <th style={{ padding: '12px' }}>Title</th>
                                        <th style={{ padding: '12px' }}>User</th>
                                        <th style={{ padding: '12px' }}>Type</th>
                                        <th style={{ padding: '12px' }}>Created</th>
                                        <th style={{ padding: '12px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allNotes.map(note => (
                                        <tr key={note._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px' }}>{note.title}</td>
                                            <td style={{ padding: '12px' }}>
                                                {note.user ? (
                                                    <span>{note.user.username} <span style={{ color: '#888', fontSize: '0.8rem' }}>({note.user.email})</span></span>
                                                ) : 'Unknown'}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                {note.isGlobal ? (
                                                    <span style={{ padding: '4px 8px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>Global</span>
                                                ) : (
                                                    <span style={{ padding: '4px 8px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '4px', fontSize: '0.8rem' }}>Private</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '12px' }}>{new Date(note.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '12px' }}>
                                                <button onClick={() => handleDeleteNote(note._id)} style={{ color: '#ef4444' }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
