"use client";
import { useEffect, useState } from "react";

export interface WsMessage {
  id: number;
  timestamp: string;
  raw: Record<string, unknown>;
}

let msgCounter = 0;

export const useBinanceStream = (symbol: string) => {
  const [price, setPrice] = useState<string | null>(null);
  const [messages, setMessages] = useState<WsMessage[]>([]);

  useEffect(() => {
    msgCounter = 0;
    setMessages([]);

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`,
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(data.c);
      setMessages((prev) =>
        [
          {
            id: ++msgCounter,
            timestamp: new Date().toISOString(),
            raw: data,
          },
          ...prev,
        ].slice(0, 50),
      );
    };

    ws.onerror = (error) => console.error("WS Error:", error);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [symbol]);

  return { price, messages };
};
