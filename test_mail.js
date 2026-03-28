const mongoose = require("mongoose");
const mailHandler = require("./utils/mailHandler");

async function test() {
    try {
        console.log("Starting test email...");
        await mailHandler.sendMail(
            "test@haha.com",
            "TEST EMAIL",
            "This is a test email - [ignoring loop detection]",
            "<b>This is a test email</b>"
        );
        console.log("Test email process completed.");
    } catch (err) {
        console.error("Manual test failed:", err);
    }
}

test();
