// Utility functions for Car Maintenance Tracker

export const LS_USER = 'cm_user';
export const LS_CARS = 'cm_cars';
export const LS_TASKS = 'cm_tasks';

export function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLocalStorage(key, fallback = []) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export function exportData(userName, cars, tasks) {
  const data = { userName, cars, tasks };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'car-maintenance-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file, onImport) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = JSON.parse(evt.target.result);
      onImport(data);
    } catch {
      alert('Invalid file format.');
    }
  };
  reader.readAsText(file);
}

export function getCarMileage(cars, vehicleId) {
  const car = cars.find(c => c.id === vehicleId);
  return car ? Number(car.mileage) : 0;
}

export function getUpcomingTasks(tasks, cars) {
  const today = new Date().toISOString().slice(0, 10);
  return tasks.filter(task => !task.completed && (task.dueDate <= today || Number(task.dueMileage) <= getCarMileage(cars, task.vehicleId)));
}
