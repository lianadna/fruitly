export type FruitLabel = 'fresh' | 'stale';

export type Prediction = {
  label: FruitLabel;
  confidence: number; // 0..1
  isDemo: boolean;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
export const isDemoMode = !API_BASE_URL;

/**
 * Mode demo: hasil dipilih pengguna agar tidak menyesatkan sebagai prediksi nyata.
 * Mode API: POST multipart/form-data dengan field "file" ke /api/predict.
 * Respons yang didukung: { prediction: "fresh" | "stale", confidence: 0.94 }.
 */
export async function predictFruit(file: File, simulatedLabel: FruitLabel): Promise<Prediction> {
  if (!API_BASE_URL) {
    await new Promise((resolve) => window.setTimeout(resolve, 750));
    return { label: simulatedLabel, confidence: simulatedLabel === 'fresh' ? 0.94 : 0.91, isDemo: true };
  }

  const body = new FormData();
  body.append('file', file);
  const response = await fetch(`${API_BASE_URL}/api/predict`, { method: 'POST', body });
  if (!response.ok) throw new Error(`Foto belum bisa diperiksa (kode ${response.status}). Coba lagi sebentar lagi.`);
  const json: unknown = await response.json();
  if (!json || typeof json !== 'object') throw new Error('Hasil dari server tidak bisa dibaca. Coba lagi sebentar lagi.');
  const data = json as Record<string, unknown>;
  const label = String(data.prediction ?? data.label ?? '').toLowerCase();
  const confidence = Number(data.confidence);
  if ((label !== 'fresh' && label !== 'stale') || !Number.isFinite(confidence)) {
    throw new Error('Hasil dari server tidak lengkap. Coba lagi sebentar lagi.');
  }
  return { label, confidence: Math.max(0, Math.min(1, confidence > 1 ? confidence / 100 : confidence)), isDemo: false };
}
