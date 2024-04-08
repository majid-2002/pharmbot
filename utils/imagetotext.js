import { createWorker } from 'tesseract.js';


(async () => {
  const worker = await createWorker('eng');
  const ret = await worker.recognize('./media/image2.jpeg');
  console.log(ret.data.text);
  await worker.terminate();
})();