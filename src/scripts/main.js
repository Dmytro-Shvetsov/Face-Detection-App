import * as tf from "@tensorflow/tfjs";
import { Webcam } from "./webcam";
import { FaceDetectionModel } from "./models";

async function detectFaces(model, webcam) {
  try {
    let imageTensor = await webcam.getFrame();
    imageTensor = tf.expandDims(imageTensor, 0);
    const [boxes, scores] = await model.detect(imageTensor);
    webcam.clearCanvas();
    webcam.drawBoundingBoxes(boxes, scores);
    imageTensor.dispose();
  } catch (err) {
    console.log(err.message);
  }
}

async function run() {
  let webcam = new Webcam();
  await webcam.init();
  const model = new FaceDetectionModel();
  await model.load();
  const detectionInterval = 100;
  let timerId = setTimeout(
    async function startDetection(model, webcam) {
      tf.engine().startScope();
      await detectFaces(model, webcam);
      tf.engine().endScope();
      timerId = setTimeout(startDetection, 10, model, webcam);
    },
    10,
    model,
    webcam
  );
}

window.onload = run;
