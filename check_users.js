const mongoose = require('mongoose');
const userModel = require('./schemas/users');

mongoose.connect('mongodb://localhost:27017/NNPTUD-S4').then(async () => {
    const users = await userModel.find({
        username: { $in: ['user01', 'user02', 'user03', 'user04', 'user05'] }
    }).select('username email role');
    console.log("Found users:");
    users.forEach(u => console.log(`  ${u.username} - ${u.email}`));
    console.log(`Total: ${users.length} users`);
    await mongoose.connection.close();
});
