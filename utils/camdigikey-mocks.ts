import type { PersonalData, CompanyData } from "~/types/camdigikey";
import type { JSONFormConfig } from "~/utils/form-schema";

export function generateMockValuesFromJson(
  config: JSONFormConfig,
): Record<string, any> {
  const values: Record<string, any> = {};
  for (const page of config.pages) {
    for (const section of page.sections ?? []) {
      for (const row of section.rows ?? []) {
        for (const field of row.fields) {
          if (field.component === "UCamDigiKey")
            values[field.name] = MOCK_PERSONAL;
          else if (field.component === "UMocCompany")
            values[field.name] = MOCK_COMPANY;
        }
      }
      for (const field of (section as any).fields ?? []) {
        if (field.component === "UCamDigiKey")
          values[field.name] = MOCK_PERSONAL;
        else if (field.component === "UMocCompany")
          values[field.name] = MOCK_COMPANY;
      }
    }
    for (const field of page.fields ?? []) {
      if ((field as any).component === "UCamDigiKey")
        values[(field as any).name] = MOCK_PERSONAL;
      else if ((field as any).component === "UMocCompany")
        values[(field as any).name] = MOCK_COMPANY;
    }
  }
  return values;
}

export const MOCK_PERSONAL: PersonalData = {
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

export const MOCK_COMPANY: CompanyData = {
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
