export class LiquidGlass {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      // Inner shadow
      shadowColor: 'rgba(255, 255, 255, 0.7)',
      shadowBlur: 7,
      shadowSpread: 0,
      shadowOffset: 0,
      
      // Glass tint
      tintColor: '255, 255, 255',
      tintOpacity: 0.04,
      
      // Frost blur
      frostBlur: 2,
      
      // Noise distortion
      noiseFrequency: 0.008,
      distortionStrength: 77,
      
      // Shape
      borderRadius: 28,
      
      ...options
    };
    
    this.svgId = `glass-distortion-${Math.random().toString(36).substr(2, 9)}`;
    this.init();
  }
  
  init() {
    this.element.classList.add('solid-glass');
    this.createSVGFilter();
    this.updateStyles();
  }
  
  createSVGFilter() {
    if (!document.getElementById(this.svgId)) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');
      svg.style.position = 'absolute';
      svg.style.overflow = 'hidden';
      
      svg.innerHTML = `
        <defs>
          <filter id="${this.svgId}" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="${this.options.noiseFrequency} ${this.options.noiseFrequency}" numOctaves="2" seed="92" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap in="SourceGraphic" in2="blurred" scale="${this.options.distortionStrength}" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      `;
      
      document.body.appendChild(svg);
    }
  }
  
  updateStyles() {
    const styles = {
      '--lg-shadow-color': this.options.shadowColor,
      '--lg-shadow-blur': `${this.options.shadowBlur}px`,
      '--lg-shadow-spread': `${this.options.shadowSpread}px`,
      '--lg-shadow-offset': this.options.shadowOffset,
      '--lg-tint-color': this.options.tintColor,
      '--lg-tint-opacity': this.options.tintOpacity,
      '--lg-frost-blur': `${this.options.frostBlur}px`,
      '--lg-border-radius': `${this.options.borderRadius}px`,
      '--lg-filter-id': `url(#${this.svgId})`
    };
    
    Object.entries(styles).forEach(([prop, value]) => {
      this.element.style.setProperty(prop, value);
    });
  }
  
  updateOption(key, value) {
    this.options[key] = value;
    
    if (key === 'noiseFrequency' || key === 'distortionStrength') {
      this.updateSVGFilter();
    }
    
    this.updateStyles();
  }
  
  updateSVGFilter() {
    const filter = document.getElementById(this.svgId);
    if (filter) {
      const turbulence = filter.querySelector('feTurbulence');
      const displacement = filter.querySelector('feDisplacementMap');
      
      if (turbulence) {
        turbulence.setAttribute('baseFrequency', `${this.options.noiseFrequency} ${this.options.noiseFrequency}`);
      }
      
      if (displacement) {
        displacement.setAttribute('scale', this.options.distortionStrength);
      }
    }
  }
  
  destroy() {
    this.element.classList.remove('solid-glass');
    const svg = document.getElementById(this.svgId)?.parentElement;
    if (svg) {
      svg.remove();
    }
  }
}