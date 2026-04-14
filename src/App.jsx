import { useState, useEffect } from "react";
import {
  Box, Bell, Settings, LayoutDashboard,
  Package, ArrowLeftRight, ChevronRight,
} from "lucide-react";

import Login     from "./pages/Login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Inventory from "./pages/Inventory.jsx";
import Movements from "./pages/Movements.jsx";

import api from "./pages/api.js";
import useWarehouse from "./pages/useWarehouse.js";

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const fontLink = document.createElement("link");
fontLink.rel  = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap";
document.head.appendChild(fontLink);

/* ── Design Tokens ────────────────────────────────────────────────────────── */
const C = {
  bg: "#0E0F11", card: "#141518", border: "#1E2025", border2: "#252830",
  text: "#F1F2F4", sub: "#9095A0", muted: "#555B66",
  blue: "#3B82F6", green: "#22C55E", yellow: "#F59E0B", red: "#EF4444",
};

/* ── Sidebar ──────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { key: "inventory", icon: Package,         label: "Inventory" },
  { key: "movements", icon: ArrowLeftRight,  label: "Movements" },
];

function Sidebar({ page, setPage, alertCount }) {
  return (
    <aside style={{
      width: 210, background: "#0A0B0D",
      borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column",
      height: "100%", flexShrink: 0,
    }}>
      <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(59,130,246,0.35)" }}>
            <Box size={13} color="#fff" />
          </div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, color: C.text, fontSize: 14 }}>StockPro</span>
        </div>
        <p style={{ fontSize: 10, color: C.muted, marginTop: 3, marginLeft: 37 }}>Warehouse</p>
      </div>

      <nav style={{ flex: 1, padding: 8, display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(({ key, icon: Icon, label }) => {
          const active = page === key;
          return (
            <div key={key} onClick={() => setPage(key)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 11px", borderRadius: 7, background: active ? "rgba(59,130,246,0.1)" : "transparent", cursor: "pointer" }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Icon size={14} color={active ? C.blue : C.sub} />
                <span style={{ fontSize: 13, color: active ? C.blue : C.sub, fontWeight: active ? 500 : 400 }}>{label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {key === "inventory" && alertCount > 0 && (
                  <span style={{ fontSize: 9, fontWeight: 600, background: "rgba(245,158,11,0.15)", color: C.yellow, padding: "1px 6px", borderRadius: 20 }}>
                    {alertCount}
                  </span>
                )}
                {active && <ChevronRight size={11} color={C.blue} opacity={0.5} />}
              </div>
            </div>
          );
        })}
      </nav>

      <div style={{ padding: 8, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 7, cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <Settings size={14} color={C.sub} />
          <span style={{ fontSize: 13, color: C.sub }}>Settings</span>
        </div>
      </div>
    </aside>
  );
}

/* ── Topbar ───────────────────────────────────────────────────────────────── */
function Topbar({ title, subtitle, alerts, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <header style={{ height: 52, background: "#0A0B0D", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0, zIndex: 20, position: "relative" }}>
      <div>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, color: C.text, fontSize: 14 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <button onClick={() => setOpen(v => !v)}
            style={{ width: 30, height: 30, borderRadius: 7, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.sub, position: "relative" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1A1C20"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Bell size={14} />
            {alerts.length > 0 && (
              <span style={{ position: "absolute", top: 5, right: 5, width: 5, height: 5, background: C.yellow, borderRadius: "50%", border: "1px solid #0A0B0D" }} />
            )}
          </button>
          {open && (
            <div style={{ position: "absolute", right: 0, top: 36, width: 260, background: "#1A1C20", border: `1px solid ${C.border2}`, borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.6)", zIndex: 100 }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Alerts ({alerts.length})</p>
              </div>
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {alerts.length === 0
                  ? <p style={{ padding: 16, fontSize: 12, color: C.muted, textAlign: "center" }}>All levels OK</p>
                  : alerts.map(p => (
                    <div key={p.id} style={{ padding: "8px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.quantity === 0 ? C.red : C.yellow, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 12, color: C.text }}>{p.name}</p>
                        <p style={{ fontSize: 10, color: C.muted }}>{p.quantity} pairs · Min: {p.min_stock}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>

        <button onClick={onLogout}
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, padding: "5px 12px", fontSize: 12, color: C.red, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
          Logout
        </button>
      </div>
    </header>
  );
}

/* ── Loading Screen ───────────────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 36, height: 36, margin: "0 auto 14px",
          border: "3px solid rgba(59,130,246,0.2)",
          borderTopColor: C.blue, borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
        <p style={{ fontSize: 13, color: C.sub, fontFamily: "DM Sans, sans-serif" }}>Loading warehouse data…</p>
      </div>
    </div>
  );
}

/* ── Error Banner ─────────────────────────────────────────────────────────── */
function ErrorBanner({ message, onDismiss }) {
  return (
    <div style={{
      background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
      borderRadius: 8, padding: "10px 16px", margin: "12px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      fontSize: 12, color: C.red, fontFamily: "DM Sans, sans-serif",
    }}>
      ⚠ {message}
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}

/* ── Root App ─────────────────────────────────────────────────────────────── */
export default function App() {
  const [auth, setAuth] = useState(false);
  const [page, setPage] = useState("dashboard");

  // useWarehouse replaces useReducer — fetches live data from Flask
  const { state, dispatch, loading, error, setError } = useWarehouse(auth);

  // Normalise field names: backend uses `stock` / `low_stock_threshold`,
  // frontend pages use `quantity` / `min_stock`. Map once here so all
  // existing pages (Dashboard, Inventory, Movements) stay untouched.
  const normalisedState = {
    ...state,
    products: state.products.map(p => ({
      ...p,
      quantity:  p.quantity  ?? p.stock    ?? 0,
      min_stock: p.min_stock ?? p.lowStock ?? 100,
      gram:      p.gram      ?? p.weight   ?? null,
      sku:       p.sku       ?? p.id.toUpperCase(),
      unit:      p.unit      ?? "Pairs",
    })),
  };

  const alerts = normalisedState.products.filter(p => p.quantity < p.min_stock);
  const TODAY  = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const TITLES = { dashboard: "Dashboard", inventory: "Inventory", movements: "Movements" };

  const handleLogin  = () => { setAuth(true); setPage("dashboard"); };
  const handleLogout = async () => {
    try { await api.logout(); } catch (_) {}
    setAuth(false);
    setPage("dashboard");
  };

  if (!auth) return <Login onLogin={handleLogin} />;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0E0F11; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0E0F11; }
        ::-webkit-scrollbar-thumb { background: #252830; border-radius: 3px; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "DM Sans, sans-serif", overflow: "hidden" }}>
        <Sidebar page={page} setPage={setPage} alertCount={alerts.length} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Topbar
            title={TITLES[page]}
            subtitle={page === "dashboard" ? TODAY : undefined}
            alerts={alerts}
            onLogout={handleLogout}
          />

          {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

          {loading
            ? <LoadingScreen />
            : (
              <>
                {page === "dashboard" && <Dashboard state={normalisedState} dispatch={dispatch} />}
                {page === "inventory" && <Inventory state={normalisedState} dispatch={dispatch} />}
                {page === "movements" && <Movements state={normalisedState} dispatch={dispatch} />}
              </>
            )
          }
        </div>
      </div>
    </>
  );
}
