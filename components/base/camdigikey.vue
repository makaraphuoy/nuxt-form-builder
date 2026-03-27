<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface CamDigiKeyData {
  name_kh?: string;
  name_en?: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  id_number?: string;
  phone?: string;
  email?: string;
}

interface Props {
  field: any;
  modelValue?: CamDigiKeyData | null;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: CamDigiKeyData | null): void;
}>();

const loading = ref(false);
const error = ref<string | null>(null);

const MOCK: CamDigiKeyData = {
  name_kh: "លឿន សុំរបាក",
  name_en: "CHHOEM SIVHOK",
  gender: "ប្រុស",
  dob: "12-07-1995",
  nationality: "ខ្មែរ",
  id_number: "020857198",
  phone: "+855967996994",
  email: "sivhokchhoem@gmail.com",
};

const isConnected = computed(() => !!props.modelValue?.name_kh || !!props.modelValue?.name_en);
const display = computed<CamDigiKeyData>(() => props.modelValue ?? MOCK);

onMounted(() => {
  if (!isConnected.value) {
    emit("update:modelValue", MOCK);
  }
});

async function connect() {
  if (props.disabled || loading.value) return;
  loading.value = true;
  error.value = null;
  try {
    const endpoint = props.field?.props?.apiEndpoint;
    if (endpoint) {
      const res = await $fetch<CamDigiKeyData>(endpoint);
      emit("update:modelValue", res);
    } else {
      await new Promise((r) => setTimeout(r, 800));
      emit("update:modelValue", MOCK);
    }
  } catch {
    error.value = "Failed to fetch identity. Please try again.";
  } finally {
    loading.value = false;
  }
}

function disconnect() {
  emit("update:modelValue", null);
  error.value = null;
}

interface InfoCol {
  label: string;
  key: keyof CamDigiKeyData;
}

const ROWS: InfoCol[][] = [
  [
    { label: "គោត្តនាម និងនាម (ខ្មែរ):", key: "name_kh" },
    { label: "គោត្តនាម និងនាម (ឡាតាំង):", key: "name_en" },
    { label: "ភេទ:", key: "gender" },
  ],
  [
    { label: "កាលបរិច្ឆេទកំណើត (ថ្ងៃ-ខែ-ឆ្នាំ):", key: "dob" },
    { label: "សញ្ជាតិ:", key: "nationality" },
    { label: "លេខអត្តសញ្ញាណប័ណ្ណ:", key: "id_number" },
  ],
  [
    { label: "ទូរស័ព្ទចល័ត:", key: "phone" },
    { label: "អ៊ីម៉ែល:", key: "email" },
  ],
];
</script>

<template>
  <div class="w-full text-sm">
    <!-- Data rows — clean document style (screenshot-match) -->
    <div class="border border-gray-200 rounded">
      <div v-for="(row, ri) in ROWS" :key="ri" class="grid py-2 px-3"
        :class="row.length === 3 ? 'grid-cols-3' : 'grid-cols-2'">
        <div v-for="col in row" :key="col.key" class="flex items-baseline gap-1 pr-4 min-w-0">
          <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">{{ col.label }}</span>
          <span class="text-gray-900 font-bold text-sm truncate">{{ display[col.key] ?? "—" }}</span>
        </div>
      </div>
    </div>

    <!-- Action row — below data, subtle -->
    <div v-if="!disabled" class="mt-2 flex items-center justify-between">
      <span class="text-xs" :class="isConnected ? 'text-blue-500' : 'text-gray-400'">
        {{ isConnected ? "✓ CamDigiKey — បានផ្ទៀងផ្ទាត់" : "* ទិន្នន័យ Mock" }}
      </span>
      <div class="flex items-center gap-3">
        <button v-if="isConnected" type="button" class="text-xs text-gray-400 hover:text-red-500 transition-colors"
          @click="disconnect">
          លុបចោល
        </button>
        <button v-else type="button"
          class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
          :disabled="loading" @click="connect">
          <svg v-if="loading" class="size-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {{ loading ? "កំពុងទាញយក..." : "ភ្ជាប់ CamDigiKey" }}
        </button>
      </div>
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </div>
</template>
