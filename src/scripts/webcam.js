import * as tf from "@tensorflow/tfjs";
import { isTypedArray } from "./utils";

export class Webcam {
  constructor() {
    this._video = document.getElementById("camera");
    this._canvas = document.getElementById("canvas");
    this._context = this._canvas.getContext("2d");
    // this._display = document.getElementById("display");

    this._initializeUiElements();
  }
  async init() {
    await this._initNavigatorMedia();

    this._webcam = await tf.data.webcam(this._video);
    this._video.play();
  }

  async _initNavigatorMedia() {
    navigator.getMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    await navigator.getMedia(
      {
        video: true,
        audio: false
      },
      stream => {
        this._video.srcObject = stream;
      },
      function(error) {
        console.log(error.code);
      }
    );
  }
  _initializeUiElements() {
    this._video.addEventListener(
      "loadeddata",
      () => {
        this._canvas.width = this._video.videoWidth;
        this._canvas.height = this._video.videoHeight;
      },
      { once: true }
    );
  }
  _drawRect(x, y, rectWidth, rectHeight, color = "red", lineWidth = 3) {
    // console.log("drawing");
    // console.log(x, y, rectWidth, rectHeight);
    this._context.strokeStyle = color;
    this._context.lineWidth = lineWidth;
    this._context.beginPath();
    this._context.rect(x, y, rectWidth, rectHeight);
    this._context.stroke();
  }
  drawBoundingBoxes(boxes, scores) {
    if (!isTypedArray(boxes)) {
      throw TypeError("Invalid argument boxes");
    }
    if (!isTypedArray(scores)) {
      throw TypeError("Invalid argument scores");
    }
    const numDetections = scores.length;
    if (numDetections != 0) {
      const imageWidth = this._video.videoWidth;
      const imageHeight = this._video.videoHeight;
      for (let i = 0; i < boxes.length; i++) {
        if (!scores[i]) {
          break;
        }
        const box = boxes.slice(i * 4, (i + 1) * 4);
        let [ymin, xmin, ymax, xmax] = box;
        ymin *= imageHeight;
        xmin *= imageWidth;
        ymax *= imageHeight;
        xmax *= imageWidth;
        this._drawRect(
          Math.min(xmin, imageWidth),
          Math.min(ymin, imageHeight),
          Math.min(xmax - xmin, imageWidth),
          Math.min(ymax - ymin, imageHeight),
          "#c1ff4d"
        );
      }
    }
  }
  clearCanvas() {
    this._context.clearRect(
      0,
      0,
      this._video.videoWidth,
      this._video.videoHeight
    );
  }
  resetVideo() {
    this._video = document.getElementById("camera");
  }
  async getFrame() {
    return this._webcam.capture();
  }
  getCanvasElement() {
    return document.cloneNode(this._canvas);
  }
}
