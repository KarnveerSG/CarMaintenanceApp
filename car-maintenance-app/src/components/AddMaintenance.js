import React, { useState } from 'react';
import { saveToLocalStorage, loadFromLocalStorage, LS_TASKS } from '../utils';

const AddMaintenance = ({ cars }) => {
  const [selectedCar, setSelectedCar] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueMileage, setDueMileage] = useState('');
  const [recurrence, setRecurrence] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCar || !taskInput) {
      alert('Please select a car and enter a task description');
      return;
    }

    const tasks = loadFromLocalStorage(LS_TASKS) || [];
    const newTask = {
      carId: selectedCar,
      task: taskInput,
      dueDate,
      dueMileage: dueMileage ? parseInt(dueMileage) : null,
      recurrence: recurrence ? parseInt(recurrence) : null,
      dateAdded: new Date().toISOString(),
      completed: false
    };

    tasks.push(newTask);
    saveToLocalStorage(LS_TASKS, tasks);
    
    // Reset form
    setTaskInput('');
    setDueDate('');
    setDueMileage('');
    setRecurrence('');
  };

  return (
    <div className="add-maintenance-container">
      <h2>Add Maintenance Task</h2>
      <form onSubmit={handleSubmit} className="maintenance-form">
        <div className="form-group">
          <label htmlFor="car-select">Select Vehicle:</label>
          <select
            id="car-select"
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            required
          >
            <option value="">Choose a vehicle</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.name} ({car.year} {car.make} {car.model})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-input">Maintenance Task:</label>
          <input
            id="task-input"
            type="text"
            placeholder="e.g., Oil Change"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="due-date">Due Date:</label>
          <input
            id="due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="due-mileage">Due at Mileage:</label>
          <input
            id="due-mileage"
            type="number"
            placeholder="e.g., 60000"
            value={dueMileage}
            onChange={(e) => setDueMileage(e.target.value)}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="recurrence">Recurrence (miles):</label>
          <input
            id="recurrence"
            type="number"
            placeholder="e.g., 5000 for every 5000 miles"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            min="0"
          />
        </div>

        <button type="submit" className="button">Add Task</button>
      </form>
    </div>
  );
};

export default AddMaintenance;
