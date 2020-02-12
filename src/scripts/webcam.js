export class Webcam {
  constructor() {
    this.display = document.getElementById("display");
    this.video = document.getElementById("camera");
    this.canvas = document.getElementById("canvas");
    this.context = canvas.getContext("2d");

    this.context.beginPath();
    this.context.rect(30, 30, 150, 150);
    this.context.stroke();
    this._set_navigator_media();

    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      stream => {
        this.video.srcObject = stream;
        this.video.play();
      },
      function(error) {
        console.log(error.code);
      }
    );
    this.video.addEventListener("play", () =>
      this.draw(this.video, this.context)
    );
    const camera_off = document.getElementById("stopButton");
    camera_off.addEventListener(
      "click",
      () => {
        this._stop(this.video.srcObject);
      },
      false
    );
  }
  _stop(stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  _set_navigator_media() {
    navigator.getMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
  }
}
