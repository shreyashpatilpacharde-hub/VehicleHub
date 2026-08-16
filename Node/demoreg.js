const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_db"
}).promise();

console.log("Database Connected Successfully");



app.post("/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, Email and Password are required"
            });
        }
        console.log(req.body);
        console.log(password);

        // Hash Password
        const hashpassword = await bcrypt.hash(password, 16);

        // Check Email Exists
        const sql = "SELECT * FROM emp WHERE email=?";

        const [user] = await db.query(sql, [email]);

        if (user.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Insert User
        const insertSql =
            "INSERT INTO emp(name,email,password) VALUES(?,?,?)";

        await db.query(insertSql, [name, email, hashpassword]);

        res.status(200).json({
            message: "Registration Successful"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });
    }
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});