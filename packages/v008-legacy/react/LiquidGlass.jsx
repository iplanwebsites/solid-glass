import React, { useRef, useEffect } from 'react';
import { LiquidGlass } from '../core/LiquidGlass.js';
import { hexToRgb } from '../core/utils.js';

export const LiquidGlassReact = ({
  children,
  shadowColor = 'rgba(255, 255, 255, 0.7)',
  shadowBlur = 7,
  shadowSpread = 0,
  shadowOffset = 0,
  tintColor = '#ffffff',
  tintOpacity = 0.04,
  frostBlur = 2,
  noiseFrequency = 0.008,
  distortionStrength = 77,
  borderRadius = 28,
  width = '300px',
  height = '200px',
  className = '',
  style = {},
  ...props
}) => {
  const elementRef = useRef(null);
  const glassRef = useRef(null);
  
  useEffect(() => {
    if (elementRef.current) {
      const options = {
        shadowColor,
        shadowBlur,
        shadowSpread,
        shadowOffset,
        tintColor: tintColor.startsWith('#') ? hexToRgb(tintColor) : tintColor,
        tintOpacity,
        frostBlur,
        noiseFrequency,
        distortionStrength,
        borderRadius
      };
      
      glassRef.current = new LiquidGlass(elementRef.current, options);
    }
    
    return () => {
      if (glassRef.current) {
        glassRef.current.destroy();
      }
    };
  }, []);
  
  // Update on prop changes
  useEffect(() => {
    if (glassRef.current) {
      const options = {
        shadowColor,
        shadowBlur,
        shadowSpread,
        shadowOffset,
        tintColor: tintColor.startsWith('#') ? hexToRgb(tintColor) : tintColor,
        tintOpacity,
        frostBlur,
        noiseFrequency,
        distortionStrength,
        borderRadius
      };
      
      Object.entries(options).forEach(([key, value]) => {
        glassRef.current.updateOption(key, value);
      });
    }
  }, [shadowColor, shadowBlur, shadowSpread, shadowOffset, tintColor, tintOpacity, frostBlur, noiseFrequency, distortionStrength, borderRadius]);
  
  return (
    <div 
      ref={elementRef}
      className={`solid-glass-wrapper ${className}`}
      style={{ width, height, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};