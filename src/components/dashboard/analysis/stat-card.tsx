import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  change?: string;
  changeColor?: string;
};

export function StatCard({ title, value, icon: Icon, description, change, changeColor }: StatCardProps) {
  return (
    <Card className="transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:bg-card/90 cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-baseline gap-2">
            {value}
            {change && <span className={`text-sm font-semibold ${changeColor}`}>{change}</span>}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
