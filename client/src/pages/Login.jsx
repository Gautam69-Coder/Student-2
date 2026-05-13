import React, { useState } from "react";
import { AuthSection } from "@/components/common/auth-section";
import { useTitle } from "@/hooks/useTitle";

export default function LoginPage({ onAuth }) {
    const [authState, setAuthState] = useState("login");
    useTitle("Login");

    return (
        <div className="min-h-screen bg-[#FCFAF8] dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
            <AuthSection authState={authState} setAuthState={setAuthState} onAuth={onAuth} />
        </div>
    );
}
