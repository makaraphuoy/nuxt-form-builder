<script setup lang="ts">
import { computed, reactive, watch } from "vue";

/**
 * BaseFullAddress — atomic cascading address picker.
 *
 * Treated as a single field in the form builder (drag/drop adds/removes all
 * 4 levels together). No per-level `subFields` config required.
 *
 * Supported field.props:
 *   labels?:   { province?, district?, commune?, village? }  — label overrides
 *   placeholders?: { province?, district?, commune?, village? }
 *   exclude?:  ('province' | 'district' | 'commune' | 'village')[] — hide levels
 *   labelKey?: string  (default "name_kh")
 *   valueKey?: string  (default "code")
 *
 * v-model value: { province, district, commune, village } (only visible levels)
 */

type AddressLevel = "province" | "district" | "commune" | "village";
const CASCADE_CHAIN: AddressLevel[] = ["province", "district", "commune", "village"];

interface Props {
  field: any;
  modelValue?: Record<string, any> | null;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, any>): void;
}>();

// ── Built-in defaults ────────────────────────────────────────────────────────

const DEFAULT_LABELS: Record<AddressLevel, string> = {
  province: "Province / City",
  district: "District / Khan",
  commune: "Commune / Sangkat",
  village: "Village",
};

const DEFAULT_PLACEHOLDERS: Record<AddressLevel, string> = {
  province: "Select province...",
  district: "Select district...",
  commune: "Select commune...",
  village: "Select village...",
};

const ENDPOINTS: Record<AddressLevel, string> = {
  province: "/api/proxy/address/provinces",
  district: "/api/proxy/address/districts",
  commune: "/api/proxy/address/communes",
  village: "/api/proxy/address/villages",
};

const COL_SPAN_CLASS: Record<number, string> = {
  1: "col-span-1",  2: "col-span-2",  3: "col-span-3",  4: "col-span-4",
  5: "col-span-5",  6: "col-span-6",  7: "col-span-7",  8: "col-span-8",
  9: "col-span-9",  10: "col-span-10", 11: "col-span-11", 12: "col-span-12",
};

// ── Derived props ────────────────────────────────────────────────────────────

const labelKey   = computed(() => props.field.props?.labelKey   ?? "name_kh");
const valueKey   = computed(() => props.field.props?.valueKey   ?? "code");
const isRequired = computed(() => !!props.field.required);

const excluded = computed<AddressLevel[]>(
  () => props.field.props?.exclude ?? [],
);

const visibleLevels = computed<AddressLevel[]>(
  () => CASCADE_CHAIN.filter((l) => !excluded.value.includes(l)),
);

function labelFor(level: AddressLevel): string {
  return props.field.props?.labels?.[level] ?? DEFAULT_LABELS[level];
}

function placeholderFor(level: AddressLevel): string {
  return props.field.props?.placeholders?.[level] ?? DEFAULT_PLACEHOLDERS[level];
}

// ── Internal state ───────────────────────────────────────────────────────────

const internal = reactive<Record<AddressLevel, any>>({
  province: null,
  district: null,
  commune: null,
  village: null,
});

watch(
  () => props.modelValue,
  (val) => {
    for (const level of CASCADE_CHAIN) {
      internal[level] = val?.[level] ?? null;
    }
  },
  { immediate: true, deep: true },
);

const formValues = computed(() => ({ ...internal }));

// ── Sub-field descriptors for BaseAddress ────────────────────────────────────

function buildSubField(level: AddressLevel) {
  const idx = CASCADE_CHAIN.indexOf(level);
  const parent = idx > 0 ? CASCADE_CHAIN[idx - 1] : null;
  const parentKey = parent ? valueKey.value : null;

  return {
    name: level,
    required: isRequired.value,
    dependsOn: parent ? [parent] : [],
    clearOnChange: true,
    props: {
      apiEndpoint: ENDPOINTS[level],
      labelKey: labelKey.value,
      valueKey: valueKey.value,
      searchable: true,
      placeholder: placeholderFor(level),
      ...(parent && parentKey
        ? {
            queryParams: (values: Record<string, any>) => {
              const parentVal = values[parent!];
              return parentVal ? { [`${parent}_code`]: parentVal[parentKey] } : {};
            },
          }
        : {}),
    },
  };
}

// ── Change handler ───────────────────────────────────────────────────────────

function handleChange(level: AddressLevel, value: any) {
  internal[level] = value;

  // Clear downstream levels
  const idx = CASCADE_CHAIN.indexOf(level);
  for (let i = idx + 1; i < CASCADE_CHAIN.length; i++) {
    internal[CASCADE_CHAIN[i]] = null;
  }

  // Emit only visible levels
  const result: Record<string, any> = {};
  for (const l of visibleLevels.value) {
    result[l] = internal[l];
  }
  emit("update:modelValue", result);
}
</script>

<template>
  <div class="grid grid-cols-12 gap-4 w-full">
    <template v-for="level in visibleLevels" :key="level">
      <div :class="COL_SPAN_CLASS[field.props?.colSpanPerLevel ?? 6] ?? 'col-span-6'">
        <div class="flex flex-col gap-1">
          <label class="block text-sm font-medium leading-6">
            {{ labelFor(level) }}
            <span v-if="isRequired" class="text-red-500 ms-0.5">*</span>
          </label>
          <BaseAddress
            :field="buildSubField(level)"
            :model-value="internal[level]"
            :form-values="formValues"
            :disabled="disabled"
            @update:model-value="handleChange(level, $event)"
          />
        </div>
      </div>
    </template>
  </div>
</template>
