let userModel = require("../schemas/users");
let roleModel = require("../schemas/roles");
let mailHandler = require("../utils/mailHandler");
let crypto = require("crypto");

module.exports = {
    CreateAnUser: async function (username, password, email, role,session,
        fullName, avatarUrl, status, loginCount
    ) {
        let newItem = new userModel({
            username: username,
            password: password,
            email: email,
            fullName: fullName,
            avatarUrl: avatarUrl,
            status: status,
            role: role,
            loginCount: loginCount
        });
        await newItem.save({session});
        return newItem; 
    },
    GetAllUser: async function () {
        let users = await userModel
            .find({ isDeleted: false })
        return users;
    },
    GetAnUserByUsername: async function (username) {
        let user = await userModel
            .findOne({
                isDeleted: false,
                username: username
            })
        return user;
    },
    GetAnUserByEmail: async function (email) {
        let user = await userModel
            .findOne({
                isDeleted: false,
                email: email
            })
        return user;
    },
    GetAnUserByToken: async function (token) {
        let user = await userModel
            .findOne({
                isDeleted: false,
                forgotPasswordToken: token
            })
        if (user.forgotPasswordTokenExp > Date.now()) {
            return user;
        } else {
            return false;
        }

    },
    GetAnUserById: async function (id) {
        let user = await userModel
            .findOne({
                isDeleted: false,
                _id: id
            }).populate('role')
        return user;
    },

    GenerateRandomPassword: function (length = 16) {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    },

    ImportUsers: async function (usersToImport) {
        // 1. Find the 'user' role
        let userRole = await roleModel.findOne({ name: { $regex: /user|người dùng/i } });
        if (!userRole) {
            throw new Error("Role 'user' not found. Please seed roles first.");
        }

        // Helper delay to avoid Mailtrap rate limit
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        let results = [];
        for (let i = 0; i < usersToImport.length; i++) {
            const { username, email } = usersToImport[i];
            const password = this.GenerateRandomPassword();

            try {
                // Create user
                let newUser = await this.CreateAnUser(
                    username, 
                    password, 
                    email, 
                    userRole._id, 
                    null, // session
                    usersToImport[i].fullName || username, 
                    "https://i.sstatic.net/l60Hf.png", 
                    true, // status
                    0 // loginCount
                );

                // Send email with password
                await mailHandler.sendMail(
                    email,
                    "Tài khoản của bạn đã được tạo",
                    `Chào ${username}, tài khoản của bạn đã được tạo thành công.\nUsername: ${username}\nPassword: ${password}`,
                    `<p>Chào <b>${username}</b>,</p><p>Tài khoản của bạn đã được tạo thành công.</p><ul><li>Username: ${username}</li><li>Password: <code>${password}</code></li></ul>`
                );

                console.log(`[${i + 1}/${usersToImport.length}] Imported ${username} successfully`);
                results.push({ username, email, status: "success" });
            } catch (err) {
                console.error(`[${i + 1}/${usersToImport.length}] Failed to import user ${username}: ${err.message}`);
                results.push({ username: username, email: email, status: "error", message: err.message });
            }

            // Delay 2s between emails to avoid Mailtrap sandbox rate limit
            if (i < usersToImport.length - 1) {
                await delay(2000);
            }
        }
        console.log("Bulk import process finished.");
        return results;

    }


}