import React, { useState, useEffect } from 'react';
import { getMaintenanceSchedule } from '../carUtils';

const MaintenanceRecommendations = ({ car }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = await getMaintenanceSchedule(car.make, car.model, car.year);
        setSchedule(data);
      } catch (err) {
        setError('Failed to load maintenance recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [car]);

  if (loading) {
    return <div className="loading">Loading maintenance schedule...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="maintenance-recommendations">
      <h3>Recommended Maintenance for {car.year} {car.make} {car.model}</h3>
      {schedule.length === 0 ? (
        <p>No maintenance recommendations available for this vehicle.</p>
      ) : (
        <div className="recommendations-grid">
          {schedule.map((item, index) => (
            <div key={index} className="recommendation-card">
              <div className="recommendation-header">
                <h4>{item.service}</h4>
                <span className="mileage">{item.mileage} miles</span>
              </div>
              <p className="description">{item.description}</p>
              <div className="estimated-cost">
                Estimated Cost: ${item.estimatedCost?.min || '??'} - ${item.estimatedCost?.max || '??'}
              </div>
              <div className="importance-level">
                Priority: {item.importance || 'Regular'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceRecommendations;
