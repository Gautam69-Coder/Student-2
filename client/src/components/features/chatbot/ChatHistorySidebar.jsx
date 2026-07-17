import React, { useState } from "react";
import {
    Plus,
    Search,
    MessageSquare,
    Check,
    X,
    Edit2,
    Trash2,
} from "lucide-react";

export function ChatHistorySidebar({
    conversations,
    activeChatId,
    setActiveChatId,
    onNewChat,
    onDeleteChat,
    onRenameChat,
}) {
    const [searchHistory, setSearchHistory] = useState("");
    const [editingChatId, setEditingChatId] = useState(null);
    const [editTitleInput, setEditTitleInput] = useState("");

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
        onRenameChat(id, editTitleInput.trim());
        setEditingChatId(null);
    };

    const filteredConversations = conversations.filter((c) =>
        c.title.toLowerCase().includes(searchHistory.toLowerCase())
    );

    return (
        <div className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 text-slate-900 select-none">
            <div className="p-4 border-b border-slate-200">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-lime-500 text-black hover:bg-lime-400 transition-transform active:scale-[0.98] shadow-lg shadow-lime-200/50 cursor-pointer"
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
                            className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-semibold transition-all relative ${
                                isActive
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
                                            className="p-1 hover:text-lime-600 rounded transition-colors cursor-pointer"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingChatId(null);
                                            }}
                                            className="p-1 hover:text-red-400 rounded transition-colors cursor-pointer"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={(e) => startEditingTitle(chat.id, chat.title, e)}
                                            className="p-1 hover:text-lime-600 rounded transition-colors cursor-pointer"
                                            title="Rename Chat"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => onDeleteChat(chat.id, e)}
                                            className="p-1 hover:text-red-400 rounded transition-colors cursor-pointer"
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
    );
}
