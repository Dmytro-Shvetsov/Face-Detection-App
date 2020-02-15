import { Tensor } from "@tensorflow/tfjs";

export function isNumber(arg) {
  return typeof arg === "number";
}

export function isTensor(arg) {
  return typeof arg === "Tensor" || arg instanceof Tensor;
}

export function isTypedArray(arg) {
  return !!(arg.buffer instanceof ArrayBuffer && arg.BYTES_PER_ELEMENT);
}
