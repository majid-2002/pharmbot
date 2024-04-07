import medicineModel from "../models/medicine.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const medicines = await medicineModel.find();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const medicine = new medicineModel({
      name: req.body.name,
      dosage: req.body.dosage,
      quantity: req.body.quantity,
      price: req.body.price,
      pharmacy: req.body.pharmacy,
    });
    const newMedicine = await medicine.save();
    res.status(201).json(newMedicine);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const medicine = await medicineModel.findById(req.params.id);
    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
