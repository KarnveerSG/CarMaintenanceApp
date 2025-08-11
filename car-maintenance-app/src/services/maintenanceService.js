import axios from 'axios';

const MAINTENANCE_SOURCES = [
  'https://www.carcare.org/car-maintenance-schedules',
  'https://www.edmunds.com/car-maintenance',
  'https://www.kbb.com/car-advice/service-schedule'
];

async function searchServiceManual(make, model, year) {
  try {
    // Search for specific car maintenance schedules
    const query = `${year} ${make} ${model} maintenance schedule service intervals`;
    const results = await Promise.all(MAINTENANCE_SOURCES.map(async (source) => {
      try {
        const response = await axios.get(source, {
          params: { q: query }
        });
        return response.data;
      } catch (error) {
        console.warn(`Failed to fetch from ${source}:`, error);
        return null;
      }
    }));

    // Process and combine results
    return parseMaintenanceSchedule(results.filter(Boolean));
  } catch (error) {
    console.error('Error searching maintenance schedules:', error);
    return getFallbackSchedule(make, model, year);
  }
}

function getFallbackSchedule(make, model, year) {
  // Common maintenance intervals based on industry standards
  return {
    regular: [
      {
        interval: 5000,
        items: ['Oil and Filter Change', 'Tire Rotation', 'Multi-Point Inspection']
      },
      {
        interval: 15000,
        items: ['Cabin Air Filter Replacement', 'Brake Inspection']
      },
      {
        interval: 30000,
        items: [
          'Air Filter Replacement',
          'Power Steering Fluid Check',
          'Transmission Fluid Check',
          'Battery Test'
        ]
      },
      {
        interval: 60000,
        items: [
          'Timing Belt Inspection/Replacement',
          'Coolant Flush',
          'Spark Plug Replacement',
          'Transmission Service'
        ]
      }
    ],
    severe: [
      {
        interval: 3000,
        items: ['Oil and Filter Change']
      },
      {
        interval: 7500,
        items: ['Tire Rotation', 'Brake Inspection']
      },
      // Add more severe condition maintenance items
    ]
  };
}

function parseMaintenanceSchedule(results) {
  // Implement parsing logic for maintenance schedules
  // This would process the scraped data and return a structured schedule
  // For now, return the fallback schedule
  return getFallbackSchedule();
}

export async function getRecommendedMaintenance(make, model, year, mileage) {
  const schedule = await searchServiceManual(make, model, year);
  
  // Filter and sort maintenance items based on current mileage
  const upcomingMaintenance = schedule.regular
    .filter(item => item.interval > mileage % item.interval)
    .map(item => ({
      ...item,
      dueMileage: Math.floor(mileage / item.interval) * item.interval + item.interval
    }))
    .sort((a, b) => a.dueMileage - b.dueMileage);

  return upcomingMaintenance;
}

export function estimateMaintenanceCost(maintenanceItem) {
  // Rough cost estimates for common maintenance tasks
  const costEstimates = {
    'Oil and Filter Change': { min: 30, max: 80 },
    'Tire Rotation': { min: 20, max: 50 },
    'Brake Inspection': { min: 30, max: 100 },
    'Air Filter Replacement': { min: 20, max: 60 },
    'Cabin Air Filter Replacement': { min: 30, max: 70 },
    'Timing Belt Replacement': { min: 500, max: 1000 },
    'Transmission Service': { min: 80, max: 250 },
    'Coolant Flush': { min: 60, max: 120 },
    'Spark Plug Replacement': { min: 40, max: 150 }
  };

  return costEstimates[maintenanceItem] || { min: 50, max: 200 }; // Default range for unknown items
}

export { searchServiceManual, getFallbackSchedule };
