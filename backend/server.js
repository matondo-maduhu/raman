const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/auth");
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    app: "Raman",
    status: "running",
    message: "Karibu Raman!"
  });
});

app.get("/api/forms", (req, res) => {
  res.json([
    {
      id: "birth-certificate",
      name: "Birth Certificate",
      description: "Jaza taarifa za cheti cha kuzaliwa"
    },
    {
      id: "aadhaar-update",
      name: "Aadhaar Update",
      description: "Sasisha taarifa"
    },
    {
      id: "pan-card",
      name: "PAN Card",
      description: "Jaza taarifa za PAN Card"
    }
  ]);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Raman backend running on port ${PORT}`);
});
