const fs = require("fs");

const Patient = require("../models/Patient");
const MedicalRecord = require("../models/MedicalRecord");

const {
    extractTextFromFile,
    calculateWordCount
} = require("../services/textExtractionService");

const uploadMedicalRecord = async (req, res) => {
    try {
        const { patientId, recordType } = req.body;

        // Check patient ID
        if (!patientId) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(400).json({
                success: false,
                message: "Patient ID is required"
            });
        }

        // Check file
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF or TXT file"
            });
        }

        // Check patient exists
        const patient = await Patient.findById(patientId);

        if (!patient) {
            fs.unlinkSync(req.file.path);

            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        // Extract text from uploaded file
        const extractedText = await extractTextFromFile(
            req.file.path,
            req.file.mimetype
        );

        // Calculate word count
        const wordCount = calculateWordCount(extractedText);

        // Save medical record
        const medicalRecord = await MedicalRecord.create({
            patientId: patient._id,
            fileName: req.file.originalname,
            filePath: req.file.path,
            recordType: recordType || "other",
            extractedText,
            wordCount
        });

        res.status(201).json({
            success: true,
            message: "Medical record uploaded and processed successfully",
            medicalRecord
        });

    } catch (error) {
        console.error("Upload medical record error:", error);

        // Delete uploaded file if processing failed
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: "Failed to process medical record",
            error: error.message
        });
    }
};


const getPatientMedicalRecords = async (req, res) => {
    try {
        const { patientId } = req.params;

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        const records = await MedicalRecord
            .find({ patientId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: records.length,
            records
        });

    } catch (error) {
        console.error("Get medical records error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch medical records"
        });
    }
};
const deleteMedicalRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const medicalRecord = await MedicalRecord.findById(id);

        if (!medicalRecord) {
            return res.status(404).json({
                success: false,
                message: "Medical record not found"
            });
        }

        // Delete the physical file
        if (
            medicalRecord.filePath &&
            fs.existsSync(medicalRecord.filePath)
        ) {
            fs.unlinkSync(medicalRecord.filePath);
        }

        // Delete the MongoDB record
        await MedicalRecord.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Medical record deleted successfully"
        });

    } catch (error) {
        console.error("Delete medical record error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete medical record"
        });
    }
};

module.exports = {
    uploadMedicalRecord,
    getPatientMedicalRecords,
    deleteMedicalRecord
};