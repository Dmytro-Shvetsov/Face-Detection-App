import * as tf from "@tensorflow/tfjs";
import { Webcam } from "./webcam";
import { FaceDetectionModel } from "./models";

// async function play(model, videoElement) {
//   const canvas = document.createElement("canvas");

//   let tensorElement = tf.expandDims(tf.browser.fromPixels(videoElement), 0);
//   const [width, height] = tensorElement.shape.slice(1, 3);

//   const [boxes, scores, numDetections] = await model.detect(tensorElement);

// console.log(boxes, boxes.shape);
// console.log(scores, scores.shape);
// console.log(numDetections);
// const [width, height] = tensorElement.shape.slice(1, 3);
// console.log(width, height);
// }

async function run() {
  let webcam = new Webcam();
  const model = new FaceDetectionModel();
  await model.load();

  const el = document.getElementById("img");
}

document.addEventListener("DOMContentLoaded", run);
