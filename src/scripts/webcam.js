import * as tf from "@tensorflow/tfjs";

export class Webcam {
  constructor() {
    this._video = document.getElementById("camera");
    this._canvas = document.getElementById("canvas");
    this._context = this._canvas.getContext("2d");
    // this._display = document.getElementById("display");

    this._initializeUiElements();
  }
  _stop(stream) {
    stream.getTracks().forEach(track => track.stop());
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
    document.getElementById("stopButton").addEventListener(
      "click",
      () => {
        this._stop(this.video.srcObject);
      },
      false
    );
    this._video.addEventListener(
      "loadeddata",
      () => {
        this._canvas.width = this._video.videoWidth;
        this._canvas.height = this._video.videoHeight;
      },
      { once: true }
    );
  }
  drawRect(x, y, rectWidth, rectHeight, color = "red", lineWidth = 3) {
    console.log("drawing");
    console.log(x, y, rectWidth, rectHeight);
    this._context.strokeStyle = color;
    this._context.lineWidth = lineWidth;
    this._context.beginPath();
    this._context.rect(x, y, rectWidth, rectHeight);
    this._context.stroke();
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
    return await this._webcam.capture();
  }
  getVideoElement() {
    return this._video;
  }
  getCanvasElement() {
    return document.cloneNode(this._canvas);
  }
}
