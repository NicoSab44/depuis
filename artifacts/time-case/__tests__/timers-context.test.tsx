import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { TimersProvider, useTimers } from "../context/TimersContext";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TimersProvider>{children}</TimersProvider>
);

describe("TimersContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("starts with an empty list", async () => {
    const { result } = renderHook(() => useTimers(), { wrapper });
    expect(result.current.timers).toHaveLength(0);
  });

  it("addTimer prepends a new timer", async () => {
    const { result } = renderHook(() => useTimers(), { wrapper });

    await act(async () => {
      result.current.addTimer("Test", "2023-01-01T00:00:00Z", "#BAE6FD");
    });

    expect(result.current.timers).toHaveLength(1);
    const timer = result.current.timers[0];
    expect(timer.label).toBe("Test");
    expect(timer.date).toBe("2023-01-01T00:00:00Z");
    expect(timer.color).toBe("#BAE6FD");
    expect(timer.id).toBeDefined();
  });

  it("addTimer prepends (newest first)", async () => {
    const { result } = renderHook(() => useTimers(), { wrapper });

    await act(async () => {
      result.current.addTimer("First", "2022-01-01T00:00:00Z", "#A");
      result.current.addTimer("Second", "2023-01-01T00:00:00Z", "#B");
    });

    expect(result.current.timers[0].label).toBe("Second");
    expect(result.current.timers[1].label).toBe("First");
  });

  it("editTimer updates label, date and color", async () => {
    const { result } = renderHook(() => useTimers(), { wrapper });

    await act(async () => {
      result.current.addTimer("Original", "2022-01-01T00:00:00Z", "#AAA");
    });

    const id = result.current.timers[0].id;

    await act(async () => {
      result.current.editTimer(id, "Updated", "2023-06-15T12:00:00Z", "#BBB");
    });

    expect(result.current.timers).toHaveLength(1);
    expect(result.current.timers[0].label).toBe("Updated");
    expect(result.current.timers[0].date).toBe("2023-06-15T12:00:00Z");
    expect(result.current.timers[0].color).toBe("#BBB");
  });

  it("removeTimer deletes the correct entry", async () => {
    const { result } = renderHook(() => useTimers(), { wrapper });

    await act(async () => {
      result.current.addTimer("Keep", "2022-01-01T00:00:00Z", "#A");
      result.current.addTimer("Delete me", "2023-01-01T00:00:00Z", "#B");
    });

    const idToDelete = result.current.timers[0].id;

    await act(async () => {
      result.current.removeTimer(idToDelete);
    });

    expect(result.current.timers).toHaveLength(1);
    expect(result.current.timers[0].label).toBe("Keep");
  });

  it("moveTimer moves up correctly", async () => {
    const { result } = renderHook(() => useTimers(), { wrapper });

    await act(async () => {
      result.current.addTimer("A", "2021-01-01T00:00:00Z", "#A");
      result.current.addTimer("B", "2022-01-01T00:00:00Z", "#B");
      result.current.addTimer("C", "2023-01-01T00:00:00Z", "#C");
    });

    const idOfA = result.current.timers[2].id;

    await act(async () => {
      result.current.moveTimer(idOfA, "up");
    });

    expect(result.current.timers[1].label).toBe("A");
    expect(result.current.timers[2].label).toBe("B");
  });

  it("moveTimer moves down correctly", async () => {
    const { result } = renderHook(() => useTimers(), { wrapper });

    await act(async () => {
      result.current.addTimer("A", "2021-01-01T00:00:00Z", "#A");
      result.current.addTimer("B", "2022-01-01T00:00:00Z", "#B");
      result.current.addTimer("C", "2023-01-01T00:00:00Z", "#C");
    });

    const idOfC = result.current.timers[0].id;

    await act(async () => {
      result.current.moveTimer(idOfC, "down");
    });

    expect(result.current.timers[0].label).toBe("B");
    expect(result.current.timers[1].label).toBe("C");
  });

  it("moveTimer does nothing at first position moving up", async () => {
    const { result } = renderHook(() => useTimers(), { wrapper });

    await act(async () => {
      result.current.addTimer("Only", "2023-01-01T00:00:00Z", "#A");
    });

    const id = result.current.timers[0].id;
    const before = [...result.current.timers];

    await act(async () => {
      result.current.moveTimer(id, "up");
    });

    expect(result.current.timers[0].id).toBe(before[0].id);
  });

  it("moveTimer does nothing at last position moving down", async () => {
    const { result } = renderHook(() => useTimers(), { wrapper });

    await act(async () => {
      result.current.addTimer("Only", "2023-01-01T00:00:00Z", "#A");
    });

    const id = result.current.timers[0].id;

    await act(async () => {
      result.current.moveTimer(id, "down");
    });

    expect(result.current.timers).toHaveLength(1);
  });
});
