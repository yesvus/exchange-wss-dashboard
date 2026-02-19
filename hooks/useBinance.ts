"use client";
import { useEffect, useState } from "react";

export const useBinanceStream = (symbol: string) => {
  const [price, setPrice] = useState<string | null>(null);

  useEffect(() => {
    // Binance WebSocket address
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`,
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // 'c' is the last price in the ticker data.
      setPrice(data.c);
    };

    ws.onerror = (error) => console.error("WS Error:", error);

    // Close the connection when the component unmounts or the symbol changes (Unsubscribe)
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [symbol]);

  return { price };
};
