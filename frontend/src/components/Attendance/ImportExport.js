import React, { useState } from "react";
import { exportToExcel, exportToCSV, exportToPDF } from "../../utils/exportUtils";
import Papa from "papaparse";
import * as XLSX from "xlsx"; // Import XLSX library

const ImportExport = ({ attendanceRecords, setAttendanceRecords }) => {
    const [file, setFile] = useState(null);

    // Handle file upload for import
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            if (file.type === "text/csv" || file.name.endsWith(".csv")) {
                // Parse CSV file
                Papa.parse(file, {
                    header: true,
                    complete: (results) => {
                        setAttendanceRecords(results.data);
                    },
                });
            } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
                // Parse Excel file
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet);
                    setAttendanceRecords(json);
                };
                reader.readAsArrayBuffer(file);
            } else {
                alert("Unsupported file format. Please upload a CSV or Excel file.");
            }
        }
    };

    return (
        <div className="mb-3">
            <button className="btn btn-success me-2" onClick={() => exportToExcel(attendanceRecords)}>
                Export Excel
            </button>
            <button className="btn btn-success me-2" onClick={() => exportToCSV(attendanceRecords)}>
                Export CSV
            </button>
            <button className="btn btn-success me-2" onClick={() => exportToPDF(attendanceRecords)}>
                Export PDF
            </button>
            <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="fileInput"
            />
            <label htmlFor="fileInput" className="btn btn-primary">
                Import
            </label>
        </div>
    );
};

export default ImportExport;