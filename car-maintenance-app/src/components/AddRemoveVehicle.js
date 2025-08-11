import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Input } from './StyledComponents';

const VehicleForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ExistingVehicles = styled.div`
  margin-top: 32px;
`;

const AddRemoveVehicle = ({ cars, onAddCar, onRemoveCar }) => {
  const [newCar, setNewCar] = useState({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCar({
      ...newCar,
      id: Date.now().toString(),
      mileage: parseInt(newCar.mileage, 10)
    });
    setNewCar({
      name: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <Card>
        <h3>Add New Vehicle</h3>
        <VehicleForm onSubmit={handleSubmit}>
          <Input
            name="name"
            value={newCar.name}
            onChange={handleInputChange}
            placeholder="Nickname (e.g., Daily Driver)"
            required
          />
          <InputGroup>
            <Input
              name="make"
              value={newCar.make}
              onChange={handleInputChange}
              placeholder="Make (e.g., Toyota)"
              required
            />
            <Input
              name="model"
              value={newCar.model}
              onChange={handleInputChange}
              placeholder="Model (e.g., Camry)"
              required
            />
          </InputGroup>
          <InputGroup>
            <Input
              type="number"
              name="year"
              value={newCar.year}
              onChange={handleInputChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              required
            />
            <Input
              type="number"
              name="mileage"
              value={newCar.mileage}
              onChange={handleInputChange}
              placeholder="Current Mileage"
              min="0"
              required
            />
          </InputGroup>
          <Button type="submit" variant="primary">Add Vehicle</Button>
        </VehicleForm>
      </Card>

      <ExistingVehicles>
        <h3>Your Vehicles</h3>
        {cars.map(car => (
          <Card key={car.id}>
            <h4>{car.name}</h4>
            <p>{car.year} {car.make} {car.model}</p>
            <p>Current Mileage: {car.mileage.toLocaleString()} miles</p>
            <Button
              variant="danger"
              onClick={() => {
                if (window.confirm(`Are you sure you want to remove ${car.name}?`)) {
                  onRemoveCar(car.id);
                }
              }}
            >
              Remove Vehicle
            </Button>
          </Card>
        ))}
      </ExistingVehicles>
    </div>
  );
};

export default AddRemoveVehicle;
