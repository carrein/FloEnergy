import { MeterReading } from "../types/types";

// Checks if the top row of the data indicates a valid NEM12 file.
export const isValidNem12Type = (data: string[][]): boolean => {
  const topRow = data[0];
  if (topRow[0] !== "100" || topRow[1] !== "NEM12") return false;
  return true;
};

// Extract MeterReadings from a parsed NEM12 file.
export const extractMeterReadings = (data: string[][]): MeterReading[] => {
  const meterReadings: MeterReading[] = [];
  let nmi = "";
  let intervalLength = "";

  for (const currentRow of data) {
    if (currentRow[0] === "200") {
      // Extract NMI and interval length from record 200
      nmi = currentRow[1];
      intervalLength = currentRow[8];
    }

    if (currentRow[0] === "300") {
      const interval = parseInt(intervalLength, 10);
      // The number of values provided must equal 1440 divided by
      // the IntervalLength. This is a repeating field with individual
      // field values separated by comma delimiters.
      const readingsCount = 1440 / interval;
      const consumptionValues = currentRow.slice(2, 2 + readingsCount);

      const consumption = consumptionValues.reduce((acc, val) => {
        return acc + parseFloat(val);
      }, 0);

      meterReadings.push({
        nmi,
        timestamp: currentRow[1],
        consumption: consumption.toString(),
      });
    }
  }

  return meterReadings;
};
