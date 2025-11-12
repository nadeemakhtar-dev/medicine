import mongoose from "mongoose";

/**
 * 🧠 Mongoose Debug Model
 * - Logs schema initialization and collection binding
 * - Verifies MongoDB connection status
 * - Confirms the active database + collection
 */

console.log("🧩 [medicineModel] Initializing medicine schema...");

// ✅ Define the schema
const medicineSchema = new mongoose.Schema(
  {
    sub_category: { type: String, default: "" },
    product_name: { type: String, required: false },
    salt_composition: { type: String, default: "" },
    product_price: { type: String, default: "" },
    product_manufactured: { type: String, default: "" },
    medicine_desc: { type: String, default: "" },
    side_effects: { type: String, default: "" },
    drug_interactions: { type: String, default: "" },
  },
  {
    collection: "medicineDB", // 👈 force use of your actual collection
    timestamps: false,
  }
);

// 🧩 Log schema fields
console.log("📋 [medicineModel] Schema fields:", Object.keys(medicineSchema.paths));

// ✅ Create the model (explicitly bind collection name)
const Medicine = mongoose.model("Medicine", medicineSchema, "medicineDB");

// 🧩 Add an event listener for MongoDB connection debugging
if (mongoose.connection.readyState === 1) {
  console.log("✅ [medicineModel] MongoDB already connected to:", mongoose.connection.name);
} else {
  console.log("⏳ [medicineModel] MongoDB connection state:", mongoose.connection.readyState);
}

// 🧩 Once the connection is open, confirm the active DB + collections
mongoose.connection.once("open", async () => {
  console.log("🟩 [medicineModel] MongoDB Connection Opened");
  console.log("📦 Active Database:", mongoose.connection.name);

  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📚 Available Collections:", collections.map(c => c.name));

    // check if your collection exists
    const found = collections.some(c => c.name === "medicineDB");
    console.log(found
      ? "✅ [medicineModel] 'medicineDB' collection found!"
      : "❌ [medicineModel] 'medicineDB' collection NOT found in this DB!");
  } catch (err) {
    console.error("🚨 [medicineModel] Error listing collections:", err.message);
  }
});

console.log("🧱 [medicineModel] Model created using collection: 'medicineDB'");

export default Medicine;
