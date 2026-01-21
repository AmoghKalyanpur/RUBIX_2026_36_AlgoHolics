'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, Wallet, ShoppingCart, Landmark } from 'lucide-react';

// --- Mock Stock Data ---
const initialStockPrice = 150.00;
const stockSymbol = "SIM-TSLA"; // Simulated Tesla

// --- Simulation Configuration ---
const priceFluctuation = 2.5; // Max price change per tick
const simulationInterval = 2000; // in milliseconds

export default function RealTimeSimulatorPage() {
  const [wallet, setWallet] = useState(50000);
  const [shares, setShares] = useState(0);
  const [stockPrice, setStockPrice] = useState(initialStockPrice);
  const [quantity, setQuantity] = useState(1);
  const [priceHistory, setPriceHistory] = useState([{ time: new Date(), price: initialStockPrice }]);

  // --- Core Simulation Engine ---
  useEffect(() => {
    const interval = setInterval(() => {
      setStockPrice(prevPrice => {
        const change = (Math.random() - 0.5) * priceFluctuation;
        const newPrice = Math.max(prevPrice + change, 10); // Ensure price doesn't go below 10
        setPriceHistory(prevHistory => [...prevHistory, { time: new Date(), price: newPrice }].slice(-50)); // Keep last 50 data points
        return newPrice;
      });
    }, simulationInterval);

    return () => clearInterval(interval);
  }, []);

  // --- Trading Logic ---
  const handleBuy = () => {
    const cost = stockPrice * quantity;
    if (wallet >= cost) {
      setWallet(wallet - cost);
      setShares(shares + quantity);
    } else {
      alert("Not enough funds!");
    }
  };

  const handleSell = () => {
    if (shares >= quantity) {
      const revenue = stockPrice * quantity;
      setWallet(wallet + revenue);
      setShares(shares - quantity);
    } else {
      alert("Not enough shares to sell!");
    }
  };

  const portfolioValue = shares * stockPrice;

  return (
    <div className="flex-grow p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Real-Time Stock Simulator</h1>
        <p className="text-muted-foreground">Buy and sell {stockSymbol} with a virtual wallet.</p>
      </header>

      {/* --- Dashboard Cards -- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Virtual Wallet</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{wallet.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shares Owned</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shares}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{portfolioValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-card-foreground/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stockSymbol} Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{stockPrice.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* --- Chart & Trading Controls -- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Market Movement</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory}>
                <XAxis dataKey="time" tickFormatter={(time) => time.toLocaleTimeString()} />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip labelFormatter={(time) => time.toLocaleString()} formatter={(price) => [`₹${price.toFixed(2)}`, 'Price']} />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trade {stockSymbol}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
              <Input 
                id="quantity"
                type="number" 
                min="1" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleBuy} className="bg-green-600 hover:bg-green-700">Buy</Button>
              <Button onClick={handleSell} variant="destructive">Sell</Button>
            </div>
            <div className="text-center text-sm text-muted-foreground pt-2">
              Total Cost: ₹{(stockPrice * quantity).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
