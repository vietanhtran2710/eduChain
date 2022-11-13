const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const key = require('./config/secret-key.json');

global.__basedir = __dirname;
console.log(__dirname)

const app = express();

var corsOptions = {
    origin: "http://localhost:4200",
};

console.log(process.argv);

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");

// db.sequelize.sync({force: true}).then(async () => {
//     console.log("Server ready");
//     await db.users.create({
//         address: key.address,
//         role: "ADMIN",
//         fullName: "ADMIN",
//         email: "vietanhtran.uet@gmail.com",
//         workLocation: "Vietnam National University",
//         dateOfBirth: "10//2000",
//         verified: true
//     });
// });

db.sequelize.sync().then(() => {
    console.log("Server ready");
});


app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

require("./routes/user.routes")(app);
require("./routes/course.routes")(app);
require("./routes/quiz.routes")(app);
require("./routes/enrollment.routes")(app);
require("./routes/blockchain.routes")(app);
require("./routes/certificate.routes")(app);
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
