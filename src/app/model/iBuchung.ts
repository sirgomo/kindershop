import { iBuchungArtikel } from "./iBuchungArtikel";
import { iKreditoren } from "./iKreditoren";

export interface iBuchung {

  buchung_id?: number;
  lieferschein_id: string;
  liefer_date: string;
  buchung_date: string;
  gebucht: number;
  korrigiertes_nr: number;
  korrigiertes_grund: string;
  kreditor: iKreditoren;
  artikels: iBuchungArtikel[];
}
