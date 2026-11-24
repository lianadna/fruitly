import { getGlobalLiteRtPromise, loadAndCompile, loadLiteRt, Tensor } from '@litertjs/core';
import type { CompiledModel } from '@litertjs/core';

export type FruitLabel = 'fresh' | 'stale';
export type Prediction = {
  label: FruitLabel;
  confidence: number;
  isDemo: boolean;
};
export type FruitCheckResult = Prediction | { label: 'no-fruit' };

export const isDemoMode = false;

const modelDir = `${import.meta.env.BASE_URL}models`;
const size = 224;
const detectorSize = 320;
const detectorClassCount = 90;
// Indeks berbasis nol dari labels.txt yang tertanam di EfficientDet-Lite0.
const fruitClasses = new Set([51, 52, 54]); // pisang, apel, jeruk
const minFruitScore = 0.35;

async function compileModel(filename: string) {
  await (getGlobalLiteRtPromise() ?? loadLiteRt('https://cdn.jsdelivr.net/npm/@litertjs/core@2.6.0/wasm/'));
  return loadAndCompile(`${modelDir}/${filename}`, { accelerator: 'wasm' });
}

async function loadModel() {
  const response = await fetch(`${modelDir}/inference_config.json`);
  if (!response.ok) throw new Error('Konfigurasi model tidak bisa dimuat.');
  const { threshold } = await response.json() as { threshold: number };

  const model = await compileModel('fruitly_best.tflite');
  return { model, threshold };
}

async function loadDetector() {
  const model = await compileModel('efficientdet_lite0_int8.tflite');
  const scores = model.getOutputDetails().find(({ shape }) => shape[2] === detectorClassCount);
  if (!scores) {
    model.delete();
    throw new Error('Model pendeteksi buah tidak bisa dibaca.');
  }
  return { model, scoreIndex: scores.index };
}

let loading: ReturnType<typeof loadModel> | undefined;
let loadingDetector: ReturnType<typeof loadDetector> | undefined;

function readPixels(image: ImageBitmap, inputSize: number) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = inputSize;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Browser tidak bisa memproses gambar.');

  context.drawImage(image, 0, 0, inputSize, inputSize);
  const rgba = context.getImageData(0, 0, inputSize, inputSize).data;
  const rgb = new Uint8Array(inputSize * inputSize * 3);
  for (let src = 0, dst = 0; src < rgba.length; src += 4, dst += 3) {
    rgb[dst] = rgba[src];
    rgb[dst + 1] = rgba[src + 1];
    rgb[dst + 2] = rgba[src + 2];
  }
  return rgb;
}

async function runModel(model: CompiledModel, pixels: Uint8Array | Float32Array, inputSize: number, outputIndex: number) {
  const input = new Tensor(pixels, [1, inputSize, inputSize, 3]);
  try {
    const outputs = await model.run(input);
    try {
      const scores = await outputs[outputIndex].data();
      if (!(scores instanceof Float32Array)) throw new Error('Skor model tidak bisa dibaca.');
      return scores;
    } finally {
      outputs.forEach((output) => output.delete());
    }
  } finally {
    input.delete();
  }
}

async function containsFruit(image: ImageBitmap) {
  loadingDetector ??= loadDetector().catch((error: unknown) => {
    loadingDetector = undefined;
    throw error;
  });
  const { model, scoreIndex } = await loadingDetector;
  const scores = await runModel(model, readPixels(image, detectorSize), detectorSize, scoreIndex);

  // Tiap kandidat objek punya satu skor per kelas. Terima jika kelas terkuatnya adalah buah.
  for (let offset = 0; offset < scores.length; offset += detectorClassCount) {
    let bestClass = -1;
    let bestScore = minFruitScore;
    for (let category = 0; category < detectorClassCount; category++) {
      const score = scores[offset + category];
      if (score > bestScore) {
        bestClass = category;
        bestScore = score;
      }
    }
    if (fruitClasses.has(bestClass)) return true;
  }
  return false;
}

export async function predictFruit(file: File): Promise<FruitCheckResult> {
  const image = await createImageBitmap(file);
  try {
    if (!await containsFruit(image)) return { label: 'no-fruit' };

    loading ??= loadModel().catch((error: unknown) => {
      loading = undefined;
      throw error;
    });
    const { model, threshold } = await loading;
    const pixels = new Float32Array(readPixels(image, size));
    const [pStale] = await runModel(model, pixels, size, 0);
    const stale = pStale >= threshold;
    return {
      label: stale ? 'stale' : 'fresh',
      confidence: stale ? pStale : 1 - pStale,
      isDemo: false,
    };
  } finally {
    image.close();
  }
}
