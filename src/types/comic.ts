export interface Comic {
  id: string;
  title: string;
  issue_number: number;
  publisher: string;
  distributor: string;
  release_date: string;
  is_custom?: boolean;
}
export type ComicFormData = Omit<Comic, 'id'>;