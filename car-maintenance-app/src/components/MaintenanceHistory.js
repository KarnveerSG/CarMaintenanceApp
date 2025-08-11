import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Select } from './StyledComponents';

const HistoryCard = styled(Card)`
  margin-bottom: 16px;
  
  .task-date {
    color: ${props => props.theme.primary};
    font-size: 0.9em;
    margin-bottom: 8px;
  }
  
  .task-vehicle {
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .task-mileage {
    color: ${props => props.theme.secondary};
    font-size: 0.9em;
  }
`;

const NoTasks = styled.p`
  text-align: center;
  color: ${props => props.theme.text}aa;
  margin: 32px 0;
  font-style: italic;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SelectContainer = styled.div`
  min-width: 200px;
  
  label {
    display: block;
    margin-bottom: 8px;
    color: ${props => props.theme.text};
  }
`;

const MaintenanceHistory = ({ tasks, cars, timeRange, customDateRange }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('all');

  const getFilteredTasks = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '3':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '12':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'ytd':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        startDate = new Date(customDateRange.start);
        now = new Date(customDateRange.end);
        break;
      default:
        startDate.setMonth(now.getMonth() - 3);
    }
    
    return tasks
      .filter(task => {
        const taskDate = new Date(task.date);
        const dateMatches = taskDate >= startDate && taskDate <= now;
        const vehicleMatches = selectedVehicle === 'all' || task.vehicleId === selectedVehicle;
        return dateMatches && vehicleMatches;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredTasks = getFilteredTasks();
  
  if (filteredTasks.length === 0) {
    return <NoTasks>No maintenance tasks found for the selected time period.</NoTasks>;
  }

  return (
    <div>
      <FilterContainer>
        <SelectContainer>
          <label>Select Vehicle</label>
          <Select 
            value={selectedVehicle} 
            onChange={(e) => setSelectedVehicle(e.target.value)}
          >
            <option value="all">All Vehicles</option>
            {cars.map(car => (
              <option key={car.id} value={car.id}>
                {car.name} ({car.year} {car.make} {car.model})
              </option>
            ))}
          </Select>
        </SelectContainer>
      </FilterContainer>
      
      {filteredTasks.map(task => {
        const vehicle = cars.find(car => car.id === task.vehicleId);
        return (
          <HistoryCard key={task.id}>
            <div className="task-date">
              {new Date(task.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="task-vehicle">
              {vehicle ? vehicle.name : 'Unknown Vehicle'}
            </div>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <div className="task-mileage">
              Mileage: {task.mileage ? task.mileage.toLocaleString() : 'Not recorded'}
            </div>
          </HistoryCard>
        );
      })}
    </div>
  );
};

export default MaintenanceHistory;
