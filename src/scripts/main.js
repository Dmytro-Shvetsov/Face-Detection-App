import * as tf from "@tensorflow/tfjs";
import { Webcam } from "./webcam";
import { FaceDetectionModel } from "./models";

async function detectFace(model, webcam) {
  let imageTensor = await webcam.getFrame();
  const [imageWidth, imageHeight] = imageTensor.shape.slice(0, 2);
  imageTensor = tf.expandDims(imageTensor, 0);

  try {
    const [boxes, scores, numDetections] = await model.detect(imageTensor);
    if (numDetections) {
      webcam.clearCanvas();
      for (let i = 0; i < numDetections[0]; i++) {
        if (scores[i] < 0.5) {
          continue;
        }
        const box = boxes.slice(i * 4, (i + 1) * 4);
        let [ymin, xmin, ymax, xmax] = box;
        ymin *= imageHeight;
        xmin *= imageWidth;
        ymax *= imageHeight;
        xmax *= imageWidth;
        webcam.drawRect(
          Math.min(xmin, imageWidth),
          Math.min(ymin, imageHeight),
          Math.min(xmax - xmin, imageWidth),
          Math.min(ymax - ymin, imageHeight),
          "#c1ff4d"
        );
      }
    }
  } catch (err) {
    console.log(err.message);
  }
  imageTensor.dispose();
}

async function run() {
  let webcam = new Webcam();
  await webcam.init();
  const model = new FaceDetectionModel();
  await model.load();

  // let w = tf.data.webcam(document.getElementById('vide'))
  // let a =
  while (true) {
    await detectFace(model, webcam);
  }
  // for (let i = 0; i < 3; i++) {
  //   await detectFace(model, webcam);
  // }
}

window.onload = run;
