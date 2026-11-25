import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps

model_dir = Path(__file__).resolve().parent / "models"
config = json.loads(
    (model_dir / "inference_config.json").read_text(encoding="utf-8")
)
model = tf.keras.models.load_model(model_dir / config["model_file"], compile=False)
max_resize_side = 2048

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fruitlyai.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["POST"],
)


@app.post("/api/predict")
def predict(file: UploadFile = File(...)):
    try:
        with Image.open(file.file) as image:
            rgb = ImageOps.exif_transpose(image).convert("RGB")
            rgb.thumbnail((max_resize_side, max_resize_side), Image.Resampling.BILINEAR)
            pixels = np.asarray(rgb, dtype=np.float32)
    except (OSError, Image.DecompressionBombError) as error:
        raise HTTPException(400, "File gambar tidak bisa dibaca.") from error

    batch = tf.image.resize(pixels, config["input"]["size"], antialias=True)[None, ...]
    p_stale = float(model(batch, training=False).numpy()[0, 0])
    stale = p_stale >= float(config["threshold"])

    return {
        "prediction": config["labels"]["1" if stale else "0"],
        "confidence": p_stale if stale else 1 - p_stale,
        "p_stale": p_stale,
    }
