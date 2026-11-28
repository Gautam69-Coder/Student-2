import React from "react";

const ChatInput = ({ inputValue, setInputValue, handleKeyPress }) => {
    return (
        <div className="w-full">
            <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress || (() => {})}
                placeholder="Ask about the code..."
                aria-label="Ask AI code helper"
                className="flex-1 px-4 w-full min-h-[44px] rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
        </div>
    );
};

export default ChatInput;
