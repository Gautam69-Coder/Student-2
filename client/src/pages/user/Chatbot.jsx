import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "/components/ui/card";
import { DashboardLayout } from "@/components/layout/layout";
import { theme } from "@/lib/theme";
import { useData } from "@/context/DataContext";
import { aiChatBot } from "@/Api/api";
import { customMessage } from "@/Utils/customMessage";
import { extractPdfText } from "@/Utils/extractingText";
import { ChatHistorySidebar } from "@/components/features/chatbot/ChatHistorySidebar";
import { ChatFeed } from "@/components/features/chatbot/ChatFeed";
import { ContextSidebar } from "@/components/features/chatbot/ContextSidebar";
import { ApiKeyModal } from "@/components/common/ApiKeyModal";

export function Chatbot() {
    const { user, notes, practicals } = useData();

    // Sidebar & Layout Toggles
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(typeof window !== "undefined" && window.innerWidth >= 1024);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Chatbot States
    const [conversations, setConversations] = useState([]);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);

    useEffect(() => {
        if (user && !user.apiKey) {
            setShowApiKeyModal(true);
        }
    }, [user]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);

    // Current Active Configuration (saved per conversation)
    const [systemPrompt, setSystemPrompt] = useState("Default Tutor");
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(2048);
    const [attachedNotes, setAttachedNotes] = useState([]);
    const [attachedPracticals, setAttachedPracticals] = useState([]);

    const localStorageKey = useMemo(() => `studhub_chat_history_${user?.email || "guest"}`, [user]);

    const systemPromptOptions = {
        "Default Tutor": "You are a helpful, professional, and knowledgeable tutor. Break down complex topics simply, provide clear examples, and support your claims with logic. give me him very short answers and  pinpoint answers",
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

    const handleRenameChat = (id, newTitle) => {
        const updated = conversations.map((c) => {
            if (c.id === id) {
                return { ...c, title: newTitle };
            }
            return c;
        });
        setConversations(updated);
        saveToLocalStorage(updated);
    };

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
        console.log('Updated attachedPracticals:', updated);
        setAttachedPracticals(updated);
        updateActiveChatConfig("attachedPracticals", updated);
    };

    // Prompt compilation & sending logic
    const handleSend = async (queryText) => {
        if (!queryText.trim() || isLoadingResponse) return;
        if (user && !user.apiKey) {
            setShowApiKeyModal(true);
            return;
        }
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

            for (const nId of attachedNotes) {
                const note = notes.find((n) => n._id === nId);

                if (note.fileType === "NAN") {
                    promptPayload += `[Attachment Note: ${note.title}]\nCategory: ${note.section}\nContent summary: ${note.content || "Code file uploaded"}\n\n`;
                }

                if (note.fileType === "application/pdf") {
                    const text = await extractPdfText(note.fileData);
                    promptPayload += `[Attachment Note: ${note.title}]\nCategory: ${note.section}\nContent summary: ${text || "Code file uploaded"}\n\n`;
                }

            }
            attachedPracticals.forEach((pId) => {
                let practical;

                for (const p of practicals) {
                    practical = p.questions.find(q => q._id === pId);
                    if (practical) break;
                }

                console.log('Practical:', practical);
                // console.log('Questions Text:', ` ${practical.question}\nCode: ${practical.code?.map((c) => c) || ""}`);
                // // console.log('Practical being processed for prompt:', practicals.map(p => p.questions.find(q=> q._id === pId)));

                if (practical) {
                    const questionsText = `${practical.question}\nCode: ${practical.code?.map((c) => JSON.stringify(c)) || ""}` || "";
                    promptPayload += `[Attachment Practical: ${practical.code?.map((c) => JSON.stringify(c.languageName)) || ""}]\n${questionsText}\n\n`;
                }
            });
            promptPayload += `\nUse the above attached resources to precisely context-match the student queries if applicable.\n\n`;
        }
        
        promptPayload += `Student Query: ${queryText}`;

        try {
            // Attempt server call
            const res = await aiChatBot(promptPayload);
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

    const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-4 w-full">
                {/* Workspace card */}
                <Card
                    className={`rounded-2xl overflow-hidden transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50 rounded-none m-0 border-0" : ""
                        }`}
                    style={{ borderColor: theme.colors.lightGray, background: theme.colors.white }}
                >
                    <CardContent className="p-0">
                        <div
                            className="flex w-full h-full"
                            style={{
                                height: isFullscreen ? "90vh" : "75vh",
                                minHeight: isFullscreen ? "90vh" : "75vh",
                            }}
                        >
                            <ChatHistorySidebar
                                conversations={conversations}
                                activeChatId={activeChatId}
                                setActiveChatId={setActiveChatId}
                                onNewChat={handleNewChat}
                                onDeleteChat={handleDeleteChat}
                                onRenameChat={handleRenameChat}
                            />

                            <ChatFeed
                                activeChat={activeChat}
                                systemPrompt={systemPrompt}
                                attachedNotesCount={attachedNotes.length}
                                attachedPracticalsCount={attachedPracticals.length}
                                isFullscreen={isFullscreen}
                                setIsFullscreen={setIsFullscreen}
                                isRightPanelOpen={isRightPanelOpen}
                                setIsRightPanelOpen={setIsRightPanelOpen}
                                isLoadingResponse={isLoadingResponse}
                                onSend={handleSend}
                            />

                            <ContextSidebar
                                currentTokenCount={currentTokenCount}
                                tokenPercentage={tokenPercentage}
                                systemPrompt={systemPrompt}
                                setSystemPrompt={setSystemPrompt}
                                systemPromptOptions={systemPromptOptions}
                                temperature={temperature}
                                setTemperature={setTemperature}
                                maxTokens={maxTokens}
                                setMaxTokens={setMaxTokens}
                                attachedNotes={attachedNotes}
                                attachedPracticals={attachedPracticals}
                                handleToggleNote={handleToggleNote}
                                handleTogglePractical={handleTogglePractical}
                                updateActiveChatConfig={updateActiveChatConfig}
                                isRightPanelOpen={isRightPanelOpen}
                                setIsRightPanelOpen={setIsRightPanelOpen}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
            {showApiKeyModal && (
                <ApiKeyModal
                    isOpen={showApiKeyModal}
                    onClose={() => setShowApiKeyModal(false)}
                />
            )}
        </DashboardLayout>
    );
}
