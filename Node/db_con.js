const express = require("express");
const mysql2 = require("mysql2");
const app = express();
app.use(express.json());

const db = mysql2.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "student_db"
}).promise();

console.log("Database Connected Successfully");

// Insert record

 app.post("/users",async (req,res) =>{
     try {
         const { name,email,password } =req.body;

         const sql = "INSERT INTO emp(name,email,password) VALUES (?,?,?)";

         await db.query(sql,[name,email,password]);

         res.json({
             message: "User inserted successfully"
         });

     }catch(err){
         res.status(500).json({
             message: err.message
         });
    }
 });

app.get("/users",async (req,res) => {
    try {
        const sql = "SELECT * FROM emp";

        const[users] = await db.query(sql);

        res.json(users);
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
});

app.get("/users/:id",async (req,res) => {
    try {
        const {id} = req.params;

        const sql = "SELECT * FROM emp WHERE id=?";

        const[user] = await db.query(sql, [id]);

        if(user.length === 0) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }
        res.json(user[0]);
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
});

app.put("/users/:id",async (req,res) => {
    try {
        const {id} = req.params;
        const { name,email,password } = req.body;

        const sql = "UPDTAE emp SET name=?, email=?, password=? WHERE id=?";

        const[result] = await db.query(sql, [
            name,
            email,
            password,
            id
        ]);

        if(result.affectedRows === 0) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }
        res.json({
            message: "User Updated Successfully"
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
});

app.delete("/users/:id",async (req,res) => {
    try {
        const {id} = req.params;

        const sql = "DELETE FROM emp WHERE id=?";

        const[result] = await db.query(sql,[id]);

        if(result.affectedRows === 0){
            return res.status(404).json({
                
                    message: "User Not found"
                });
            
        }
        res.json({
            message:"User Deleted Successfully"
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
});

/* REGISTER API */

app.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        let pass = bcrypt.hash("dhana@1234");

        // Check Email Exists
        const checkSql = "SELECT * FROM students WHERE email=?";

        // Create Promise
        const result = db.query(checkSql, [email]);

        // Wait for Promise to resolve
        const [user] = await result;

        if (user.length > 0) {

            return res.status(400).json({
                message: "Email already exists"
            });

        }

        // Insert User
        const insertSql =
            "INSERT INTO students(name,email,password) VALUES(?,?,?)";

        await db.query(insertSql, [name, email, password]);

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

/* LOGIN API */

// app.post("/login", async (req, res) => {

//     try {

//         const { email, password } = req.body;

//         const sql =
//             "SELECT * FROM students WHERE email=? AND password=?";

//         const [result] = await db.query(sql, [email, password]);

//         if (result.length === 0) {
     
//             return res.status(401).json({
//                 message: "Invalid Email or Password"
//             });

//         }

//         res.json({
//             message: "Login Successful",
//             user: result[0]
//         });

//     } catch (err) {

//         res.status(500).json({
//             message: err.message
//         });

//     }

// });

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

