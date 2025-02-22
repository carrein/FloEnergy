import Papa, { ParseResult } from "papaparse";

// Returns true if the file is a valid CSV (MIME type: text/csv).
export const isValidCSVType = (file: File): boolean => {
  if (file.type !== "text/csv") return false;
  return true;
};

// Parses a CSV file and returns a promise with a 2D array of strings.
// WARNING: Parsing is performed client-side. For larger files, consider
// shifting this logic to the backend and streaming the file.
export const parseCSV = async (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (result: ParseResult<string[]>) => {
        resolve(result.data);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        reject("Error parsing file");
      },
    });
  });
};
