export interface Pull {
  id: string;
  customer_id: string;
  comic_id: string;
  date_added: string;
}
export interface CustomerPullList {
  customer_id: string;
  pulls: Pull[];
}