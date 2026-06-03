import React from "react";
import StudyOverview from "./StudyOverview";

// Dashboard Home is intentionally replaced with StudyOverview.
// This keeps all other dashboard routes unchanged.
export function Home() {
    return <StudyOverview />;
}

