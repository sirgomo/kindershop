export interface IUser{
  id?: number;
  email: string;
  password: string;
  vorname: string;
  nachname: string;
  strasse: string;
  hausnummer: string;
  plz: number;
  stadt: string;
  l_nachname?: string;
  l_strasse?: string;
  l_hausnummer?: string;
  l_plz?: number;
  l_stadt?: string;
  role?: string;
}
