<script setup lang="ts">
import type { FieldWithConditions } from "~/types/form-builder";
import { resolveComponentMap } from "~/utils/ui-helper";

interface Props {
  field: FieldWithConditions;
  formValues?: Record<string, any>; // needed by cascading address
  options?: any[]; // pre-computed from useFormState.getOptions
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  formValues: () => ({}),
  options: () => [],
  disabled: false,
});

const value = defineModel<any>();

function getComponent(field: FieldWithConditions) {
  if (typeof field.component === "string") {
    return resolveComponentMap[field.component] ?? field.component;
  }
  return field.component;
}


function fieldProps() {
  const computedItems = props.options?.length ? props.options : undefined;
  return {
    ...props.field.props,
    ...props.field.attrs,
    ...(computedItems ? { items: computedItems } : {}),
  };
}
</script>

<template>
  <UFormField
    :name="field.name"
    :label="field.label"
    :description="field.description"
    :required="field.required"
  >
    <!-- date picker -->
    <BaseDatePicker
      v-if="field.component === 'UCalendar'"
      :field="field"
      :model-value="value"
      @update:model-value="value = $event"
    />

    <!-- map picker -->
    <BaseMapPicker
      v-else-if="field.component === 'UMapPicker'"
      :field="field"
      :model-value="value"
      :disabled="disabled"
      @update:model-value="value = $event"
    />

    <!-- cascading address -->
    <BaseAddress
      v-else-if="field.component === 'UAddress'"
      :field="field"
      :model-value="value"
      :form-values="formValues"
      :disabled="disabled"
      @update:model-value="value = $event"
    />

    <!-- async searchable select -->
    <BaseAsynSelect
      v-else-if="field.component === 'UAsyncSelect'"
      :field="field"
      :model-value="value"
      :disabled="disabled"
      @update:model-value="value = $event"
    />

    <!-- switch / toggle -->
    <USwitch
      v-else-if="field.component === 'USwitch'"
      v-model="value"
      :disabled="disabled"
      v-bind="{ ...field.props, ...field.attrs }"
    />

    <!-- tag input -->
    <BaseTagInput
      v-else-if="field.component === 'UTagInput'"
      :model-value="value"
      :placeholder="field.placeholder"
      :disabled="disabled"
      @update:model-value="value = $event"
    />

    <!-- date range -->
    <BaseDateRange
      v-else-if="field.component === 'UDateRange'"
      :model-value="value"
      :disabled="disabled"
      @update:model-value="value = $event"
    />

    <!-- OTP / PIN -->
    <BaseOtpInput
      v-else-if="field.component === 'UOtpInput'"
      :model-value="value"
      :length="field.props?.length ?? 6"
      :disabled="disabled"
      @update:model-value="value = $event"
    />

    <!-- repeater group -->
    <BaseRepeaterGroup
      v-else-if="field.component === 'URepeater'"
      :fields="field.props?.fields ?? []"
      :model-value="value"
      :disabled="disabled"
      @update:model-value="value = $event"
    />

    <!-- table field -->
    <BaseTableField
      v-else-if="field.component === 'UTableField'"
      :columns="field.props?.columns ?? []"
      :model-value="value"
      :disabled="disabled"
      @update:model-value="value = $event"
    />

    <!-- image / avatar upload — auto-uploads and shows thumbnail -->
    <BaseAvatarUpload
      v-else-if="field.component === 'UFileUpload'"
      :model-value="value"
      :accept="field.props?.accept ?? 'image/*'"
      :disabled="disabled"
      @update:model-value="value = $event"
    />

    <!-- file attachment — uploads and shows filename card with actions -->
    <BaseFileAttachment
      v-else-if="field.component === 'UFileInput'"
      :model-value="value"
      :accept="field.props?.accept ?? '*/*'"
      :multiple="field.props?.multiple ?? false"
      :disabled="disabled"
      @update:model-value="value = $event"
    />

    <!-- SelectMenu — must use value-key so v-model holds the string value, not the full option object -->
    <USelectMenu
      v-else-if="field.component === 'USelectMenu'"
      v-model="value"
      :items="options?.length ? options : (field.props?.items ?? [])"
      value-key="value"
      :placeholder="field.placeholder"
      :disabled="disabled"
      v-bind="{ ...field.attrs }"
      class="w-full"
    />

    <!-- all other Nuxt UI components -->
    <component
      v-else
      :is="getComponent(field)"
      v-model="value"
      :placeholder="field.placeholder"
      :type="field.type"
      :disabled="disabled"
      v-bind="fieldProps()"
      class="w-full"
    />
  </UFormField>
</template>
