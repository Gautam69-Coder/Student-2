import React, { useState } from "react";
import { AuthSection } from "@/components/features/auth/auth-section";
import { useTitle } from "@/hooks/useTitle";

export default function LoginPage({ onAuth }) {
    const [authState, setAuthState] = useState("login");
    useTitle("Login");

    return (
        <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-studio-grid opacity-70" />
                <div
                    className="absolute inset-x-0 -top-40 h-[480px]"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(79, 70, 229, 0.14), rgba(16, 185, 129, 0.06) 55%, transparent 100%)",
                    }}
                />
            </div>

            <div className="relative z-10 min-h-screen">
                <AuthSection authState={authState} setAuthState={setAuthState} onAuth={onAuth} />
            </div>
        </div>
    );
}
