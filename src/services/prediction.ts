import { loadAndCompile, loadLiteRt, Tensor } from '@litertjs/core';

export type FruitLabel = 'fresh' | 'stale';
export type Prediction = {
  label: FruitLabel;
  confidence: number;
  isDemo: boolean;
};

export const isDemoMode = false;

const modelDir = `${import.meta.env.BASE_URL}models`;
const size = 224;

async function loadModel() {
  const response = await fetch(`${modelDir}/inference_config.json`);
  if (!response.ok) throw new Error('Konfigurasi model tidak bisa dimuat.');
  const { threshold } = await response.json() as { threshold: number };

  await loadLiteRt('https://cdn.jsdelivr.net/npm/@litertjs/core@2.6.0/wasm/');
  const model = await loadAndCompile(`${modelDir}/fruitly_best.tflite`, {
    accelerator: 'wasm',
  });
  return { model, threshold };
}

let loading: ReturnType<typeof loadModel> | undefined;

export async function predictFruit(file: File): Promise<Prediction> {
  loading ??= loadModel().catch((error: unknown) => {
    loading = undefined;
    throw error;
  });
  const { model, threshold } = await loading;

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Browser tidak bisa memproses gambar.');

  const image = await createImageBitmap(file);
  try {
    context.drawImage(image, 0, 0, size, size);
  } finally {
    image.close();
  }

  const rgba = context.getImageData(0, 0, size, size).data;
  const rgb = new Float32Array(size * size * 3);
  for (let src = 0, dst = 0; src < rgba.length; src += 4, dst += 3) {
    rgb[dst] = rgba[src];
    rgb[dst + 1] = rgba[src + 1];
    rgb[dst + 2] = rgba[src + 2];
  }

  const input = new Tensor(rgb, [1, size, size, 3]);
  try {
    const outputs = await model.run(input);
    try {
      const pStale = Number((await outputs[0].data())[0]);
      const stale = pStale >= threshold;
      return {
        label: stale ? 'stale' : 'fresh',
        confidence: stale ? pStale : 1 - pStale,
        isDemo: false,
      };
    } finally {
      outputs.forEach((output) => output.delete());
    }
  } finally {
    input.delete();
  }
}