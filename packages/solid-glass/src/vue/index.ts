import {
  defineComponent,
  h,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  type PropType,
} from "vue";
import type { GlassOptions, TemplateName, TemplatePresetName } from "../types";
import { renderGlass } from "../render-glass";
import { injectSvgFilter, ensureStyles } from "../dom";

/**
 * Vue 3 Glass component — flat props, auto CSS, auto fallback.
 *
 * @example
 * ```vue
 * <template>
 *   <Glass template="frosted" :blur="16">
 *     <p>Behind the glass</p>
 *   </Glass>
 *
 *   <Glass template="auroraNorth" :paused="true">
 *     <p>Paused aurora</p>
 *   </Glass>
 * </template>
 *
 * <script setup>
 * import { Glass } from "solid-glass/vue";
 * </script>
 * ```
 */
export const Glass = defineComponent({
  name: "Glass",
  props: {
    template: { type: String as PropType<TemplateName | TemplatePresetName>, default: "frosted" },
    as: { type: String, default: "div" },
    fallback: { type: String as PropType<TemplateName>, default: undefined },
    // All glass options as flat props
    blur: { type: Number, default: undefined },
    opacity: { type: Number, default: undefined },
    borderRadius: { type: Number, default: undefined },
    tintColor: { type: String, default: undefined },
    tintOpacity: { type: Number, default: undefined },
    borderColor: { type: String, default: undefined },
    borderWidth: { type: Number, default: undefined },
    borderOpacity: { type: Number, default: undefined },
    shadowColor: { type: String, default: undefined },
    shadowBlur: { type: Number, default: undefined },
    shadowSpread: { type: Number, default: undefined },
    distortion: { type: Number, default: undefined },
    noiseFrequency: { type: Number, default: undefined },
    noiseOctaves: { type: Number, default: undefined },
    noiseSeed: { type: Number, default: undefined },
    turbulence: { type: Number, default: undefined },
    surface: { type: String as PropType<GlassOptions["surface"]>, default: undefined },
    refractiveIndex: { type: Number, default: undefined },
    bezelWidth: { type: Number, default: undefined },
    glassThickness: { type: Number, default: undefined },
    specularOpacity: { type: Number, default: undefined },
    specularAngle: { type: Number, default: undefined },
    width: { type: Number, default: undefined },
    height: { type: Number, default: undefined },
    saturation: { type: Number, default: undefined },
    brightness: { type: Number, default: undefined },
    contrast: { type: Number, default: undefined },
    hueRotate: { type: Number, default: undefined },
    colors: { type: Array as PropType<string[]>, default: undefined },
    colorOpacity: { type: Number, default: undefined },
    gradientAngle: { type: Number, default: undefined },
    colorBlend: { type: String as PropType<GlassOptions["colorBlend"]>, default: undefined },
    animated: { type: Boolean, default: undefined },
    animationSpeed: { type: Number, default: undefined },
    animationEasing: { type: String as PropType<GlassOptions["animationEasing"]>, default: undefined },
    bounciness: { type: Number, default: undefined },
    paused: { type: Boolean, default: undefined },
    colorScheme: { type: String as PropType<GlassOptions["colorScheme"]>, default: undefined },
  },
  setup(props, { slots }) {
    let cleanupSvg: (() => void) | null = null;

    onMounted(() => ensureStyles());

    const overrides = computed<GlassOptions>(() => {
      const o: GlassOptions = {};
      // Only include explicitly set props (excluding style/className which aren't Vue props)
      const keys = [
        "blur", "opacity", "borderRadius", "tintColor", "tintOpacity",
        "borderColor", "borderWidth", "borderOpacity",
        "shadowColor", "shadowBlur", "shadowSpread",
        "distortion", "noiseFrequency", "noiseOctaves", "noiseSeed", "turbulence",
        "surface", "refractiveIndex", "bezelWidth", "glassThickness",
        "specularOpacity", "specularAngle", "width", "height",
        "saturation", "brightness", "contrast", "hueRotate",
        "colors", "colorOpacity", "gradientAngle", "colorBlend",
        "animated", "animationSpeed", "animationEasing", "bounciness", "paused",
        "colorScheme",
      ] as const;
      for (const key of keys) {
        const val = (props as Record<string, unknown>)[key];
        if (val !== undefined) (o as Record<string, unknown>)[key] = val;
      }
      return o;
    });

    const generated = computed(() => renderGlass(props.template, overrides.value));

    function injectSvg() {
      if (cleanupSvg) {
        cleanupSvg();
        cleanupSvg = null;
      }
      const filter = generated.value.svgFilter;
      if (filter) {
        cleanupSvg = injectSvgFilter(filter);
      }
    }

    onMounted(injectSvg);
    watch(() => generated.value.svgFilter, injectSvg);
    onBeforeUnmount(() => cleanupSvg?.());

    return () => {
      const style: Record<string, string | number> = {};
      for (const [key, val] of Object.entries(generated.value.cssVars)) {
        style[key] = val;
      }
      if (generated.value.inlineStyle) Object.assign(style, generated.value.inlineStyle);
      return h(props.as, { class: generated.value.className, style }, slots.default?.());
    };
  },
});

/**
 * Vue 3 composable for applying glass effects.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useGlass } from "solid-glass/vue";
 *
 * const glass = useGlass("aurora", { colors: ["#a78bfa", "#6ee7b7"] });
 * </script>
 *
 * <template>
 *   <div :ref="glass.ref" :class="glass.className" :style="glass.style">
 *     Aurora vibes
 *   </div>
 * </template>
 * ```
 */
export function useGlass(
  template: TemplateName | TemplatePresetName = "frosted",
  options?: GlassOptions
) {
  const elRef = ref<HTMLElement | null>(null);
  let cleanupSvg: (() => void) | null = null;

  onMounted(() => ensureStyles());

  const generated = computed(() => renderGlass(template, options ?? {}));

  const style = computed(() => {
    const vars: Record<string, string | number> = {};
    for (const [key, val] of Object.entries(generated.value.cssVars)) {
      vars[key] = val;
    }
    if (generated.value.inlineStyle) Object.assign(vars, generated.value.inlineStyle);
    return vars;
  });

  const className = computed(() => generated.value.className);

  function injectSvg() {
    if (cleanupSvg) {
      cleanupSvg();
      cleanupSvg = null;
    }
    const filter = generated.value.svgFilter;
    if (filter) {
      cleanupSvg = injectSvgFilter(filter);
    }
  }

  onMounted(injectSvg);
  watch(() => generated.value.svgFilter, injectSvg);
  onBeforeUnmount(() => cleanupSvg?.());

  return { ref: elRef, className, style };
}
