import React, { useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function MRIClassifier() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add drag state
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setPrediction(null);
    setError(null);
  };

  // Drag event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setPrediction(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to classify image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[url('/back.jpg')] bg-cover bg-center">

      <Card className="w-full max-w-md shadow-lg ">

        <CardContent className="flex flex-col items-center space-y-4 bg-gradient-to-r from-blue-200 to-purple-300 p-6 rounded-lg">

          <div
            className={`w-full flex flex-col items-center border-2 border-dashed rounded-md p-4 transition-colors ${dragActive ? "border-blue-500 bg-blue-100" : "border-slate-400 bg-slate-100"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label className="w-full flex flex-col items-center cursor-pointer">
              <input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <span className="mt-2 bg-slate-400 rounded-md px-3 py-1 text-gray-800">
                {file ? file.name : "Choose an image"}
              </span>
            </label>
            <p className="text-gray-600 mt-2"><b>Drag & drop</b> an image here, or <b>Click to Select</b></p>
          </div>

          <button className="mb-4 border-2 border-teal-500 bg-lime-300 py-2 px-3 rounded-lg active:bg-lime-200 hover:bg-lime-400 font-bold text-teal-800" onClick={handleUpload} disabled={!file || loading} variant="contained">
            {loading ? "Processing..." : "Upload & Classify"}
          </button>

          {error && <p className="text-red-500">{error}</p>}

          {prediction && (
            <div className="mt-4 text-center">
              <Typography variant="h6">Prediction:</Typography>
              <Typography>Class: {prediction.class}</Typography>
              <Typography>Confidence: {(prediction.confidence * 100).toFixed(2)}%</Typography>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
