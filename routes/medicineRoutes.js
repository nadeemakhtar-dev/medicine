import express from "express";
import mongoose from "mongoose"; // 👈 ADD THIS LINE
import { debugSearchMedicines, getMedicines, addMedicine } from "../controllers/medicineController.js";
import Medicine from "../models/medicineModel.js"; // 👈 Also import your model (for /debug/test route)

const router = express.Router();

// 🧩 Fetch all medicines
router.get("/", getMedicines);

// 🧩 Debug Search
router.get("/search", debugSearchMedicines);

// 🧩 Add a new medicine
router.post("/", addMedicine);

// 🧩 Debug Route #1 — check raw MongoDB collection
router.get("/debug/all", async (req, res) => {
  try {
    const data = await mongoose.connection.db.collection("medicineDB").find({}).toArray();
    console.log("🧾 Found docs in medicineDB:", data.length);
    res.json(data);
  } catch (err) {
    console.error("❌ Error in /debug/all:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🧩 Debug Route #2 — check model-based query
router.get("/debug/test", async (req, res) => {
  try {
    const docs = await Medicine.find({ product_name: /Insulin/i });
    console.log("🧾 Model test found:", docs.length);
    res.json({ count: docs.length, docs });
  } catch (err) {
    console.error("❌ Error in /debug/test:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
