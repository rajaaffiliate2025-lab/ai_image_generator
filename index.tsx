/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import './index.css';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setLoading(true);
    setImageUrl('');
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        const url = `data:image/png;base64,${base64ImageBytes}`;
        setImageUrl(url);
      } else {
        setError('No image was generated. Please try a different prompt.');
      }
    } catch (e) {
      setError(`An error occurred: ${e.message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>AI Image Generator</h1>
      <div className="prompt-container">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to generate an image, e.g., 'A robot holding a red skateboard.'"
          aria-label="Image prompt"
          disabled={loading}
        />
        <button onClick={generateImage} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      <div className="result-container" aria-live="polite">
        {loading && <div className="loading-spinner" aria-label="Loading"></div>}
        {error && <p className="error-message" role="alert">{error}</p>}
        {imageUrl && !loading && !error && (
          <img src={imageUrl} alt={prompt} />
        )}
        {!loading && !imageUrl && !error && (
            <p className="placeholder">Your generated image will appear here.</p>
        )}
      </div>
    </>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
