import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  patient: {
    type: String,
    required: true,
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  medicines: [
    {
      quantity: {
        type: Number,
        required: true,
      },
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
