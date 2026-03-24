# CLAUDE.md — Nuxt Form Builder

## Project

Nuxt 3 + Nuxt UI v3 + Zod v4 dynamic form system. Package manager: **yarn**.

## Commands

```bash
yarn dev        # dev server
yarn build      # production build
yarn preview    # preview build
yarn lint       # eslint
yarn format     # prettier
```

## Architecture

Two form system versions exist:

- **V1 (legacy)** — `components/builder/` + `components/form/Builder.vue` — inline state, manual validation, do not extend
- **V2 (current)** — `components/v2/` — composable-driven, use this for all new work

## Key Files

| File | Purpose |
|---|---|
| `types/form-builder.ts` | `Field`, `FieldWithConditions` interfaces |
| `constants/form-builder.ts` | `FormSection`, `FormPage`, `FormConfig` types + example data (types split here by mistake — do not move without refactor) |
| `utils/form-schema.ts` | `JSONFormConfig` → runtime `FormConfig` via `interpretConfig()`, `buildValidation()` |
| `composables/useFormState.ts` | Reactive form values, errors, `validate()`, `reset()`, `setValue()`, `clearDependents()` |
| `composables/useFormStorage.ts` | localStorage CRUD for saved form configs |
| `composables/useFieldComponentRegistry.ts` | Maps string component names → Vue components |
| `components/v2/FormRenderer.vue` | Single-page form renderer |
| `components/v2/WizardRenderer.vue` | Multi-step wizard renderer |
| `components/v2/FormBuilder.ts` | Fluent class builder: `.addField()`, `.addRow()`, `.build()` |
| `pages/builder/index.vue` | Visual drag-and-drop form builder UI |
| `server/api/address/` | Province → District → Commune → Village cascade endpoints |

## Core Types

```ts
FieldWithConditions {
  name, label, component, type
  hidden?(values): boolean       // conditional visibility
  disabled?(values): boolean
  options?(values): any[]        // dynamic select options
  defaultValue?(values): any
  dependsOn?: string[]           // triggers clearDependents on change
  clearOnChange?: boolean        // default true
  colSpan?: number               // 1–12 grid columns
  row?: number                   // row group number (auto-set by recalcRows)
  validation?: ZodType
}

FormConfig { pages: FormPage[] }
FormPage    { id, title, sections?, fields? }
FormSection { id, title, displayStyle: "card"|"collapse"|"plain", fields }
```

## Builder Page (`pages/builder/index.vue`)

### Canvas grid logic
- Fields grouped by `row` via `sectionRowGroups` computed → rendered as `grid grid-cols-12`
- Each field card shows at actual `colSpan` width (WYSIWYG)
- `recalcRows()` — call after any colSpan or field-order change; packs fields into rows left-to-right
- `flatIndexOf(field)` — returns flat index in `currentSection.fields[]`
- `onFieldDragOver(field, sectionId, e)` — detects left/right half of card; sets `dragOverIndex` to insert before or after
- Drop indicators: left-border (`dragOverIndex === flatIndexOf`) and right-border (`dragOverIndex === flatIndexOf + 1`)

### Drag sources
- **Palette → canvas**: `onPaletteDragStart` → `makeField()` → `onDrop()`
- **Canvas → canvas**: `onCanvasDragStart` → `onDrop()` (reorder)

### JSON serialisation
- `buildConfig()` → `JSONFormConfig` (serialisable, no functions)
- `interpretConfig(json)` → runtime `FormConfig` with `hidden()`/`disabled()` functions

## Patterns

- JSON-safe configs: `JSONFormConfig` / `JSONField` (in `utils/form-schema.ts`) — use when storing to API or localStorage
- Runtime configs: `FormConfig` / `FieldWithConditions` — use in renderers
- Component registry: `useFieldComponentRegistry` maps `"UInput"` → Vue component; register custom fields with `registerComponent()`
- `hiddenIf` in JSON uses `every()` (AND logic only — no OR support yet)
- `FormRenderer.vue` iterates `visibleFields` directly — `row` grouping is unused there (known issue)

## Tailwind Grid

Static class map required for JIT — `COL_SPAN_CLASS` in `pages/builder/index.vue` and `COL_SPAN` in `components/v2/FormRenderer.vue`. Always use the lookup object, never interpolate `col-span-${n}`.

## API Routes

| Route | Description |
|---|---|
| `GET /api/forms` | List saved forms |
| `GET /api/forms/:id` | Get form by ID |
| `GET /api/address/provinces` | Address cascade level 1 |
| `GET /api/address/districts?province_code=` | Level 2 |
| `GET /api/address/communes?district_code=` | Level 3 |
| `GET /api/address/villages?commune_code=` | Level 4 |
| `GET /api/licenses/search?q=` | Async select source |
