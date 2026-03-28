const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const userController = require("./controllers/users");

const MONGO_URI = 'mongodb://localhost:27017/NNPTUD-S4';

async function importFromFile(filePath) {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for import");

        const fullPath = path.resolve(filePath);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`File not found: ${fullPath}`);
        }

        const rawData = fs.readFileSync(fullPath, 'utf8');
        const usersToImport = JSON.parse(rawData);

        console.log(`Importing ${usersToImport.length} users...`);
        let results = await userController.ImportUsers(usersToImport);
        
        console.table(results);
        console.log("Import completed.");
        
        await mongoose.connection.close();
    } catch (error) {
        console.error("Import failed:", error);
        process.exit(1);
    }
}

// Get file path from command line arguments
const filePath = process.argv[2] || "./users_import.json";
importFromFile(filePath);
