/**
 * api.js  —  StockPro frontend API service
 *
 * Drop this in src/api.js and import wherever you need it.
 * All calls go to Flask on http://localhost:5000/api
 *
 * Usage:
 *   import api from "./api";
 *   const products = await api.getProducts();
 */

const BASE = "https://ba1-3.onrender.com/api";


async function request(method, path, body = null) {
  const opts = {
    method,
    credentials: "include",          // send session cookie
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const api = {
  // ── Auth ────────────────────────────────────────────────
  login:  (username, password) => request("POST", "/login",  { username, password }),
  logout: ()                   => request("POST", "/logout"),
  me:     ()                   => request("GET",  "/me"),

  // ── Products ────────────────────────────────────────────
  getProducts:   ()      => request("GET",    "/products"),
  getProduct:    (id)    => request("GET",    `/products/${id}`),
  createProduct: (data)  => request("POST",   "/products", data),
  updateProduct: (id, d) => request("PUT",    `/products/${id}`, d),
  deleteProduct: (id)    => request("DELETE", `/products/${id}`),

  // ── Movements ───────────────────────────────────────────
  /**
   * @param {"in"|"out"|undefined} type  optional filter
   */
  getMovements:  (type)  => request("GET", `/movements${type ? `?type=${type}` : ""}`),

  /**
   * Mirrors ADD_STOCK reducer action
   * @param {{ pid, qty, ref, note }} payload
   */
  addStock:   (payload)  => request("POST", "/movements/add-stock", payload),

  /**
   * Mirrors DISPATCH reducer action
   * @param {{ pid, qty, order, note }} payload
   */
  dispatch:   (payload)  => request("POST", "/movements/dispatch",  payload),

  // ── Stats ───────────────────────────────────────────────
  getStats:     ()           => request("GET", "/stats"),
  getLowStock:  (threshold)  => request("GET", `/stats/low-stock${threshold ? `?threshold=${threshold}` : ""}`),
};

export default api;
