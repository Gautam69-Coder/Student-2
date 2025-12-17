import React, { useState, useEffect } from 'react';
import { fetchNotes, createNote, updateNote, deleteNote } from '../api';
import { Plus, Trash2, Save, Edit } from 'lucide-react';

const Notes = ({ user }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (user) {
            loadNotes();
        }
    }, [user]);

    const loadNotes = async () => {
        try {
            const res = await fetchNotes();
            setNotes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.title || !newNote.content) return;
        try {
            if (newNote._id) {
                // Update existing note
                const res = await updateNote(newNote._id, { title: newNote.title, content: newNote.content });
                setNotes(notes.map(n => n._id === newNote._id ? res.data : n));
            } else {
                // Create new note
                const res = await createNote(newNote);
                setNotes([res.data, ...notes]);
            }
            setNewNote({ title: '', content: '' });
            setIsAdding(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (note) => {
        setNewNote(note);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        try {
            await deleteNote(id);
            setNotes(notes.filter(n => n._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
            <h3>Please login to access your private notes.</h3>
        </div>
    );

    return (
        <div style={{ marginTop: '40px', marginRight: "10px", marginLeft: "10px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>My Notes</h2>
                <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
                    <Plus size={18} /> {isAdding ? 'Cancel' : 'New Note'}
                </button>
            </div>

            {isAdding && (
                <div className="card" style={{ marginBottom: '24px', border: '1px solid var(--accent)' }}>
                    <input
                        className="input"
                        placeholder="Note Title"
                        value={newNote.title}
                        onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                        style={{ marginBottom: '12px', fontWeight: '600' }}
                    />
                    <textarea
                        className="input"
                        placeholder="Write your note here..."
                        rows={4}
                        value={newNote.content}
                        onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                        style={{ marginBottom: '16px', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-primary" onClick={handleAddNote}>
                            <Save size={18} /> {newNote._id ? 'Update Note' : 'Save Note'}
                        </button>
                        <button className="btn" onClick={() => { setIsAdding(false); setNewNote({ title: '', content: '' }); }} style={{ backgroundColor: '#eee', color: '#333' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {notes.map(note => (
                    <div key={note._id} className="card" style={{ position: 'relative' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', paddingRight: '24px' }}>{note.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => handleEdit(note)}
                                style={{ color: 'var(--accent)', opacity: 0.7 }}
                                title="Edit Note"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(note._id)}
                                style={{ color: '#ef4444', opacity: 0.7 }}
                                title="Delete Note"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#aaa' }}>
                            {new Date(note.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            {notes.length === 0 && !isAdding && (
                <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>No notes yet. Create one!</p>
            )}
        </div>
    );
};

export default Notes;
