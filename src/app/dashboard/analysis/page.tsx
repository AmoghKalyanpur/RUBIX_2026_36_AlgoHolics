'use client';

import { StatCard } from "@/components/dashboard/analysis/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupeeIcon, Search, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Building, Percent, Loader2, Gauge, Bell, Sparkles, Activity, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dummyData } from "@/lib/dummy-data";
import { BacktestSimulator } from "@/components/dashboard/analysis/backtest-simulator";

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
        // --- 1. FETCH OVERVIEW DATA (Dynamic!) ---
        try {
            const overviewRes = await fetch(`http://127.0.0.1:8000/overview/${ticker}`);
            const overviewJson = await overviewRes.json();
            
            if (!overviewJson.error) {
                const { current_price, price_change, change_percent, market_cap, pe_ratio, high_52, low_52, description } = overviewJson;
                
                // Helper to format large numbers
                const formatCap = (num: number) => {
                    if (num >= 1.0e+12) return (num / 1.0e+12).toFixed(2) + "T";
                    if (num >= 1.0e+9) return (num / 1.0e+9).toFixed(2) + "B";
                    if (num >= 1.0e+7) return (num / 1.0e+7).toFixed(2) + "Cr"; 
                    return num.toString();
                };

                const newOverviewData = [
                    { title: "Current Price", value: `₹${current_price}`, icon: IndianRupeeIcon, change: `${price_change >= 0 ? '+' : ''}${price_change}`, changeColor: price_change >= 0 ? 'text-green-400' : 'text-red-400', description: "The most recent trading price." },
                    { title: "Price Change (%)", value: `${change_percent}%`, icon: price_change >= 0 ? TrendingUp : TrendingDown, changeColor: price_change >= 0 ? 'text-green-400' : 'text-red-400', description: "Daily price fluctuation." },
                    { title: "Market Cap", value: `₹${formatCap(market_cap)}`, icon: Building, description: "Total market value." },
                    { title: "P/E Ratio", value: pe_ratio, icon: TrendingUp, description: "Price-to-Earnings Ratio." },
                    { title: "52-Week High", value: `₹${high_52}`, icon: ArrowUp, description: "Highest price in last year." },
                    { title: "52-Week Low", value: `₹${low_52}`, icon: ArrowDown, description: "Lowest price in last year." },
                ];
                setOverviewData(newOverviewData);
                const shortDesc = description.split('. ').slice(0, 2).join('. ') + '.';
                setCompanyDescription(shortDesc);
            }
        } catch (e) {
            console.error("Overview Fetch Failed", e);
        }

        // --- 2. FETCH HISTORICAL CHART (Real!) ---
        try {
            const historyRes = await fetch(`http://127.0.0.1:8000/history/${ticker}`);
            const historyJson = await historyRes.json();
            
            if (Array.isArray(historyJson)) {
                setHistoricalData(historyJson);
            } else {
                console.warn("History data format invalid", historyJson);
            }
        } catch (e) {
            console.error("Failed to fetch history:", e);
        }

        // --- 3. FETCH TECHNICAL ANALYSIS ---
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
        <div className="text-center py-8 md:py-12 px-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/20 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Stock Analysis Dashboard
            </h1>
            <p className="mt-3 md:mt-4 max-w-2xl mx-auto text-base text-muted-foreground">
                Leverage AI-powered technical analysis and backtesting to make smarter investment decisions. Enter a stock ticker below to begin.
            </p>
            <div className="mt-6 flex justify-center">
                <div className="flex w-full max-w-md items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="e.g., INFY.NS, RELIANCE.NS..."
                        className="flex-1 bg-background/50 border-border focus:ring-2 focus:ring-primary/50 transition-all"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !loading && fetchStockData()}
                        disabled={loading}
                    />
                    <Button type="submit" onClick={fetchStockData} disabled={loading} className="transition-all duration-300 ease-in-out hover:bg-primary/90">
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                        <span className="ml-2">Analyse</span>
                    </Button>
                </div>
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
              
              {/* --- UPDATED GRAPH SECTION START --- */}
              <CardContent className="h-[400px]">
                  {historicalData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={historicalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.5)" />
                              <XAxis 
                                  dataKey="date" 
                                  stroke="hsl(var(--muted-foreground))" 
                                  tickFormatter={(value) => {
                                      const date = new Date(value);
                                      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                                  }}
                                  minTickGap={30}
                                  tick={{ fontSize: 12 }}
                              />
                              <YAxis 
                                  domain={['auto', 'auto']} 
                                  stroke="hsl(var(--muted-foreground))" 
                                  tickFormatter={(value) => `₹${value.toFixed(0)}`}
                                  tick={{ fontSize: 12 }}
                              />
                              <Tooltip 
                                  contentStyle={{ 
                                      backgroundColor: 'hsl(var(--background))', 
                                      border: '1px solid hsl(var(--border))',
                                      borderRadius: '8px',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                  }}
                                  itemStyle={{ color: 'hsl(var(--primary))' }}
                                  labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}
                                  formatter={(value: number) => [`₹${value.toFixed(2)}`, "Close Price"]}
                                  labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                              />
                              <Line 
                                  type="monotone" 
                                  dataKey="close" 
                                  name="Close Price" 
                                  stroke="hsl(var(--primary))" 
                                  strokeWidth={2} 
                                  dot={false} 
                                  activeDot={{ r: 6, strokeWidth: 0 }} 
                              />
                          </LineChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                          <p>Search for a stock to see its historical price trend.</p>
                      </div>
                  )}
              </CardContent>
              {/* --- UPDATED GRAPH SECTION END --- */}

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
                            value={analysisData ? analysisData.trend : "--"} 
                            icon={analysisData?.trend === 'UP' ? TrendingUp : TrendingDown} 
                            description="The predicted direction of the stock price movement."
                        />
                        <StatCard 
                            title="Confidence" 
                            value={analysisData ? `${(analysisData.confidence * 100).toFixed(1)}%` : "--"} 
                            icon={Gauge}
                            description="The model's confidence level in its trend prediction."
                        />
                        <StatCard 
                            title="Signal" 
                            value={analysisData ? analysisData.signal : "--"} 
                            icon={Bell} 
                            changeColor={analysisData?.signal === "BUY" ? "text-green-400" : analysisData?.signal === "SELL" ? "text-red-400" : ""}
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
                            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                                {analysisData ? analysisData.ai_insight : "Enter a stock ticker above to generate AI insights."}
                            </p>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="backtest" className="mt-6">
            <BacktestSimulator ticker={ticker || "INFY.NS"} />
        </TabsContent>
      </Tabs>
    </div>
  );
}