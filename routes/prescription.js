import prescriptionModel from "../models/prescription.js";
import express from "express";
import medicineModel from "../models/medicine.js";
import { readFile } from "node:fs/promises";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const prescriptions = await prescriptionModel.find();
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { patient, prescription } = req.body;

    const newPrescription = new prescriptionModel({
      patient: patient,
      prescription: prescription,
    });

    await newPrescription.save();

    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/image", async (req, res) => {
  const data = (await readFile("./media/image2.jpeg")).toString("base64");
  console.log(data);

  res.status(200).json({ data });
});

router.post("/:prescriptionId/medicine/:medicineId", async (req, res) => {
  try {
    const { prescriptionId, medicineId } = req.params;

    console.log("works here aadd prescription ");

    // Find the prescription by ID
    const prescription = await prescriptionModel.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Check if the medicine is already added to the prescription
    const isMedicineAdded = prescription.prescription.some(
      (medicine) => medicine._id == medicineId
    );

    if (isMedicineAdded) {
      return res.status(400).json({ message: "Medicine already added" });
    }

    const medicine = await medicineModel.findById(medicineId);

    // Push the new medicine ID into the prescription's prescription array
    prescription.prescription.push({
      _id: medicine._id,
      drug: medicine.name,
      dosage: medicine.dosage,
      quantity: "1 tab",
    });

    // Save the updated prescription
    await prescription.save();

    res
      .status(200)
      .json({ message: "Medicine added to prescription", prescription });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/:prescriptionId/medicine/:medicineId", async (req, res) => {
  try {
    const { prescriptionId, medicineId } = req.params;

    const prescrip = await prescriptionModel.findById(prescriptionId);

    if (!prescrip) {
      return res.status(404).json({ message: "Prescription not found" });
    }


    prescrip.prescription = prescrip.prescription.filter((medicine) => {
      return medicine._id != medicineId;
    });

    await prescrip.save();

    res
      .status(200)
      .json({ message: "Medicine deleted successfully", prescrip });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
