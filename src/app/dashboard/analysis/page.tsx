'use client';

import { StatCard } from "@/components/dashboard/analysis/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, IndianRupeeIcon, Search, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Building, Percent, Loader2, Gauge, Bell, Sparkles } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dummyData } from "@/lib/dummy-data";

const getInitialOverviewData = () => ([
    { title: "Current Price", value: "-", icon: IndianRupeeIcon, change: "", changeColor: "" },
    { title: "Price Change (%)", value: "-", icon: Percent, change: "", changeColor: "" },
    { title: "Market Capitalization", value: "-", icon: Building },
    { title: "P/E Ratio", value: "-", icon: TrendingUp },
    { title: "52-Week High", value: "-", icon: ArrowUp },
    { title: "52-Week Low", value: "-", icon: ArrowDown },
]);

const initialDescription = "Select a stock ticker from the search bar to view its latest financial metrics and a brief company overview.";

export default function AnalysisPage() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data States
  const [overviewData, setOverviewData] = useState(getInitialOverviewData());
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [companyDescription, setCompanyDescription] = useState(initialDescription);
  const [analysisData, setAnalysisData] = useState<any>(null); // New state for Python Backend Data

  const fetchStockData = async () => {
    if (!ticker) {
        setError("Please enter a stock ticker.");
        return;
    }

    setLoading(true);
    setError(null);
    setHistoricalData([]);
    setOverviewData(getInitialOverviewData());
    setCompanyDescription(initialDescription);
    setAnalysisData(null); // Reset analysis data

    try {
        // 1. Fetch Dummy Data (Overview Tab)
        // In a real app, this would also be an API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const stockData = dummyData[ticker.toUpperCase()];

        if (stockData) {
            const { globalQuote, marketCap, peRatio, week52High, week52Low, description, timeSeries } = stockData;
            const currentPrice = parseFloat(globalQuote["05. price"]);
            const prevClose = parseFloat(globalQuote["08. previous close"]);
            const priceChange = currentPrice - prevClose;
            const priceChangePercent = ((priceChange / prevClose) * 100).toFixed(2);

            const newOverviewData = [
                { title: "Current Price", value: `₹${currentPrice.toFixed(2)}`, icon: IndianRupeeIcon, change: `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}`, changeColor: priceChange >= 0 ? 'text-green-500' : 'text-red-500' },
                { title: "Price Change (%)", value: `${priceChangePercent}%`, icon: priceChange >= 0 ? TrendingUp : TrendingDown, change: "", changeColor: priceChange >= 0 ? 'text-green-500' : 'text-red-500' },
                { title: "Market Capitalization", value: `₹${marketCap}`, icon: Building },
                { title: "P/E Ratio", value: peRatio, icon: TrendingUp },
                { title: "52-Week High", value: `₹${week52High}`, icon: ArrowUp },
                { title: "52-Week Low", value: `₹${week52Low}`, icon: ArrowDown },
            ];
            setOverviewData(newOverviewData);
            setCompanyDescription(description);

            const formattedData = Object.keys(timeSeries).map(date => ({
                date,
                close: parseFloat(timeSeries[date]['4. close']),
            })).reverse();
            setHistoricalData(formattedData);
        } else {
            // Only show error if BOTH dummy data and API fail, but for now we warn about dummy data
            console.warn(`No dummy data found for ${ticker}. Overview will be empty.`);
        }

        // 2. Fetch Real Analysis Data (Trend Tab - Python Backend)
        try {
            const response = await fetch(`http://127.0.0.1:8000/technical/${ticker}`);
            if (response.ok) {
                const result = await response.json();
                setAnalysisData(result);
            } else {
                console.error("Failed to fetch analysis data");
            }
        } catch (apiError) {
            console.error("API Connection Error:", apiError);
            // We don't block the whole UI if just the trend analysis fails
        }

    } catch (err) {
        setError("An unexpected error occurred.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Stock Analysis</h2>
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                    type="text"
                    placeholder="e.g., INFY.NS, RELIANCE.NS..."
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && fetchStockData()}
                    disabled={loading}
                />
                <Button type="submit" onClick={fetchStockData} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    <span className="ml-2">Analyse</span>
                </Button>
            </div>
        </div>

        {error && (
            <Card className="border-destructive bg-destructive/10">
                <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
                <CardContent><p>{error}</p></CardContent>
            </Card>
        )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trend">Trend Analysis</TabsTrigger>
          <TabsTrigger value="backtest">Backtest Simulator</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
              <CardDescription>{companyDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {overviewData.map((item) => (
                  <StatCard key={item.title} {...item} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
              <CardHeader>
                  <CardTitle>Historical Price Trend</CardTitle>
                  <CardDescription>Closing price trend over the last 100 days.</CardDescription>
              </CardHeader>
              <CardContent>
                  {historicalData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={400}>
                          <LineChart data={historicalData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="close" name="Close Price" stroke="#8884d8" activeDot={{ r: 8 }} />
                          </LineChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="flex items-center justify-center h-96">
                          <p>Search for a stock to see its historical price trend.</p>
                      </div>
                  )}
              </CardContent>
          </Card>
        </TabsContent>

        {/* UPDATED TREND ANALYSIS TAB */}
        <TabsContent value="trend" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Trend Analysis</CardTitle>
                    <CardDescription>Real-time technical analysis powered by a machine learning backend.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 py-6">
                    <div className="grid gap-6 sm:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Trend Prediction</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {analysisData ? analysisData.trend : "--"}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Confidence</CardTitle>
                                <Gauge className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {analysisData ? `${(analysisData.confidence * 100).toFixed(1)}%` : "--"}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Signal</CardTitle>
                                <Bell className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${
                                    analysisData?.signal === "BUY" ? "text-green-600" : 
                                    analysisData?.signal === "SELL" ? "text-red-600" : ""
                                }`}>
                                    {analysisData ? analysisData.signal : "--"}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <Sparkles className="h-5 w-5 text-primary" />
                                AI Insight
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {analysisData ? analysisData.ai_insight : "Enter a stock ticker above to generate AI insights."}
                            </p>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="backtest" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Backtest Simulator</CardTitle>
                    <CardDescription>Simulate trading strategies based on historical data.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-96">
                    <p>Backtesting feature coming soon.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}