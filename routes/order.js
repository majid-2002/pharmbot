import orderModel from '../models/order.js'
import express from "express";
const app=express()

const router=express.Router()

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
        patient: req.body.patient,
        pharmacy: req.body.pharmacy,
        status: req.body.status,
        medicines: req.body.medicines,
        total: req.body.total,
      });
      const newOrder = await order.save();
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

  export default router;