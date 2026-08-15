import React from 'react'
import { theme } from "@/lib/theme";


const ChatInput = ({inputValue, setInputValue, handleKeyPress}) => {


    return (
        <div className="w-full">
            <input
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                }}
                onKeyDown={handleKeyPress || (() => {})}
                placeholder="Ask about the code..."
                className="flex-1 px-4 w-full py-3 rounded-xl border text-sm outline-none transition-colors"
                style={{
                    background: theme.colors.white,
                    borderColor: theme.colors.lightGray,
                    color: theme.colors.dark,
                }}
            />
        </div>
    )
}

export default ChatInput
