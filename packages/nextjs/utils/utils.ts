import Decimal from "decimal.js";

export const formatBigInt = (value: bigint, decimals = 18) => {
  const decimalValue = new Decimal(value.toString());
  const decimalDivisor = new Decimal(10).pow(decimals);
  const result = decimalValue.div(decimalDivisor);
  return result.toDecimalPlaces(6, Decimal.ROUND_DOWN).toString();
};

export function isStrictlyNumber(input: string) {
  return !isNaN(Number(input)) && input.trim() !== "";
}
