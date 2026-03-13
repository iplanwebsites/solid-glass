export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '255, 255, 255';
}

export function rgbToHex(rgb) {
  const parts = rgb.split(',').map(p => parseInt(p.trim()));
  return '#' + parts.map(p => p.toString(16).padStart(2, '0')).join('');
}