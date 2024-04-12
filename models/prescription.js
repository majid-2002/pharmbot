import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  phoneno_id: {
    type: String,
    required: true,
  },
  imageId: {
    type: String,
    required: true,
  },
  patient: {
    name: {
      type: String,
    },
    address: {
      type: String,
      default: "",
    },
    age: {
      type: String,
      default: "0"
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
