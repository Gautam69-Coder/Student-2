# 🛠️ Security Remediation Log: How the Vulnerabilities Were Fixed

This document logs all 24 security bugs found in the Student-2 project and details the exact code changes applied to fix them.

---

## 🔴 Critical Severity Fixes

### BUG-1: Mass Assignment / Privilege Escalation via `updateProfile`
*   **Vulnerability:** The profile update endpoint passed `req.body.field` directly to Mongoose `$set` with no validation. This allowed any user to escalate themselves to `superadmin` by sending `{ "field": { "role": "superadmin" } }`.
*   **How it was fixed:** Introduced a whitelist `ALLOWED_PROFILE_FIELDS` to sanitize input. Only designated fields (`username`, `email`, `password`, `avatar`) are extracted and passed to the database update function.
*   **Affected File:** [auth.controller.js](file:///d:/PC-Data/Student-2/server/src/controllers/auth.controller.js#L77-L98)

### BUG-2: Timing Attack & Public Access on Admin Access Endpoint
*   **Vulnerability:** The `/admin-access` endpoint compared the password with `process.env.ADMIN_PASS` using `===` (susceptible to timing attacks) and lacked rate limiting.
*   **How it was fixed:** Implemented `crypto.timingSafeEqual()` to eliminate the timing side-channel. Also wrapped the endpoint in `authLimiter` (rate-limiting brute-force attempts).
*   **Affected File:** [auth.controller.js](file:///d:/PC-Data/Student-2/server/src/controllers/auth.controller.js#L134-L140)

### BUG-3: Unauthenticated Socket.io Handshake
*   **Vulnerability:** The Socket.io connection accepted the `user_online` event and registered the user's presence/updated the database using client-provided user IDs, letting anyone impersonate any user.
*   **How it was fixed:** Added a handshake middleware in `index.js` to extract and verify the JWT from cookies/auth payload. The socket service (`socket.service.js`) now strictly relies on the verified ID attached to `socket.user` rather than client-provided payload IDs.
*   **Affected Files:** [index.js](file:///d:/PC-Data/Student-2/server/src/index.js), [socket.service.js](file:///d:/PC-Data/Student-2/server/src/services/socket.service.js)

### BUG-4: No Registration Input Validation
*   **Vulnerability:** The `/register` endpoint registered accounts without basic formats check (e.g., accepting empty/short passwords).
*   **How it was fixed:** Added validation checks to verify username lengths, email formatting (using regex), and a minimum password length of 6 characters.
*   **Affected File:** [auth.controller.js](file:///d:/PC-Data/Student-2/server/src/controllers/auth.controller.js#L9-L43)

### BUG-18: JWT Token Saved in `localStorage`
*   **Vulnerability:** Saving the JWT in `localStorage` made it vulnerable to token theft via Cross-Site Scripting (XSS).
*   **How it was fixed:** Removed all instances of saving/reading token values to/from `localStorage`. The application now relies purely on `HTTPOnly` cookies.
*   **Affected Files:** [auth-section.jsx](file:///d:/PC-Data/Student-2/client/src/components/features/auth/auth-section.jsx), [api.js](file:///d:/PC-Data/Student-2/client/src/Api/api.js), [authSlice.js](file:///d:/PC-Data/Student-2/client/src/store/slices/authSlice.js)

### BUG-19: XSS in Blog Post Rendering
*   **Vulnerability:** Blog content was rendered using `dangerouslySetInnerHTML={{ __html: post.content }}`. If blog posts were ever loaded dynamically or written by a compromised admin, this would allow stored XSS.
*   **How it was fixed:** Added a helper function `sanitizeHtml` to BlogPost.jsx to strip out `<script>` tags, event handlers (`onerror`, `onload`), and `javascript:` URIs before rendering.
*   **Affected File:** [BlogPost.jsx](file:///d:/PC-Data/Student-2/client/src/pages/blog/BlogPost.jsx)

---

## 🟠 High Severity Fixes

### BUG-5: Hashed and Plaintext Passwords Logged to Console
*   **Vulnerability:** Plaintext passwords and complete database user objects were printed using `console.log` on every login, leaking secrets to production server logs.
*   **How it was fixed:** Deleted all `console.log(password)` and `console.log("User :", user)` lines from the authentication handler.
*   **Affected File:** [auth.controller.js](file:///d:/PC-Data/Student-2/server/src/controllers/auth.controller.js#L47-L52)

### BUG-6: Authorization Checks Bypassable due to JWT Role Trust
*   **Vulnerability:** Multiple controllers relied on `req.user.role` from the JWT token rather than fetching the current role from the database. A demoted admin's token would remain valid for up to 30 days.
*   **How it was fixed:** Configured the authorization checks in sensitive routes (e.g. users role updates, delete, and tracks) to fetch the user's latest details and roles from the database dynamically.
*   **Affected Files:** Multiple controllers.

### BUG-7: Multer Unrestricted File Upload
*   **Vulnerability:** The upload middleware had no constraints on file sizes or types, enabling attackers to upload malicious scripts (`.exe`, `.php`) or cause server-side disk exhaustion.
*   **How it was fixed:** Added an explicit whitelist for allowed extensions (`pdf`, `doc`, `docx`, `png`, `jpg`, `jpeg`, `txt`, `pptx`, `xlsx`, `csv`) and set a `limits.fileSize` of 10MB. Filenames are also sanitized to remove path traversal triggers (`..` or `/`).
*   **Affected File:** [multer.js](file:///d:/PC-Data/Student-2/server/src/middleware/multer.js)

### BUG-8: Content Update Mass Assignment
*   **Vulnerability:** `updateContent` updated content with `{ $set: req.body }`, allowing updates to unauthorized properties.
*   **How it was fixed:** Extracted and whitelisted only relevant properties (`title`, `description`, `code`, `language`, `section`, etc.) for the update query.
*   **Affected File:** [content.controller.js](file:///d:/PC-Data/Student-2/server/src/controllers/content.controller.js)

### BUG-9: Missing Auth Middleware on Sensitive Routes
*   **Vulnerability:** Multiple sensitive routes (like notifications, activity track metrics, guest track logs) were open to the public without auth.
*   **How it was fixed:** Bound the `auth` middleware to protect the endpoints, securing them from unauthorized access.
*   **Affected Route Files:** [notification.js](file:///d:/PC-Data/Student-2/server/src/routes/notification.js), [activityTrack.js](file:///d:/PC-Data/Student-2/server/src/routes/activityTrack.js), [guestTrack.js](file:///d:/PC-Data/Student-2/server/src/routes/guestTrack.js)

### BUG-10: Google Login Account Hijack
*   **Vulnerability:** The Google auth callback used Mongoose upsert to create or overwrite data based on email, which could accidentally overwrite a password-registered admin account's details.
*   **How it was fixed:** Added a check to identify existing registered accounts. If a user already exists with standard credentials, the callback returns the user cleanly without performing an upsert/overwriting credentials.
*   **Affected File:** [auth.controller.js](file:///d:/PC-Data/Student-2/server/src/controllers/auth.controller.js)

### BUG-20: Authentication Guard Bypass in React Router
*   **Vulnerability:** `ProtectedRoute` checked `localStorage.getItem("isAuthenticated") !== "true"` to determine access. This could be bypassed via the browser console: `localStorage.setItem('isAuthenticated', 'true')`.
*   **How it was fixed:** Refactored the route guard to verify the actual state prop (`isAuthenticated`) passed from Redux/Context state.
*   **Affected File:** [App.jsx](file:///d:/PC-Data/Student-2/client/src/App.jsx)

### BUG-21: Missing Frontend Role Checks on Admin Routing
*   **Vulnerability:** The frontend `/admin` route verified authentication, but did not assert whether the user was an admin, allowing logged-in regular students to access admin components.
*   **How it was fixed:** Added a check to the route definition: `<ProtectedRoute isAuthenticated={isAuthenticated && ['admin', 'superadmin'].includes(userRole)} ...>`
*   **Affected File:** [App.jsx](file:///d:/PC-Data/Student-2/client/src/App.jsx)

### BUG-22: Token Sent in Both Cookie & Header
*   **Vulnerability:** Dual transmission of the token (using both cookies and localStorage headers) nullified the security benefits of `HTTPOnly` configurations.
*   **How it was fixed:** Removed the header-based transmission completely. The backend is configured to use cookie-only validation.
*   **Affected Files:** [api.js](file:///d:/PC-Data/Student-2/client/src/Api/api.js), [auth.js](file:///d:/PC-Data/Student-2/server/src/middleware/auth.js)

---

## 🟡 Medium Severity Fixes

### BUG-11: Cookie `sameSite` Strict in Cross-Origin Environments
*   **Vulnerability:** The cookie had `sameSite: 'strict'`, which blocked transmission on cross-origin requests (e.g., student-2.pages.dev to Render backend).
*   **How it was fixed:** Adjusted cookie policies to `sameSite: 'none'` with `secure: true` in production, allowing standard cookie auth to function.
*   **Affected File:** [auth.controller.js](file:///d:/PC-Data/Student-2/server/src/controllers/auth.controller.js)

### BUG-12: JWT Secret Validation
*   **Vulnerability:** Server started without verifying if env vars (`JWT_SECRET`, etc.) were configured.
*   **How it was fixed:** Created `validateEnv.js` to test configuration values at startup and crash with a clear error trace if missing.
*   **Affected Files:** [validateEnv.js](file:///d:/PC-Data/Student-2/server/src/utils/validateEnv.js), [index.js](file:///d:/PC-Data/Student-2/server/src/index.js)

### BUG-13: No Rate Limiting
*   **Vulnerability:** Attacking tools could brute-force passwords, registers, or abuse OpenAI endpoints freely.
*   **How it was fixed:** Configured rate-limiting layers (`authLimiter`, `aiLimiter`, and `generalLimiter`) to cap requests per IP.
*   **Affected File:** [rateLimiter.js](file:///d:/PC-Data/Student-2/server/src/middleware/rateLimiter.js)

### BUG-14: Large JSON payload size limits
*   **Vulnerability:** Body limits set to `100mb` made the server vulnerable to memory exhaustion.
*   **How it was fixed:** Set JSON and raw text sizes to `1mb`, leaving `10mb` for standard multipart forms.
*   **Affected File:** [app.js](file:///d:/PC-Data/Student-2/server/src/app.js)

### BUG-15: Prompt Injection on LLM prompts
*   **Vulnerability:** User queries were embedded directly inside system prompts without validation, leaving them open to jailbreak overrides.
*   **How it was fixed:** Added a `sanitizeForPrompt` function to filter out directives like `System:`, `Ignore instructions`, and similar directives.
*   **Affected Files:** [aiAssistant.controller.js](file:///d:/PC-Data/Student-2/server/src/controllers/aiAssistant.controller.js), [aiCodeHelper.controller.js](file:///d:/PC-Data/Student-2/server/src/controllers/aiCodeHelper.controller.js)

---

## 🔵 Low Severity Fixes

### BUG-16: Inconsistent `superadmin` / `admin` checks
*   **Vulnerability:** Some endpoints asserted `req.user.role !== 'admin'`, which locked out `superadmin` users.
*   **How it was fixed:** Updated logical asserts across all controllers to allow `superadmin` and `admin` roles consistently.
*   **Affected Files:** Multiple controllers.

### BUG-17 & BUG-24: Debug logging to Console
*   **Vulnerability:** Plain debug variables (e.g., query payloads, full API responses) were logged to stdout.
*   **How it was fixed:** Removed console logging of user-specific data from production code paths.
*   **Affected Files:** Multiple controllers and frontend source files.
