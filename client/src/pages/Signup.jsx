import React, { useState } from "react";
import { AuthSection } from "@/components/common/auth-section";
import { useTitle } from "@/hooks/useTitle";

export default function SignupPage({ onAuth }) {
    const [authState, setAuthState] = useState("signup");
    useTitle("Sign Up");

    return (
        <div
            className="min-h-screen relative overflow-hidden"
            style={{
                '--background': '201 100% 13%',
                '--foreground': '0 0% 100%',
                '--muted-foreground': '240 4% 66%',
                '--primary': '0 0% 100%',
                '--primary-foreground': '0 0% 4%',
                '--secondary': '0 0% 10%',
                '--accent': '0 0% 10%',
                '--border': '0 0% 18%',
                '--input': '0 0% 18%'
            }}
        >
            {/* Background video */}
            <div className="absolute inset-0 z-0">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
                />
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.65))' }}
                />
            </div>

            {/* Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                href="https://fonts.googleapis.com/css2?family=Instrumental+Serif:wght@400&family=Inter:wght@400;500&display=swap"
                rel="stylesheet"
            />

            <div className="relative z-10 min-h-screen flex items-center justify-center">
                <AuthSection authState={authState} setAuthState={setAuthState} onAuth={onAuth} />
            </div>
        </div>
    );
}

