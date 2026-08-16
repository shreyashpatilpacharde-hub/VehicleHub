const express = require("express");
const mysql2 = require("mysql2");
const app = express();
app.use(express.json());

app.post("/search", async (req, res) => {

    try {

        const { search } = req.body;

        const sql = "SELECT * FROM emp WHERE name LIKE ? OR email LIKE ?";

        const [result] = await db.query(sql, [
            `%${search}%`,
            `%${search}%`
        ]);

        res.json(result);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});