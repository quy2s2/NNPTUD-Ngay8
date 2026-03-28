const mongoose = require("mongoose");
const roleModel = require("./schemas/roles");

const MONGO_URI = 'mongodb://localhost:27017/NNPTUD-S4';

async function seedRoles() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for seeding");

        const roles = [
            { name: "ADMIN", description: "Quản trị viên" },
            { name: "USER", description: "Người dùng" }
        ];

        for (const role of roles) {
            await roleModel.findOneAndUpdate(
                { name: role.name },
                role,
                { upsert: true, new: true }
            );
        }

        console.log("Roles seeded successfully");
        await mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding roles:", error);
        process.exit(1);
    }
}

seedRoles();
