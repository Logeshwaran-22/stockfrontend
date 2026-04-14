/**
 * INVENTORY PAGE
 * Props:
 *   state    — { products, movements }
 *   dispatch — reducer dispatch function
 */

import { useState, useMemo } from "react";
import { Search, Plus, Minus, PackageCheck, PackageMinus } from "lucide-react";
import AddStockModal from "./AddStockModal";
import DispatchModal from "./DispatchModal";

const C = {
  bg: "#0E0F11", card: "#141518", border: "#1E2025", border2: "#252830",
  text: "#F1F2F4", sub: "#9095A0", muted: "#555B66",
  blue: "#3B82F6", green: "#22C55E", yellow: "#F59E0B", red: "#EF4444",
};
const CATS = [
  { name: "Latex Blue", color: "#3B82F6" },
  { name: "Latex Grey", color: "#9095A0" },
  { name: "PU Coated",  color: "#F59E0B" },
  { name: "Sleeve",     color: "#22C55E" },
];

function Card({ children, style = {} }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, ...style }}>{children}</div>;
}
function Btn({ children, onClick, color = C.blue, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 7, fontSize: 12, fontWeight: 500, fontFamily: "DM Sans, sans-serif", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, border: `1px solid ${color}40`, background: color + "18", color, ...style }}>
      {children}
    </button>
  );
}

const getStatus = p =>
  p.quantity === 0         ? ["Out of Stock", C.red]    :
  p.quantity < p.min_stock ? ["Low Stock",    C.yellow] :
                             ["In Stock",     C.green];

export default function Inventory({ state, dispatch }) {
  const { products } = state;
  const [search, setSearch]   = useState("");
  const [cat,    setCat]      = useState("");
  const [addOpen,  setAdd]    = useState(false);
  const [dispOpen, setDisp]   = useState(false);
  const [pre,      setPre]    = useState(null);

  const filtered = useMemo(() =>
    products.filter(p => {
      const q = search.toLowerCase();
      return (
        (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
        (!cat || p.category === cat)
      );
    }),
    [products, search, cat]
  );

  const totalFiltered = filtered.reduce((s, p) => s + p.quantity, 0);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
      <Card>

        {/* Toolbar */}
        <div style={{
          padding: "13px 16px", borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={12} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.muted }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search product or SKU…"
                style={{
                  background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border2}`,
                  borderRadius: 7, color: C.text, fontFamily: "DM Sans, sans-serif",
                  fontSize: 12, padding: "7px 10px 7px 30px", outline: "none", width: 200,
                }}
              />
            </div>

            {/* Category filter */}
            <select
              value={cat}
              onChange={e => setCat(e.target.value)}
              style={{
                background: "#1A1C20", border: `1px solid ${C.border2}`, borderRadius: 7,
                color: C.sub, fontFamily: "DM Sans, sans-serif",
                fontSize: 12, padding: "7px 10px", outline: "none", cursor: "pointer",
              }}
            >
              <option value="">All Categories</option>
              {CATS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn color={C.green} onClick={() => { setPre(null); setAdd(true); }}>
              <PackageCheck size={12} /> Add Stock
            </Btn>
            <Btn color={C.red} onClick={() => { setPre(null); setDisp(true); }}>
              <PackageMinus size={12} /> Dispatch
            </Btn>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["SKU", "Product Name", "Category", "Weight", "Stock (Pairs)", "Min Stock", "Status", "Actions"].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px", textAlign: "left",
                    fontSize: 10, fontWeight: 600, color: C.sub,
                    textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 40, textAlign: "center", color: C.muted, fontSize: 13 }}>
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => {
                  const [stLabel, stColor] = getStatus(p);
                  const catColor = CATS.find(c => c.name === p.category)?.color || C.sub;
                  return (
                    <tr
                      key={p.id}
                      style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1A1C20"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      {/* SKU */}
                      <td style={{ padding: "11px 14px", color: C.muted, fontFamily: "monospace", fontSize: 10 }}>
                        {p.sku}
                      </td>
                      {/* Name */}
                      <td style={{ padding: "11px 14px", color: C.text, fontWeight: 500 }}>
                        {p.name}
                      </td>
                      {/* Category */}
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{
                          fontSize: 10, background: catColor + "18",
                          color: catColor, padding: "2px 8px", borderRadius: 4, fontWeight: 500,
                        }}>
                          {p.category}
                        </span>
                      </td>
                      {/* Weight */}
                      <td style={{ padding: "11px 14px", color: C.sub }}>
                        {p.gram ? `${p.gram}gm` : "—"}
                      </td>
                      {/* Stock */}
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 16, fontFamily: "Syne, sans-serif", fontWeight: 700, color: stColor }}>
                          {p.quantity}
                        </span>
                        <span style={{ fontSize: 10, color: C.muted, marginLeft: 4 }}>pairs</span>
                      </td>
                      {/* Min stock */}
                      <td style={{ padding: "11px 14px", color: C.muted }}>
                        {p.min_stock} pairs
                      </td>
                      {/* Status badge */}
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{
                          fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 5,
                          background: stColor + "18", color: stColor,
                        }}>
                          {stLabel}
                        </span>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button
                            title="Add Stock"
                            onClick={() => { setPre(p); setAdd(true); }}
                            style={{
                              width: 27, height: 27, borderRadius: 5,
                              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                              color: C.green,
                            }}
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            title="Dispatch"
                            onClick={() => { setPre(p); setDisp(true); }}
                            style={{
                              width: 27, height: 27, borderRadius: 5,
                              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                              color: C.red,
                            }}
                          >
                            <Minus size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          padding: "10px 14px", borderTop: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <p style={{ fontSize: 11, color: C.muted }}>
            {filtered.length} of {products.length} products
          </p>
          <p style={{ fontSize: 11, color: C.muted }}>
            Total: <strong style={{ color: C.text }}>{totalFiltered} pairs</strong>
          </p>
        </div>
      </Card>

      <AddStockModal  open={addOpen}  onClose={() => { setAdd(false);  setPre(null); }} products={products} dispatch={dispatch} pre={pre} />
      <DispatchModal  open={dispOpen} onClose={() => { setDisp(false); setPre(null); }} products={products} dispatch={dispatch} pre={pre} />
    </div>
  );
}