import React from 'react';
import styled from 'styled-components';
import { Select } from './StyledComponents';

const Container = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SelectWrapper = styled.div`
  min-width: 200px;

  label {
    display: block;
    margin-bottom: 8px;
    color: ${props => props.theme.text};
  }
`;

const CustomRangeContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }

  span {
    color: ${props => props.theme.text};
  }

  input {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid ${props => props.theme.border};
    background: ${props => props.theme.cardBg};
    color: ${props => props.theme.text};
  }
`;

const TimeRangeSelector = ({ value, onChange, customRange, onCustomRangeChange }) => {
  const getYTDDates = () => {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    };
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue === 'ytd') {
      const ytdDates = getYTDDates();
      onCustomRangeChange(ytdDates);
    }
    onChange(newValue);
  };

  return (
    <Container>
      <SelectWrapper>
        <label>Time Range</label>
        <Select value={value} onChange={handleChange}>
          <option value="3">Last 3 Months</option>
          <option value="6">Last 6 Months</option>
          <option value="12">Last 12 Months</option>
          <option value="ytd">Year to Date</option>
          <option value="custom">Custom Range</option>
        </Select>
      </SelectWrapper>

      {value === 'custom' && (
        <CustomRangeContainer>
          <div>
            <label>Start Date</label>
            <input
              type="date"
              value={customRange.start}
              onChange={(e) => onCustomRangeChange({ ...customRange, start: e.target.value })}
            />
          </div>
          <span>to</span>
          <div>
            <label>End Date</label>
            <input
              type="date"
              value={customRange.end}
              onChange={(e) => onCustomRangeChange({ ...customRange, end: e.target.value })}
            />
          </div>
        </CustomRangeContainer>
      )}
    </Container>
  );
};

export default TimeRangeSelector;
