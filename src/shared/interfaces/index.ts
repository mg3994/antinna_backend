export interface IIdentifiable {
  id: string;
}

export interface IAuditable {
  createdAt: string;
  updatedAt?: string;
}
