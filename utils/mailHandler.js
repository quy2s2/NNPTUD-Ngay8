const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "33617de504c623",
        pass: "33cb8cffb57218"
    }
});

module.exports = {
    sendMail: async function (to, subject, text, html) {
        try {
            await transporter.sendMail({
                from: '"Server Import" <no-reply@import.com>',
                to: to,
                subject: subject,
                text: text,
                html: html,
            });
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }
}
