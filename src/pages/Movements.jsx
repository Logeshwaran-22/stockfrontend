/**
 * MOVEMENTS PAGE
 * Props:
 *   state    — { products, movements }
 *   dispatch — reducer dispatch function
 */

import { useState } from "react";
import {
  ArrowLeftRight, ArrowUpRight, ArrowDownRight,
  PackageCheck, PackageMinus,
} from "lucide-react";
import AddStockModal from "./AddStockModal";
import DispatchModal from "./DispatchModal";

const C = {
  bg: "#0E0F11", card: "#141518", border: "#1E2025", border2: "#252830",
  text: "#F1F2F4", sub: "#9095A0", muted: "#555B66",
  blue: "#3B82F6", green: "#22C55E", yellow: "#F59E0B",
  red: "#EF4444", purple: "#A855F7",
};
const fmtDate = s => new Date(s).toLocaleString("en-IN", {
  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true,
});

function Card({ children, style = {} }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, ...style }}>{children}</div>;
}
function StatCard({ label, value, sub, icon: Icon, color = C.blue }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 500, color: C.sub, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} color={color} />
        </div>
      </div>
      <div style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 700, color: C.text, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
function Btn({ children, onClick, color = C.blue }) {
  return (
    <button onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 7, fontSize: 12, fontWeight: 500, fontFamily: "DM Sans, sans-serif", cursor: "pointer", border: `1px solid ${color}40`, background: color + "18", color }}>
      {children}
    </button>
  );
}

export default function Movements({ state, dispatch }) {
  const { products, movements } = state;
  const [filter,   setFilter] = useState("");   // "" | "in" | "out"
  const [addOpen,  setAdd]    = useState(false);
  const [dispOpen, setDisp]   = useState(false);

  const shown    = filter ? movements.filter(m => m.type === filter) : movements;
  const totalIn  = movements.filter(m => m.type === "in").reduce((s, m) => s + m.qty, 0);
  const totalOut = movements.filter(m => m.type === "out").reduce((s, m) => s + m.qty, 0);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <StatCard label="Total Records"    value={movements.length} icon={ArrowLeftRight} color={C.purple} />
        <StatCard label="Total Received"   value={`+${totalIn}`}   icon={ArrowUpRight}   color={C.green}  sub="pairs added to warehouse" />
        <StatCard label="Total Dispatched" value={`-${totalOut}`}  icon={ArrowDownRight} color={C.red}    sub="pairs sent out" />
      </div>

      {/* Table card */}
      <Card>

        {/* Filter tabs + actions */}
        <div style={{
          padding: "12px 16px", borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[["", "All"], ["in", "Stock In"], ["out", "Dispatched"]].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)}
                style={{
                  padding: "6px 14px", borderRadius: 6, fontSize: 12,
                  fontFamily: "DM Sans, sans-serif", cursor: "pointer", border: "none",
                  background: filter === v ? C.blue : "rgba(255,255,255,0.04)",
                  color: filter === v ? "#fff" : C.sub,
                  transition: "all .15s",
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn color={C.green} onClick={() => setAdd(true)}><PackageCheck size={12} /> Add Stock</Btn>
            <Btn color={C.red}   onClick={() => setDisp(true)}><PackageMinus size={12} /> Dispatch</Btn>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Date & Time", "Type", "Product", "Qty (Pairs)", "Order / Reference", "Note"].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px", textAlign: "left",
                    fontSize: 10, fontWeight: 600, color: C.sub,
                    textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: "center", color: C.muted, fontSize: 13 }}>
                    No movements recorded yet
                  </td>
                </tr>
              ) : (
                shown.map((m, i) => (
                  <tr
                    key={m.id}
                    style={{ borderBottom: i < shown.length - 1 ? `1px solid ${C.border}` : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1A1C20"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Date */}
                    <td style={{ padding: "11px 14px", color: C.muted, fontFamily: "monospace", fontSize: 10, whiteSpace: "nowrap" }}>
                      {fmtDate(m.date)}
                    </td>
                    {/* Type badge */}
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 5,
                        background: m.type === "in" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: m.type === "in" ? C.green : C.red,
                      }}>
                        {m.type === "in" ? "↑ Added" : "↓ Dispatched"}
                      </span>
                    </td>
                    {/* Product */}
                    <td style={{ padding: "11px 14px", color: C.text, fontWeight: 500 }}>
                      {m.product}
                    </td>
                    {/* Qty */}
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ fontSize: 15, fontFamily: "Syne, sans-serif", fontWeight: 700, color: m.type === "in" ? C.green : C.red }}>
                        {m.type === "in" ? "+" : "-"}{m.qty}
                      </span>
                      <span style={{ fontSize: 10, color: C.muted, marginLeft: 4 }}>pairs</span>
                    </td>
                    {/* Reference */}
                    <td style={{ padding: "11px 14px", color: C.sub, fontFamily: "monospace", fontSize: 11 }}>
                      {m.reference || "—"}
                    </td>
                    {/* Note */}
                    <td style={{ padding: "11px 14px", color: C.muted }}>
                      {m.note || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {shown.length > 0 && (
          <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 11, color: C.muted }}>
              Showing {shown.length} {filter === "in" ? "stock-in" : filter === "out" ? "dispatch" : "total"} records
            </p>
          </div>
        )}
      </Card>

      <AddStockModal  open={addOpen}  onClose={() => setAdd(false)}  products={products} dispatch={dispatch} />
      <DispatchModal  open={dispOpen} onClose={() => setDisp(false)} products={products} dispatch={dispatch} />
    </div>
  );
}