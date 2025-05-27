export interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  location: string;
  lat?: number;
  lng?: number;
  createdBy?: number;
}
