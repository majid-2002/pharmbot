import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";
import fs from "fs";

const router = express().use(bodyParser.json());

const verify_token = process.env.VERIFY_TOKEN;
const access_token = process.env.ACCESS_TOKEN;

const PORT = process.env.PORT || 8000;

router.listen(PORT, async () => {
  console.log("Server is running on port " + PORT);
});

router.get("/", (req, res) => {
  res.status(200).send("200 | Server Running");
});

router.get("/webhook", (req, res) => {
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

router.post("/webhook", async (req, res) => {
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

      if (msg.type === "image" && msg.image) {
        // Retrieve media URL
        let mediaId = msg.image.id;
        let mediaUrl = await getMediaUrl(mediaId);
        let mediaData = await downloadMedia(mediaUrl);

        fs.writeFileSync("./media/" + mediaId + ".jpeg", mediaData);

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
              body: "Image received and saved successfully.",
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
