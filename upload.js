const http = require("http");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const Busboy = require("busboy");

const PORT = 8787;
const MONGODB_URI = "mongodb+srv://tabu-admin:7JgNDMAM1sRvEjcy@cluster0.27erlhk.mongodb.net/tabu?retryWrites=true&w=majority&appName=Cluster0";

// Create resumes folder
const resumesDir = path.join(__dirname, "uploads", "resumes");
if (!fs.existsSync(resumesDir)) {
    fs.mkdirSync(resumesDir, { recursive: true });
}

// MongoDB connection
let db;
async function connectDB() {
    try {
        console.log("🔄 Attempting MongoDB connection...");
        console.log("📍 Connection URI:", MONGODB_URI.substring(0, 50) + "...");
        
        const client = new MongoClient(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // 10 seconds
            connectTimeoutMS: 10000,
            socketTimeoutMS: 10000,
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority'
        });
        
        console.log("⏳ Connecting to MongoDB Atlas...");
        await client.connect();
        
        console.log("🏓 Testing connection with ping...");
        await client.db("admin").command({ ping: 1 });
        
        console.log("✅ Connected successfully to MongoDB Atlas");
        db = client.db("tabu"); // Use tabu database
        console.log("📊 Database 'tabu' ready for operations");
        
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        console.error("🔍 Full error details:", error);
        console.log("⚠️  Continuing without MongoDB. File upload will still work.");
    }
}

// Generate unique filename: jobId_timestamp_uniqueId_originalName.ext
function makeUniqueName(jobId, originalName) {
    // Ensure originalName is a string
    const filename = typeof originalName === 'string' ? originalName : 'resume.pdf';
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    return `${jobId}_${timestamp}_${uniqueId}_${base}${ext}`;
}

// Handle upload
async function handleUpload(req, res) {
    const busboy = Busboy({ headers: req.headers });
    const fields = {};
    let fileData = null;
    let fileWritten = false; // Flag to track if file was written
    let dbEntryCreated = false; // Flag to track if DB entry was created
    let filePath = null; // Store file path for cleanup

    busboy.on("field", (name, val) => fields[name] = val);
    busboy.on("file", (name, file, info) => {
        if (name === "resume") {
            const chunks = [];
            file.on("data", chunk => chunks.push(chunk));
            file.on("end", () => fileData = { 
                filename: info.filename || info.name || 'resume.pdf', 
                buffer: Buffer.concat(chunks) 
            });
        }
    });

    busboy.on("finish", async () => {
        try {
            if (!fileData) {
                return res.writeHead(400, {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }).end(JSON.stringify({ error: "No file uploaded" }));
            }

            const { 
                jobId, 
                fullName, 
                email, 
                phone, 
                experience 
            } = fields;
            
            if (!jobId || !fullName || !email) {
                return res.writeHead(400, {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }).end(JSON.stringify({ error: "Missing required fields: jobId, fullName, and email are required" }));
            }

            // Check for duplicate application (same email + jobId) - only if database available
            if (db) {
                const existingApplicant = await db.collection("applicants").findOne({
                    email: email,
                    jobId: jobId
                });

                if (existingApplicant) {
                    return res.writeHead(409, {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    }).end(JSON.stringify({ 
                        error: "You have already applied for this position. Only one application per job is allowed.",
                        existingApplication: {
                            appliedDate: existingApplicant.appliedDate,
                            resumeOriginalName: existingApplicant.resumeOriginalName
                        }
                    }));
                }
            } else {
                console.warn('Warning: Cannot check for duplicate applications - no database connection');
            }

            // Save file with unique name
            const uniqueName = makeUniqueName(jobId, fileData.filename);
            filePath = path.join(resumesDir, uniqueName);
            
            try {
                fs.writeFileSync(filePath, fileData.buffer);
                fileWritten = true;
                console.log(`File written successfully: ${uniqueName}`);
            } catch (fileError) {
                console.error("File write error:", fileError);
                throw new Error("Failed to save resume file");
            }

            // Save to MongoDB with all form fields
            const applicant = {
                jobId,
                fullName,
                email,
                phone: phone || "",
                experience: experience || "",
                resumeOriginalName: fileData.filename,
                resumeStoredName: uniqueName,
                resumePath: filePath,
                appliedDate: new Date(),
                status: "pending"
            };

            // Save to database if available
            if (db) {
                try {
                    await db.collection("applicants").insertOne(applicant);
                    dbEntryCreated = true;
                    console.log(`DB entry created successfully for: ${fullName} (${email})`);
                } catch (dbError) {
                    console.error("Database insert error:", dbError);
                    throw new Error("Failed to save application to database");
                }
            } else {
                console.warn('Warning: Application file saved but not recorded in database - no database connection');
                dbEntryCreated = true; // Consider it "created" so file cleanup doesn't happen
            }

            console.log("Application processed successfully, sending response...");
            
            const responseData = { 
                success: true, 
                message: "Application submitted successfully!",
                applicant: {
                    name: fullName,
                    email: email,
                    jobId: jobId
                },
                originalName: fileData.filename,
                storedAs: uniqueName
            };
            
            res.writeHead(200, { 
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(JSON.stringify(responseData)),
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            });
            res.end(JSON.stringify(responseData));
            
            console.log("Response sent successfully");

        } catch (error) {
            console.error("Error:", error);
            
            // Cleanup on error: remove file if written but DB insert failed
            if (fileWritten && !dbEntryCreated && filePath) {
                try {
                    fs.unlinkSync(filePath);
                    console.log("Cleaned up orphaned file:", filePath);
                } catch (cleanupError) {
                    console.error("Failed to cleanup file:", cleanupError);
                }
            }
            
            res.writeHead(500, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            }).end(JSON.stringify({ 
                error: error.message || "Upload failed",
                details: "Please try again or contact support if the problem persists"
            }));
        }
    });

    req.pipe(busboy);
}

// Handle equipment image upload
async function handleEquipmentUpload(req, res) {
    console.log("Equipment upload request received");
    console.log("Request headers:", req.headers);
    
    const busboy = Busboy({ headers: req.headers });
    let fileData = null;
    let fields = {};
    let fileWritten = false;
    let filePath = null;

    busboy.on("field", (fieldname, val) => {
        fields[fieldname] = val;
    });

    busboy.on("file", (fieldname, file, info) => {
        if (fieldname === "equipmentImage") {
            const chunks = [];
            file.on("data", (data) => chunks.push(data));
            file.on("end", () => fileData = { 
                filename: info.filename || info.name || 'equipment.jpg', 
                buffer: Buffer.concat(chunks) 
            });
        }
    });

    busboy.on("finish", async () => {
        try {
            if (!fileData) {
                return res.writeHead(400, {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }).end(JSON.stringify({ error: "No file uploaded" }));
            }

            const { equipmentName, equipmentSpecs, equipmentFeatures } = fields;
            
            if (!equipmentName) {
                return res.writeHead(400, {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }).end(JSON.stringify({ error: "Equipment name is required" }));
            }

            // Ensure equipment directory exists
            const equipmentDir = path.join(__dirname, "uploads", "equipment");
            if (!fs.existsSync(equipmentDir)) {
                fs.mkdirSync(equipmentDir, { recursive: true });
            }

            // Generate unique filename
            const timestamp = Date.now();
            const originalName = String(fileData.filename || 'equipment.jpg');
            const extension = path.extname(originalName);
            const uniqueName = `${timestamp}_${originalName}`;
            filePath = path.join(equipmentDir, uniqueName);

            try {
                fs.writeFileSync(filePath, fileData.buffer);
                fileWritten = true;
                console.log(`Equipment image saved: ${filePath}`);
            } catch (fileError) {
                console.error("File write error:", fileError);
                throw new Error("Failed to save equipment image");
            }

            console.log("Equipment upload processed successfully");
            
            const responseData = { 
                success: true, 
                message: "Equipment image uploaded successfully!",
                equipment: {
                    name: equipmentName,
                    specs: equipmentSpecs,
                    features: equipmentFeatures
                },
                originalName: fileData.filename,
                storedAs: uniqueName,
                filename: uniqueName
            };
            
            res.writeHead(200, { 
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(JSON.stringify(responseData)),
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            });
            res.end(JSON.stringify(responseData));
            
            console.log("Equipment upload response sent successfully");

        } catch (error) {
            console.error("Equipment upload error:", error);
            
            // Cleanup on error: remove file if written
            if (fileWritten && filePath) {
                try {
                    fs.unlinkSync(filePath);
                    console.log("Cleaned up equipment file:", filePath);
                } catch (cleanupError) {
                    console.error("Failed to cleanup equipment file:", cleanupError);
                }
            }

            res.writeHead(500, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            });
            res.end(JSON.stringify({ error: error.message || "Equipment upload failed" }));
        }
    });

    req.pipe(busboy);
}

// Get applicants for admin
async function getApplicants(req, res) {
    // Return empty array if no database connection
    if (!db) {
        console.warn('No database connection - returning empty applicants list');
        res.writeHead(200, { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
        }).end(JSON.stringify([]));
        return;
    }
    
    try {
        const applicants = await db.collection("applicants").find({}).sort({ appliedDate: -1 }).toArray();
        res.writeHead(200, { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
        }).end(JSON.stringify(applicants));
    } catch (error) {
        res.writeHead(500, { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
        }).end(JSON.stringify({ error: "Failed to get applicants" }));
    }
}

// Auto-delete old applications (6 months)
async function cleanupOldApplications() {
    // Skip cleanup if no database connection
    if (!db) {
        console.log('Skipping cleanup - no database connection');
        return { success: true, message: 'Cleanup skipped - no database connection' };
    }
    
    try {
        console.log('Starting cleanup of old applications...');
        
        // Calculate date 6 months ago
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        // Find applications older than 6 months
        const oldApplications = await db.collection("applicants").find({
            appliedDate: { $lt: sixMonthsAgo }
        }).toArray();
        
        if (oldApplications.length === 0) {
            console.log('No old applications to cleanup');
            return;
        }
        
        console.log(`Found ${oldApplications.length} applications older than 6 months to cleanup`);
        
        let filesDeleted = 0;
        let recordsDeleted = 0;
        
        for (const application of oldApplications) {
            try {
                // Delete resume file if it exists
                const filePath = path.join(resumesDir, application.resumeStoredName);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    filesDeleted++;
                    console.log(`Deleted file: ${application.resumeStoredName}`);
                } else {
                    console.log(`File not found (already deleted?): ${application.resumeStoredName}`);
                }
                
                // Delete database record
                await db.collection("applicants").deleteOne({ _id: application._id });
                recordsDeleted++;
                console.log(`Deleted record for: ${application.fullName} (${application.email})`);
                
            } catch (error) {
                console.error(`Error cleaning up application for ${application.fullName}:`, error);
            }
        }
        
        console.log(`Cleanup completed: ${filesDeleted} files deleted, ${recordsDeleted} records deleted`);
        
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

// Schedule cleanup to run daily at 2 AM
function scheduleCleanup() {
    const now = new Date();
    const nextCleanup = new Date();
    nextCleanup.setHours(2, 0, 0, 0); // 2 AM
    
    // If it's past 2 AM today, schedule for tomorrow
    if (now.getHours() >= 2) {
        nextCleanup.setDate(nextCleanup.getDate() + 1);
    }
    
    const timeUntilCleanup = nextCleanup.getTime() - now.getTime();
    
    console.log(`Next automatic cleanup scheduled for: ${nextCleanup.toLocaleString()}`);
    
    setTimeout(() => {
        cleanupOldApplications();
        // Schedule the next cleanup (24 hours later)
        setInterval(cleanupOldApplications, 24 * 60 * 60 * 1000); // Run daily
    }, timeUntilCleanup);
}

// Simple server
const server = http.createServer(async (req, res) => {
    try {
        // Enhanced CORS headers
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.setHeader("Access-Control-Max-Age", "86400");

        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} from ${req.headers.origin || 'unknown origin'}`);

        // Handle preflight OPTIONS request
        if (req.method === "OPTIONS") {
            res.writeHead(200);
            res.end();
            return;
        }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "POST" && url.pathname === "/upload") {
        return handleUpload(req, res);
    }

    if (req.method === "GET" && url.pathname === "/applicants") {
        return getApplicants(req, res);
    }

    if (req.method === "POST" && url.pathname === "/equipment") {
        return handleEquipmentUpload(req, res);
    }

    // Test endpoint
    if (req.method === "GET" && url.pathname === "/test") {
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        });
        res.end(JSON.stringify({ 
            message: "Server is working!", 
            timestamp: new Date().toISOString(),
            equipmentDir: path.join(__dirname, "uploads", "equipment"),
            equipmentDirExists: fs.existsSync(path.join(__dirname, "uploads", "equipment"))
        }));
        return;
    }

    if (req.method === "POST" && url.pathname === "/cleanup") {
        try {
            await cleanupOldApplications();
            res.writeHead(200, { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }).end(JSON.stringify({ 
                success: true, 
                message: "Cleanup completed successfully" 
            }));
        } catch (error) {
            console.error('Manual cleanup error:', error);
            res.writeHead(500, {
                "Content-Type": "application/json", 
                "Access-Control-Allow-Origin": "*"
            }).end(JSON.stringify({ 
                error: "Cleanup failed", 
                details: error.message 
            }));
        }
        return;
    }

    // Serve equipment images
    if (req.method === "GET" && url.pathname.startsWith("/uploads/equipment/")) {
        console.log(`Equipment image request: ${url.pathname}`);
        const filename = path.basename(url.pathname);
        const equipmentImagePath = path.join(__dirname, "uploads", "equipment", filename);
        
        console.log(`Looking for equipment image at: ${equipmentImagePath}`);
        console.log(`File exists: ${fs.existsSync(equipmentImagePath)}`);
        
        try {
            if (fs.existsSync(equipmentImagePath)) {
                const stat = fs.statSync(equipmentImagePath);
                const ext = path.extname(filename).toLowerCase();
                
                let contentType = 'application/octet-stream';
                if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
                else if (ext === '.png') contentType = 'image/png';
                else if (ext === '.gif') contentType = 'image/gif';
                else if (ext === '.webp') contentType = 'image/webp';
                
                console.log(`Serving equipment image: ${filename} (${contentType}, ${stat.size} bytes)`);
                
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Content-Length': stat.size,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
                    'Cache-Control': 'public, max-age=31536000'
                });
                
                const readStream = fs.createReadStream(equipmentImagePath);
                readStream.pipe(res);
                return;
            } else {
                console.log(`Equipment image not found: ${equipmentImagePath}`);
                res.writeHead(404, { 
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'text/plain'
                });
                res.end('Equipment image not found');
                return;
            }
        } catch (error) {
            console.error('Error serving equipment image:', error);
            res.writeHead(500, { 
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/plain'
            });
            res.end('Error serving equipment image');
            return;
        }
    }

    if (req.method === "GET" && url.pathname === "/download") {
        const filename = url.searchParams.get("filename");
        if (!filename) {
            res.writeHead(400).end("Filename required");
            return;
        }
        
        const filePath = path.join(__dirname, "uploads", "resumes", filename);
        if (!fs.existsSync(filePath)) {
            res.writeHead(404).end("File not found");
            return;
        }
        
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "application/octet-stream");
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        return;
    }

    res.writeHead(404).end("Not Found");
    } catch (error) {
        console.error("Server error:", error);
        try {
            if (!res.headersSent) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
            }
        } catch (responseError) {
            console.error("Failed to send error response:", responseError);
        }
    }
});

// Start
async function start() {
    // Try to connect to MongoDB, but don't fail if it doesn't work
    try {
        await connectDB();
        
        // Run cleanup immediately on startup (only if MongoDB connected)
        if (db) {
            console.log('Running initial cleanup check...');
            await cleanupOldApplications();
            
            // Schedule daily cleanup
            scheduleCleanup();
        }
    } catch (error) {
        console.warn('Starting server without MongoDB. Equipment upload/serving will still work.');
    }
    
    // Always start the server, regardless of MongoDB status
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Simple upload server running on:`);
        console.log(`  - http://localhost:${PORT}`);
        console.log(`  - http://127.0.0.1:${PORT}`);
        console.log(`  - http://0.0.0.0:${PORT}`);
        console.log('Equipment endpoints available:');
        console.log(`  - POST /equipment (upload)`);
        console.log(`  - GET /uploads/equipment/* (serve images)`);
        console.log(`  - GET /test (server status)`);
        console.log('Resume endpoints available:');
        console.log(`  - POST /upload (job applications)`);
        console.log(`  - GET /applicants (admin view)`);
        console.log(`  - GET /download (resume download)`);
    });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

start().catch(console.error); 
