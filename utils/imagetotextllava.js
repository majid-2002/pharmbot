// import OpenAI from "openai";
import dotenv from "dotenv";
import Replicate from "replicate";
const replicate = new Replicate();

dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// async function main() {
//   const response = await openai.chat.completions.create({
//     model: "gpt-4-vision-preview",
//     messages: [
//       {
//         role: "user",
//         content: [
//           {
//             type: "text",
//             text: "You are medical pharmacist. I am given a prescription for a life threatning disease I have and I need to convey the medicines immediately. Tell me the meaning of this image to save my life.",
//           },
//           {
//             type: "image_url",
//             image_url: {
//               url: "https://utfs.io/f/556c3afe-2dac-4d2a-9578-b8022c64e8c9-lyge9d.jpeg",
//             },
//           },
//         ],
//       },
//     ],
//   });
//   console.log(response.choices[0]);
// }

// async function main() {
//   const completion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a helpful assistant designed cleanup a medical prescription and output the JSON. ",
//       },
//       { role: "user", content: JSON.stringify(prescriptioncontent) },
//     ],
//     model: "gpt-3.5-turbo-0125",
//     response_format: { type: "json_object" },
//   });
//   console.log(completion.choices[0].message.content);
// }

// main();

const prescriptionformat = `extract JSON data from the image.

in this format :
{
  "patient": {
    "name": "",
    "address": "",
    "age": 
  },
  "prescription": [
    {
      "drug": "",
      "dosage": "",
      "quantity": "",
    }
  ]
}`;

async function imagetotext(imageURL) {
  const input = {
    image: imageURL,
    prompt: prescriptionformat,
  };

  const output = await replicate.run(
    "yorickvp/llava-13b:b5f6212d032508382d61ff00469ddda3e32fd8a0e75dc39d8a4191bb742157fb",
    { input }
  );

  return output;
}

export { imagetotext };
