/**
 * useWarehouse.js  —  Global state + async reducer (React Hook)
 *
 * Replaces the pure in-memory reducer with API-backed actions.
 * Drop in src/hooks/useWarehouse.js
 *
 * Usage:
 *   const { state, dispatch, loading, error } = useWarehouse();
 */

import { useReducer, useEffect, useCallback, useState } from "react";
import api from "./api";

// ── Initial State ──────────────────────────────────────────────────────────
const INITIAL = {
  products:  [],
  movements: [],
  stats:     null,
  user:      null,
};

// ── Pure Reducer (optimistic / local updates) ──────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case "SET_PRODUCTS":
      return { ...state, products: action.payload };

    case "SET_MOVEMENTS":
      return { ...state, movements: action.payload };

    case "SET_STATS":
      return { ...state, stats: action.payload };

    case "SET_USER":
      return { ...state, user: action.payload };

    // Optimistic: prepend movement + update local product stock
    case "ADD_STOCK": {
      const { movement, product } = action.payload;
      return {
        ...state,
        movements: [movement, ...state.movements],
        products: state.products.map(p =>
          p.id === product.id ? product : p
        ),
      };
    }

    case "DISPATCH": {
      const { movement, product } = action.payload;
      return {
        ...state,
        movements: [movement, ...state.movements],
        products: state.products.map(p =>
          p.id === product.id ? product : p
        ),
      };
    }

    case "RESET":
      return INITIAL;

    default:
      return state;
  }
}

// ── Hook ───────────────────────────────────────────────────────────────────
export default function useWarehouse() {
  const [state,   dispatch] = useReducer(reducer, INITIAL);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── Bootstrap: load products + movements on mount ───────────────────────
  useEffect(() => {
    async function bootstrap() {
      setLoading(true);
      try {
        const [products, movements, stats] = await Promise.all([
          api.getProducts(),
          api.getMovements(),
          api.getStats(),
        ]);
        dispatch({ type: "SET_PRODUCTS",  payload: products  });
        dispatch({ type: "SET_MOVEMENTS", payload: movements });
        dispatch({ type: "SET_STATS",     payload: stats     });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  // ── Async dispatch wrapper ───────────────────────────────────────────────
  const asyncDispatch = useCallback(async (action) => {
    setError(null);
    try {
      switch (action.type) {

        case "ADD_STOCK": {
          const res = await api.addStock({
            pid:  action.pid,
            qty:  action.qty,
            ref:  action.ref  || "",
            note: action.note || "",
          });
          // Build a movement object matching the frontend shape
          const movement = {
            id:        res.movementId,
            type:      "in",
            pid:       action.pid,
            product:   res.product.name,
            qty:       action.qty,
            reference: action.ref  || "",
            note:      action.note || "",
            date:      new Date().toISOString(),
          };
          dispatch({ type: "ADD_STOCK", payload: { movement, product: res.product } });
          break;
        }

        case "DISPATCH": {
          const res = await api.dispatch({
            pid:   action.pid,
            qty:   action.qty,
            order: action.order || "",
            note:  action.note  || "",
          });
          const movement = {
            id:        res.movementId,
            type:      "out",
            pid:       action.pid,
            product:   res.product.name,
            qty:       action.qty,
            reference: action.order || "",
            note:      action.note  || "",
            date:      new Date().toISOString(),
          };
          dispatch({ type: "DISPATCH", payload: { movement, product: res.product } });
          break;
        }

        default:
          dispatch(action);
      }
    } catch (err) {
      setError(err.message);
      throw err;   // re-throw so the modal can show an inline error
    }
  }, []);

  return { state, dispatch: asyncDispatch, loading, error };
}
