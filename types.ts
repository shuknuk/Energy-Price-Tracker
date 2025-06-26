
export interface EnergyPricePoint {
  timestamp: Date;
  price: number; // Price in $/kWh
}

export interface CalculationResult {
  startTime: Date;
  cost: number;
}

export interface ApplianceDetails {
  power: number; // in Watts
  duration: number; // in hours
}
