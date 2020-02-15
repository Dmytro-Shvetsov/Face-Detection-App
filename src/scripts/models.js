import * as tf from "@tensorflow/tfjs";
import { loadGraphModel } from "@tensorflow/tfjs-converter";
import { isNumber, isTensor } from "./utils";

export class FaceDetectionModel {
  constructor(iouThreshold = 0.5, scoreThreshold = 0.5) {
    if (!isNumber(iouThreshold)) {
      throw TypeError("Invalid argument iouThreshold");
    }
    if (!isNumber(scoreThreshold)) {
      throw TypeError("Invalid argument scoreThreshold");
    }

    this._iouThreshold = iouThreshold;
    this._scoreThreshold = scoreThreshold;
    this._modelUrl = "/web_model/model.json";
    this._classes = ["Face"];
  }
  async load() {
    if (!this._model) {
      this._model = await loadGraphModel(this._modelUrl);
    }
  }
  async detect(tensorImages, maxOutputs = 6) {
    /* 
    videoElement: any video html element(video, img)
    returns: list containing [boxes, scores]


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
    if (!isTensor(tensorImages)) {
      throw TypeError("Invalid argument tensorImages");
    }
    if (!isNumber(maxOutputs)) {
      throw TypeError("Invalid argument maxOutputs");
    }
    if (!this._model) {
      throw Error("Error! FaceDetectionModel was not loaded.");
    }

    let outputs = await this._model.executeAsync(tensorImages);
    let [boxes, scores] = [outputs[0].squeeze(), outputs[3].squeeze()];
    const {
      selectedIndices,
      selectedScores
    } = await tf.image.nonMaxSuppressionWithScoreAsync(
      boxes,
      scores,
      maxOutputs,
      this._iouThreshold,
      this._scoreThreshold
    );
    const selectedBoxes = tf.gather(boxes, selectedIndices);

    const [boxesData, scoresData] = await Promise.all([
      selectedBoxes.data(),
      selectedScores.data()
    ]);

    outputs.forEach(item => item.dispose());
    boxes.dispose();
    scores.dispose();
    selectedIndices.dispose();
    selectedBoxes.dispose();
    return [boxesData, scoresData];
  }
  dispose() {
    if (this._model) {
      this._model.dispose();
    }
  }
}
