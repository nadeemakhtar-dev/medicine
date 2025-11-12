import Medicine from "../models/medicineModel.js";

// GET all medicines
export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicines", error });
  }
};

// GET medicine by name
export const getMedicineByName = async (req, res) => {
  try {
    const { name } = req.query; // 👈 reads ?name=Fepanil from URL

    if (!name) {
      return res.status(400).json({ message: "Missing required query parameter: name" });
    }

    const medicine = await Medicine.findOne({
      product_name: { $regex: name, $options: "i" } // case-insensitive
    });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🔹 Search by Product Name
export const searchByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: "Missing 'name' query parameter" });

    const medicines = await Medicine.find({
      product_name: { $regex: name, $options: "i" }
    });

    if (!medicines.length) return res.status(404).json({ message: "No medicines found for this name" });

    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const smartSearch = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Missing 'query' parameter" });
    }

    const medicines = await Medicine.find({
      $or: [
        { product_name: { $regex: query, $options: "i" } },
        { sub_category: { $regex: query, $options: "i" } },
        { salt_composition: { $regex: query, $options: "i" } },
        { medicine_desc: { $regex: query, $options: "i" } }
      ]
    });

    if (!medicines.length) {
      console.log("🔎 No matches found for:", query);
      return res.status(404).json({ message: "No matches found" });
    }

    console.log(`✅ Found ${medicines.length} matches for "${query}"`);
    res.status(200).json(medicines);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


/**
 * 🧠 Smart Debug Search
 * Searches flexibly across multiple fields with detailed logs.
 */
export const debugSearchMedicines = async (req, res) => {
  try {
    const { query } = req.query;

    console.log("\n==================== SEARCH DEBUG START ====================");
    console.log("📅 Time:", new Date().toLocaleString());
    console.log("🟩 Raw query param:", query);

    if (!query || query.trim() === "") {
      console.log("❌ Missing or empty query string");
      console.log("==================== SEARCH DEBUG END ====================\n");
      return res.status(400).json({ message: "Missing 'query' parameter" });
    }

    // Escape special regex chars and make spaces flexible
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const flexibleRegex = new RegExp(escapedQuery.replace(/\s+/g, "\\s*"), "i");

    console.log("🔍 Using regex:", flexibleRegex);

    const searchFilter = {
      $or: [
        { product_name: { $regex: flexibleRegex } },
        { sub_category: { $regex: flexibleRegex } },
        { salt_composition: { $regex: flexibleRegex } },
        { medicine_desc: { $regex: flexibleRegex } },
      ],
    };

    console.log("⚙️ Final MongoDB filter:");
    console.dir(searchFilter, { depth: null });

    console.log("⏳ Executing MongoDB query...");
    const medicines = await Medicine.find(searchFilter);
    console.log("✅ MongoDB query executed successfully!");
    console.log("📊 Documents found:", medicines.length);

    if (medicines.length === 0) {
      console.log("❌ No matching results found for:", query);
      console.log("==================== SEARCH DEBUG END ====================\n");
      return res.status(404).json({ message: "No matches found" });
    }

    console.log("🧾 First match example:", medicines[0].product_name);
    console.log("==================== SEARCH DEBUG END ====================\n");

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    console.error("🚨 Search error:", error.message);
    console.log("==================== SEARCH DEBUG END ====================\n");
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// 🔹 Search by Sub Category
export const searchByCategory = async (req, res) => {
  try {
    const { sub_category } = req.query;
    if (!sub_category) return res.status(400).json({ message: "Missing 'sub_category' query parameter" });

    const medicines = await Medicine.find({
      sub_category: { $regex: sub_category, $options: "i" }
    });

    if (!medicines.length) return res.status(404).json({ message: "No medicines found for this sub category" });

    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};


// POST new medicine
export const addMedicine = async (req, res) => {
  try {
    const newMed = new Medicine(req.body);
    await newMed.save();
    res.status(201).json({ message: "Medicine added successfully", data: newMed });
  } catch (error) {
    res.status(500).json({ message: "Error adding medicine", error });
  }
};
