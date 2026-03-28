const mailHandler = require("./utils/mailHandler");

const users = [
    { name: "user01", email: "user01@haha.com" },
    { name: "user02", email: "user02@haha.com" },
    { name: "user03", email: "user03@haha.com" },
    { name: "user04", email: "user04@haha.com" },
    { name: "user05", email: "user05@haha.com" }
];

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendBulk() {
    console.log("Starting bulk mail process...");
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        try {
            await mailHandler.sendMail(
                user.email,
                "Welcome to our service",
                `Hello ${user.name}, welcome to our service!`,
                `<b>Hello ${user.name}</b>, <p>welcome to our service!</p>`
            );
            console.log(`[${i + 1}/${users.length}] Sent to ${user.name} (${user.email})`);
        } catch (error) {
            console.error(`[${i + 1}/${users.length}] Failed to send to ${user.name}:`, error.message);
        }
        // Wait 2 seconds between emails to avoid Mailtrap rate limit
        if (i < users.length - 1) {
            console.log("Waiting 2s before next email...");
            await delay(2000);
        }
    }
    console.log("Bulk mail process completed.");
}

sendBulk();
