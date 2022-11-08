const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

global.__basedir = __dirname;
console.log(__dirname)

const app = express();

var corsOptions = {
    origin: "http://localhost:4200",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync().then(() => {
  console.log("Drop and re-sync db.");
});

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

require("./routes/user.routes")(app);
require("./routes/course.routes")(app);
require("./routes/quiz.routes")(app);
// require("./routes/token.routes")(app);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
