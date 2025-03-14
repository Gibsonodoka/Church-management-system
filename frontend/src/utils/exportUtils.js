import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Export to Excel
export const exportToExcel = (data, fileName = "attendance.xlsx") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, fileName);
};

// Export to CSV
export const exportToCSV = (data, fileName = "attendance.csv") => {
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data));
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
};

// Export to PDF
export const exportToPDF = (data, fileName = "attendance.pdf") => {
    const doc = new jsPDF();
    doc.autoTable({
        head: [["Date", "Month", "Service", "Men", "Women", "Youth", "Teens", "Children", "Total"]],
        body: data.map((record) => [
            record.date,
            record.month,
            record.service_description,
            record.men,
            record.women,
            record.youth,
            record.teens,
            record.children,
            record.total,
        ]),
    });
    doc.save(fileName);
};