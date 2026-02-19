"use client";

import { useState, useEffect } from "react";
import { useBinanceStream } from "@/hooks/useBinance";
import { PriceChart } from "@/components/PriceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Github } from "lucide-react";

export default function Dashboard() {
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const { price, messages } = useBinanceStream(selectedPair);
  const [chartData, setChartData] = useState<{ time: number; value: number }[]>(
    [],
  );

  useEffect(() => {
    if (price) {
      const currentTime = Math.floor(Date.now() / 1000);
      setChartData((prev) =>
        [...prev, { time: currentTime, value: parseFloat(price) }].slice(-100),
      ); // Son 100 veriyi tut
    }
  }, [price]);

  return (
    <main className="p-10 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          WSS Visualizer (Binance)
        </h1>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/yesvus/exchange-wss-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub repository"
          >
            <Github className="w-5 h-5" />
          </a>

          <Select onValueChange={setSelectedPair} defaultValue={selectedPair}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Pair" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTCUSDT">BTC / USDT</SelectItem>
              <SelectItem value="ETHUSDT">ETH / USDT</SelectItem>
              <SelectItem value="SOLUSDT">SOL / USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-medium">
            LIVE PRICE: {selectedPair}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-6xl font-mono font-extrabold text-foreground tracking-tighter">
            {price ? `$${parseFloat(price).toLocaleString()}` : "---"}
          </div>

          <div className="rounded-md border border-border p-4 bg-background/50">
            <PriceChart data={chartData} symbol={selectedPair} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            WebSocket Stream
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-80 overflow-y-auto font-mono text-xs">
            {messages.length === 0 ? (
              <div className="p-4 text-muted-foreground">
                Waiting for messages…
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={msg.id}
                  className="flex gap-4 px-4 py-2 border-b border-border transition-opacity"
                  style={{ opacity: 1 - i * 0.018 }}
                >
                  <span className="shrink-0 text-muted-foreground w-6 text-right">
                    {msg.id}
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {msg.timestamp.slice(11, 23)}
                  </span>
                  <span className="text-foreground break-all">
                    {JSON.stringify(msg.raw)}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
