const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const extractTextFromFile = async (filePath, mimeType) => {
    const extension = path.extname(filePath).toLowerCase();

    // TXT file
    if (extension === ".txt" || mimeType === "text/plain") {
        return fs.readFileSync(filePath, "utf-8");
    }

    // PDF file
    if (extension === ".pdf" || mimeType === "application/pdf") {
        const fileBuffer = fs.readFileSync(filePath);

        const pdfData = await pdfParse(fileBuffer);

        return pdfData.text;
    }

    throw new Error("Unsupported file type");
};

const calculateWordCount = (text) => {
    if (!text || !text.trim()) {
        return 0;
    }

    return text.trim().split(/\s+/).length;
};

module.exports = {
    extractTextFromFile,
    calculateWordCount
};