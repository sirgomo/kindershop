export interface iKreditoren {
  id?: number;
  kreditorennummer: string;
  kreditorenname: string;
  anschrift: string;
  telefonnummer?: string;
  faxnummer?: string;
  email?: string;
  bankname: string;
  iban: string;
  bic: string;
  zahlungsbedingungen?: string;
  steuernummer?: string;
  ust_idnr?: string;
  land?: string;
}
