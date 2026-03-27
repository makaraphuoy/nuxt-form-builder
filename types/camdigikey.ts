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
