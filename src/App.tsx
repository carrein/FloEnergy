import { useState } from "react";
import { Button } from "./components/Button";
import { Column } from "./components/Column";
import { isValidCSVType, parseCSV } from "./helpers/csv";
import { extractMeterReadings, isValidNem12Type } from "./helpers/nem12";
import { createInsertStatement } from "./helpers/sql";

/**
 * Entry point for NEM12 CSV Parser.
 * TODO: Do not bake core upload and parsing logic directly into App.tsx.
 * Instead decompose screens into sub-components e.g. UploadScreen, ParseScreen, etc.
 */
const App = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [sqlStatement, setSqlStatement] = useState<string>("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSqlStatement("");
    setCopySuccess(false);

    if (!isValidCSVType(file)) {
      setErrorMessage("Please upload a valid CSV file.");
      return;
    }

    const parsedFile = await parseCSV(file);

    if (!isValidNem12Type(parsedFile)) {
      setErrorMessage("Invalid NEM12 file. Please check the file format.");
      return;
    }

    const meterReadings = extractMeterReadings(parsedFile);

    setSqlStatement(createInsertStatement(meterReadings));
    setErrorMessage("");
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(sqlStatement)
      .then(() => setCopySuccess(true))
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Column>
      <h1>NEM12 CSV Parser</h1>
      <Column>
        <span>
          Generate SQL INSERT statements from a NEM12-compatible CSV file.
        </span>
        <span>※Only 200 and 300 NEM12 record indicators are parsed.</span>
        <span>
          ※INSERT statements follow a predefined format: aggregated usage over a
          time interval for a specific timestamp.
        </span>
      </Column>
      <Column>
        <h3>Upload a NEM12 compatible CSV file.</h3>
        <input type="file" accept=".csv" onChange={handleFileChange} required />
      </Column>
      <Column>
        {sqlStatement && (
          <Column>
            <h3>Generated INSERT statement.</h3>
            <textarea rows={5} value={sqlStatement} readOnly />
            <Button onClick={handleCopy}>Copy</Button>
            {copySuccess && (
              <span>✔️INSERT statement copied to clipboard.</span>
            )}
          </Column>
        )}
      </Column>
      {errorMessage && <span>⚠️{errorMessage}</span>}
    </Column>
  );
};

export default App;
