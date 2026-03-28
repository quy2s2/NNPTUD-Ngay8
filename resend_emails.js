const mongoose = require("mongoose");
const userModel = require("./schemas/users");
const mailHandler = require("./utils/mailHandler");
const crypto = require("crypto");

const MONGO_URI = 'mongodb://localhost:27017/NNPTUD-S4';

function generatePassword(length = 16) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function resendEmails() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await userModel.find({
            username: { $in: ['user01', 'user02', 'user03', 'user04', 'user05'] }
        });

        console.log(`Found ${users.length} users. Sending emails...`);

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            // Generate new password and update in DB
            const newPassword = generatePassword();
            
            await userModel.findOneAndUpdate(
                { _id: user._id },
                { password: newPassword }
            );

            // Send email
            await mailHandler.sendMail(
                user.email,
                "Tài khoản của bạn đã được tạo",
                `Chào ${user.username}, tài khoản của bạn đã được tạo thành công.\nUsername: ${user.username}\nPassword: ${newPassword}`,
                `<p>Chào <b>${user.username}</b>,</p><p>Tài khoản của bạn đã được tạo thành công.</p><ul><li>Username: ${user.username}</li><li>Password: <code>${newPassword}</code></li></ul>`
            );

            console.log(`[${i + 1}/${users.length}] Email sent to ${user.username} (${user.email})`);

            // Delay 2s between emails
            if (i < users.length - 1) {
                console.log("Waiting 2s...");
                await delay(2000);
            }
        }

        console.log("All emails sent successfully!");
        await mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

resendEmails();
