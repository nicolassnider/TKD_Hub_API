import React from "react";
import { fetchJson } from "../lib/api";

export default function MercadoPagoDebug() {
  const createPreference = async () => {
    try {
      const res = await fetchJson("/api/MercadoPago/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1 }),
      });
      alert(JSON.stringify(res));
    } catch (e) {
      alert(String(e));
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">MercadoPago</h2>
      <button
        onClick={createPreference}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create preference (debug)
      </button>
    </div>
  );
}
