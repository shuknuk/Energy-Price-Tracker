
import type { EnergyPricePoint } from '../types';

// This mock service simulates fetching data from the U.S. Energy Information Administration (EIA) API.
// It generates a week's worth of hourly price data with realistic fluctuations.
class MockEnergyService {
  public getWeeklyPriceData(): Promise<EnergyPricePoint[]> {
    return new Promise((resolve) => {
      const data: EnergyPricePoint[] = [];
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      for (let d = new Date(sevenDaysAgo); d <= now; d.setHours(d.getHours() + 1)) {
        const hour = d.getHours();
        
        // Base price
        let basePrice = 0.10; // $0.10/kWh
        
        // Peak hours (4 PM - 8 PM)
        if (hour >= 16 && hour <= 20) {
          basePrice += 0.15 * Math.random() + 0.05; // Significantly more expensive
        }
        // Off-peak hours (12 AM - 5 AM)
        else if (hour >= 0 && hour <= 5) {
          basePrice -= 0.05 * Math.random() + 0.02; // Cheaper
        }
        // Shoulder hours
        else {
          basePrice += (Math.random() - 0.5) * 0.04; // Mild fluctuation
        }
        
        // Weekend discount
        if (d.getDay() === 0 || d.getDay() === 6) {
            basePrice *= 0.8;
        }

        // Ensure price is not negative
        const finalPrice = Math.max(0.02, basePrice);

        data.push({
          timestamp: new Date(d),
          price: parseFloat(finalPrice.toFixed(4)),
        });
      }
      
      // Simulate network delay
      setTimeout(() => resolve(data), 500);
    });
  }
}

export const mockEnergyService = new MockEnergyService();
