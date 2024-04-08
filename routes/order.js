import express from "express";
import orderModel from "../models/order.js";
import prescriptionModel from "../models/prescription.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/:prescriptionId", async (req, res) => {
  console.log("works");

  const prescription = await prescriptionModel.findById(
    req.params.prescriptionId
  );

  if (!prescription) {
    return res.status(404).json({ error: "Prescription not found" });
  }

  // Calculate total price based on medicines in the prescription
  const total = prescription.prescription.reduce((acc, med) => {
    return acc + 30;
  }, 0);

  try {
    const newOrder = new orderModel({
      patient: prescription.patient.name,
      status: "completed",
      medicines: prescription.prescription.map((med) => ({
        drug: med.drug,
        dosage: med.dosage,
        quantity: med.quantity,
        price: 30,
      })),
      total: total,
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (req.body.status) {
      order.status = req.body.status;
    }
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
