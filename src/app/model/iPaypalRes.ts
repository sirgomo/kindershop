export interface iPaypalRes {

  id?: number;
  email?: string;
  vorname: string;
  nachname: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  stadt: string;
  l_nachname?: string;
  l_strasse?: string;
  l_hausnummer?: string;
  l_plz?: string;
  l_stadt?: string;
  bestellung_status: BESTELLUNGSTATUS;
  total_price?: number;
  steuer?: number;
  artikels_list: string;
  einkaufs_datum: Date;
  versand_datum: Date;
  bazahlt_am: Date;
  payart: PAYART;
  paypalOrderId?: string;
}
export enum BESTELLUNGSTATUS {
  INBEARBEITUNG = 'INBEARBEITUNG',
  VERSCHICKT = 'VERSCHICKT',
  ZUGESTELLT = 'ZUGESTELLT',
  STORNIERT = 'STORNIERT',
}
export enum PAYART {
  PAYPAL = 'PAYPAL',
  PERNACHNAHME = 'PERNACHNAHME',
}
