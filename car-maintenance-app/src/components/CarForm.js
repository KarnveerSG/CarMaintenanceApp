import React, { useState, useEffect } from 'react';
import { validateCar, getCarImage, getMaintenanceSchedule } from '../carUtils';

const CarForm = ({ onSubmit, initialValues = {} }) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    make: initialValues.make || '',
    model: initialValues.model || '',
    year: initialValues.year || '',
    mileage: initialValues.mileage || ''
  });
  const [validationError, setValidationError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsValidating(true);
    setValidationError(null);

    try {
      const validation = await validateCar(formData.make, formData.model, formData.year);
      
      if (!validation.valid) {
        setValidationError(validation.message);
        if (validation.continueAnyway) {
          const shouldContinue = window.confirm(
            `${validation.message} Would you like to continue anyway?`
          );
          if (shouldContinue) {
            onSubmit(formData);
          }
        }
        return;
      }

      onSubmit(formData);
    } catch (error) {
      setValidationError('An error occurred while validating the car details');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="car-form">
      <div className="form-group">
        <label htmlFor="name">Nickname for this car:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="make">Make:</label>
        <input
          type="text"
          id="make"
          name="make"
          value={formData.make}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="model">Model:</label>
        <input
          type="text"
          id="model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="year">Year:</label>
        <input
          type="number"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          min="1885"
          max={new Date().getFullYear() + 1}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="mileage">Current Mileage:</label>
        <input
          type="number"
          id="mileage"
          name="mileage"
          value={formData.mileage}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      {validationError && (
        <div className="error-message">
          {validationError}
        </div>
      )}

      <button type="submit" className="button" disabled={isValidating}>
        {isValidating ? 'Validating...' : 'Add Car'}
      </button>
    </form>
  );
};

export default CarForm;
