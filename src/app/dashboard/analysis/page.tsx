"use client";

import { StatCard } from "@/components/dashboard/analysis/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building, DollarSign, Percent, Search, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const overviewData = [
  { title: "Current Value", value: "$150.23", icon: DollarSign, description: "+2.5% from yesterday" },
  { title: "Market Cap", value: "$2.75T", icon: Building, description: "Apple Inc. (AAPL)" },
  { title: "P/E Ratio", value: "29.8", icon: Percent, description: "Price-to-Earnings" },
  { title: "52-Week High", value: "$198.23", icon: TrendingUp, description: "Represents market sentiment" },
];

const chartData = [
  { date: "Jan", value: 130 },
  { date: "Feb", value: 145 },
  { date: "Mar", value: 140 },
  { date: "Apr", value: 160 },
  { date: "May", value: 155 },
  { date: "Jun", value: 170 },
  { date: "Jul", value: 180 },
];

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Stock Analysis</h2>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="text" placeholder="Search a stock (e.g., AAPL)" />
          <Button type="submit" >
            <Search className="h-4 w-4 mr-2" />
            Analyse
          </Button>
        </div>
      </div>

      {/* Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Key metrics for the selected stock.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewData.map((item) => (
              <StatCard key={item.title} {...item} />
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                        contentStyle={{
                            background: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                        }}
                    />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Trend Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
          <CardDescription>
            In-depth trend analysis tools will be available here soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This section is under development.</p>
        </CardContent>
      </Card>

      {/* Backtest Simulator Section */}
      <Card>
        <CardHeader>
          <CardTitle>Backtest Simulator</CardTitle>
          <CardDescription>
            Simulate and test your trading strategies against historical data. Coming soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This section is under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
