'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "./stat-card";
import { ArrowUpRight, BarChart, BookOpen } from 'lucide-react';

// Dummy data for the backtest
const backtestData = {
  '1M': {
    chartData: Array.from({ length: 30 }, (_, i) => ({
      date: `Day ${i + 1}`,
      ai_strategy: 10000 + i * 50 + Math.random() * 500,
      buy_hold: 10000 + i * 40 + Math.random() * 400,
    })),
    stats: {
      totalProfit: 1250, profitPercent: 12.5, vsMarket: 420, vsMarketPercent: 4.2, tradesExecuted: 24
    },
    tradeLog: [
        { date: '2025-11-15', signal: 'BUY', price: 1245.00, quantity: 10, profitLoss: null },
        { date: '2025-11-20', signal: 'SELL', price: 1310.00, quantity: 10, profitLoss: 650.00 },
        { date: '2025-11-21', signal: 'BUY', price: 1310.00, quantity: 10, profitLoss: 130.00 },
        { date: '2025-11-22', signal: 'BUY', price: 1245.00, quantity: 10, profitLoss: null },
        { date: '2025-11-23', signal: 'SELL', price: 1310.00, quantity: 10, profitLoss: -650.00 },
        { date: '2025-11-24', signal: 'BUY', price: 1245.00, quantity: 10, profitLoss: -300.00 },
        { date: '2025-11-25', signal: 'SELL', price: 1310.00, quantity: 10, profitLoss: 180.00 },
        { date: '2025-11-26', signal: 'BUY', price: 1245.00, quantity: 10, profitLoss: -200.00 },
        { date: '2025-11-27', signal: 'SELL', price: 1206.00, quantity: 10, profitLoss: -400.00 },
        { date: '2025-11-28', signal: 'SELL', price: 1310.00, quantity: 10, profitLoss: 650.00 },
    ],
    summary: { totalTrades: 24, winRate: 62.5, avgProfitLoss: 185.00 }
  },
  '3M': {
    chartData: Array.from({ length: 90 }, (_, i) => ({
      date: `Day ${i + 1}`,
      ai_strategy: 10000 + i * 25 + Math.random() * 1000,
      buy_hold: 10000 + i * 20 + Math.random() * 800,
    })),
    stats: { totalProfit: 2550, profitPercent: 25.5, vsMarket: 520, vsMarketPercent: 5.2, tradesExecuted: 56 },
    tradeLog: [],
    summary: { totalTrades: 56, winRate: 71.2, avgProfitLoss: 210.50 }
  },
  '6M': {
    chartData: Array.from({ length: 180 }, (_, i) => ({
      date: `Day ${i + 1}`,
      ai_strategy: 10000 + i * 15 + Math.random() * 1500,
      buy_hold: 10000 + i * 12 + Math.random() * 1200,
    })),
    stats: { totalProfit: 4500, profitPercent: 45.0, vsMarket: 1200, vsMarketPercent: 12.0, tradesExecuted: 110 },
    tradeLog: [],
    summary: { totalTrades: 110, winRate: 68.0, avgProfitLoss: 195.00 }
  },
  '1Y': {
    chartData: Array.from({ length: 365 }, (_, i) => ({
      date: `Day ${i + 1}`,
      ai_strategy: 10000 + i * 10 + Math.random() * 2000,
      buy_hold: 10000 + i * 8 + Math.random() * 1800,
    })),
    stats: { totalProfit: 8000, profitPercent: 80.0, vsMarket: 2500, vsMarketPercent: 25.0, tradesExecuted: 200 },
    tradeLog: [],
    summary: { totalTrades: 200, winRate: 75.0, avgProfitLoss: 250.00 }
  }
};

type TimeRange = '1M' | '3M' | '6M' | '1Y';

export function BacktestSimulator() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

  const { chartData, stats, tradeLog, summary } = backtestData[timeRange];

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                  <CardTitle className="text-xl">Strategy vs. Buy & Hold Performance</CardTitle>
                  <CardDescription className="pt-2">Comparing AI strategy against a simple buy-and-hold approach.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                  {(['1M', '3M', '6M', '1Y'] as TimeRange[]).map((range) => (
                      <Button 
                          key={range} 
                          variant={timeRange === range ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setTimeRange(range)}
                      >
                          {range}
                      </Button>
                  ))}
              </div>
          </div>
        </CardHeader>
        <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="ai_strategy" name="AI Strategy" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} dot={false} />
                    <Line type="monotone" dataKey="buy_hold" name="Buy & Hold" stroke="hsl(var(--muted-foreground))" strokeWidth={2} activeDot={{ r: 8 }} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
            title="Total Profit" 
            value={`${stats.profitPercent > 0 ? '+' : ''}${stats.profitPercent.toFixed(1)}%`} 
            icon={BarChart}
            change={`₹${stats.totalProfit.toLocaleString()}`} 
            changeColor={stats.totalProfit > 0 ? 'text-green-400' : 'text-red-400'} 
            description="Total profit from the AI strategy over the period."
        />
        <StatCard 
            title="vs Market" 
            value={`${stats.vsMarketPercent > 0 ? '+' : ''}${stats.vsMarketPercent.toFixed(1)}%`} 
            icon={ArrowUpRight}
            change={`₹${stats.vsMarket.toLocaleString()}`}
            changeColor={stats.vsMarket > 0 ? 'text-green-400' : 'text-red-400'} 
            description="Performance of the AI strategy compared to the market."
        />
        <StatCard 
            title="Trades Executed" 
            value={stats.tradesExecuted.toString()} 
            icon={BookOpen}
            description="Total number of buy/sell transactions made by the AI."
        />
      </div>

      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Trade Log</CardTitle>
                <div className="text-sm text-muted-foreground space-x-4">
                    <span>Total Trades: <span className="font-semibold text-foreground">{summary.totalTrades}</span></span>
                    <span>Win Rate: <span className="font-semibold text-foreground">{summary.winRate.toFixed(1)}%</span></span>
                    <span>Avg. Profit/Loss: <span className={`font-semibold ${summary.avgProfitLoss > 0 ? 'text-green-400' : 'text-red-400'}`}>₹{summary.avgProfitLoss.toFixed(2)}</span></span>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Signal</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Profit/Loss</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tradeLog.map((trade, index) => (
                        <TableRow key={index}>
                            <TableCell>{trade.date}</TableCell>
                            <TableCell>
                                <span className={`font-semibold ${trade.signal === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                                    {trade.signal}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">₹{trade.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{trade.quantity}</TableCell>
                            <TableCell className={`text-right font-semibold ${!trade.profitLoss ? '' : trade.profitLoss > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {trade.profitLoss === null ? '-' : `${trade.profitLoss > 0 ? '+' : ''}₹${trade.profitLoss.toFixed(2)}`}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
