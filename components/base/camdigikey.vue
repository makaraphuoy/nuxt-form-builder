<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface PersonalData {
  name_kh?: string;
  name_en?: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  id_number?: string;
  phone?: string;
  email?: string;
}

interface CompanyData {
  reg_number?: string;
  name_kh?: string;
  name_en?: string;
  province?: string;
  district?: string;
  commune?: string;
  village?: string;
  street?: string;
  building?: string;
  phone?: string;
  fax?: string;
  email?: string;
}

type CamDigiKeyData = PersonalData & CompanyData;

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
const vatNumber = ref("");

const isCompany = computed(() => props.field?.props?.type === "company");

const MOCK_PERSONAL: CamDigiKeyData = {
  name_kh: "លឿន សុំរបាក",
  name_en: "CHHOEM SIVHOK",
  gender: "ប្រុស",
  dob: "12-07-1995",
  nationality: "ខ្មែរ",
  id_number: "020857198",
  phone: "+855967996994",
  email: "sivhokchhoem@gmail.com",
};

const MOCK_COMPANY: CamDigiKeyData = {
  reg_number: "1001144",
  name_kh: "សីឡា កំព្យូទ័រ",
  name_en: "SELA COMPUTER PLC",
  province: "ព្រះសីហនុ",
  district: "ស្ទឹងហាវ",
  commune: "អូរគ្រែ",
  village: "ភូមិ១",
  street: "25",
  building: "57",
  phone: "+855 12 908 948",
  fax: "+855 12 908 948",
  email: "selacomputer@gmail.com",
};

const MOCK = computed(() => isCompany.value ? MOCK_COMPANY : MOCK_PERSONAL);

const isConnected = computed(() => !!props.modelValue?.name_kh || !!props.modelValue?.name_en);
const display = computed<CamDigiKeyData>(() => props.modelValue ?? MOCK.value);

onMounted(() => {
  if (!isConnected.value) {
    emit("update:modelValue", MOCK.value);
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
      emit("update:modelValue", MOCK.value);
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
</script>

<template>
  <div class="w-full text-sm">
    <div class="border border-gray-200 rounded">

      <!-- ── COMPANY layout ── -->
      <template v-if="isCompany">
        <!-- Row 0: reg number (left) + VAT input (right) -->
        <div class="grid grid-cols-2 py-2 px-3">
          <div class="flex items-baseline gap-1 pr-4 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">លេខចុះបញ្ជីអាជីវកម្ម:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.reg_number ?? "—" }}</span>
          </div>
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">លេខអតប:</span>
            <input
              v-model="vatNumber"
              type="text"
              :disabled="disabled"
              placeholder="សូមបញ្ចូល..."
              class="flex-1 min-w-0 border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        </div>

        <!-- Row 1: company name -->
        <div class="grid grid-cols-2 py-2 px-3">
          <div class="flex items-baseline gap-1 pr-4 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">នាមករណ៍ក្រុមហ៊ុន (ខ្មែរ):</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.name_kh ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">នាមករណ៍ក្រុមហ៊ុន (ឡាតាំង):</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.name_en ?? "—" }}</span>
          </div>
        </div>

        <!-- Address section header -->
        <div class="px-3 py-1 border-t border-gray-100">
          <span class="text-xs font-semibold text-green-600">អាសយដ្ឋានបច្ចុប្បន្ន</span>
        </div>

        <!-- Province / District / Commune -->
        <div class="grid grid-cols-3 py-2 px-3">
          <div class="flex items-baseline gap-1 pr-3 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ខេត្ត/ក្រុង:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.province ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 pr-3 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ស្រុក/ខណ្ឌ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.district ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ឃុំ/សង្កាត់:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.commune ?? "—" }}</span>
          </div>
        </div>

        <!-- Village / Street / Building -->
        <div class="grid grid-cols-3 py-2 px-3">
          <div class="flex items-baseline gap-1 pr-3 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ភូមិ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.village ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 pr-3 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ផ្លូវ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.street ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">លេខផ្ទះ/អាគារ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.building ?? "—" }}</span>
          </div>
        </div>

        <!-- Phone / Fax / Email -->
        <div class="grid grid-cols-3 py-2 px-3">
          <div class="flex items-baseline gap-1 pr-3 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ទូរស័ព្ទ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.phone ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 pr-3 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ទូរសារ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.fax ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">អ៊ីម៉ែល:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.email ?? "—" }}</span>
          </div>
        </div>
      </template>

      <!-- ── PERSONAL layout ── -->
      <template v-else>
        <div class="grid grid-cols-3 py-2 px-3">
          <div v-for="key in ['name_kh','name_en','gender'] as const" :key="key" class="flex items-baseline gap-1 pr-4 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">
              {{ key === 'name_kh' ? 'គោត្តនាម និងនាម (ខ្មែរ):' : key === 'name_en' ? 'គោត្តនាម និងនាម (ឡាតាំង):' : 'ភេទ:' }}
            </span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display[key] ?? "—" }}</span>
          </div>
        </div>
        <div class="grid grid-cols-3 py-2 px-3">
          <div v-for="key in ['dob','nationality','id_number'] as const" :key="key" class="flex items-baseline gap-1 pr-4 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">
              {{ key === 'dob' ? 'កាលបរិច្ឆេទកំណើត (ថ្ងៃ-ខែ-ឆ្នាំ):' : key === 'nationality' ? 'សញ្ជាតិ:' : 'លេខអត្តសញ្ញាណប័ណ្ណ:' }}
            </span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display[key] ?? "—" }}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 py-2 px-3">
          <div v-for="key in ['phone','email'] as const" :key="key" class="flex items-baseline gap-1 pr-4 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">
              {{ key === 'phone' ? 'ទូរស័ព្ទចល័ត:' : 'អ៊ីម៉ែល:' }}
            </span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display[key] ?? "—" }}</span>
          </div>
        </div>
      </template>

    </div>

    <!-- Action row -->
    <div v-if="!disabled" class="mt-2 flex items-center justify-between">
      <span class="text-xs" :class="isConnected ? 'text-blue-500' : 'text-gray-400'">
        {{ isConnected ? "✓ CamDigiKey — បានផ្ទៀងផ្ទាត់" : "* ទិន្នន័យ Mock" }}
      </span>
      <div class="flex items-center gap-3">
        <button v-if="isConnected" type="button" class="text-xs text-gray-400 hover:text-red-500 transition-colors" @click="disconnect">
          លុបចោល
        </button>
        <button v-else type="button"
          class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
          :disabled="loading" @click="connect">
          <svg v-if="loading" class="size-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
