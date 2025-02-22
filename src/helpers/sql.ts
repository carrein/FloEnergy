import { MeterReading } from "../types/types";

// Naively create INSERT statement using template literals.
// WARNING: Logic should be shifted to the backend to prevent SQL injection attacks.
// Use a query builder or ORM to safely create SQL queries.
export const createInsertStatement = (
  meterReadings: MeterReading[],
): string => {
  const formattedReadings = meterReadings.map(
    (item) =>
      `('${item.nmi}', TO_TIMESTAMP('${item.timestamp}'::text, 'YYYYMMDD'), ${item.consumption})`,
  );
  const values = formattedReadings.join(", ");
  return `INSERT INTO meter_readings (nmi, timestamp, consumption) VALUES ${values};`;
};
