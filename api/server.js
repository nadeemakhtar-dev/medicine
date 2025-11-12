import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import medicineRoutes from "../routes/medicineRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection failed:", err));

app.use("/api/medicines", medicineRoutes);

// ❌ Don't use app.listen() on Vercel
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Export app instead
export default app;
