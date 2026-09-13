export type CopyOption = 's1' | 's2' | 't1' | 't2' | 'a1' | 'a2' | 'skip';

export interface CurrencyState {
  cny: string;
  rate: string;
}

export interface Part1State {
  items: string;
  weight: string;
  price: string;
  rateSea: string;
  rateTruck: string;
  rateAir: string;
  activeSea: boolean;
  activeTruck: boolean;
  activeAir: boolean;
}

export interface Part2State {
  qty: string;
  rateSea: string;
  rateTruck: string;
  rateAir: string;
  activeSea: boolean;
  activeTruck: boolean;
  activeAir: boolean;
}
