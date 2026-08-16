const express = require("express");
const mysql = require("mysql2");

const app = express();

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_db"
});

console.log("Database Connected Successfully");

// API to get Second Highest Salary using LIMIT and OFFSET
app.get("/secondHighestSalary", (req, res) => {

    const query ="SELECT salary FROM emp ORDER BY salary DESC LIMIT 1,1";

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({
                
                message: "Error",
                
            });
        }

        res.status(200).json({
          
            message: "Second Highest Salary",
            data: result
        });
    });

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});