import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import Evidence from '../models/Evidence.js';
import * as crypto from 'crypto';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'] },
            (error: any, result: any) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
};

interface ReportBody {
    studentReg: string;
    examCode: string;
    description: string;
    invigilatorId: string;
}

// --- 1. SUBMIT REPORT (Write Data) ---
export const submitReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { studentReg, examCode, description, invigilatorId } = req.body as ReportBody;

        // Multer + Cloudinary puts the file info here
        const file = req.file;

        // Validation
        if (!studentReg || !examCode || !invigilatorId) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        console.log(`📝 Processing Report for: ${studentReg}`);
        if (file) {
            console.log(`📂 File received: ${file.originalname} (${file.mimetype})`);
            // Debug log to see available properties if path is missing
            if (!file.path) console.log("⚠️ File object missing 'path'. Properties:", Object.keys(file));
        }

        // --- Resolve Invigilator ID (Smart Fallback Logic) ---
        let targetInvigilatorId: number | null = null;
        const parsedId = parseInt(invigilatorId);

        if (!isNaN(parsedId)) {
            const byId = await prisma.invigilator.findUnique({ where: { id: parsedId } });
            if (byId) targetInvigilatorId = byId.id;
        }

        if (!targetInvigilatorId) {
            const byStaffId = await prisma.invigilator.findUnique({ where: { staffId: invigilatorId } });
            if (byStaffId) targetInvigilatorId = byStaffId.id;
        }

        if (!targetInvigilatorId) {
            const fallback = await prisma.invigilator.findFirst({ orderBy: { id: 'desc' } });
            if (fallback) {
                console.log(`⚠️ Warning: Provided Invigilator ID '${invigilatorId}' not found. Auto-linking to: '${fallback.name}' (ID: ${fallback.id})`);
                targetInvigilatorId = fallback.id;
            } else {
                res.status(400).json({ error: "Invigilator not found in database." });
                return;
            }
        }

        // --- NEW CLOUDINARY UPLOAD LOGIC ---
        let fileUrl = '';
        let publicId = '';
        let fileHash: string | null = null;

        if (file) {
            // Hash the file
            const hashSum = crypto.createHash('sha256');
            hashSum.update(file.buffer);
            fileHash = hashSum.digest('hex');

            // Upload
            try {
                const uploadResult = await uploadToCloudinary(file.buffer, 'exam_evidence_vault');
                fileUrl = uploadResult.secure_url;
                publicId = uploadResult.public_id;
            } catch (err) {
                console.error("Cloudinary upload failed", err);
                res.status(500).json({ error: "Failed to upload evidence to Cloudinary" });
                return;
            }
        }

        // --- Start Hybrid Transaction ---
        const result = await prisma.$transaction(async (prismaTx) => {

            // A. Create Incident in PostgreSQL (Structured Data)
            const newIncident = await prismaTx.malpractice.create({
                data: {
                    student: { connect: { regNo: studentReg } },
                    invigilator: { connect: { id: targetInvigilatorId! } },
                    examCode: examCode,
                    status: 'REPORTED',
                }
            });

            // A.2. Create EvidenceVault in PostgreSQL if file exists
            if (file && fileUrl) {
                await prismaTx.evidenceVault.create({
                    data: {
                        caseId: newIncident.id,
                        fileType: file.mimetype || 'unknown',
                        storageUrl: fileUrl,
                        checksumHash: fileHash,
                        fileSizeKb: file.size ? Math.round(file.size / 1024) : 0,
                    }
                });
            }

            let newEvidence = null;

            // B. Create Evidence in MongoDB (Only if we have a valid file URL)
            if (file && fileUrl) {
                newEvidence = new Evidence({
                    incidentId: newIncident.id,
                    studentReg: studentReg,
                    description: description || "No description provided",

                    // STORE CLOUDINARY LINKS
                    url: fileUrl,                        // The Cloudinary URL
                    publicId: publicId,                  // The Cloudinary Public ID
                    fileType: file.mimetype || "",
                    originalName: file.originalname || ""
                });

                await newEvidence.save();
            } else if (file) {
                console.error("❌ File uploaded but no URL found. Skipping MongoDB save to prevent crash.");
            }

            return { incident: newIncident, evidence: newEvidence };
        }, { maxWait: 5000, timeout: 10000 });

        console.log("✅ Report Saved: Postgres (Case)" + (result.evidence ? " + MongoDB (Evidence Link)" : ""));
        res.status(201).json({ success: true, data: result });

    } catch (error: any) {
        console.error("❌ Report Submission Failed:", error);
        res.status(500).json({ error: "Failed to process report", details: error.message });
    }
};

// ... (getDashboardStats remains unchanged) ...
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const recentReportsRaw = await prisma.malpractice.findMany({
            take: 5,
            orderBy: { incidentDate: 'desc' },
            include: { student: { select: { name: true, regNo: true } } }
        });
        const totalReports = await prisma.malpractice.count();
        const pendingReports = await prisma.malpractice.count({ where: { status: 'REPORTED' } });

        res.json({
            success: true,
            stats: { totalReports, pendingReports, activeExams: 1, myReports: totalReports },
            recentReports: recentReportsRaw.map(r => ({
                id: `CASE-${r.id}`,
                studentName: r.student.name || r.studentReg,
                time: new Date(r.incidentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: r.status === 'REPORTED' ? 'pending' : 'review',
                severity: 'major'
            }))
        });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch dashboard" });
    }
};