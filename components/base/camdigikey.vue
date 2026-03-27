<script setup lang="ts">
import { computed } from "vue";

export interface PersonalData {
  _type: "personal";
  name_kh?: string;
  name_en?: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  id_number?: string;
  phone?: string;
  email?: string;
}

export interface CompanyData {
  _type: "company";
  reg_number?: string;
  vat_number?: string;
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

export type CamDigiKeyData = PersonalData | CompanyData;

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

const isCompany = computed(() => props.field?.props?.type === "company");

const MOCK_PERSONAL: PersonalData = {
  _type: "personal",
  name_kh: "លឿន សុំរបាក",
  name_en: "CHHOEM SIVHOK",
  gender: "ប្រុស",
  dob: "12-07-1995",
  nationality: "ខ្មែរ",
  id_number: "020857198",
  phone: "+855967996994",
  email: "sivhokchhoem@gmail.com",
};

const MOCK_COMPANY: CompanyData = {
  _type: "company",
  reg_number: "1001144",
  vat_number: "",
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

// Display uses real value if present, mock otherwise — but never auto-emits mock
const isConnected = computed(() => !!props.modelValue);
const display = computed<CamDigiKeyData>(() => props.modelValue ?? MOCK.value);

// VAT number is part of modelValue for company — not a stray local ref
const vatNumber = computed({
  get: () => (display.value as CompanyData).vat_number ?? "",
  set: (val: string) => {
    if (!isConnected.value) return;
    emit("update:modelValue", { ...(props.modelValue as CompanyData), vat_number: val });
  },
});

</script>

<template>
  <div class="w-full text-sm">
    <div class="border border-gray-200 rounded" :class="!isConnected ? 'opacity-60' : ''">

      <!-- ── COMPANY layout ── -->
      <template v-if="isCompany">
        <!-- reg number (left) + VAT input (right) -->
        <div class="grid grid-cols-2 py-2 px-3">
          <div class="flex items-baseline gap-1 pr-4 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">លេខចុះបញ្ជីអាជីវកម្ម:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as CompanyData).reg_number ?? "—" }}</span>
          </div>
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">លេខអតប:</span>
            <input
              v-model="vatNumber"
              type="text"
              :disabled="disabled || !isConnected"
              placeholder="សូមបញ្ចូល..."
              class="flex-1 min-w-0 border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        </div>

        <!-- company names -->
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

        <!-- address header -->
        <div class="px-3 py-1 border-t border-gray-100">
          <span class="text-xs font-semibold text-green-600">អាសយដ្ឋានបច្ចុប្បន្ន</span>
        </div>

        <!-- province / district / commune -->
        <div class="grid grid-cols-3 py-2 px-3">
          <div class="flex items-baseline gap-1 pr-3 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ខេត្ត/ក្រុង:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as CompanyData).province ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 pr-3 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ស្រុក/ខណ្ឌ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as CompanyData).district ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ឃុំ/សង្កាត់:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as CompanyData).commune ?? "—" }}</span>
          </div>
        </div>

        <!-- village / street / building -->
        <div class="grid grid-cols-3 py-2 px-3">
          <div class="flex items-baseline gap-1 pr-3 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ភូមិ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as CompanyData).village ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 pr-3 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ផ្លូវ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as CompanyData).street ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">លេខផ្ទះ/អាគារ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as CompanyData).building ?? "—" }}</span>
          </div>
        </div>

        <!-- phone / fax / email -->
        <div class="grid grid-cols-3 py-2 px-3">
          <div class="flex items-baseline gap-1 pr-3 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ទូរស័ព្ទ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as CompanyData).phone ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 pr-3 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ទូរសារ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as CompanyData).fax ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">អ៊ីម៉ែល:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as CompanyData).email ?? "—" }}</span>
          </div>
        </div>
      </template>

      <!-- ── PERSONAL layout ── -->
      <template v-else>
        <div class="grid grid-cols-3 py-2 px-3">
          <div class="flex items-baseline gap-1 pr-4 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">គោត្តនាម និងនាម (ខ្មែរ):</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.name_kh ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 pr-4 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">គោត្តនាម និងនាម (ឡាតាំង):</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ display.name_en ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ភេទ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as PersonalData).gender ?? "—" }}</span>
          </div>
        </div>
        <div class="grid grid-cols-3 py-2 px-3">
          <div class="flex items-baseline gap-1 pr-4 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">កាលបរិច្ឆេទកំណើត:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as PersonalData).dob ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 pr-4 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">សញ្ជាតិ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as PersonalData).nationality ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">លេខអត្តសញ្ញាណប័ណ្ណ:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as PersonalData).id_number ?? "—" }}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 py-2 px-3">
          <div class="flex items-baseline gap-1 pr-4 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ទូរស័ព្ទចល័ត:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as PersonalData).phone ?? "—" }}</span>
          </div>
          <div class="flex items-baseline gap-1 min-w-0">
            <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">អ៊ីម៉ែល:</span>
            <span class="text-gray-900 font-bold text-sm truncate">{{ (display as PersonalData).email ?? "—" }}</span>
          </div>
        </div>
      </template>

    </div>

  </div>
</template>
