import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API = "http://localhost:5000/api";

function App() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("viewer");
  const [revealed, setRevealed] = useState({});
  const [audit, setAudit] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    const [u, a] = await Promise.all([
      fetch(`${API}/users`).then(r => r.json()),
      fetch(`${API}/audit`).then(r => r.json())
    ]);
    setUsers(u);
    setAudit(a);
  }

  useEffect(() => { load(); }, []);

  async function reveal(id) {
    setMessage("");
    const response = await fetch(`${API}/users/${id}/reveal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setRevealed(prev => ({ ...prev, [id]: { ...data, expires: Date.now() + 30000 } }));
    setMessage("Confidential information revealed. It will auto-hide after 30 seconds.");
    setTimeout(() => {
      setRevealed(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 30000);

    await load();
  }

  function value(user, field) {
    return revealed[user.id]?.[field] ?? user[field];
  }

  return (
    <div className="app">
      <header>
        <div>
          <h1>PrivacyShield</h1>
          <p>Role-based confidential information viewer</p>
        </div>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </header>

      <main>
        <section className="notice">
          <strong>Privacy by default:</strong>
          Sensitive fields are masked by the server. Only an authorised admin
          can request a temporary reveal, and every reveal is audited.
        </section>

        {message && <div className="message">{message}</div>}

        <section className="grid">
          {users.map(user => (
            <article className="card" key={user.id}>
              <h2>{user.name}</h2>
              <p><b>Email:</b> {value(user, "email")}</p>
              <p><b>Phone:</b> {value(user, "phone")}</p>
              <p><b>PAN:</b> {value(user, "pan")}</p>
              <p><b>Aadhaar:</b> {value(user, "aadhaar")}</p>
              <p><b>Card:</b> {value(user, "card")}</p>
              <button onClick={() => reveal(user.id)}>
                Reveal for 30 seconds
              </button>
            </article>
          ))}
        </section>

        <section className="audit">
          <h2>Audit Log</h2>
          {audit.length === 0 ? (
            <p>No confidential fields have been revealed yet.</p>
          ) : (
            audit.map((item, i) => (
              <div className="audit-row" key={i}>
                <span>{item.action}</span>
                <span>User #{item.userId}</span>
                <span>{item.role}</span>
                <span>{new Date(item.timestamp).toLocaleString()}</span>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);