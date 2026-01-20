'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "./stat-card"; // Assuming this exists
import { ArrowUpRight, BarChart, BookOpen, Loader2 } from 'lucide-react';

type TimeRange = '1M' | '3M' | '6M' | '1Y';

// Helper to map UI buttons to API periods
const PERIOD_MAP: Record<string, string> = {
    '1M': '1mo', '3M': '3mo', '6M': '6mo', '1Y': '1y'
};

export function BacktestSimulator({ ticker }: { ticker: string }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('6M');
  const [loading, setLoading] = useState(false);
  
  // Default State (Empty)
  const [data, setData] = useState({
      chartData: [],
      stats: { totalProfit: 0, profitPercent: 0, vsMarket: 0, vsMarketPercent: 0, tradesExecuted: 0 },
      tradeLog: [],
      summary: { totalTrades: 0, winRate: 0, avgProfitLoss: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            // Convert '6M' -> '6mo' for the API
            const apiPeriod = PERIOD_MAP[timeRange];
            const response = await fetch(`http://127.0.0.1:8000/backtest/${ticker}?period=${apiPeriod}`);
            const result = await response.json();

            if (result.chart_data) {
                setData({
                    chartData: result.chart_data,
                    stats: result.stats,
                    tradeLog: result.tradeLog || [],
                    summary: result.summary || { totalTrades: 0, winRate: 0, avgProfitLoss: 0 }
                });
            }
        } catch (error) {
            console.error("Failed to fetch backtest data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [timeRange, ticker]);

  const { chartData, stats, tradeLog, summary } = data;

  return (
    <div className="space-y-6">
      {/* --- CHART SECTION --- */}
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
                          disabled={loading}
                      >
                          {range}
                      </Button>
                  ))}
              </div>
          </div>
        </CardHeader>
        <CardContent className="h-[400px]">
            {loading ? (
                <div className="h-full w-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                        <XAxis 
                            dataKey="date" 
                            stroke="hsl(var(--muted-foreground))" 
                            tickFormatter={(val) => val.split(" ")[0]} // Show date only
                            minTickGap={30}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} 
                            formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="ai_strategy" name="AI Strategy" stroke="#10b981" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="buy_hold" name="Buy & Hold" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </CardContent>
      </Card>

      {/* --- STATS CARDS --- */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
            title="Total Profit" 
            value={`${stats.profitPercent > 0 ? '+' : ''}${stats.profitPercent}%`} 
            icon={BarChart}
            change={`₹${stats.totalProfit.toLocaleString()}`} 
            changeColor={stats.totalProfit > 0 ? 'text-green-400' : 'text-red-400'} 
            description="Total profit from the AI strategy over the period."
        />
        <StatCard 
            title="vs Market" 
            value={`${stats.vsMarketPercent > 0 ? '+' : ''}${stats.vsMarketPercent}%`} 
            icon={ArrowUpRight}
            change={`₹${stats.vsMarket.toLocaleString()}`}
            changeColor={stats.vsMarket > 0 ? 'text-green-400' : 'text-red-400'} 
            description="Performance compared to buying and holding."
        />
        <StatCard 
            title="Trades Executed" 
            value={stats.tradesExecuted.toString()} 
            icon={BookOpen}
            description="Total number of buy/sell transactions made by the AI."
        />
      </div>

      {/* --- TRADE LOG TABLE --- */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Trade Log</CardTitle>
                <div className="text-sm text-muted-foreground space-x-4 hidden sm:block">
                    <span>Total Trades: <span className="font-semibold text-foreground">{summary.totalTrades}</span></span>
                    <span>Win Rate: <span className="font-semibold text-foreground">{summary.winRate}%</span></span>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {/* Scrollable container for table */}
            <div className="max-h-[300px] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Signal</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Profit/Loss</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tradeLog.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                    No trades executed in this period.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tradeLog.map((trade: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell className="text-xs sm:text-sm">{trade.date}</TableCell>
                                    <TableCell>
                                        <span className={`font-semibold ${trade.signal === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                                            {trade.signal}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">₹{trade.price.toLocaleString()}</TableCell>
                                    <TableCell className={`text-right font-semibold ${!trade.profitLoss ? '' : trade.profitLoss > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {trade.profitLoss === null ? '-' : `${trade.profitLoss > 0 ? '+' : ''}₹${trade.profitLoss}`}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}