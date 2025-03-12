export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phoneNumber: string;
  storeCredit: number;
}
export type CustomerFormData = Omit<Customer, 'id'>;