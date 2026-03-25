import type { JSONField } from "~/utils/form-schema";

// ─── Canvas types

export interface CanvasField extends JSONField {
  _id: string;
  _group?: string;
}

export interface CanvasRow {
  _id: string;
  layout: "auto" | "flex" | "grid";
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  fields: CanvasField[];
}

export interface CanvasSection {
  _id: string;
  title: string;
  description?: string;
  icon?: string;
  displayStyle?: "card" | "collapse" | "plain";
  rows: CanvasRow[];
}

export interface CanvasPage {
  _id: string;
  title: string;
  description?: string;
  sections: CanvasSection[];
}

// ─── Palette ─────

export interface PaletteItem {
  component: string;
  label: string;
  icon: string;
  defaultProps?: Record<string, any>;
  defaultItems?: Array<{ label: string; value: string }>;
  isAddressGroup?: boolean;
  isFile?: boolean;
  isDatePicker?: boolean;
  isAsyncSelect?: boolean;
  isFileUpload?: boolean;
  isTable?: boolean;
  isOtp?: boolean;
  isRepeater?: boolean;
  isMap?: boolean;
}

export const palette: PaletteItem[] = [
  { component: "UInput", label: "Text Input", icon: "i-heroicons-pencil" },
  {
    component: "UTextarea",
    label: "Textarea",
    icon: "i-heroicons-bars-3-bottom-left",
    defaultProps: { rows: 3 },
  },
  {
    component: "USelect",
    label: "Select",
    icon: "i-heroicons-chevron-up-down",
    defaultItems: [
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
    ],
  },
  {
    component: "USelectMenu",
    label: "Select Menu",
    icon: "i-heroicons-magnifying-glass-circle",
    defaultItems: [
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
    ],
  },
  {
    component: "URadioGroup",
    label: "Radio Group",
    icon: "i-heroicons-radio",
    defaultItems: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    defaultProps: { orientation: "horizontal" },
  },
  {
    component: "UCheckboxGroup",
    label: "Checkbox Group",
    icon: "i-heroicons-check-circle",
    defaultItems: [
      { label: "Item 1", value: "1" },
      { label: "Item 2", value: "2" },
    ],
  },
  {
    component: "UInput",
    label: "Number",
    icon: "i-heroicons-hashtag",
    defaultProps: { type: "number" },
  },
  {
    component: "UInput",
    label: "Email",
    icon: "i-heroicons-envelope",
    defaultProps: { type: "email" },
  },
  {
    component: "UCalendar",
    label: "Date Picker",
    icon: "i-heroicons-calendar-days",
    isDatePicker: true,
  },
  {
    component: "UAsyncSelect",
    label: "Async Search",
    icon: "i-heroicons-magnifying-glass",
    isAsyncSelect: true,
  },
  { component: "USwitch", label: "Switch", icon: "i-lucide-toggle-right" },
  {
    component: "UFileUpload",
    label: "Photo / Avatar",
    icon: "i-heroicons-photo",
    isFileUpload: true,
  },
  {
    component: "UFileInput",
    label: "File Upload",
    icon: "i-heroicons-paper-clip",
    isFile: true,
  },
  {
    component: "UAddress",
    label: "Full Address",
    icon: "i-heroicons-map-pin",
    isAddressGroup: true,
  },
  {
    component: "UTableField",
    label: "Table",
    icon: "i-heroicons-table-cells",
    isTable: true,
  },
  {
    component: "UTagInput",
    label: "Tag Input",
    icon: "i-heroicons-tag",
  },
  {
    component: "UDateRange",
    label: "Date Range",
    icon: "i-heroicons-calendar-days",
  },
  {
    component: "UOtpInput",
    label: "OTP / PIN",
    icon: "i-heroicons-key",
    isOtp: true,
  },
  {
    component: "URepeater",
    label: "Repeater Group",
    icon: "i-heroicons-queue-list",
    isRepeater: true,
  },
  {
    component: "UMapPicker",
    label: "Map Picker",
    icon: "i-heroicons-map-pin",
    isMap: true,
  },
];

// ─── Field factory

export function makeField(
  item: PaletteItem,
  sectionFields: CanvasField[],
  uid: () => string,
): CanvasField[] {
  if (item.isAddressGroup) {
    const groupId = `addr_${Date.now()}`;
    const baseRow = sectionFields.length + 1;
    const ts = Date.now();
    return [
      {
        _id: uid(),
        _group: groupId,
        name: `province_${ts}`,
        label: "ខេត្ត/ក្រុង",
        component: "UAddress",
        type: "select",
        colSpan: 6,
        row: baseRow,
        required: true,
        clearOnChange: true,
        props: {
          placeholder: "ជ្រើសរើសខេត្ត...",
          apiEndpoint: "/api/proxy/address/provinces",
          searchable: true,
          clearable: true,
          labelKey: "name_kh",
          valueKey: "code",
        },
      },
      {
        _id: uid(),
        _group: groupId,
        name: `district_${ts}`,
        label: "ស្រុក/ក្រុង",
        component: "UAddress",
        type: "select",
        colSpan: 6,
        row: baseRow,
        required: true,
        clearOnChange: true,
        dependsOn: [`province_${ts}`],
        props: {
          placeholder: "ជ្រើសរើសសស្រុក...",
          apiEndpoint: "/api/proxy/address/districts",
          searchable: true,
          clearable: true,
          labelKey: "name_kh",
          valueKey: "code",
          addressQueryParamKey: "province_code",
          addressQueryParamSourceField: `province_${ts}`,
        },
      },
      {
        _id: uid(),
        _group: groupId,
        name: `commune_${ts}`,
        label: "ឃុំ/សង្កាត់",
        component: "UAddress",
        type: "select",
        colSpan: 6,
        row: baseRow + 1,
        required: true,
        clearOnChange: true,
        dependsOn: [`district_${ts}`, `province_${ts}`],
        props: {
          placeholder: "ជ្រើសរើសឃុំ...",
          apiEndpoint: "/api/proxy/address/communes",
          searchable: true,
          clearable: true,
          labelKey: "name_kh",
          valueKey: "code",
          addressQueryParamKey: "district_code",
          addressQueryParamSourceField: `district_${ts}`,
        },
      },
      {
        _id: uid(),
        _group: groupId,
        name: `village_${ts}`,
        label: "ភូមិ",
        component: "UAddress",
        type: "select",
        colSpan: 6,
        row: baseRow + 1,
        required: true,
        clearOnChange: true,
        dependsOn: [`commune_${ts}`, `district_${ts}`, `province_${ts}`],
        props: {
          placeholder: "ជ្រើសរើសភូមិ...",
          apiEndpoint: "/api/proxy/address/villages",
          searchable: true,
          clearable: true,
          labelKey: "name_kh",
          valueKey: "code",
          addressQueryParamKey: "commune_code",
          addressQueryParamSourceField: `commune_${ts}`,
        },
      },
    ];
  }
  if (item.isDatePicker) {
    return [
      {
        _id: uid(),
        name: `field_${Date.now()}`,
        label: item.label,
        component: "UCalendar",
        type: "date",
        placeholder: "Select date...",
        colSpan: 12,
        row: sectionFields.length + 1,
      },
    ];
  }
  if (item.isAsyncSelect) {
    return [
      {
        _id: uid(),
        name: `field_${Date.now()}`,
        label: item.label,
        component: "UAsyncSelect",
        type: "select",
        placeholder: "Search...",
        colSpan: 12,
        row: sectionFields.length + 1,
        props: {
          apiEndpoint: "",
          searchParam: "q",
          debounce: 300,
          minChars: 2,
          placeholder: "Search...",
          noResultsText: "No results found",
          loadingText: "Loading...",
        },
      },
    ];
  }
  if (item.isFileUpload) {
    return [
      {
        _id: uid(),
        name: `field_${Date.now()}`,
        label: item.label,
        component: "UFileUpload",
        colSpan: 12,
        row: sectionFields.length + 1,
        props: {
          accept: "image/*",
          multiple: false,
        },
      },
    ];
  }
  if (item.isOtp) {
    return [
      {
        _id: uid(),
        name: `field_${Date.now()}`,
        label: item.label,
        component: "UOtpInput",
        colSpan: 12,
        row: sectionFields.length + 1,
        props: { length: 6 },
      },
    ];
  }
  if (item.isRepeater) {
    return [
      {
        _id: uid(),
        name: `field_${Date.now()}`,
        label: item.label,
        component: "URepeater",
        colSpan: 12,
        row: sectionFields.length + 1,
        props: {
          fields: [
            { key: "field1", label: "Field 1", type: "text" },
            { key: "field2", label: "Field 2", type: "text" },
          ],
        },
      },
    ];
  }
  if (item.isMap) {
    return [
      {
        _id: uid(),
        name: `field_${Date.now()}`,
        label: item.label,
        component: "UMapPicker",
        type: "text",
        placeholder: "No location selected",
        colSpan: 12,
        row: sectionFields.length + 1,
      },
    ];
  }
  if (item.isTable) {
    return [
      {
        _id: uid(),
        name: `field_${Date.now()}`,
        label: item.label,
        component: "UTableField",
        colSpan: 12,
        row: sectionFields.length + 1,
        props: {
          columns: [
            { key: "col1", label: "Column 1", type: "text" },
            { key: "col2", label: "Column 2", type: "text" },
          ],
        },
      },
    ];
  }
  return [
    {
      _id: uid(),
      name: `field_${Date.now()}`,
      label: item.label,
      component: item.component,
      type: item.isFile
        ? "file"
        : (item.defaultProps?.type ??
          (item.component === "UTextarea" ? "textarea" : "text")),
      placeholder: item.isFile
        ? undefined
        : `Enter ${item.label.toLowerCase()}`,
      colSpan: 12,
      row: sectionFields.length + 1,
      ...(item.defaultItems ? { items: item.defaultItems } : {}),
      ...(item.defaultProps ? { props: item.defaultProps } : {}),
    },
  ];
}
