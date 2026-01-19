import { FinBotChat } from "@/components/dashboard/finbot-chat";

export default function FinBotPage() {
  return (
    <div className="h-[calc(100vh-theme(spacing.14)-2*theme(spacing.6))]">
        <FinBotChat />
    </div>
  );
}
