"use client";

import React, { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  AreaSeries,
  ColorType,
} from "lightweight-charts";

interface PriceChartProps {
  data: { time: number; value: number }[];
  symbol: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { type: ColorType.Solid, color: "#000000" },
        textColor: "#888888",
      },
      grid: {
        vertLines: { color: "#1a1a1a" },
        horzLines: { color: "#1a1a1a" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: "#333333",
      },
      rightPriceScale: {
        borderColor: "#333333",
      },
    });

    const newSeries = chart.addSeries(AreaSeries, {
      lineColor: "#ffffff",
      topColor: "rgba(255, 255, 255, 0.2)",
      bottomColor: "rgba(255, 255, 255, 0.0)",
      lineWidth: 2,
    });

    newSeries.setData(data as LineData[]);

    chartRef.current = chart;
    seriesRef.current = newSeries;

    const handleResize = () => {
      chartRef.current?.applyOptions({
        width: chartContainerRef.current?.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol]);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      const lastDataPoint = data[data.length - 1];
      seriesRef.current.update(lastDataPoint as LineData);
    }
  }, [data]);

  return <div ref={chartContainerRef} className="w-full" />;
};
