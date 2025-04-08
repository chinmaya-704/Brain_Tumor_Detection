import React, { useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";

export default function MRIClassifier() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setPrediction(null);
    setError(null);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md p-4">
        <CardContent className="flex flex-col items-center space-y-4">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={!file || loading} variant="contained">
            {loading ? "Processing..." : "Upload & Classify"}
          </Button>

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
