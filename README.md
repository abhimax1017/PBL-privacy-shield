# PBL – PrivacyShield: Secure Confidential Information Viewer

## Selected Assignment
Assignment 41 – Data Privacy: Show/hide confidential user information in the UI.

The source assignment requires sensitive fields to be masked by default, role-authorised reveal, temporary auto-hide, and audit logging. It also requires server-side masking so masked data is not merely hidden with CSS.

## Stack
- React + Vite
- Node.js + Express
- Role-based access control
- Server-side masking
- Audit log

## Run

### Backend
```bash
cd server
npm install
npm start
```

### Frontend
Open another terminal:
```bash
cd client
npm install
npm run dev
```

Open:
http://localhost:5173

## Demo
1. Start as Viewer. All sensitive fields are masked.
2. Click Reveal. The server rejects the request with HTTP 403.
3. Select Admin.
4. Reveal a user's information.
5. The information is displayed temporarily and auto-hides after 30 seconds.
6. Check the Audit Log for the reveal event.

## Security Note
This is an academic demonstration. Production systems should use real authentication, HTTPS, encrypted storage, CSRF protection, secure session handling, and a persistent database for audit logs.
