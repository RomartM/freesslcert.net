import { useEffect, useState } from "react";
import { useWizardStore } from "@/stores/wizard-store";

export function useAutoClear() {
  const autoClearTimestamp = useWizardStore((s) => s.autoClearTimestamp);
  const reset = useWizardStore((s) => s.reset);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!autoClearTimestamp) {
      setRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      const diff = autoClearTimestamp - Date.now();
      if (diff <= 0) {
        reset();
        setRemaining(null);
        clearInterval(interval);
      } else {
        setRemaining(Math.ceil(diff / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoClearTimestamp, reset]);

  return remaining;
}
