import { useAutoClear } from "@/hooks/useAutoClear";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Timer } from "lucide-react";

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function AutoClearWarning() {
  const remaining = useAutoClear();

  if (remaining === null) {
    return null;
  }

  const isUrgent = remaining < 120;

  return (
    <Alert
      className={
        isUrgent
          ? "border-error/50 bg-error/5"
          : "border-warning/50 bg-warning/5"
      }
    >
      <Timer
        className={`size-4 ${isUrgent ? "text-error" : "text-warning"}`}
      />
      <AlertTitle
        className={isUrgent ? "text-error" : "text-warning"}
      >
        Security auto-clear
      </AlertTitle>
      <AlertDescription>
        Your certificate data will be automatically cleared in{" "}
        <span className="font-mono font-semibold">
          {formatTime(remaining)}
        </span>{" "}
        for security. Download your files before the timer expires.
      </AlertDescription>
    </Alert>
  );
}
