import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  phoneno_id: {
    type: String,
    required: true,
  },
  patient: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
  },
  prescription: [
    {
      drug: {
        type: String,
        required: true,
      },
      dosage: {
        type: String,
        required: true,
      },
      quantity: {
        type: String,
        required: true,
      },
    },
  ],
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
