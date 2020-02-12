import { loadGraphModel } from "@tensorflow/tfjs-converter";
import { squeeze } from "@tensorflow/tfjs";

export class FaceDetectionModel {
  constructor() {
    this._modelUrl = "/web_model/model.json";
    this.classes = ["Face"];
  }
  async load() {
    if (!this._model) {
      this._model = await loadGraphModel(this._modelUrl);
    }
  }
  async detect(tensorImages) {
    /* 
    videoElement: any video html element(video, img)
    returns: list containing [boxes, scores, numDetections]


    The given SavedModel SignatureDef contains the following input(s):
      inputs['inputs'] tensor_info:
          dtype: DT_UINT8
          shape: (-1, -1, -1, 3)
          name: image_tensor:0
    The given SavedModel SignatureDef contains the following output(s):
      outputs['detection_boxes'] tensor_info:
          dtype: DT_FLOAT
          shape: (-1, 100, 4)
          name: detection_boxes:0
      outputs['detection_classes'] tensor_info:
          dtype: DT_FLOAT
          shape: (-1, 100)
          name: detection_classes:0
      outputs['detection_multiclass_scores'] tensor_info:
          dtype: DT_FLOAT
          shape: (-1, 100, 2)
          name: detection_multiclass_scores:0
      outputs['detection_scores'] tensor_info:
          dtype: DT_FLOAT
          shape: (-1, 100)
          name: detection_scores:0
      outputs['num_detections'] tensor_info:
          dtype: DT_FLOAT
          shape: (-1)
          name: num_detections:0
      outputs['raw_detection_boxes'] tensor_info:
          dtype: DT_FLOAT
          shape: (-1, -1, 4)
          name: raw_detection_boxes:0
      outputs['raw_detection_scores'] tensor_info:
          dtype: DT_FLOAT
          shape: (-1, -1, 2)
          name: raw_detection_scores:0
  */
    if (!this._model) {
      throw Error("Error! FaceDetectionModel was not loaded.");
    }

    const outputs = await this._model.executeAsync(tensorImages);

    let predictions = [outputs[0], outputs[3], outputs[4]];
    predictions = await predictions.map(t => t.data());

    outputs.forEach(item => item.dispose());

    return Promise.all(predictions);
  }

  drawBoundingBoxes(context, boxes, scores, numDetections) {}
}
