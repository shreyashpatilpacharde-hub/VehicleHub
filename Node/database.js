const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const transporter = require("./mailer");

const app = express();

app.use(cors());
app.use(express.json());

// Upload Folder
app.use("/uploads", express.static("uploads"));

// Multer Configuration
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));

    }

});

const upload = multer({
    storage: storage
});

// Database Connection
let db;

async function connectDB() {

    try {

        db = await mysql.createConnection({

            host: "localhost",
            user: "root",
            password: "",
            database: "vehicle_management"

        });

        console.log("Database Connected");

    } catch (err) {

        console.log(err);

    }

}

connectDB();

// ======================= REGISTER API =======================

app.post("/register", async (req, res) => {

    try {

        const { name, email, mobile, password } = req.body;

        const [check] = await db.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (check.length > 0) {

            return res.json({
                message: "Email Already Exists"
            });

        }

        await db.query(

            "INSERT INTO users(name,email,mobile,password) VALUES(?,?,?,?)",

            [
                name,
                email,
                mobile,
                password
            ]

        );

        try {
            await transporter.sendMail({
                from: '"Vehicle Management System"<shreyashpatil.pacharde@gmail.com>',
                to: email,
                subject: "Registration Successful",
                html: `
                  <h2>Hello, ${name}</h2>
                  <p>Welcome to Vehicle Management System</p>
                  <p>Your registration is successful</p>
                  <p>Date: ${new Date().toLocaleString()}</p>
                `
            });

        } catch (mailErr) {
            console.log(mailErr);
        }

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

// ======================= LOGIN API =======================

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const [user] = await db.query(

            "SELECT * FROM users WHERE email=? AND password=?",

            [
                email,
                password
            ]

        );

        if (user.length == 0) {

            return res.json({

                message: "Invalid Email or Password"

            });

        }

        try {
            await transporter.sendMail({
                from: '"Vehicle Management System"<shreyashpatil.pacharde@gmail.com>',
                to: user[0].email,
                subject: "Login Successful",
                html: `
                  <h2>Hello ${user[0].name}</h2>
                  <p>You have successfully logged in.</p>
                  <p>Date: ${new Date().toLocaleString()}</p>
                `
            });

        } catch (mailErr) {
            console.log(mailErr);
        }

        res.json({

            message: "Login Successful",

            user_id: user[0].user_id,

            name: user[0].name,

            email: user[0].email

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================= IMAGE UPLOAD API =======================

app.post("/upload", upload.single("vehicle_image"), (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                message: "Please Select Vehicle Image"

            });

        }

        res.json({

            message: "Image Uploaded Successfully",

            image: req.file.filename

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================= SELL VEHICLE API =======================

app.post("/vehicles", async (req, res) => {

    try {

        const {

            owner_name,
            owner_mobile,
            vehicle_number,
            brand,
            model,
            year,
            fuel_type,
            kilometer_driven,
            price,
            vehicle_condition,
            vehicle_image

        } = req.body;

        await db.query(

            `INSERT INTO vehicles
            (owner_name,owner_mobile,vehicle_number,brand,model,year,fuel_type,kilometer_driven,price,vehicle_condition,vehicle_image)
            VALUES(?,?,?,?,?,?,?,?,?,?,?)`,

            [

                owner_name,
                owner_mobile,
                vehicle_number,
                brand,
                model,
                year,
                fuel_type,
                kilometer_driven,
                price,
                vehicle_condition,
                vehicle_image

            ]

        );

        res.json({

            message: "Vehicle Added Successfully"

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================= GET ALL AVAILABLE VEHICLES =======================

app.get("/vehicles", async (req, res) => {

    try {

        const [rows] = await db.query(

            "SELECT * FROM vehicles WHERE status='Available'"

        );

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================= PAGINATION API =======================

app.get("/vehicles/page", async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;

        const limit = parseInt(req.query.limit) || 5;

        const offset = (page - 1) * limit;

        const [rows] = await db.query(

            "SELECT * FROM vehicles WHERE status='Available' LIMIT ? OFFSET ?",

            [limit, offset]

        );

        const [count] = await db.query(

            "SELECT COUNT(*) AS total FROM vehicles WHERE status='Available'"

        );

        res.json({

            total: count[0].total,
            page: page,
            limit: limit,
            vehicles: rows

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================= BUY VEHICLE API =======================

app.post("/buy", async (req, res) => {

    try {

        const {

            vehicle_id,
            user_id,
            user_name,
            user_mobile,
            customer_address

        } = req.body;

        const [vehicle] = await db.query(

            "SELECT * FROM vehicles WHERE vehicle_id=?",

            [vehicle_id]

        );

        if (vehicle.length === 0) {

            return res.json({

                message: "Vehicle Not Found"

            });

        }

        await db.query(

            `INSERT INTO buy
            (vehicle_id,user_id,user_name,user_mobile,customer_address,purchase_date,purchase_price)
            VALUES(?,?,?,?,?,CURDATE(),?)`,

            [

                vehicle_id,
                user_id,
                user_name,
                user_mobile,
                customer_address,
                vehicle[0].price

            ]

        );

        await db.query(

            "UPDATE vehicles SET status='Sold' WHERE vehicle_id=?",

            [vehicle_id]

        );

        res.json({

            message: "Vehicle Purchased Successfully"

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================= ADMIN VEHICLE LIST API =======================

app.get("/admin/vehicles", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM vehicles"
        );

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ======================= ADMIN UPDATE PRICE API =======================

app.put("/admin/vehicles/:id", async (req, res) => {

    try {

        const { price } = req.body;

        await db.query(
            "UPDATE vehicles SET price=? WHERE vehicle_id=?",
            [price, req.params.id]
        );

        res.json({
            message: "Price Updated Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ======================= DELETE VEHICLE API =======================

app.delete("/vehicles/:id", async (req, res) => {

    try {

        await db.query(
            "DELETE FROM vehicles WHERE vehicle_id=?",
            [req.params.id]
        );

        res.json({
            message: "Vehicle Deleted Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ======================= BUY HISTORY API =======================

app.get("/buy", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM buy"
        );

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

app.post("/admin/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        const [admin] = await db.query(
            "SELECT * FROM admin WHERE username=? AND password=?",
            [username, password]
        );

        if (admin.length === 0) {

            return res.json({
                message: "Invalid Username or Password"
            });

        }

        res.json({
            message: "Admin Login Successful",
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ======================= VIEW VEHICLES =======================

app.get("/admin/vehicles", async (req, res) => {

    try {

        const [rows] = await db.query(

            "SELECT * FROM vehicles WHERE status='Available'"

        );

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

});

// Update Price API

app.put("/admin/vehicles/:id", async (req, res) => {

    try {

        const { price } = req.body;

        await db.query(
            "UPDATE vehicles SET price=? WHERE vehicle_id=?",
            [price, req.params.id]
        );

        res.json({
            message: "Vehicle Updated Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ======================= SOLD VEHICLES =======================

app.get("/admin/soldvehicles", async (req, res) => {

    try {

        const [rows] = await db.query(

            "SELECT * FROM vehicles WHERE status='Sold'"

        );

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================= BUY HISTORY =======================

app.get("/buy", async (req, res) => {

    try {

        const [rows] = await db.query(

            `SELECT
                buy.purchase_id,
                buy.vehicle_id,
                buy.user_name,
                buy.user_mobile,
                buy.customer_address,
                buy.purchase_date,
                buy.purchase_price,
                vehicles.brand,
                vehicles.model
            FROM buy
            INNER JOIN vehicles
            ON buy.vehicle_id = vehicles.vehicle_id`

        );

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

});

// Admin Panel History
app.get("/history", async (req, res) => {

    try {

        const [rows] = await db.query(

            `SELECT
                buy.buy_id,
                buy.user_name,
                buy.user_mobile,
                buy.customer_address,
                buy.purchase_price,
                buy.purchase_date,
                vehicles.brand,
                vehicles.model,
                vehicles.vehicle_number
            FROM buy
            INNER JOIN vehicles
            ON buy.vehicle_id = vehicles.vehicle_id
            ORDER BY buy.buy_id ASC`

        );

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

});

// Search Bar API 

app.post("/search", async (req, res) => {

    try {

        const { search } = req.body;

        const value = `%${search}%`;

        const [result] = await db.query(
            "SELECT * FROM vehicles WHERE status='Available' AND ( brand like ? OR model like ?)",
            [value, value]
        );

        res.json(result);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

app.post("/upload", upload.single("image"), (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Please Select Image"
            });
        }

        console.log(req.file);

        res.json({
            message: "Image Uploaded Successfully",
            image: req.file.filename
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ======================= SERVER =======================

app.listen(3000, () => {

    console.log("Server Running On Port 3000");

});