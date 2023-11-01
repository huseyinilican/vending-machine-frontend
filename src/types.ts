import { ObjectId } from "mongodb";

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  temperature: number;
  imageUrl: string;
};

export type Transaction = {
  id?: ObjectId;
  product?: Product;
  insertedMoney: number;
  change: number;
  timeStamp: string;
};

export type MachineSettings = {
  id?: ObjectId;
  someKey: string;
  resetRequired: boolean;
  collectedMoney: number;
  temperatureThreshold: number;
};
