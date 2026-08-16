const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());





// const express = require("express");
// const mysql = require("mysql2");

// const app = express();
// app.use(express.json());

/* DATABASE CONNECTION */

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_db"
}).promise();

console.log("Database Connected Successfully");

/* INSERT USER */

app.post("/users", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const sql =
            "INSERT INTO emp(name, email, password) VALUES (?, ?, ?)";

        await db.query(sql, [name, email, password]);

        res.json({
            message: "User inserted successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


/* GET ALL USERS */

app.get("/users", async (req, res) => {

    try {

        const sql = "SELECT * FROM emp";

        const [users] = await db.query(sql);

        res.json(users);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

/* GET USER BY ID */

app.get("/users/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const sql = "SELECT * FROM emp WHERE id=?";

        const [user] = await db.query(sql, [id]);

        if (user.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json(user[0]);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


/* UPDATE USER */

app.put("/users/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const { name, email, password } = req.body;

        const sql =
            "UPDATE emp SET name=?, email=?, password=? WHERE id=?";

        const [result] = await db.query(sql, [
            name,
            email,
            password,
            id
        ]);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json({
            message: "User updated successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});



 /* DELETE USER */

app.delete("/users/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const sql = "DELETE FROM emp WHERE id=?";

        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "User not found"
            });    

        }

        res.json({
            message: "User deleted successfully"
        });
                      
       } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
      
});


/* REGISTER API */

/* REGISTER API */

app.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        let pass = await bcrypt.hash(password, 10);

        // Check Email Exists
        const checksql = "SELECT * FROM emp WHERE email=?";

        // Create Promise
        const result = db.query(checksql, [email]);

        // Wait for Promise to resolve
        const [user] = await result;

        if (user.length > 0) {

            return res.status(400).json({
                message: "Email already exists"
            });

        }

        // Insert User
        const insertSql =
            "INSERT INTO emp(name,email,password) VALUES(?,?,?)";

        await db.query(insertSql, [name, email, pass]);

        res.json({
            message: "Registration Successful"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});





// app.post("/register", async (req, res) => {

//     try {

//         const { name, email, password } = req.body;

//         // Check Email Exists
//         const checkSql = "SELECT * FROM emp WHERE email=?";

//         // Create Promise
//         const result = db.query(checkSql, [email]);

//         // Wait for Promise to resolve
//         const [user] = await result;

//         if (user.length > 0) {

//             return res.status(400).json({
//                 message: "Email already exists"
//             });

//         }

//         // Insert User
//         const insertSql =
//             "INSERT INTO emp(name,email,password) VALUES(?,?,?)";

//         await db.query(insertSql, [name, email, password]);

//         res.json({
//             message: "Registration Successful"
//         });

//     } catch (err) {

//         console.log(err);

//         res.status(500).json({
//             message: err.message
//         });

//     }

// });


 /* LOGIN API */

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const sql =
            "SELECT * FROM emp WHERE email=? AND password=?";

        const [result] = await db.query(sql, [email, password]);

        if (result.length === 0) {
     
            return res.status(401).json({
                message: "Invalid Email or Password"
            });

        }

        res.json({
            message: "Login Successful",
            user: result[0]
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});
/* SERVER */

