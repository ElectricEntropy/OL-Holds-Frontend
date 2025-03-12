export interface Comic {
  id: string;
  title: string;
  publisher: string;
  isCustom?: boolean;
}
export interface PullListItem extends Comic {
  addedAt: string;
}
export interface CustomerPullList {
  customerId: string;
  comics: PullListItem[];
}