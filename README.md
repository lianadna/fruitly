# Fruitly — Fruit Freshness Detection

**A smarter way to check fruit freshness.**

Fruitly is a web-based application that uses **Convolutional Neural Networks (CNN)** to classify fruit freshness through image analysis. By simply uploading a fruit image, users can receive a prediction indicating whether the fruit is **Fresh** or **Stale**.

This project is developed as part of the **Computer Vision and Image Processing** course at IPB University.

## Features

- **Fruit Image Upload** — Upload fruit images directly from your device.
- **AI-Powered Detection** — Analyze fruit images using a CNN-based classification model.
- **Freshness Classification** — Classify fruits into two categories: Fresh and Stale.
- **Confidence Score** — Display the model's prediction confidence.
- **Responsive Design** — Provide a seamless experience across desktop and mobile devices.
- **User-Friendly Interface** — A clean, modern, and intuitive interface.

> **Note:** Fruitly is currently under development. The features listed above represent the planned functionality.

## Tech Stack

| Category | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Backend | Python, FastAPI |
| Deep Learning | TensorFlow, Keras |
| Model | Convolutional Neural Network (CNN) |

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

1. Clone the repository.

   ```bash
   git clone https://github.com/lianadna/fruitly.git
   ```

2. Navigate to the project directory.

   ```bash
   cd fruitly
   ```

3. Install dependencies.

   ```bash
   npm install
   ```

4. Start the development server.

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, usually `http://localhost:5173/`.

## How It Works

Fruitly follows a simple image classification workflow:

1. **Upload Image** — The user uploads a fruit image.
2. **Image Preprocessing** — The image is resized and normalized according to the CNN model's input requirements.
3. **CNN Prediction** — The trained model analyzes the image and predicts its freshness category.
4. **Classification Result** — The application displays the predicted category and confidence score.

### Classification Categories

| Category | Description |
|---|---|
| Fresh | Fruit predicted to be in a fresh condition |
| Stale | Fruit predicted to be in a non-fresh condition |

## Dataset

The CNN model will use the **Fresh and Stale Classification** dataset available on Kaggle.

**Dataset:** [Fresh and Stale Classification — Kaggle](https://www.kaggle.com/datasets/swoyam2609/fresh-and-stale-classification/data)

The dataset contains fruit images categorized by freshness condition for image classification tasks.
