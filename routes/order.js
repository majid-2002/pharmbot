import express from "express";
import orderModel from "../models/order.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const order = new orderModel({
      medicines: req.body.medicines,
      total: req.body.total,
      patient: req.body.patient,
      status: req.body.status,
      pharmacy: req.body.pharmacy,
    });
    const newOrder = await order.save();
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
