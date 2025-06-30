require('dotenv').config();

const express = require("express");
const mysql2 = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ DB connection
const db = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ipath_gr",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});


app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUserSql = "SELECT * FROM users WHERE username = ?";
    db.query(checkUserSql, [username], (err, results) => {
      if (err) {
        console.error("Check user error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const insertUserSql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
      db.query(insertUserSql, [username, hashedPassword, role], (err) => {
        if (err) {
          console.error("Insert user error:", err);
          return res.status(500).json({ message: "Registration failed" });
        }

        res.status(201).json({ message: "User registered successfully" });
      });
    });
  } catch (error) {
    console.error("Hashing error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Login query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      username: user.username,
      role: user.role,
    });
  });
});


app.post("/api/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    await db.execute(
      "INSERT INTO emails(recipient, subject, message, sent_at) VALUES (?, ?, ?, NOW())",
      [to, subject, message]
    );

    res.json({ success: true, message: "Email sent and logged!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send the email" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
