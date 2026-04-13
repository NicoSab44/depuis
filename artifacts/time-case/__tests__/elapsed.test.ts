import { computeElapsed } from "../utils/elapsed";

const MS = {
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
};

const BASE = new Date("2020-01-01T00:00:00Z").getTime();

/** Build a date string that is exactly `days` days before BASE */
function daysAgo(days: number): string {
  return new Date(BASE - days * MS.day).toISOString();
}

describe("computeElapsed", () => {
  describe("future date", () => {
    it("returns zeros when date is in the future", () => {
      const future = new Date("2099-01-01").toISOString();
      const result = computeElapsed(future, BASE);
      expect(result).toEqual({
        leftValue: 0,
        leftUnit: "hours",
        rightValue: 0,
        rightUnit: "days",
      });
    });
  });

  describe("hours + days range (< 7 days)", () => {
    it("shows hours and days for 5 hours elapsed", () => {
      const date = new Date(BASE - 5 * MS.hour).toISOString();
      const result = computeElapsed(date, BASE);
      expect(result.leftUnit).toBe("hours");
      expect(result.rightUnit).toBe("days");
      expect(result.leftValue).toBe(5);
      expect(result.rightValue).toBe(0);
    });

    it("shows hours=24 and days=1 for exactly 1 day elapsed", () => {
      const result = computeElapsed(daysAgo(1), BASE);
      expect(result.leftUnit).toBe("hours");
      expect(result.rightUnit).toBe("days");
      expect(result.leftValue).toBe(24);
      expect(result.rightValue).toBe(1);
    });

    it("shows hours and days for 6 days elapsed", () => {
      const result = computeElapsed(daysAgo(6), BASE);
      expect(result.leftUnit).toBe("hours");
      expect(result.rightUnit).toBe("days");
      expect(result.rightValue).toBe(6);
    });
  });

  describe("days + weeks range (>= 7 days, < 31 days)", () => {
    it("shows days and weeks for exactly 7 days elapsed", () => {
      const result = computeElapsed(daysAgo(7), BASE);
      expect(result.leftUnit).toBe("days");
      expect(result.rightUnit).toBe("weeks");
      expect(result.rightValue).toBe(1);
      expect(result.leftValue).toBe(7);
    });

    it("shows days and weeks for 14 days elapsed", () => {
      const result = computeElapsed(daysAgo(14), BASE);
      expect(result.leftUnit).toBe("days");
      expect(result.rightUnit).toBe("weeks");
      expect(result.rightValue).toBe(2);
      expect(result.leftValue).toBe(14);
    });

    it("shows days and weeks for 21 days elapsed", () => {
      const result = computeElapsed(daysAgo(21), BASE);
      expect(result.leftUnit).toBe("days");
      expect(result.rightUnit).toBe("weeks");
      expect(result.rightValue).toBe(3);
    });
  });

  describe("weeks + months range (>= 31 days, < 366 days)", () => {
    // totalMonths = floor(totalDays / 30.4375) >= 1 requires totalDays >= 31
    it("shows weeks and months for 31 days elapsed", () => {
      const result = computeElapsed(daysAgo(31), BASE);
      expect(result.leftUnit).toBe("weeks");
      expect(result.rightUnit).toBe("months");
      expect(result.rightValue).toBe(1);
    });

    it("shows weeks and months for 60 days elapsed", () => {
      const result = computeElapsed(daysAgo(60), BASE);
      expect(result.leftUnit).toBe("weeks");
      expect(result.rightUnit).toBe("months");
      expect(result.rightValue).toBe(1);
      // weeks = floor(60/7) = 8
      expect(result.leftValue).toBe(8);
    });

    it("shows weeks and months for 6 months (183 days) elapsed", () => {
      const result = computeElapsed(daysAgo(183), BASE);
      expect(result.leftUnit).toBe("weeks");
      expect(result.rightUnit).toBe("months");
      // months = floor(183 / 30.4375) = floor(6.01) = 6
      expect(result.rightValue).toBe(6);
    });
  });

  describe("months + years range (>= 366 days)", () => {
    // totalYears = floor(totalDays / 365.25) >= 1 requires totalDays >= 366
    it("shows months and years for 366 days elapsed", () => {
      const result = computeElapsed(daysAgo(366), BASE);
      expect(result.leftUnit).toBe("months");
      expect(result.rightUnit).toBe("years");
      expect(result.rightValue).toBe(1);
    });

    it("shows months and years for 3 years (1096 days) elapsed", () => {
      const result = computeElapsed(daysAgo(1096), BASE);
      expect(result.leftUnit).toBe("months");
      expect(result.rightUnit).toBe("years");
      // years = floor(1096 / 365.25) = floor(3.0) = 3
      expect(result.rightValue).toBe(3);
      // months = floor(1096 / 30.4375) = floor(36.0) = 36
      expect(result.leftValue).toBe(36);
    });

    it("shows months and years for 10 years (3653 days) elapsed", () => {
      const result = computeElapsed(daysAgo(3653), BASE);
      expect(result.leftUnit).toBe("months");
      expect(result.rightUnit).toBe("years");
      // years = floor(3653 / 365.25) = 9 (just under 10)... use 3653 carefully
      // 10 years = 3652.5 days, so 3653 gives floor(3653/365.25)=10
      expect(result.rightValue).toBe(10);
    });
  });

  describe("boundary: 0 ms elapsed (same instant)", () => {
    it("returns hours+days with 0 values", () => {
      const result = computeElapsed(new Date(BASE).toISOString(), BASE);
      expect(result.leftUnit).toBe("hours");
      expect(result.rightUnit).toBe("days");
      expect(result.leftValue).toBe(0);
      expect(result.rightValue).toBe(0);
    });
  });
});
