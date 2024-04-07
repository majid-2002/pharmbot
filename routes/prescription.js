import prescriptionModel from '../models/prescription.js'
import express from 'express'

const app=express()

const router=express.Router()

router.get('/' ,async(req,res)=>{
    try{
        const prescription=await prescriptionModel.find()
        res.status(200).json(prescription);
     }   
    catch(error){
        res.status(500).json({ error: error });
    }
})

router.post('/',async(req,res)=>{
    try{
        const prescription = new prescriptionModel({
            phoneno_id: req.body.phoneno_id,
            patient: req.body.patient,
            prescription:req.body.prescription
          });
          console.log(prescription)
          const newPrescription = await prescription.save();
          res.status(201).json(newPrescription);
    }
    catch{

    }
})

export default router;