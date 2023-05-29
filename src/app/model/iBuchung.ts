import { iBuchungArtikel } from "./iBuchungArtikel";
import { iKreditoren } from "./iKreditoren";

export interface iBuchung {

  buchung_id?: number;
  lieferschein_id: string;
  liefer_date: Date;
  buchung_date: Date;
  gebucht: number;
  korrigiertes_nr: number;
  korrigiertes_grund: string;
  kreditor: iKreditoren;
  artikels: iBuchungArtikel[];
}
