import pharmacyModel from '../models/pharmacy.js'
import express from "express";
const app=express()

app.use(express.json());

const router = express.Router();

router.get('/' ,async(req,res)=>{
    try{
        const pharmacy=await pharmacyModel.find()
        res.status(200).json(pharmacy);
     }   
    catch(error){
        res.status(500).json({ error: error });
    }
})

router.post('/',async(req,res)=>{
    try{
        const pharmacy = new pharmacyModel({
            name: req.body.name,
            address: req.body.address,
            phone:req.body.phone
          });
          console.log(pharmacy)
          const newPharmacy = await pharmacy.save();
          res.status(201).json(newPharmacy);
    }
    catch{

    }
})

export default router;