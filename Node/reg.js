const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// ==================== Upload Folder ====================

app.use("/uploads", express.static("uploads"));

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

// ==================== Database ====================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_db"
}).promise();

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database Connected Successfully !!");
    }
});

// Upload Image 

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

// ==================== Get All Users ====================

app.get("/users", async (req, res) => {

    try {

        const [users] = await db.query("SELECT * FROM emp");

        res.json(users);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ==================== Get User By Id ====================

app.get("/users/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "SELECT * FROM emp WHERE id=?",
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        res.json(result[0]);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ==================== Add User ====================

app.post("/users", async (req, res) => {

    try {

        const { name, email, password, dob, upload_image } = req.body;

        await db.query(
            "INSERT INTO emp(name,email,password,dob,upload_image) VALUES(?,?,?,?,?)",
            [name, email, password, dob, upload_image]
        );

        res.json({
            message: "User Inserted Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ==================== Update User ====================

app.put("/users/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const { name, email, password, dob, upload_image } = req.body;

        const [result] = await db.query(
            "UPDATE emp SET name=?,email=?,password=?,dob=?,upload_image=? WHERE id=?",
            [name, email, password, dob, upload_image, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        res.json({
            message: "User Updated Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ==================== Delete User ====================

app.delete("/deleteUser/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM emp WHERE id=?",
            [id]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "User Not Found"
            });

        }

        res.json({
            message: "User Deleted Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ==================== Search ====================

app.post("/search", async (req, res) => {

    try {

        const { search } = req.body;

        const value = `%${search}%`;

        const [result] = await db.query(
            "SELECT * FROM emp WHERE name LIKE ? OR email LIKE ? OR dob LIKE ?",
            [value, value, value]
        );

        res.json(result);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ==================== Register ====================

app.post("/register", async (req, res) => {

    try {

        const { name, email, password, dob, upload_image } = req.body;

        const [check] = await db.query(
            "SELECT * FROM emp WHERE email=?",
            [email]
        );

        if (check.length > 0) {

            return res.json({
                message: "Email Already Exists"
            });

        }

        await db.query(
            "INSERT INTO emp(name,email,password,dob,upload_image) VALUES(?,?,?,?,?)",
            [name, email, password, dob, upload_image]
        );

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

// ==================== Login ====================

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const [result] = await db.query(
            "SELECT * FROM emp WHERE email=? AND password=?",
            [email, password]
        );

        if (result.length === 0) {

            return res.status(401).json({
                message: "Invalid Email or Password"
            });

        }

        res.json({
            message: "Login Successful",
            id: result[0].id,
            name: result[0].name,
            email: result[0].email,
            //user: result[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ==================== Pagination ====================

app.get("/pagination", async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;

        const offset = (page - 1) * limit;

        const [countResult] = await db.query(
            "SELECT COUNT(*) AS total FROM emp"
        );

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        const [result] = await db.query(
            "SELECT * FROM emp LIMIT ? OFFSET ?",
            [limit, offset]
        );

        res.json({
            data: result,
            total,
            page,
            limit,
            totalPages
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

app.post("/bulk-upload", async (req, res) => {
    try {
        const users = req.body.users || [];
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ message: "No users provided for bulk upload" });
        }

        const values = users.map((u) => [u.name, u.email, u.password, u.dob, u.upload_image]);
        const sql = `insert into emp(name,email,password,dob,upload_image) values ?`;

        await db.query(sql, [values]);

        res.json({ message: "Data Upload Done !!" });
    } catch (err) {
        console.error("/bulk-upload error:", err);
        res.status(500).json({ message: err.message || "Bulk upload failed" });
    }
});

app.post("/addpro", async (req, res) => {

    try {

        const {
            pname,
            pdescription,
            pmrp,
            u_id,
            pimage
        } = req.body;

        await db.query(
            "INSERT INTO product(pname, pdescription, pmrp, u_id, pimage) VALUES(?,?,?,?,?)",
            [pname, pdescription, pmrp, u_id, pimage]
        );

        res.json({
            message: "Product Inserted Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

app.get("/ProductList", async (req, res) => {

    try {

        const [product] = await db.query("SELECT id, pname, pdescription, pmrp, u_id, pimage FROM product");

        res.json(product);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});



app.get("/products/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "SELECT * FROM product WHERE id=?",
            [id]
        );

        if (result.length === 0) {

            return res.status(404).json({
                message: "Product Not Found"
            });

        }

        res.json(result[0]);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

app.get("/products/:id", async (req, res) => {

    const { id } = req.params;

    const [result] = await db.query(
        "SELECT * FROM product WHERE id=?",
        [id]
    );

    res.json(result[0]);

});

app.put("/products/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            pname,
            pdescription,
            pmrp,
            u_id,
            pimage
        } = req.body;

        const sql = `
        UPDATE product
            SET
            pname=?,
            pdescription=?,
            pmrp=?,
            u_id=?,
            pimage = IF(?='', pimage, ?)
            WHERE id=?`;

        const [result] = await db.query(
            sql,
            [
                pname,
                pdescription,
                pmrp,
                u_id,
                pimage,
                pimage,
                id
            ]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Product Not Found"
            });

        }

        res.json({
            message: "Product Updated Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ==================== Delete Product ====================

app.delete("/deleteProduct/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM product WHERE id=?",
            [id]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Product Not Found"
            });

        }

        res.json({
            message: "Product Deleted Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

app.listen(3000, () => {

    console.log("Server Running On Port 3000");

});