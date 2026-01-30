
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash, FlaskConical, Pen, Search, FileUp, X, Image as ImageIcon, FileText } from "lucide-react"
import {
    createPractical,
    updatePractical,
    deletePractical,
    fetchPracticals
} from "@/Api/api"

export function ManagePracticals({ uniqueSubjectSections }) {
    const [newPractical, setNewPractical] = useState({
        practicalNumber: '',
        section: '',
        questions: [{ question: '', code: '', fileData: null, fileName: null, fileType: null }]
    });
    const [practicals, setPracticals] = useState([]);
    const [editPracticalId, setEditPracticalId] = useState(null);
    const [filterRole, setFilterRole] = useState("all")


    const handleAddQuestion = () => {
        setNewPractical({
            ...newPractical,
            questions: [...newPractical.questions, { question: '', code: '', fileData: null, fileName: null, fileType: null }]
        });
    };

    const handleRemoveQuestion = (index) => {
        setNewPractical({
            ...newPractical,
            questions: newPractical.questions.filter((_, i) => i !== index)
        });
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedQuestions = [...newPractical.questions];
                updatedQuestions[index] = {
                    ...updatedQuestions[index],
                    fileData: reader.result,
                    fileName: file.name,
                    fileType: file.type
                };
                setNewPractical({ ...newPractical, questions: updatedQuestions });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = (index) => {
        const updatedQuestions = [...newPractical.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            fileData: null,
            fileName: null,
            fileType: null
        };
        setNewPractical({ ...newPractical, questions: updatedQuestions });
    };

    const handleAddPractical = async (e) => {
        e.preventDefault();
        try {
            if (editPracticalId) {
                const res = await updatePractical(editPracticalId, newPractical);

                setEditPracticalId(null);
            } else {
                const res = await createPractical(newPractical);

                setNewPractical({ practicalNumber: '', section: '', questions: [{ question: '', code: '', fileData: null, fileName: null, fileType: null }] });
                alert('Practical added successfully!');
            }
            handleFetchPracticals(); // Refresh list after add/update
        } catch (error) {
            console.error('Error adding practical:', error);
            alert('Failed to add practical');
        }
    };

    const handleUpdatePractical = async (practical) => {
        try {
            setEditPracticalId(practical._id);
            setNewPractical({
                practicalNumber: practical.practicalNumber,
                section: practical.section,
                questions: practical.questions.length > 0 ? practical.questions : [{ question: '', code: '', fileData: null, fileName: null, fileType: null }]
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeletePractical = async (practicalId) => {
        try {
            if (!window.confirm("Are you sure you want to delete this practical?")) return;
            await deletePractical(practicalId);
            setPracticals(practicals.filter(practical => practical._id !== practicalId))
        } catch (error) {
            console.error(error);
        }
    };

    const handleFetchPracticals = async () => {
        try {
            const res = await fetchPracticals();
            setPracticals(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleFetchPracticals();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Add New Practical</h2>
                <p className="text-slate-500">Create a new practical assignment with code template</p>
            </motion.div>

            <form onSubmit={handleAddPractical}>
                <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 border border-[#E5E5E5] shadow-sm ">
                    <div className="space-y-6">
                        <div className="flex justify-between w-full gap-4">
                            <div className="w-full">
                                <label htmlFor="practical-subject" className="text-sm font-medium text-slate-700">
                                    Subject
                                </label>
                                <select className="mt-2 w-full px-4 h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg appearance-none cursor-pointer"
                                    value={newPractical.section}
                                    onChange={e => setNewPractical({ ...newPractical, section: e.target.value })}
                                    required
                                >
                                    <option value="">Select subject</option>
                                    {uniqueSubjectSections.map((section) => (
                                        <option key={section._id} value={section.name}>
                                            {section.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full">
                                <label htmlFor="practical-question" className="text-sm font-medium text-slate-700">
                                    Practical No
                                </label>
                                <input
                                    type="text"
                                    id="Practical No"
                                    value={newPractical.practicalNumber}
                                    onChange={e => setNewPractical({ ...newPractical, practicalNumber: e.target.value })}
                                    placeholder="Write the practical question/problem statement..."
                                    className="mt-2 w-full px-4 h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="border-blue-400 border-dashed border rounded-lg p-4 space-y-8">
                            {newPractical.questions.map((question, index) => (
                                <React.Fragment key={index}>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between w-full">
                                                <label htmlFor={`practical-question-${index}`} className="text-sm font-medium text-slate-700">
                                                    Question {index + 1}
                                                </label>
                                                {newPractical.questions.length > 1 && (
                                                    <Trash
                                                        className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                                                        onClick={() => handleRemoveQuestion(index)}
                                                    />
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                id={`practical-question-${index}`}
                                                value={newPractical.questions[index].question}
                                                onChange={(e) => {
                                                    const updatedQuestions = [...newPractical.questions];
                                                    updatedQuestions[index] = {
                                                        ...updatedQuestions[index],
                                                        question: e.target.value,
                                                    };
                                                    setNewPractical({ ...newPractical, questions: updatedQuestions });
                                                }}
                                                required
                                                placeholder="Write the practical question/problem statement..."
                                                className="mt-2 w-full px-4 h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor={`practical-code-${index}`} className="text-sm font-medium text-slate-700">
                                                Code Template
                                            </label>
                                            <textarea
                                                id={`practical-code-${index}`}
                                                value={newPractical.questions[index].code}
                                                onChange={(e) => {
                                                    const updatedQuestions = [...newPractical.questions];
                                                    updatedQuestions[index] = {
                                                        ...updatedQuestions[index],
                                                        code: e.target.value,
                                                    };
                                                    setNewPractical({ ...newPractical, questions: updatedQuestions });
                                                }}
                                                required
                                                placeholder="// Starter code for students..."
                                                className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-200 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg min-h-40 transition-all"
                                            />
                                        </div>

                                        {/* File/Image Upload for Question */}
                                        <div className="mt-2 text-slate-700">
                                            <label className="text-sm font-medium block mb-2">
                                                Reference Image or File (Optional)
                                            </label>

                                            {!newPractical.questions[index].fileData ? (
                                                <div className="flex items-center justify-center w-full">
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <FileUp className="w-8 h-8 mb-3 text-slate-400" />
                                                            <p className="mb-2 text-sm text-slate-500 font-medium">Click to upload reference</p>
                                                            <p className="text-xs text-slate-400 uppercase tracking-wider">Images, PDFs, or Code files</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            onChange={(e) => handleFileChange(index, e)}
                                                        />
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl relative group">
                                                    <div className="p-2.5 bg-slate-800 rounded-lg text-white">
                                                        {newPractical.questions[index].fileType?.startsWith('image/') ? (
                                                            <ImageIcon className="w-5 h-5" />
                                                        ) : (
                                                            <FileText className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-white truncate">
                                                            {newPractical.questions[index].fileName}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">
                                                            {(newPractical.questions[index].fileType || 'file').split('/')[1]}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(index)}
                                                        className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>

                                                    {/* Image Preview Overlay */}
                                                    {newPractical.questions[index].fileType?.startsWith('image/') && (
                                                        <div className="absolute -top-32 left-0 w-32 h-32 rounded-lg border border-slate-200 shadow-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                            <img src={newPractical.questions[index].fileData} alt="Preview" className="w-full h-full object-cover bg-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {index < newPractical.questions.length - 1 && (
                                        <hr className="border-slate-100 my-2" />
                                    )}
                                </React.Fragment>
                            ))}

                            <button className="w-full bg-slate-900 mt-4 hover:bg-slate-800 text-white font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                                onClick={handleAddQuestion}
                                type="button"
                            >
                                + Add Question
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="w-full bg-slate-900 mt-4 hover:bg-slate-800 text-white font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
                                <FlaskConical className="w-4 h-4" /> {editPracticalId ? 'Update Practical' : 'Add Practical'}
                            </button>
                            {editPracticalId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNewPractical({
                                            practicalNumber: '',
                                            section: '',
                                            questions: [{ question: "", code: "", fileData: null, fileName: null, fileType: null }]
                                        })
                                        setEditPracticalId(null)
                                    }}
                                    className="w-fit px-4 bg-blue-500 mt-4 hover:bg-blue-600 text-white font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
                                    <FlaskConical className="w-4 h-4" /> Cancel
                                </button>
                            )}
                        </div>
                    </div>


                </motion.div>
            </form >
            <div>
                <div className=" flex justify-between items-center">
                    <div className="pb-2 mb-2">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Practicals</h2>
                        <p className="text-slate-500">All Added Practicals</p>
                    </div>
                    <div>
                        <motion.div className="flex items-center flex-wrap gap-3 justify-between">

                            <div className="flex gap-3">

                                <select
                                    value={filterRole}
                                    onChange={(e) => { setFilterRole(e.target.value); }}
                                    className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
                                >
                                    {uniqueSubjectSections.map((section) => (

                                        <option key={section._id} value={section.name}>
                                            {section.name}
                                        </option>
                                    ))}

                                </select>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <div className="bg-white border-2 p-4 rounded-2xl">
                    <table className="w-full  ">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-center">Practical Name</th>
                                <th className="px-4 py-2 text-center">Subject</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        {practicals.sort((a, b) => b.practicalNumber - a.practicalNumber).filter(practical => practical.section === filterRole || filterRole === "all").map((practical) => (
                            <tr className="border-b border-[#E5E5E5]" key={practical._id}>
                                <td className="px-4 py-2 text-center">{practical.practicalNumber}</td>
                                <td className="px-4 py-2 text-center">{practical.section}</td>
                                <td className="flex justify-center gap-2 mb-2 mt-2">
                                    <button onClick={() => handleUpdatePractical(practical)} className="bg-slate-900 w-fit sm:px-4 px-2 sm:py-1  hover:bg-slate-800 text-white font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
                                        <Pen className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDeletePractical(practical._id)} className="bg-slate-900 w-fit sm:px-4 px-2 sm:py-1  hover:bg-slate-800 text-white font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
        </motion.div >
    )
}
