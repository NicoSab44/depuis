export type UnitKey = "hours" | "days" | "weeks" | "months" | "years";

export type UnitPair = {
  leftValue: number;
  leftUnit: UnitKey;
  rightValue: number;
  rightUnit: UnitKey;
};

export function computeElapsed(dateStr: string, now: number): UnitPair {
  const start = new Date(dateStr).getTime();
  const diffMs = now - start;
  if (diffMs < 0) {
    return { leftValue: 0, leftUnit: "hours", rightValue: 0, rightUnit: "days" };
  }

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = Math.floor(totalDays / 30.4375);
  const totalYears = Math.floor(totalDays / 365.25);

  if (totalYears >= 1) {
    return { leftValue: totalMonths, leftUnit: "months", rightValue: totalYears, rightUnit: "years" };
  }
  if (totalMonths >= 1) {
    return { leftValue: totalWeeks, leftUnit: "weeks", rightValue: totalMonths, rightUnit: "months" };
  }
  if (totalWeeks >= 1) {
    return { leftValue: totalDays, leftUnit: "days", rightValue: totalWeeks, rightUnit: "weeks" };
  }
  return { leftValue: totalHours, leftUnit: "hours", rightValue: totalDays, rightUnit: "days" };
}
