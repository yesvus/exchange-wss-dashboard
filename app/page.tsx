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

export default function Dashboard() {
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const { price } = useBinanceStream(selectedPair);
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
          Market Radar
        </h1>

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
    </main>
  );
}
