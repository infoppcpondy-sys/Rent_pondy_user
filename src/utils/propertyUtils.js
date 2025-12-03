// Utility helpers extracted from AddProperty.jsx
// Keep these small, pure, and well-documented so other components can reuse them.

import { toWords } from 'number-to-words';

export function convertToIndianRupees(num) {
  const number = parseInt(num, 10);
  if (isNaN(number)) return "";

  if (number >= 10000000) {
    return (number / 10000000).toFixed(2).replace(/\.00$/, '') + " crores";
  } else if (number >= 100000) {
    return (number / 100000).toFixed(2).replace(/\.00$/, '') + " lakhs";
  } else {
    return toWords(number).replace(/\b\w/g, l => l.toUpperCase()) + " rupees";
  }
}

export function convertToWords(num) {
  const number = parseInt(num, 10);
  if (isNaN(number)) return "";

  if (number >= 10000000) {
    return (number / 10000000).toFixed(2).replace(/\.00$/, '') + " crores";
  } else if (number >= 100000) {
    return (number / 100000).toFixed(2).replace(/\.00$/, '') + " lakhs";
  } else {
    return toWords(number).replace(/\b\w/g, l => l.toUpperCase());
  }
}

// Parse coordinate input like "11.7540° N, 79.7619° E" into { lat, lng }
export function parseLatLngString(input) {
  if (!input || typeof input !== 'string') return null;
  const match = input.match(/([\-\d.]+)[^\dNS]*([NS]),\s*([\-\d.]+)[^\dEW]*([EW])/i);
  if (!match) return null;

  let lat = parseFloat(match[1]);
  const latDir = match[2].toUpperCase();
  let lng = parseFloat(match[3]);
  const lngDir = match[4].toUpperCase();

  if (latDir === 'S') lat = -lat;
  if (lngDir === 'W') lng = -lng;

  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}

// Apply a centered watermark text to an image File and return a new File (Promise)
export function applyImageWatermark(file, watermarkText = 'Rent Pondy') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const fontSize = Math.max(24, Math.floor(canvas.width / 15));
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;

          // Outline then fill for readability
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 4;
          ctx.strokeText(watermarkText, centerX, centerY);

          ctx.fillStyle = 'rgba(224, 223, 223, 0.9)';
          ctx.fillText(watermarkText, centerX, centerY);

          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Failed to create blob from canvas'));
            const watermarkedFile = new File([blob], file.name, { type: file.type });
            resolve(watermarkedFile);
          }, file.type);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = event.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
