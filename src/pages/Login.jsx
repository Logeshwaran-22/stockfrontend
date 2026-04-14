/**
 * Login.jsx  —  Updated to authenticate against Flask /api/login
 * Drop this in src/Login.jsx (replaces the hardcoded credentials version)
 */

import { useState } from "react";
import { Eye, EyeOff, Box, ArrowRight } from "lucide-react";
import api from "./api";

const C = {
  bg: "#0E0F11", card: "#141518", border: "#1E2025", border2: "#252830",
  text: "#F1F2F4", sub: "#9095A0", muted: "#555B66",
  blue: "#3B82F6", green: "#22C55E", yellow: "#F59E0B", red: "#EF4444",
};

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err,  setErr]  = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setErr("");
  };

  // ── Submit: call Flask /api/login ─────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !pass) { setErr("Please enter both fields."); return; }

    setBusy(true);
    setErr("");
    try {
      const res = await api.login(user, pass);
      onLogin(res);   // pass user info up to App
    } catch (apiErr) {
      setErr(apiErr.message || "Invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  const inputStyle = (hasErr) => ({
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${hasErr ? "rgba(239,68,68,0.45)" : C.border2}`,
    borderRadius: 8,
    color: C.text,
    fontFamily: "DM Sans, sans-serif",
    fontSize: 14,
    padding: "12px 14px",
    outline: "none",
    transition: "border-color .2s",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0E0F11; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{
        minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr",
        background: C.bg, fontFamily: "DM Sans, sans-serif",
      }}>
        {/* ── LEFT PANEL ── */}
        <div style={{
          position: "relative", background: C.bg,
          borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 52px", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
            top: "5%", left: "-15%", pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: C.blue,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(59,130,246,0.45)",
              }}>
                <Box size={15} color="#fff" />
              </div>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, color: C.text, fontSize: 16 }}>
                StockPro
              </span>
            </div>
            <p style={{ fontSize: 10, color: C.muted, marginTop: 3, marginLeft: 42 }}>
              Warehouse Management
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.22)",
              borderRadius: 100, padding: "4px 12px", marginBottom: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.blue, display: "inline-block" }} />
              <span style={{ fontSize: 10, color: C.blue, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
                Raw Gloves Warehouse
              </span>
            </div>

            <h1 style={{
              fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 700,
              color: C.text, lineHeight: 1.2, marginBottom: 16,
            }}>
              Control every pair.<br />
              <span style={{ color: C.blue }}>Zero guesswork.</span>
            </h1>

            <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.75, maxWidth: 340, fontWeight: 300 }}>
              Track Latex Blue &amp; Grey (40–90gm), PU Coated and Sleeve gloves.
              Add stock, dispatch orders, see your live balance instantly.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
              {[["Latex Blue", C.blue], ["Latex Grey", C.sub], ["PU Coated", C.yellow], ["Sleeve", C.green]].map(([name, color]) => (
                <span key={name} style={{
                  background: color + "15", border: `1px solid ${color}30`,
                  borderRadius: 100, padding: "5px 12px",
                  fontSize: 11, color, fontWeight: 500,
                }}>{name}</span>
              ))}
              <span style={{
                background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
                borderRadius: 100, padding: "5px 12px", fontSize: 11, color: C.muted,
              }}>
                40 · 50 · 60 · 70 · 80 · 90 gm
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, position: "relative", zIndex: 1 }}>
            {[["14", "Total SKUs"], ["4", "Categories"], ["Pairs", "Unit"]].map(([v, l]) => (
              <div key={l} style={{
                background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
                borderRadius: 9, padding: "12px 14px",
              }}>
                <div style={{ fontSize: 18, fontFamily: "Syne, sans-serif", fontWeight: 700, color: C.text }}>{v}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{
          background: "#0A0B0D",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "48px 60px",
        }}>
          <div style={{ width: "100%", maxWidth: 360 }}>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 6 }}>
              Sign in
            </h2>
            <p style={{ fontSize: 13, color: C.muted, fontWeight: 300, marginBottom: 32 }}>
              Access your warehouse dashboard
            </p>

            {err && (
              <div style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)",
                borderRadius: 8, padding: "10px 14px", marginBottom: 18,
                fontSize: 12, color: C.red,
              }}>
                {err}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: C.sub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Username</p>
                <input
                  type="text" value={user} onChange={handleChange(setUser)}
                  placeholder="admin" autoComplete="username" style={inputStyle(!!err)}
                  onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.6)"}
                  onBlur={e  => e.target.style.borderColor = err ? "rgba(239,68,68,0.45)" : C.border2}
                />
              </div>

              <div style={{ marginBottom: 28, position: "relative" }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: C.sub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Password</p>
                <input
                  type={show ? "text" : "password"} value={pass} onChange={handleChange(setPass)}
                  placeholder="••••••••" autoComplete="current-password"
                  style={{ ...inputStyle(!!err), paddingRight: 42 }}
                  onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.6)"}
                  onBlur={e  => e.target.style.borderColor = err ? "rgba(239,68,68,0.45)" : C.border2}
                />
                <button type="button" onClick={() => setShow(v => !v)}
                  style={{ position: "absolute", right: 12, bottom: 12, background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", alignItems: "center" }}>
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <button type="submit" disabled={busy} style={{
                width: "100%", background: C.blue, color: "#fff",
                fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 500,
                padding: 13, border: "none", borderRadius: 8,
                cursor: busy ? "wait" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 0 20px rgba(59,130,246,0.3)",
                opacity: busy ? 0.7 : 1, transition: "opacity .2s",
              }}>
                {busy ? (
                  <>
                    <span style={{
                      width: 13, height: 13,
                      border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "#fff",
                      borderRadius: "50%", display: "inline-block",
                      animation: "spin .65s linear infinite",
                    }} />
                    Signing in…
                  </>
                ) : (
                  <>Sign in <ArrowRight size={14} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
