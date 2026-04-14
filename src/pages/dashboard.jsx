

import { useState } from "react";
import {
  AlertTriangle, CheckCircle2, TrendingDown,
  PackageCheck, PackageMinus,
} from "lucide-react";
import AddStockModal  from "./AddStockModal";
import DispatchModal  from "./DispatchModal";

const C = {
  bg: "#0E0F11", card: "#141518", border: "#1E2025", border2: "#252830",
  text: "#F1F2F4", sub: "#9095A0", muted: "#555B66",
  blue: "#3B82F6", green: "#22C55E", yellow: "#F59E0B", red: "#EF4444",
};

const fmtDate = s => new Date(s).toLocaleString("en-IN", {
  day: "2-digit", month: "short", year: "numeric",
  hour: "2-digit", minute: "2-digit", hour12: true,
});

const TODAY = new Date().toLocaleDateString("en-IN", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});

function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, ...style }}>
      {children}
    </div>
  );
}

function SLabel({ children }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 600, color: C.sub, textTransform: "uppercase", letterSpacing: "0.08em" }}>
      {children}
    </p>
  );
}

function Btn({ children, onClick, color = C.blue }) {
  return (
    <button onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: "DM Sans, sans-serif", cursor: "pointer", border: `1px solid ${color}40`, background: color + "18", color }}>
      {children}
    </button>
  );
}

export default function Dashboard({ state, dispatch }) {
  const { products, movements } = state;
  const [addOpen,  setAdd]  = useState(false);
  const [dispOpen, setDisp] = useState(false);

  const outStock   = products.filter(p => p.quantity === 0);
  const lowStock   = products.filter(p => p.quantity > 0 && p.quantity < p.min_stock);
  const alerts     = [...outStock, ...lowStock];
  const dispatches = (movements || []).filter(m => m.type === "out");

  // build dealer summary
  const dealerMap = {};
  dispatches.forEach(m => {
    if (!m.dealer) return;
    if (!dealerMap[m.dealer]) dealerMap[m.dealer] = { name: m.dealer, total: 0, count: 0, last: m.date };
    dealerMap[m.dealer].total += m.qty;
    dealerMap[m.dealer].count += 1;
  });
  const dealers = Object.values(dealerMap);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 11, color: C.muted }}>{TODAY}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn color={C.green} onClick={() => setAdd(true)}>
            <PackageCheck size={13} /> Add Stock
          </Btn>
          <Btn color={C.red} onClick={() => setDisp(true)}>
            <PackageMinus size={13} /> Dispatch to Dealer
          </Btn>
        </div>
      </div>

      {/* Status strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[
          { label: "In Stock",     count: products.filter(p => p.quantity >= p.min_stock).length, color: C.green,  bg: "rgba(34,197,94,0.07)",  Icon: CheckCircle2  },
          { label: "Low Stock",    count: lowStock.length,  color: C.yellow, bg: "rgba(245,158,11,0.07)", Icon: AlertTriangle },
          { label: "Out of Stock", count: outStock.length,  color: C.red,    bg: "rgba(239,68,68,0.07)",  Icon: TrendingDown  },
        ].map(({ label, count, color, bg, Icon }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${color}22`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 10, color: color + "cc", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{label}</p>
              <p style={{ fontSize: 22, fontFamily: "Syne, sans-serif", fontWeight: 700, color }}>
                {count} <span style={{ fontSize: 11, fontFamily: "DM Sans", fontWeight: 400, color: color + "88" }}>products</span>
              </p>
            </div>
            <Icon size={20} color={color} opacity={0.3} />
          </div>
        ))}
      </div>

      {/* Two columns: Stock + Dealers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Stock levels */}
        <Card>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
            <SLabel>Stock Levels</SLabel>
          </div>
          <div style={{ maxHeight: 440, overflowY: "auto" }}>
            {products.map((p, i) => {
              const isOut = p.quantity === 0;
              const isLow = p.quantity > 0 && p.quantity < p.min_stock;
              const dot   = isOut ? C.red : isLow ? C.yellow : C.green;
              return (
                <div key={p.id}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: i < products.length - 1 ? `1px solid ${C.border}` : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1A1C20"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: C.text }}>{p.name}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 16, fontFamily: "Syne, sans-serif", fontWeight: 700, color: dot }}>{p.quantity}</span>
                    <span style={{ fontSize: 10, color: C.muted, marginLeft: 4 }}>pairs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right column: dealer summary + recent dispatches */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Dealer summary */}
          <Card>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <SLabel>Dealers</SLabel>
              {dealers.length > 0 && (
                <span style={{ fontSize: 10, color: C.muted }}>{dealers.length} dealer{dealers.length > 1 ? "s" : ""}</span>
              )}
            </div>
            {dealers.length === 0 ? (
              <p style={{ padding: "28px 18px", textAlign: "center", color: C.muted, fontSize: 12 }}>
                No dispatches yet
              </p>
            ) : dealers.map((d, i) => (
              <div key={d.name}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 18px", borderBottom: i < dealers.length - 1 ? `1px solid ${C.border}` : "none" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1A1C20"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(59,130,246,0.1)", border: `1px solid ${C.border2}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.blue, flexShrink: 0 }}>
                    {d.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{d.name}</p>
                    <p style={{ fontSize: 10, color: C.muted }}>{d.count} dispatch{d.count > 1 ? "es" : ""} · last {fmtDate(d.last)}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 15, fontFamily: "Syne, sans-serif", fontWeight: 700, color: C.red }}>−{d.total}</p>
                  <p style={{ fontSize: 10, color: C.muted }}>pairs</p>
                </div>
              </div>
            ))}
          </Card>

          {/* Recent dispatch log */}
          <Card>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
              <SLabel>Recent Dispatches</SLabel>
            </div>
            <div style={{ maxHeight: 196, overflowY: "auto" }}>
              {dispatches.length === 0 ? (
                <p style={{ padding: "24px 18px", textAlign: "center", color: C.muted, fontSize: 12 }}>No dispatches yet</p>
              ) : dispatches.slice(0, 15).map((m, i) => (
                <div key={m.id}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 18px", borderBottom: i < Math.min(dispatches.length, 15) - 1 ? `1px solid ${C.border}` : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1A1C20"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div>
                    <p style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{m.dealer || "—"}</p>
                    <p style={{ fontSize: 10, color: C.muted }}>{m.product} · {fmtDate(m.date)}</p>
                  </div>
                  <p style={{ fontSize: 13, fontFamily: "Syne, sans-serif", fontWeight: 700, color: C.red }}>−{m.qty}</p>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>

      {/* Alerts panel */}
      {alerts.length > 0 && (
        <Card>
          <div style={{ padding: "12px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 7 }}>
            <AlertTriangle size={12} color={C.yellow} />
            <SLabel>Needs Attention ({alerts.length})</SLabel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
            {alerts.map((p, i) => {
              const isOut = p.quantity === 0;
              const color = isOut ? C.red : C.yellow;
              const pct   = Math.min(100, (p.quantity / p.min_stock) * 100);
              return (
                <div key={p.id} style={{ padding: "12px 16px", borderRight: i % 4 < 3 ? `1px solid ${C.border}` : "none", borderBottom: i < alerts.length - 4 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <p style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{p.name}</p>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: color + "18", color }}>
                      {isOut ? "OUT" : "LOW"}
                    </span>
                  </div>
                  <p style={{ fontSize: 18, fontFamily: "Syne, sans-serif", fontWeight: 700, color, marginBottom: 3 }}>
                    {p.quantity} <span style={{ fontSize: 10, fontWeight: 400, color: C.muted }}>pairs</span>
                  </p>
                  <div style={{ height: 2, borderRadius: 1, background: C.border }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 1 }} />
                  </div>
                  <p style={{ fontSize: 9, color: C.muted, marginTop: 3 }}>Min: {p.min_stock}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <AddStockModal open={addOpen}  onClose={() => setAdd(false)}  products={products} dispatch={dispatch} />
      <DispatchModal open={dispOpen} onClose={() => setDisp(false)} products={products} dispatch={dispatch} />
    </div>
  );
}