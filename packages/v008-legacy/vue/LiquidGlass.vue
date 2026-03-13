<template>
  <div 
    ref="glassElement" 
    class="solid-glass-wrapper"
    :style="wrapperStyles"
  >
    <slot></slot>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { LiquidGlass } from '../core/LiquidGlass.js';
import { hexToRgb } from '../core/utils.js';

export default {
  name: 'LiquidGlass',
  props: {
    shadowColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.7)'
    },
    shadowBlur: {
      type: Number,
      default: 7
    },
    shadowSpread: {
      type: Number,
      default: 0
    },
    shadowOffset: {
      type: Number,
      default: 0
    },
    tintColor: {
      type: String,
      default: '#ffffff'
    },
    tintOpacity: {
      type: Number,
      default: 0.04
    },
    frostBlur: {
      type: Number,
      default: 2
    },
    noiseFrequency: {
      type: Number,
      default: 0.008
    },
    distortionStrength: {
      type: Number,
      default: 77
    },
    borderRadius: {
      type: Number,
      default: 28
    },
    width: {
      type: String,
      default: '300px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  setup(props) {
    const glassElement = ref(null);
    let glassInstance = null;
    
    const wrapperStyles = computed(() => ({
      width: props.width,
      height: props.height
    }));
    
    const options = computed(() => ({
      shadowColor: props.shadowColor,
      shadowBlur: props.shadowBlur,
      shadowSpread: props.shadowSpread,
      shadowOffset: props.shadowOffset,
      tintColor: props.tintColor.startsWith('#') ? hexToRgb(props.tintColor) : props.tintColor,
      tintOpacity: props.tintOpacity,
      frostBlur: props.frostBlur,
      noiseFrequency: props.noiseFrequency,
      distortionStrength: props.distortionStrength,
      borderRadius: props.borderRadius
    }));
    
    onMounted(() => {
      if (glassElement.value) {
        glassInstance = new LiquidGlass(glassElement.value, options.value);
      }
    });
    
    onUnmounted(() => {
      if (glassInstance) {
        glassInstance.destroy();
      }
    });
    
    // Watch for prop changes
    watch(options, (newOptions) => {
      if (glassInstance) {
        Object.entries(newOptions).forEach(([key, value]) => {
          glassInstance.updateOption(key, value);
        });
      }
    }, { deep: true });
    
    return {
      glassElement,
      wrapperStyles
    };
  }
};
</script>

<style scoped>
.solid-glass-wrapper {
  position: relative;
}
</style>