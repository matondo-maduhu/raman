const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDatabase, saveDatabase } = require("../database");

const router = express.Router();

const JWT_SECRET = "raman-demo-secret";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Jaza name, email na password"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password iwe na angalau characters 6"
      });
    }

    const db = await getDatabase();

    const existing = db.exec(
      "SELECT id FROM users WHERE email = ?",
      [email.toLowerCase()]
    );

    if (existing.length) {
      return res.status(409).json({
        error: "Email tayari imesajiliwa"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email.toLowerCase(), hashedPassword]
    );

    saveDatabase(db);

    const result = db.exec(
      "SELECT id, name, email, created_at FROM users WHERE email = ?",
      [email.toLowerCase()]
    );

    const user = {
      id: result[0].values[0][0],
      name: result[0].values[0][1],
      email: result[0].values[0][2],
      created_at: result[0].values[0][3]
    };

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Usajili umefanikiwa",
      token,
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error"
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Weka email na password"
      });
    }

    const db = await getDatabase();

    const result = db.exec(
      "SELECT id, name, email, password, created_at FROM users WHERE email = ?",
      [email.toLowerCase()]
    );

    if (!result.length) {
      return res.status(401).json({
        error: "Email au password si sahihi"
      });
    }

    const row = result[0].values[0];

    const validPassword = await bcrypt.compare(
      password,
      row[3]
    );

    if (!validPassword) {
      return res.status(401).json({
        error: "Email au password si sahihi"
      });
    }

    const user = {
      id: row[0],
      name: row[1],
      email: row[2],
      created_at: row[4]
    };

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login imefanikiwa",
      token,
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error"
    });
  }
});

module.exports = router;
