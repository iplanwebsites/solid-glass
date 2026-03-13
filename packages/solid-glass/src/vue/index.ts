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
import type { GlassEffectName, GlassEffectMap } from "../types";
import { getEffect } from "../effects";
import { cn } from "../utils";

/**
 * Vue 3 Glass component supporting all effects.
 *
 * @example
 * ```vue
 * <template>
 *   <Glass effect="frosted" :options="{ blur: 16 }">
 *     <p>Behind the glass</p>
 *   </Glass>
 * </template>
 *
 * <script setup>
 * import { Glass } from "solid-glass/vue";
 * import "solid-glass/css";
 * </script>
 * ```
 */
export const Glass = defineComponent({
  name: "Glass",
  props: {
    effect: {
      type: String as PropType<GlassEffectName>,
      default: "frosted",
    },
    options: {
      type: Object as PropType<GlassEffectMap[GlassEffectName]>,
      default: () => ({}),
    },
    radius: { type: Number, default: undefined },
    blur: { type: Number, default: undefined },
    as: { type: String, default: "div" },
  },
  setup(props, { slots }) {
    const svgEl = ref<Element | null>(null);

    const merged = computed(() => {
      const o = { ...props.options } as Record<string, unknown>;
      if (props.radius !== undefined) o.borderRadius = props.radius;
      if (props.blur !== undefined) o.blur = props.blur;
      return o;
    });

    const generated = computed(() => {
      const gen = getEffect(props.effect);
      return gen(merged.value);
    });

    function injectSvg() {
      // Remove old
      if (svgEl.value) {
        svgEl.value.remove();
        svgEl.value = null;
      }
      const filter = generated.value.svgFilter;
      if (!filter) return;
      const container = document.createElement("div");
      container.innerHTML = filter;
      const svg = container.firstElementChild;
      if (svg) {
        document.body.appendChild(svg);
        svgEl.value = svg;
      }
    }

    onMounted(injectSvg);
    watch(() => generated.value.svgFilter, injectSvg);
    onBeforeUnmount(() => svgEl.value?.remove());

    return () => {
      const style: Record<string, string | number> = {};
      for (const [key, val] of Object.entries(generated.value.cssVars)) {
        style[key] = val;
      }
      return h(
        props.as,
        { class: cn(generated.value.className), style },
        slots.default?.()
      );
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
 * import "solid-glass/css";
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
export function useGlass<E extends GlassEffectName>(
  effect: E,
  options?: GlassEffectMap[E]
) {
  const elRef = ref<HTMLElement | null>(null);
  const svgEl = ref<Element | null>(null);

  const generated = computed(() => {
    const gen = getEffect(effect);
    return gen(options ?? ({} as GlassEffectMap[E]));
  });

  const style = computed(() => {
    const vars: Record<string, string | number> = {};
    for (const [key, val] of Object.entries(generated.value.cssVars)) {
      vars[key] = val;
    }
    return vars;
  });

  const className = computed(() => generated.value.className);

  function injectSvg() {
    if (svgEl.value) {
      svgEl.value.remove();
      svgEl.value = null;
    }
    const filter = generated.value.svgFilter;
    if (!filter) return;
    const container = document.createElement("div");
    container.innerHTML = filter;
    const svg = container.firstElementChild;
    if (svg) {
      document.body.appendChild(svg);
      svgEl.value = svg;
    }
  }

  onMounted(injectSvg);
  watch(() => generated.value.svgFilter, injectSvg);
  onBeforeUnmount(() => svgEl.value?.remove());

  return { ref: elRef, className, style };
}
