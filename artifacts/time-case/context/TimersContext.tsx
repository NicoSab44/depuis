import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface TimerEntry {
  id: string;
  label: string;
  date: string;
  color: string;
}

interface TimersContextValue {
  timers: TimerEntry[];
  addTimer: (label: string, date: string, color: string) => void;
  editTimer: (id: string, label: string, date: string, color: string) => void;
  removeTimer: (id: string) => void;
  moveTimer: (id: string, direction: "up" | "down") => void;
}

const TimersContext = createContext<TimersContextValue>({
  timers: [],
  addTimer: () => {},
  editTimer: () => {},
  removeTimer: () => {},
  moveTimer: () => {},
});

const STORAGE_KEY = "@time_case_timers_v2";

export function TimersProvider({ children }: { children: React.ReactNode }) {
  const [timers, setTimers] = useState<TimerEntry[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setTimers(JSON.parse(raw));
        } catch {}
      }
    });
  }, []);

  const persist = useCallback((entries: TimerEntry[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, []);

  const addTimer = useCallback(
    (label: string, date: string, color: string) => {
      const newEntry: TimerEntry = {
        id: crypto.randomUUID(),
        label,
        date,
        color,
      };
      setTimers((prev) => {
        const updated = [newEntry, ...prev];
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const editTimer = useCallback(
    (id: string, label: string, date: string, color: string) => {
      setTimers((prev) => {
        const updated = prev.map((t) =>
          t.id === id ? { ...t, label, date, color } : t
        );
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const removeTimer = useCallback(
    (id: string) => {
      setTimers((prev) => {
        const updated = prev.filter((t) => t.id !== id);
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const moveTimer = useCallback(
    (id: string, direction: "up" | "down") => {
      setTimers((prev) => {
        const idx = prev.findIndex((t) => t.id === id);
        if (idx === -1) return prev;
        const newIdx = direction === "up" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= prev.length) return prev;
        const updated = [...prev];
        const temp = updated[idx];
        updated[idx] = updated[newIdx];
        updated[newIdx] = temp;
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  return (
    <TimersContext.Provider
      value={{ timers, addTimer, editTimer, removeTimer, moveTimer }}
    >
      {children}
    </TimersContext.Provider>
  );
}

export function useTimers() {
  return useContext(TimersContext);
}
