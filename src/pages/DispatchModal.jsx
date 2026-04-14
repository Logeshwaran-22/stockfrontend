/**
 * DISPATCH MODAL
 * Props:
 *   open     — boolean
 *   onClose  — function
 *   products — array
 *   dispatch — reducer dispatch
 *   pre      — optional pre-selected product object
 */

import { useState } from "react";
import { PackageMinus } from "lucide-react";

const C = {
  card: "#141518", border: "#1E2025", border2: "#252830",
  text: "#F1F2F4", sub: "#9095A0", muted: "#555B66",
  blue: "#3B82F6", green: "#22C55E", red: "#EF4444",
};

function Field({ label, type = "text", value, onChange, placeholder, min }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <p style={{ fontSize: 10, fontWeight: 500, color: C.sub, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{label}</p>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} min={min}
        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border2}`, borderRadius: 7, color: C.text, fontFamily: "DM Sans, sans-serif", fontSize: 13, padding: "10px 12px", outline: "none" }}
        onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.6)"}
        onBlur={e  => e.target.style.borderColor = C.border2}
      />
    </div>
  );
}
function Dropdown({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <p style={{ fontSize: 10, fontWeight: 500, color: C.sub, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{label}</p>}
      <select value={value} onChange={onChange}
        style={{ width: "100%", background: "#1A1C20", border: `1px solid ${C.border2}`, borderRadius: 7, color: C.text, fontFamily: "DM Sans, sans-serif", fontSize: 13, padding: "10px 12px", outline: "none", cursor: "pointer" }}>
        {options.map(o => <option key={o.value} value={o.value} style={{ background: "#1A1C20" }}>{o.label}</option>)}
      </select>
    </div>
  );
}
function Btn({ children, onClick, type = "button", color, disabled }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 7, fontSize: 12, fontWeight: 500, fontFamily: "DM Sans, sans-serif", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, border: `1px solid ${color}40`, background: color + "18", color }}>
      {children}
    </button>
  );
}

export default function DispatchModal({ open, onClose, products, dispatch, pre }) {
  const [pid,  setPid]  = useState(pre?.id || "");
  const [qty,  setQty]  = useState("");
  const [ref,  setRef]  = useState("");
  const [note, setNote] = useState("");

  const sel      = products.find(p => p.id === pid);
  const balance  = sel ? sel.quantity - +qty : null;
  const overshot = balance !== null && balance < 0;

  const close = () => { setPid(pre?.id || ""); setQty(""); setRef(""); setNote(""); onClose(); };

  const submit = e => {
    e.preventDefault();
    if (!pid || !qty || +qty <= 0 || overshot) return;
    dispatch({ type: "DISPATCH", pid, qty: +qty, ref, note });
    close();
  };

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={close}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", background: C.card, border: `1px solid ${C.border2}`, borderRadius: 14, width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, color: C.text, fontSize: 14 }}>📦 Dispatch Order</p>
          <button onClick={close} style={{ background: "none", border: "none", color: "#555B66", cursor: "pointer", fontSize: 22 }}>×</button>
        </div>
        <div style={{ padding: "20px 22px" }}>
          <form onSubmit={submit}>
            <Dropdown label="Product" value={pid} onChange={e => setPid(e.target.value)}
              options={[{ value: "", label: "— Select product —" }, ...products.map(p => ({ value: p.id, label: `${p.name}  (${p.quantity} pairs available)` }))]} />

            {/* Current stock */}
            {sel && (
              <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                <p style={{ fontSize: 10, color: C.sub }}>Current Stock</p>
                <p style={{ fontSize: 20, fontFamily: "Syne, sans-serif", fontWeight: 700, color: C.blue }}>
                  {sel.quantity} <span style={{ fontSize: 12, color: C.muted }}>pairs</span>
                </p>
              </div>
            )}

            <Field label="Quantity to Dispatch (Pairs)" type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="e.g. 100" />

            {/* Balance preview */}
            {sel && qty && (
              <div style={{ background: overshot ? "rgba(239,68,68,0.07)" : "rgba(34,197,94,0.06)", border: `1px solid ${overshot ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.2)"}`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                <p style={{ fontSize: 10, color: C.sub }}>Balance After Dispatch</p>
                <p style={{ fontSize: 20, fontFamily: "Syne, sans-serif", fontWeight: 700, color: overshot ? C.red : C.green }}>
                  {Math.max(0, balance)} <span style={{ fontSize: 12, color: C.muted }}>pairs</span>
                  {overshot && <span style={{ fontSize: 11, color: C.red, marginLeft: 8 }}>⚠ Not enough stock</span>}
                </p>
              </div>
            )}

            <Field label="Order ID / Reference" value={ref}  onChange={e => setRef(e.target.value)}  placeholder="ORD-001" />
            <Field label="Note (optional)"      value={note} onChange={e => setNote(e.target.value)} placeholder="Customer, details…" />

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn onClick={close} color="#9095A0">Cancel</Btn>
              <Btn type="submit" color={C.red} disabled={!pid || !qty || +qty <= 0 || overshot}>
                <PackageMinus size={13} /> Dispatch
              </Btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}