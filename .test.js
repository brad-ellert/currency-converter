import { formatNumberAsCurrencyWithoutSymbol } from "./App";

describe("formatNumberAsCurrencyWithoutSymbol", () => {
  it("formats USD correctly", () => {
    expect(formatNumberAsCurrencyWithoutSymbol(1234.567, "USD")).toBe(
      "1234.57"
    );
  });

  it("formats JPY correctly", () => {
    expect(formatNumberAsCurrencyWithoutSymbol(1234.567, "JPY")).toBe(
      "1235"
    );
  });
});
