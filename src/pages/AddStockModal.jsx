/**
 * ADD STOCK MODAL
 * Props:
 *   open     — boolean
 *   onClose  — function
 *   products — array
 *   dispatch — reducer dispatch
 *   pre      — optional pre-selected product object
 */

import { useState } from "react";
import { PackageCheck } from "lucide-react";

const C = {
  card: "#141518", border: "#1E2025", border2: "#252830",
  text: "#F1F2F4", sub: "#9095A0", muted: "#555B66",
  green: "#22C55E",
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

export default function AddStockModal({ open, onClose, products, dispatch, pre }) {
  const [pid,  setPid]  = useState(pre?.id || "");
  const [qty,  setQty]  = useState("");
  const [ref,  setRef]  = useState("");
  const [note, setNote] = useState("");

  const close = () => { setPid(pre?.id || ""); setQty(""); setRef(""); setNote(""); onClose(); };

  const submit = e => {
    e.preventDefault();
    if (!pid || !qty || +qty <= 0) return;
    dispatch({ type: "ADD_STOCK", pid, qty: +qty, ref, note });
    close();
  };

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={close}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", background: C.card, border: `1px solid ${C.border2}`, borderRadius: 14, width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, color: C.text, fontSize: 14 }}>➕ Add Stock</p>
          <button onClick={close} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 22 }}>×</button>
        </div>
        <div style={{ padding: "20px 22px" }}>
          <form onSubmit={submit}>
            <Dropdown label="Product" value={pid} onChange={e => setPid(e.target.value)}
              options={[{ value: "", label: "— Select product —" }, ...products.map(p => ({ value: p.id, label: p.name }))]} />
            <Field label="Quantity (Pairs)" type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="e.g. 500" />
            <Field label="PO / Reference"   value={ref}  onChange={e => setRef(e.target.value)}  placeholder="PO-001" />
            <Field label="Note (optional)"  value={note} onChange={e => setNote(e.target.value)} placeholder="Supplier, batch…" />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn onClick={close} color="#9095A0">Cancel</Btn>
              <Btn type="submit" color={C.green} disabled={!pid || !qty || +qty <= 0}>
                <PackageCheck size={13} /> Add Stock
              </Btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}