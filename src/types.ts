export type Product = {
  id?: string;
  name: string;
  price: number;
  stock: number;
  temperature: number;
  imageUrl: string;
};

export type Transaction = {
  id?: string;
  product?: Product;
  insertedMoney: number;
  change: number;
  timeStamp: string;
};

export type MachineSettings = {
  id?: string;
  someKey: string;
  resetRequired: boolean;
  collectedMoney: number;
  temperatureThreshold: number;
};
