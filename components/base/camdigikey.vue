<script setup lang="ts">
import { computed } from "vue";
import { MOCK_PERSONAL } from "~/utils/camdigikey-mocks";
import type { PersonalData } from "~/types/camdigikey";

export type { PersonalData };

interface Props {
  field: any;
  modelValue?: PersonalData | null;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: PersonalData | null): void;
}>();

const isConnected = computed(() => !!props.modelValue);
const display = computed<PersonalData>(() => props.modelValue ?? MOCK_PERSONAL);
</script>

<template>
  <div class="w-full text-sm">
    <div class="border border-gray-200 rounded" :class="!isConnected ? 'opacity-60' : ''">

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
          <span class="text-gray-900 font-bold text-sm truncate">{{ display.gender ?? "—" }}</span>
        </div>
      </div>

      <div class="grid grid-cols-3 py-2 px-3">
        <div class="flex items-baseline gap-1 pr-4 min-w-0">
          <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">កាលបរិច្ឆេទកំណើត:</span>
          <span class="text-gray-900 font-bold text-sm truncate">{{ display.dob ?? "—" }}</span>
        </div>
        <div class="flex items-baseline gap-1 pr-4 min-w-0">
          <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">សញ្ជាតិ:</span>
          <span class="text-gray-900 font-bold text-sm truncate">{{ display.nationality ?? "—" }}</span>
        </div>
        <div class="flex items-baseline gap-1 min-w-0">
          <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">លេខអត្តសញ្ញាណប័ណ្ណ:</span>
          <span class="text-gray-900 font-bold text-sm truncate">{{ display.id_number ?? "—" }}</span>
        </div>
      </div>

      <div class="grid grid-cols-2 py-2 px-3">
        <div class="flex items-baseline gap-1 pr-4 min-w-0">
          <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">ទូរស័ព្ទចល័ត:</span>
          <span class="text-gray-900 font-bold text-sm truncate">{{ display.phone ?? "—" }}</span>
        </div>
        <div class="flex items-baseline gap-1 min-w-0">
          <span class="text-gray-500 text-xs whitespace-nowrap shrink-0">អ៊ីម៉ែល:</span>
          <span class="text-gray-900 font-bold text-sm truncate">{{ display.email ?? "—" }}</span>
        </div>
      </div>

    </div>
  </div>
</template>
