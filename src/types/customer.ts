export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  birth_date: string;
  comic_discount: number;
  store_credit: number;
  //account_creation_date: string;
  notes: string;
}
export type CustomerFormData = Omit<Customer, 'id'>;