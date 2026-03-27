<script setup lang="ts">
import { computed } from "vue";
import { MOCK_COMPANY } from "~/utils/camdigikey-mocks";
import type { CompanyData } from "~/types/camdigikey";

export type { CompanyData };

interface Props {
  field: any;
  modelValue?: CompanyData | null;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: CompanyData | null): void;
}>();

const isConnected = computed(() => !!props.modelValue);
const display = computed<CompanyData>(() => props.modelValue ?? MOCK_COMPANY);

const vatNumber = computed({
  get: () => display.value.vat_number ?? "",
  set: (val: string) => {
    if (!isConnected.value) return;
    emit("update:modelValue", { ...(props.modelValue as CompanyData), vat_number: val });
  },
});
</script>

<template>
  <div class="w-full text-sm">
    <div class="border border-gray-200 rounded" :class="!isConnected ? 'opacity-60' : ''">

      <!-- reg number (left) + VAT input (right) -->
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

      <!-- village / street / building -->
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

      <!-- phone / fax / email -->
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

    </div>
  </div>
</template>
