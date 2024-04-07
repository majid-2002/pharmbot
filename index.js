import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";
import fs from "fs";
import mongoose from "mongoose";
import { imagetotext } from "./utils/imagetotextllava.js";
import prescriptionModel from "./models/prescription.js";

const app = express().use(bodyParser.json());

const verify_token = process.env.VERIFY_TOKEN;
const access_token = process.env.ACCESS_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

const PORT = process.env.PORT || 8000;

mongoose.set("strictQuery", true);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, async () => {
  console.log("Server is running on port " + PORT);
});

app.get("/", (req, res) => {
  res.status(200).send("200 | Server Running");
});

app.get("/webhook", (req, res) => {
  try {
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];

    console.log(mode, challenge, token);

    if (mode && token) {
      if (mode === "subscribe" && token === verify_token) {
        res.status(200).send(challenge);
      } else {
        res.status(403);
      }
    }
  } catch (error) {
    console.error({ error });
    return res.sendStatus(500);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    let body_param = req.body;

    // console.log(JSON.stringify(body_param, null, 2));

    if (
      body_param.object &&
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phone_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg = body_param.entry[0].changes[0].value.messages[0];

      if (msg.type === "text" && msg.text) {
        // welcome message
        if (
          msg.text.body === "hi" ||
          msg.text.body === "Hi" ||
          msg.text.body === "hello" ||
          msg.text.body === "Hello"
        ) {
          await axios({
            method: "POST",
            url:
              "https://graph.facebook.com/v13.0/" +
              phone_no_id +
              "/messages?access_token=" +
              access_token,
            data: {
              messaging_product: "whatsapp",
              to: from,
              type: "text",
              text: {
                body: "Hello, Please send you medical prescription for buying the medicines.",
              },
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          });
        }
      }

      if (msg.type === "image" && msg.image) {
        // Retrieve media URL
        let mediaId = msg.image.id;
        let mediaUrl = await getMediaUrl(mediaId);
        let mediaData = await downloadMedia(mediaUrl);

        fs.writeFileSync("./media/" + mediaId + ".jpeg", mediaData);

        // {
        //   patient: {
        //     name: "John Smith",
        //     address: "1662 Emply St, NY, NY, USA",
        //     age: 34,
        //   },
        //   prescription: [
        //     {
        //       drug: "Beta-Lactam 100 mg-1 tab BID",
        //       dosage: "100 mg-1 tab BID",
        //       quantity: "1 tab BID",
        //     },
        //     {
        //       drug: "Doxycycline 100 mg-2 tab TD",
        //       dosage: "100 mg-2 tab TD",
        //       quantity: "2 tab TD",
        //     },
        //     {
        //       drug: "Cimetidine 50 mg-1 tab QID",
        //       dosage: "50 mg-1 tab QID",
        //       quantity: "1 tab QID",
        //     },
        //     {
        //       drug: "Oxpeprazole 50 mg-1 tab QD",
        //       dosage: "50 mg-1 tab QD",
        //       quantity: "1 tab QD",
        //     },
        //   ],
        // };
        // Convert image to text
        let prescriptionData = JSON.parse(
          await imagetotext("./media/" + mediaId + ".jpeg")
        );

        const prescriptionInstance = new prescriptionModel({
          patient: prescriptionData.patient,
          prescription: prescriptionData.prescription,
        });

        prescriptionInstance
          .save()
          .then((savedPrescription) => {
            console.log("Prescription saved successfully:", savedPrescription);
          })
          .catch((error) => {
            console.error("Error saving prescription:", error);
          });

        // Send a confirmation message
        await axios({
          method: "POST",
          url:
            "https://graph.facebook.com/v13.0/" +
            phone_no_id +
            "/messages?access_token=" +
            access_token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: {
              body: "Your prescription has been received. We will get back to you shortly.",
            },
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error({ error });
    return res.sendStatus(500);
  }
});

async function getMediaUrl(mediaId) {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${mediaId}/`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return response.data.url;
  } catch (error) {
    console.error("Error retrieving media URL:", error);
    throw error;
  }
}

async function downloadMedia(mediaUrl) {
  try {
    const response = await axios.get(mediaUrl, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading media:", error);
    throw error;
  }
}
