import React from 'react';
import styled from 'styled-components';
import { Select } from './StyledComponents';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-end;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;

  label {
    display: block;
    margin-bottom: 8px;
    color: ${props => props.theme.text};
    font-weight: 500;
  }
`;

const CustomRangeContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.cardBg};
  color: ${props => props.theme.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const MaintenanceFilters = ({ 
  selectedVehicle,
  onVehicleChange,
  timeRange,
  onTimeRangeChange,
  customRange,
  onCustomRangeChange,
  cars
}) => {
  const handleTimeRangeChange = (e) => {
    const newValue = e.target.value;
    if (newValue === 'ytd') {
      const now = new Date();
      const ytdDates = {
        start: new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      };
      onCustomRangeChange(ytdDates);
    }
    onTimeRangeChange(newValue);
  };

  return (
    <FilterContainer>
      <h3>Filter Maintenance History</h3>
      <FilterRow>
        <FilterGroup>
          <label>Select Vehicle</label>
          <Select value={selectedVehicle} onChange={onVehicleChange}>
            <option value="all">All Vehicles</option>
            {cars.map(car => (
              <option key={car.id} value={car.id}>
                {car.name} ({car.year} {car.make} {car.model})
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <label>Time Range</label>
          <Select value={timeRange} onChange={handleTimeRangeChange}>
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="12">Last 12 Months</option>
            <option value="ytd">Year to Date</option>
            <option value="custom">Custom Range</option>
          </Select>
        </FilterGroup>
      </FilterRow>

      {timeRange === 'custom' && (
        <FilterRow>
          <CustomRangeContainer style={{ width: '100%' }}>
            <FilterGroup>
              <label>Start Date</label>
              <DateInput
                type="date"
                value={customRange.start}
                onChange={(e) => onCustomRangeChange({ ...customRange, start: e.target.value })}
              />
            </FilterGroup>
            <FilterGroup>
              <label>End Date</label>
              <DateInput
                type="date"
                value={customRange.end}
                onChange={(e) => onCustomRangeChange({ ...customRange, end: e.target.value })}
              />
            </FilterGroup>
          </CustomRangeContainer>
        </FilterRow>
      )}
    </FilterContainer>
  );
};

export default MaintenanceFilters;
