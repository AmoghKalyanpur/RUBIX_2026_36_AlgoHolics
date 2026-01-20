'use client';

import { StatCard } from "@/components/dashboard/analysis/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, IndianRupeeIcon, Search, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Building, Percent, Loader2, Gauge, Bell, Sparkles, Info } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dummyData } from "@/lib/dummy-data";

const getInitialOverviewData = () => ([
    { title: "Current Price", value: "-", icon: IndianRupeeIcon, description: "The most recent trading price of the stock." },
    { title: "Price Change (%)", value: "-", icon: Percent, description: "The daily fluctuation in the stock's price." },
    { title: "Market Capitalization", value: "-", icon: Building, description: "Total market value of the company's outstanding shares." },
    { title: "P/E Ratio", value: "-", icon: TrendingUp, description: "Ratio of the company's stock price to its earnings per share." },
    { title: "52-Week High", value: "-", icon: ArrowUp, description: "The highest price at which the stock has traded in the past year." },
    { title: "52-Week Low", value: "-", icon: ArrowDown, description: "The lowest price at which the stock has traded in the past year." },
]);

const initialDescription = "Select a stock ticker from the search bar to view its latest financial metrics and a brief company overview.";

export default function AnalysisPage() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [overviewData, setOverviewData] = useState(getInitialOverviewData());
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [companyDescription, setCompanyDescription] = useState(initialDescription);
  const [analysisData, setAnalysisData] = useState<any>(null);

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
    setAnalysisData(null);

    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const stockData = dummyData[ticker.toUpperCase()];

        if (stockData) {
            const { globalQuote, marketCap, peRatio, week52High, week52Low, description, timeSeries } = stockData;
            const currentPrice = parseFloat(globalQuote["05. price"]);
            const prevClose = parseFloat(globalQuote["08. previous close"]);
            const priceChange = currentPrice - prevClose;
            const priceChangePercent = ((priceChange / prevClose) * 100).toFixed(2);

            const newOverviewData = [
                { title: "Current Price", value: `₹${currentPrice.toFixed(2)}`, icon: IndianRupeeIcon, change: `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}`, changeColor: priceChange >= 0 ? 'text-green-400' : 'text-red-400', description: "The most recent trading price of the stock." },
                { title: "Price Change (%)", value: `${priceChangePercent}%`, icon: priceChange >= 0 ? TrendingUp : TrendingDown, changeColor: priceChange >= 0 ? 'text-green-400' : 'text-red-400', description: "The daily fluctuation in the stock's price." },
                { title: "Market Capitalization", value: `₹${marketCap}`, icon: Building, description: "Total market value of the company's outstanding shares." },
                { title: "P/E Ratio", value: peRatio, icon: TrendingUp, description: "Ratio of the company's stock price to its earnings per share." },
                { title: "52-Week High", value: `₹${week52High}`, icon: ArrowUp, description: "The highest price at which the stock has traded in the past year." },
                { title: "52-Week Low", value: `₹${week52Low}`, icon: ArrowDown, description: "The lowest price at which the stock has traded in the past year." },
            ];
            setOverviewData(newOverviewData);
            setCompanyDescription(description);

            const formattedData = Object.keys(timeSeries).map(date => ({
                date,
                close: parseFloat(timeSeries[date]['4. close']),
            })).reverse();
            setHistoricalData(formattedData);
        } else {
            console.warn(`No dummy data found for ${ticker}.`);
        }

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
        }

    } catch (err) {
        setError("An unexpected error occurred.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-background">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Stock Analysis Dashboard</h1>
            <div className="flex w-full max-w-md items-center space-x-2">
                <Input
                    type="text"
                    placeholder="e.g., INFY.NS, RELIANCE.NS..."
                    className="flex-1 bg-card border-border focus:ring-2 focus:ring-primary/50 transition-all"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && fetchStockData()}
                    disabled={loading}
                />
                <Button type="submit" onClick={fetchStockData} disabled={loading} className="transition-all duration-300 ease-in-out hover:bg-primary/90">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                    <span className="ml-2 hidden sm:inline">Analyse</span>
                </Button>
            </div>
        </div>

        {error && (
            <Card className="border-destructive bg-destructive/10 animate-in fade-in-50">
                <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
                <CardContent><p>{error}</p></CardContent>
            </Card>
        )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card rounded-lg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trend">AI Trend Analysis</TabsTrigger>
          <TabsTrigger value="backtest">Backtest Simulator</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Company Overview</CardTitle>
              <CardDescription className="pt-2 text-foreground/80">{companyDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {overviewData.map((item) => (
                  <StatCard key={item.title} {...item} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                  <CardTitle className="text-xl">Historical Price Trend</CardTitle>
                  <CardDescription className="pt-2">Closing price trend over the last 100 days.</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                  {historicalData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                              <YAxis domain={['dataMin - 20', 'dataMax + 20']} stroke="hsl(var(--muted-foreground))" />
                              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                              <Legend />
                              <Line type="monotone" dataKey="close" name="Close Price" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                          </LineChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                          <p>Search for a stock to see its historical price trend.</p>
                      </div>
                  )}
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend" className="mt-6">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl">AI-Powered Trend Analysis</CardTitle>
                    <CardDescription className="pt-2">Real-time technical analysis powered by a machine learning backend.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 py-6">
                    <div className="grid gap-6 sm:grid-cols-3">
                        <StatCard 
                            title="Trend Prediction" 
                            value={analysisData ? analysisData.ui_summary.trend : "--"} 
                            icon={analysisData?.ui_summary.trend === 'UP' ? TrendingUp : TrendingDown} 
                            description="The predicted direction of the stock price movement."
                        />
                        <StatCard 
                            title="Confidence" 
                            value={analysisData ? `${(analysisData.ui_summary.confidence * 100).toFixed(1)}%` : "--"} 
                            icon={Gauge}
                            description="The model's confidence level in its trend prediction."
                        />
                        <StatCard 
                            title="Signal" 
                            value={analysisData ? analysisData.ui_summary.signal : "--"} 
                            icon={Bell} 
                            changeColor={analysisData?.ui_summary.signal === "BUY" ? "text-green-400" : analysisData?.ui_summary.signal === "SELL" ? "text-red-400" : ""}
                            description="A trading signal (Buy, Sell, or Hold) based on the analysis."
                        />
                    </div>
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <Sparkles className="h-5 w-5 text-primary" />
                                AI Insight
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {analysisData ? analysisData.ai_insight : "Enter a stock ticker above to generate AI insights."}
                            </p>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="backtest" className="mt-6">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Backtest Simulator</CardTitle>
                    <CardDescription className="pt-2">Simulate trading strategies based on historical data.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                    <p>Backtesting feature coming soon.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}