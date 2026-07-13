import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Send,
    Plus,
    Trash2,
    Edit2,
    Check,
    X,
    FileText,
    FlaskConical,
    Sliders,
    MessageSquare,
    Brain,
    Clock,
    Search,
    ChevronRight,
    HelpCircle,
    User,
    Bot,
    Maximize2,
    Minimize2,
    Copy,
} from "lucide-react";
import { Card, CardContent } from "/components/ui/card";
import { DashboardLayout } from "@/components/layout/layout";

import { Progress } from "/components/ui/progress";
import { Badge } from "/components/ui/badge";
import { theme } from "@/lib/theme";
import { useData } from "@/context/DataContext";
import { aiAssistant } from "@/Api/api";
import { customMessage } from "@/Utils/customMessage";
import { MarkdownContent } from "@/Utils/MarkdownContent";
import { SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

export function Chatbot() {


    const { user, notes, practicals } = useData();
    const messagesEndRef = useRef(null);

    // Sidebar & Layout Toggles
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [editingChatId, setEditingChatId] = useState(null);
    const [editTitleInput, setEditTitleInput] = useState("");
    const [searchHistory, setSearchHistory] = useState("");

    // Search filters for Context files
    const [noteSearch, setNoteSearch] = useState("");
    const [practicalSearch, setPracticalSearch] = useState("");
    const [practicalsQuestion, setPracticalsQuestion] = useState([]);
    const [section, setSection] = useState(null);

    // Chatbot States
    const [conversations, setConversations] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [isQuestionModal, setIsQuestionModel] = useState(false);

    // Current Active Configuration (saved per conversation)
    const [systemPrompt, setSystemPrompt] = useState("Default Tutor");
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(2048);
    const [attachedNotes, setAttachedNotes] = useState([]);
    const [attachedPracticals, setAttachedPracticals] = useState([]);

    const localStorageKey = useMemo(() => `studhub_chat_history_${user?.email || "guest"}`, [user]);

    const systemPromptOptions = {
        "Default Tutor": "You are a helpful, professional, and knowledgeable tutor. Break down complex topics simply, provide clear examples, and support your claims with logic.",
        "Code Optimizer": "You are a senior software engineer. Analyze code snippets, suggest best practices, optimize space/time complexity, and explain programming paradigms elegantly.",
        "Concept Explainer": "Explain any given topic by employing simple intuitive analogies, metaphors, and clear structured bullet points. Keep definitions crisp.",
        "Exam Prep Instructor": "Review inputs to construct interactive practice questions, mock tests, and summarize key testable facts. Be analytical and rigorous."
    };

    // Load Chat History from LocalStorage
    useEffect(() => {
        const stored = localStorage.getItem(localStorageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.length > 0) {
                    setConversations(parsed);
                    // Select first chat
                    setActiveChatId(parsed[0].id);
                    loadConversationState(parsed[0]);
                    return;
                }
            } catch (e) {
                console.error("Failed to parse chat history:", e);
            }
        }
        // Initialize an empty first chat if none exists
        initFirstChat();
    }, [localStorageKey]);

    // Save Chat History to LocalStorage on modifications
    const saveToLocalStorage = (updatedConversations) => {
        localStorage.setItem(localStorageKey, JSON.stringify(updatedConversations));
    };

    const initFirstChat = () => {
        const newChat = {
            id: `chat_${Date.now()}`,
            title: "Explain Concept",
            messages: [
                {
                    role: "assistant",
                    content: "Hi! I am your AI Study Buddy. Select context from your Notes or Practicals in the **Context Window** on the right, and start asking me anything!",
                },
            ],
            systemPrompt: "Default Tutor",
            temperature: 0.7,
            maxTokens: 2048,
            attachedNotes: [],
            attachedPracticals: [],
            createdAt: new Date().toISOString(),
        };
        setConversations([newChat]);
        setActiveChatId(newChat.id);
        loadConversationState(newChat);
        saveToLocalStorage([newChat]);
    };

    const loadConversationState = (chat) => {
        setSystemPrompt(chat.systemPrompt || "Default Tutor");
        setTemperature(chat.temperature !== undefined ? chat.temperature : 0.7);
        setMaxTokens(chat.maxTokens !== undefined ? chat.maxTokens : 2048);
        setAttachedNotes(chat.attachedNotes || []);
        setAttachedPracticals(chat.attachedPracticals || []);
    };

    // Sync active chat configuration with local states
    useEffect(() => {
        if (!activeChatId) return;
        const activeChat = conversations.find((c) => c.id === activeChatId);
        if (activeChat) {
            loadConversationState(activeChat);
        }
    }, [activeChatId]);

    // Sync active configuration changes back into the conversations list
    const updateActiveChatConfig = (field, value) => {
        setConversations((prev) => {
            const updated = prev.map((c) => {
                if (c.id === activeChatId) {
                    return { ...c, [field]: value };
                }
                return c;
            });
            saveToLocalStorage(updated);
            return updated;
        });
    };

    // Auto scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversations, activeChatId, isLoadingResponse]);

    // Calculate Token Usage
    const currentTokenCount = useMemo(() => {
        // Base system prompt tokens
        let count = 120;
        // User messages
        const activeChat = conversations.find((c) => c.id === activeChatId);
        if (activeChat) {
            activeChat.messages.forEach((m) => {
                count += Math.round(m.content.length / 4.2);
            });
        }
        // Attached notes context tokens
        attachedNotes.forEach((noteId) => {
            const note = notes.find((n) => n._id === noteId);
            if (note) {
                count += Math.round(((note.title || "").length + (note.content || "").length) / 4.2) + 100;
            }
        });
        // Attached practicals context tokens
        attachedPracticals.forEach((pId) => {
            const practical = practicals.find((p) => p._id === pId);
            if (practical) {
                count += Math.round(((practical.section || "").length + JSON.stringify(practical.questions || {}).length) / 4.2) + 150;
            }
        });
        return Math.min(count, 32768); // Cap at 32k visual
    }, [conversations, activeChatId, attachedNotes, attachedPracticals, notes, practicals]);

    const tokenPercentage = useMemo(() => {
        return Math.min(Math.round((currentTokenCount / 32768) * 100), 100);
    }, [currentTokenCount]);

    // History Actions
    const handleNewChat = () => {
        const newChat = {
            id: `chat_${Date.now()}`,
            title: `New Chat ${conversations.length + 1}`,
            messages: [
                {
                    role: "assistant",
                    content: "Let's explore a new topic. Select resources or ask your questions directly!",
                },
            ],
            systemPrompt: "Default Tutor",
            temperature: 0.7,
            maxTokens: 2048,
            attachedNotes: [],
            attachedPracticals: [],
            createdAt: new Date().toISOString(),
        };
        const updated = [newChat, ...conversations];
        setConversations(updated);
        setActiveChatId(newChat.id);
        loadConversationState(newChat);
        saveToLocalStorage(updated);
    };

    const handleDeleteChat = (id, e) => {
        e.stopPropagation();
        const updated = conversations.filter((c) => c.id !== id);
        if (updated.length === 0) {
            initFirstChat();
            return;
        }
        setConversations(updated);
        saveToLocalStorage(updated);
        if (activeChatId === id) {
            setActiveChatId(updated[0].id);
            loadConversationState(updated[0]);
        }
        customMessage({ type: "success", content: "Conversation deleted" });
    };

    const startEditingTitle = (id, title, e) => {
        e.stopPropagation();
        setEditingChatId(id);
        setEditTitleInput(title);
    };

    const saveChatTitle = (id, e) => {
        e.stopPropagation();
        if (!editTitleInput.trim()) {
            setEditingChatId(null);
            return;
        }
        const updated = conversations.map((c) => {
            if (c.id === id) {
                return { ...c, title: editTitleInput.trim() };
            }
            return c;
        });
        setConversations(updated);
        saveToLocalStorage(updated);
        setEditingChatId(null);
    };

    // Filter notes and practicals
    const filteredNotes = useMemo(() => {
        return notes.filter((n) =>
            (n.title || "").toLowerCase().includes(noteSearch.toLowerCase()) ||
            (n.section || "").toLowerCase().includes(noteSearch.toLowerCase())
        );
    }, [notes, noteSearch]);

    const filteredPracticals = useMemo(() => {
        const practicalSections = practicals.map((i) => i.section)
        return [...new Set(practicalSections)]
    }, [practicals, practicalSearch]);

    //Practicals Questions
    const getPracticalQuestions = (section) => {
        setPracticalsQuestion(practicals.filter((p) => p.section === section))
        setSection(section)
    };

    console.log(practicalsQuestion)
    const items = practicalsQuestion.map((practical) => ({
        key: `practical-${practical.practicalNumber}`,
        label: `Practical : ${practical.practicalNumber}`,
        icon: <FlaskConical />,
        children: practical.questions.map((question, index) => ({
            key: JSON.stringify({
                question: question.question,
            }),
            label: question.question,
        })),
    }));

    const handleToggleNote = (id) => {
        let updated;
        if (attachedNotes.includes(id)) {
            updated = attachedNotes.filter((nId) => nId !== id);
        } else {
            updated = [...attachedNotes, id];
        }
        setAttachedNotes(updated);
        updateActiveChatConfig("attachedNotes", updated);
    };

    const handleTogglePractical = (id) => {
        let updated;
        if (attachedPracticals.includes(id)) {
            updated = attachedPracticals.filter((pId) => pId !== id);
        } else {
            updated = [...attachedPracticals, id];
        }
        setAttachedPracticals(updated);
        updateActiveChatConfig("attachedPracticals", updated);
    };

    // Prompt compilation & sending logic
    const handleSend = async (forcedPrompt = "") => {
        const queryText = forcedPrompt || inputMessage;
        if (!queryText.trim() || isLoadingResponse) return;

        // Save input message locally
        setInputMessage("");
        setIsLoadingResponse(true);

        // Fetch active chat
        const activeChat = conversations.find((c) => c.id === activeChatId);
        if (!activeChat) return;

        const newUserMessage = { role: "user", content: queryText };
        const updatedMessagesWithUser = [...activeChat.messages, newUserMessage];

        // Optimistically update screen
        setConversations((prev) =>
            prev.map((c) => {
                if (c.id === activeChatId) {
                    return { ...c, messages: updatedMessagesWithUser };
                }
                return c;
            })
        );

        // Compile augmented prompt context
        let promptPayload = "";
        const instructions = systemPromptOptions[systemPrompt] || systemPromptOptions["Default Tutor"];
        promptPayload += `System Instructions:\n${instructions}\n\n`;

        if (attachedNotes.length > 0 || attachedPracticals.length > 0) {
            promptPayload += `Attached Context details:\n`;
            attachedNotes.forEach((nId) => {
                const note = notes.find((n) => n._id === nId);
                if (note) {
                    promptPayload += `[Attachment Note: ${note.title}]\nCategory: ${note.section}\nContent summary: ${note.content || "Code file uploaded"}\n\n`;
                }
            });
            attachedPracticals.forEach((pId) => {
                const practical = practicals.find((p) => p._id === pId);
                if (practical) {
                    const questionsText = practical.questions?.map((q, idx) => `Q${idx + 1}: ${q.question}\nCode: ${q.codeTemplate || ""}`).join("\n") || "";
                    promptPayload += `[Attachment Practical: ${practical.section}]\n${questionsText}\n\n`;
                }
            });
            promptPayload += `\nUse the above attached resources to precisely context-match the student queries if applicable.\n\n`;
        }

        promptPayload += `Student Query: ${queryText}`;

        try {
            // Attempt server call
            const res = await aiAssistant(promptPayload);
            let assistantResponse = "";

            if (res.data && res.data.data) {
                assistantResponse = res.data.data;
            } else if (res.data && res.data.message) {
                assistantResponse = res.data.message;
            } else {
                throw new Error("No response body");
            }

            const updatedMessagesWithBot = [...updatedMessagesWithUser, { role: "assistant", content: assistantResponse }];
            setConversations((prev) => {
                const updated = prev.map((c) => {
                    if (c.id === activeChatId) {
                        return { ...c, messages: updatedMessagesWithBot };
                    }
                    return c;
                });
                saveToLocalStorage(updated);
                return updated;
            });

        } catch (error) {
            console.error("API assistant request failed. Triggering frontend-only context fallback...", error);
            // Simulate processing latency
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Generate smart fallback response based on keywords and attachments
            const assistantResponse = generateLocalFallback(queryText);
            const updatedMessagesWithBot = [...updatedMessagesWithUser, { role: "assistant", content: assistantResponse }];
            setConversations((prev) => {
                const updated = prev.map((c) => {
                    if (c.id === activeChatId) {
                        return { ...c, messages: updatedMessagesWithBot };
                    }
                    return c;
                });
                saveToLocalStorage(updated);
                return updated;
            });
            customMessage({ type: "info", content: "Local Fallback response rendered" });
        } finally {
            setIsLoadingResponse(false);
        }
    };

    // Helper for fallback generation
    const generateLocalFallback = (prompt) => {
        const cleanPrompt = prompt.toLowerCase();
        let attachedNoteNames = attachedNotes.map(id => notes.find(n => n._id === id)?.title).filter(Boolean);
        let attachedPracNames = attachedPracticals.map(id => practicals.find(p => p._id === id)?.section).filter(Boolean);

        let contextNotice = "";
        if (attachedNoteNames.length > 0 || attachedPracNames.length > 0) {
            contextNotice = `\n\n*(Verified matching context files: ${[...attachedNoteNames, ...attachedPracNames].join(", ")})*`;
        }

        if (cleanPrompt.includes("osi") || cleanPrompt.includes("layer") || cleanPrompt.includes("model")) {
            return `### OSI Model Reference guide ${contextNotice}

The Open Systems Interconnection (OSI) model divides network communications into 7 abstract layers:

1. **Physical Layer:** Transmission of raw bitstreams over physical mediums (copper, fiber, wireless).
2. **Data Link Layer:** MAC addressing, framing, and node-to-node link reliability (e.g. Ethernet, PPP).
3. **Network Layer:** IP routing, packet logical addressing, and path determination (e.g. IPv4/IPv6).
4. **Transport Layer:** End-to-end data sequencing, error check, flow control (TCP, UDP).
5. **Session Layer:** Setting up, maintaining, and syncing communication dialogues.
6. **Presentation Layer:** Data syntax translating, encoding, encryption, and compression (SSL/TLS, JSON).
7. **Application Layer:** Interface for network service interactions (HTTP, SSH, DNS).

Let me know if you need to trace an IP packet or implement a specific socket protocol!`;
        }

        if (cleanPrompt.includes("react") || cleanPrompt.includes("hook") || cleanPrompt.includes("state")) {
            return `### React Hooks Cheat Sheet ${contextNotice}

React provides hooks to manage component lifecycle and state values:

\`\`\`javascript
import React, { useState, useEffect, useMemo, useCallback } from 'react';

function Counter({ step = 1 }) {
    // 1. Local State hook
    const [count, setCount] = useState(0);

    // 2. Lifecycle effect hook
    useEffect(() => {
        console.log(\`Count changed to: \${count}\`);
        return () => console.log('Cleaned up previous state');
    }, [count]);

    // 3. Performance Memoizing hook
    const heavyCalculation = useMemo(() => {
        return count * 9999999;
    }, [count]);

    // 4. Callback reference stability hook
    const handleIncrement = useCallback(() => {
        setCount(prev => prev + step);
    }, [step]);

    return (
        <button onClick={handleIncrement}>
            Count: {count}
        </button>
    );
}
\`\`\`

Would you like to explore state context providers or custom hooks for your app?`;
        }

        if (cleanPrompt.includes("java") || cleanPrompt.includes("thread") || cleanPrompt.includes("sync")) {
            return `### Java Multi-Threading & Synchronization ${contextNotice}

In Java, concurrency is managed using threads and lock blocks. Here's a brief example of synchronization:

\`\`\`java
public class Counter {
    private int count = 0;

    // Synchronized method locks the object monitor
    public synchronized void increment() {
        count++;
    }

    public int getCount() {
        return count;
    }
}
\`\`\`

#### Key States of Java Threads:
- **New:** Thread created but \`start()\` not yet called.
- **Runnable:** Ready to execute, waiting for OS CPU scheduling.
- **Blocked:** Waiting for a monitor lock to enter/resume a synchronized block.
- **Waiting:** Waiting indefinitely for another thread action (\`wait()\` / \`join()\`).
- **Timed Waiting:** Waiting for a specific delay (\`sleep(ms)\`, \`wait(ms)\`).
- **Terminated:** Execution finished.

Let me know if you'd like to code a Thread pool or use \`java.util.concurrent\` executors!`;
        }

        // Default response using context info
        if (attachedNoteNames.length > 0 || attachedPracNames.length > 0) {
            return `### Context Analysis Response ${contextNotice}

I have processed your query: **"${prompt}"** in relation to your attached workspace files.

#### Key Highlights from Attached Resources:
- **Notes Attached:** ${attachedNoteNames.length > 0 ? attachedNoteNames.map(n => `\`${n}\``).join(", ") : "None"}
- **Practicals Attached:** ${attachedPracNames.length > 0 ? attachedPracNames.map(p => `\`${p}\``).join(", ") : "None"}

Please specify if you want me to write code snippets, summarize concepts, or create an interactive exam guide based on these files.`;
        }

        return `### Study Assistant Response

I have received your prompt. Here are some options you can explore:
- Define terms or concepts by typing "Explain [Topic]".
- Select any of your saved study **Notes** or experimental **Practicals** from the right-hand **Context Window** sidebar to ask questions specific to your course files.
- Toggle model configurations (temperature, system persona) to fine-tune my analytical style!`;
    };

    // Suggestions for quick prompting
    const suggestions = [
        { title: "Explain OSI Layers", text: "Explain the OSI Model layers and highlight the Transport layer's key duties.", icon: Clock },
        { title: "React State Hook", text: "Show me a React component demonstrating useState and useEffect lifecycle hook updates.", icon: FileText },
        { title: "Explain Recursion", text: "Break down how recursion works in coding with simple analogies and code.", icon: Brain },
    ];

    const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];
    const filteredConversations = conversations.filter((c) =>
        c.title.toLowerCase().includes(searchHistory.toLowerCase())
    );

    return (
        <DashboardLayout css={"89vh"}>
            {/* This feature only for Desktop version */}
            <div className="flex flex-col gap-4   sm:block hidden">
                {/* Workspace card */}
                <Card className={`rounded-2xl overflow-hidden transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50 rounded-none m-0 border-0" : ""}`} style={{ borderColor: theme.colors.lightGray, background: theme.colors.white }}>
                    <CardContent className="p-0 ">
                        <div className="flex w-full h-full" style={{ height: isFullscreen ? "90vh" : "75vh", minHeight: isFullscreen ? "90vh" : "75vh" }}>

                            {/* LEFT SIDEBAR - CHAT HISTORY */}
                            <div className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 text-slate-900 select-none">
                                <div className="p-4 border-b border-slate-200">
                                    <button
                                        onClick={handleNewChat}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-lime-500 text-black hover:bg-lime-400 transition-transform active:scale-[0.98] shadow-lg shadow-lime-200/50"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>New Chat</span>
                                    </button>

                                    <div className="relative mt-4">
                                        <input
                                            type="text"
                                            placeholder="Search history..."
                                            value={searchHistory}
                                            onChange={(e) => setSearchHistory(e.target.value)}
                                            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none bg-slate-100 border border-slate-300 text-slate-700 placeholder-slate-500"
                                        />
                                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-2 space-y-1" data-lenis-prevent>
                                    {filteredConversations.map((chat) => {
                                        const isActive = chat.id === activeChatId;
                                        const isEditing = chat.id === editingChatId;

                                        return (
                                            <div
                                                key={chat.id}
                                                onClick={() => !isEditing && setActiveChatId(chat.id)}
                                                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-semibold transition-all relative ${isActive
                                                    ? "bg-slate-100 text-slate-900 border-l-2 border-lime-400"
                                                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                    <MessageSquare className="w-4 h-4 shrink-0 opacity-70 group-hover:text-lime-600" />
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={editTitleInput}
                                                            onChange={(e) => setEditTitleInput(e.target.value)}
                                                            onKeyDown={(e) => e.key === "Enter" && saveChatTitle(chat.id, e)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-full py-0.5 px-1 bg-white border border-lime-500 rounded text-xs outline-none text-slate-900 font-normal"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <span className="truncate">{chat.title}</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                    {isEditing ? (
                                                        <>
                                                            <button
                                                                onClick={(e) => saveChatTitle(chat.id, e)}
                                                                className="p-1 hover:text-lime-600 rounded transition-colors"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditingChatId(null);
                                                                }}
                                                                className="p-1 hover:text-red-400 rounded transition-colors"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={(e) => startEditingTitle(chat.id, chat.title, e)}
                                                                className="p-1 hover:text-lime-600 rounded transition-colors"
                                                                title="Rename Chat"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                                                className="p-1 hover:text-red-400 rounded transition-colors"
                                                                title="Delete Chat"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* MAIN WORKSPACE CHAT PANEL */}
                            <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
                                {/* Header info */}
                                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center border border-lime-500/20 shrink-0">
                                            <Sparkles className="w-5 h-5 text-lime-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                <span>{activeChat?.title || "AI Chatbot"}</span>
                                                <Badge variant="outline" className="bg-lime-500/10 text-lime-600 text-[10px] font-bold border-lime-500/20 uppercase tracking-widest px-1.5 py-0.5">
                                                    {systemPrompt}
                                                </Badge>
                                            </div>
                                            <div className="text-slate-400 text-xs flex items-center gap-1.5 mt-0.5">
                                                <Brain className="w-3.5 h-3.5 text-lime-600" />
                                                <span>Context attached: {attachedNotes.length + attachedPracticals.length} files</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIsFullscreen(!isFullscreen)}
                                            className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-200 hover:text-slate-900 transition-all text-slate-400"
                                            title={isFullscreen ? "Minimize" : "Maximize"}
                                        >
                                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                                            className={`flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-200 hover:text-slate-900 transition-all ${isRightPanelOpen ? "bg-lime-500/10 text-lime-600 border-lime-500/20" : "bg-transparent text-slate-400"
                                                }`}
                                            title="Context Settings"
                                        >
                                            <Sliders className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages Feed */}
                                <div className="flex-1 relative min-h-0">
                                    <div className="absolute inset-0 overflow-y-auto px-6 py-6 space-y-6 bg-slate-50" data-lenis-prevent>
                                        {activeChat?.messages.length <= 1 && (
                                            <div className="max-w-2xl mx-auto py-10 flex flex-col items-center justify-center text-center">
                                                <div className="w-16 h-16 rounded-2xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center mb-6">
                                                    <Sparkles className="w-8 h-8 text-lime-600" />
                                                </div>
                                                <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome to AI Chatbot</h2>
                                                <p className="text-slate-400 text-sm max-w-md mb-8">
                                                    Supercharge your study workspace. Attach key lecture notes and lab sheets, choose context rules, and chat with AI.
                                                </p>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
                                                    {suggestions.map((sug, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => handleSend(sug.text)}
                                                            className="p-4 bg-white border border-slate-200 hover:border-lime-500/30 rounded-xl cursor-pointer hover:bg-slate-50/50 transition-all flex flex-col justify-between h-32 group"
                                                        >
                                                            <div className="text-xs font-bold text-slate-900 group-hover:text-lime-600 transition-colors flex items-center gap-2">
                                                                <sug.icon className="w-3.5 h-3.5 text-lime-600" />
                                                                {sug.title}
                                                            </div>
                                                            <div className="text-slate-400 text-xs mt-2 line-clamp-3">
                                                                "{sug.text}"
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeChat?.messages.length > 1 && (
                                            <div className="max-w-5xl mx-auto space-y-6">
                                                {activeChat.messages.map((msg, index) => {
                                                    const isUser = msg.role === "user";
                                                    return (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.25 }}
                                                            className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                                                        >
                                                            {!isUser && (
                                                                <div className="w-8 h-8 rounded-lg bg-lime-500/10 border border-lime-500/30 flex items-center justify-center shrink-0">
                                                                    <Bot className="w-4 h-4 text-lime-600" />
                                                                </div>
                                                            )}

                                                            <div
                                                                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
                                                                    ? "bg-lime-400 text-black font-semibold rounded-tr-none shadow-lg shadow-lime-200/30"
                                                                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                                                                    }`}
                                                            >
                                                                {isUser ? (
                                                                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                                                                ) : (
                                                                    <MarkdownContent content={msg.content} role={msg.role} />
                                                                )}
                                                            </div>

                                                            {isUser && (
                                                                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
                                                                    <User className="w-4 h-4 text-slate-600" />
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    );
                                                })}

                                                {isLoadingResponse && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="flex gap-4 justify-start"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-lime-500/10 border border-lime-500/30 flex items-center justify-center shrink-0">
                                                            <Bot className="w-4 h-4 text-lime-600" />
                                                        </div>
                                                        <div className="bg-white border border-slate-200 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-lime-400 animate-bounce"></span>
                                                            <span className="w-2 h-2 rounded-full bg-lime-400 animate-bounce [animation-delay:0.2s]"></span>
                                                            <span className="w-2 h-2 rounded-full bg-lime-400 animate-bounce [animation-delay:0.4s]"></span>
                                                            <span className="ml-1 font-semibold text-lime-600/80">Analyzing attached context...</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                <div ref={messagesEndRef} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Message input footer */}
                                <div className="p-4 bg-white border-t border-slate-200">
                                    <div className="max-w-3xl mx-auto flex gap-3">
                                        <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-100 border border-slate-300 focus-within:border-lime-500 transition-colors">
                                            <input
                                                type="text"
                                                value={inputMessage}
                                                onChange={(e) => setInputMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                                placeholder="Type a message or concept question..."
                                                className="w-full px-4 py-3 text-sm outline-none bg-transparent text-slate-900 placeholder-slate-500"
                                                disabled={isLoadingResponse}
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleSend()}
                                            disabled={!inputMessage.trim() || isLoadingResponse}
                                            className="flex items-center justify-center w-12 h-12 rounded-xl font-bold bg-lime-500 text-black hover:bg-lime-400 disabled:opacity-50 disabled:hover:bg-lime-500 transition-all active:scale-95 shrink-0"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDEBAR - CONTEXT WINDOW PANEL */}
                            <div>
                                <AnimatePresence>
                                    {isRightPanelOpen && (
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: "320px", opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            className="flex flex-col h-full bg-white border-l border-slate-200 text-slate-900 shrink-0"
                                        >
                                            {/* Token Indicator Header */}
                                            <div className="p-5 border-b border-slate-200">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-sm font-bold flex items-center gap-2">
                                                        <Brain className="w-4 h-4 text-lime-600" />
                                                        <span>Context Window</span>
                                                    </h3>
                                                    <Badge variant="outline" className="bg-lime-500/10 text-lime-600 text-[10px] font-mono border-lime-500/20 px-1 py-0.5">
                                                        {currentTokenCount.toLocaleString()} / 32k
                                                    </Badge>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Progress
                                                        value={tokenPercentage}
                                                        className="h-2 rounded bg-slate-100 [&>div]:bg-lime-400"
                                                    />
                                                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                                        <span>{tokenPercentage}% Capacity Used</span>
                                                        <span>{32768 - currentTokenCount > 0 ? `${(32768 - currentTokenCount).toLocaleString()} available` : "Full"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Scrolling Configuration */}
                                            <div className="flex-1 overflow-y-auto p-4 space-y-6" data-lenis-prevent>
                                                {/* System prompt personas */}
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">System Persona</h4>
                                                    <select
                                                        value={systemPrompt}
                                                        onChange={(e) => {
                                                            setSystemPrompt(e.target.value);
                                                            updateActiveChatConfig("systemPrompt", e.target.value);
                                                        }}
                                                        className="w-full bg-slate-100 border border-slate-300 text-slate-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-lime-500 font-semibold"
                                                    >
                                                        {Object.keys(systemPromptOptions).map((key) => (
                                                            <option key={key} value={key}>
                                                                {key}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Slider Settings */}
                                                <div className="space-y-4 border-t border-slate-200 pt-4">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Model Parameters</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-slate-400">Temperature</span>
                                                            <span className="font-bold text-lime-600">{temperature}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0.0"
                                                            max="1.0"
                                                            step="0.1"
                                                            value={temperature}
                                                            onChange={(e) => {
                                                                const v = parseFloat(e.target.value);
                                                                setTemperature(v);
                                                                updateActiveChatConfig("temperature", v);
                                                            }}
                                                            className="w-full accent-lime-500 bg-slate-100 rounded h-1 cursor-pointer"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-slate-400">Max Tokens</span>
                                                            <span className="font-bold text-lime-600">{maxTokens}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="256"
                                                            max="4096"
                                                            step="128"
                                                            value={maxTokens}
                                                            onChange={(e) => {
                                                                const v = parseInt(e.target.value);
                                                                setMaxTokens(v);
                                                                updateActiveChatConfig("maxTokens", v);
                                                            }}
                                                            className="w-full accent-lime-500 bg-slate-100 rounded h-1 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Notes selection list */}
                                                <div className="border-t border-slate-200 pt-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attach Notes</h4>
                                                        <Badge className="bg-lime-400 text-black text-[10px] font-bold font-sans">
                                                            {attachedNotes.length} attached
                                                        </Badge>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Search Notes..."
                                                            value={noteSearch}
                                                            onChange={(e) => setNoteSearch(e.target.value)}
                                                            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none bg-slate-100 border border-slate-300 text-slate-700"
                                                        />
                                                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                                                    </div>
                                                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1" data-lenis-prevent>
                                                        {filteredNotes.map((note) => {
                                                            const isChecked = attachedNotes.includes(note._id);
                                                            return (
                                                                <div
                                                                    key={note._id}
                                                                    onClick={() => handleToggleNote(note._id)}
                                                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors border ${isChecked
                                                                        ? "bg-lime-500/10 border-lime-500/30 text-slate-900"
                                                                        : "bg-slate-50 border-transparent hover:bg-slate-200 text-slate-400"
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center gap-2 truncate">
                                                                        <FileText className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                                                                        <span className="truncate">{note.title}</span>
                                                                    </div>
                                                                    <span className="text-[10px] px-1 text-slate-400 shrink-0">{note.section}</span>
                                                                </div>
                                                            );
                                                        })}
                                                        {filteredNotes.length === 0 && (
                                                            <div className="text-slate-400 text-xs py-2 text-center">No matching notes found.</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Practicals selection list */}
                                                <div className="border-t border-slate-200 pt-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attach Practicals</h4>
                                                        <Badge className="bg-lime-400 text-black text-[10px] font-bold font-sans">
                                                            {attachedPracticals.length} attached
                                                        </Badge>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Search Practicals..."
                                                            value={practicalSearch}
                                                            onChange={(e) => setPracticalSearch(e.target.value)}
                                                            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none bg-slate-100 border border-slate-300 text-slate-700"
                                                        />
                                                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                                                    </div>
                                                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1" data-lenis-prevent>
                                                        {filteredPracticals.map((prac, index) => {
                                                            const isChecked = attachedPracticals.includes(index);
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    onClick={() => {
                                                                        handleTogglePractical(index);
                                                                        console.log(prac);
                                                                        getPracticalQuestions(prac);
                                                                        setIsQuestionModel(true);
                                                                    }}
                                                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors border ${isChecked
                                                                        ? "bg-lime-500/10 border-lime-500/30 text-slate-900"
                                                                        : "bg-slate-50 border-transparent hover:bg-slate-200 text-slate-400"
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center gap-2 truncate">
                                                                        <FlaskConical className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                                                                        <span className="truncate">{prac || "Untitled Practical"}</span>
                                                                    </div>
                                                                    <span className="text-[10px] px-1 text-slate-400 shrink-0">Practicals</span>

                                                                </div>

                                                            );
                                                        })}
                                                        {filteredPracticals.length === 0 && (
                                                            <div className="text-slate-400 text-xs py-2 text-center">No matching practicals found.</div>
                                                        )}
                                                    </div>

                                                    {isQuestionModal && (
                                                        <>
                                                            {/* Question Model */}
                                                            <div className={`absolute  bg-white p-4 shadow-2xl   bottom-40 right-100 z-100 h-[400px]  rounded-2xl w-200 `}>
                                                                {/* //Practicals Search */}
                                                                <div className="relative">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search Practicals..."
                                                                        value={practicalSearch}
                                                                        onChange={(e) => setPracticalSearch(e.target.value)}
                                                                        className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none bg-slate-100 border border-slate-300 text-slate-700"
                                                                    />
                                                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                                                                </div>
                                                                <X className=" text-black absolute -right-9.5 -top-6 p-2 hover:text-white hover:bg-black rounded-2xl" size={35}
                                                                    onClick={() => {
                                                                        setIsQuestionModel(false)
                                                                    }} />

                                                                <div className="flex items-center justify-center my-4   gap-2 m-2 truncate">
                                                                    <FlaskConical className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                                                                    <span className="truncate text-[15px] text-lime-600">{section || "Untitled Practical"}</span>
                                                                </div>

                                                                {/* // Practicals List */}
                                                                <div className="my-4 max-h-[320px] overflow-auto hide-scrollbar rounded-2xl ">
                                                                    <Menu
                                                                        onClick={(e) => { console.log(e.key) }}
                                                                        style={{ width: "100%", border: "1px", borderRadius: "10px", overflow: "auto" }}
                                                                        defaultSelectedKeys={['1']}
                                                                        // defaultOpenKeys={['sub4']}
                                                                        mode="inline"
                                                                        items={items}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-center sm:hidden h-full block items-center">
                <h1 className="text-lime-600 py-2 px-4 flex justify-center items-center  rounded-2xl bg-white shadow-md">This feature only for Desktop version</h1>
            </div>
        </DashboardLayout >
    );
}


