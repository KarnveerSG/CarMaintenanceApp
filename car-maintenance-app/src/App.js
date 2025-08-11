import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import './App.css';
import {
  LS_USER, LS_CARS, LS_TASKS,
  saveToLocalStorage, loadFromLocalStorage,
  getUpcomingTasks
} from './utils';
import logo from './assets/logo-small.svg';
import { THEMES } from './themes';
import AddMaintenance from './components/AddMaintenance';
import ImportExportSection from './components/ImportExportSection';
import TimeRangeSelector from './components/TimeRangeSelector';
import MaintenanceRecommendations from './components/MaintenanceRecommendations';
import HelpTooltip from './components/HelpTooltip';
import HelpDetailPopup from './components/HelpDetailPopup';
import AddRemoveVehicle from './components/AddRemoveVehicle';
import MaintenanceHistory from './components/MaintenanceHistory';
import MaintenanceFilters from './components/MaintenanceFilters';
import HELP_CONTENT from './constants/helpContent';
import {
  AppContainer,
  Sidebar,
  Logo,
  AppTitle,
  TabButton,
  MainContent,
  ContentHeader,
  ContentBody,
  Card,
  Button,
  Input,
  Select
} from './components/StyledComponents';

const SIDEBAR_TABS = [
  { key: 'home', label: 'Home', help: 'Overview of your vehicles and upcoming maintenance' },
  { key: 'vehicles', label: 'My Vehicles', help: "View and manage your vehicles' information" },
  { key: 'addremove', label: 'Add/Remove Vehicle', help: 'Add new vehicles or remove existing ones' },
  { key: 'maintenance', label: 'Add Maintenance', help: 'Record maintenance tasks for your vehicles' },
  { key: 'recommended', label: 'Recommended', help: 'View recommended maintenance for your vehicles' },
  { key: 'history', label: 'Maintenance History', help: 'View past maintenance records' },
  { key: 'importexport', label: 'Import/Export', help: 'Backup or restore your data' },
  { key: 'settings', label: 'Settings', help: 'Customize app appearance and preferences' },
  { key: 'help', label: 'Help', help: 'Learn how to use the app' }
];

const FONT_SIZES = {
  small: {
    base: '14px',
    h1: '24px',
    h2: '20px',
    h3: '16px'
  },
  medium: {
    base: '16px',
    h1: '28px',
    h2: '24px',
    h3: '20px'
  },
  large: {
    base: '18px',
    h1: '32px',
    h2: '28px',
    h3: '24px'
  }
};

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [userName, setUserName] = useState(() => localStorage.getItem(LS_USER) || '');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'medium');
  const [selectedHelpTopic, setSelectedHelpTopic] = useState(null);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return savedTheme || 'light';
  });

  const [userNameInput, setUserNameInput] = useState('');
  const [userNameSubmitted, setUserNameSubmitted] = useState(!!localStorage.getItem(LS_USER));
  const [cars, setCars] = useState(() => loadFromLocalStorage(LS_CARS) || []);
  const [tasks, setTasks] = useState(() => loadFromLocalStorage(LS_TASKS) || []);
  const [timeRange, setTimeRange] = useState('3'); // Options: '3', '6', '12', 'ytd', 'custom'
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Listen for system theme changes
  useEffect(() => {
    if (localStorage.getItem('theme') === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Persist data to localStorage
  useEffect(() => { localStorage.setItem(LS_USER, userName); }, [userName]);
  useEffect(() => { saveToLocalStorage(LS_CARS, cars); }, [cars]);
  useEffect(() => { saveToLocalStorage(LS_TASKS, tasks); }, [tasks]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('theme', theme); }, [theme]);

  // Apply theme and font size to document root
  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZES[fontSize].base;
    document.documentElement.style.backgroundColor = THEMES[theme].background;
    document.documentElement.style.color = THEMES[theme].text;
  }, [fontSize, theme]);

  const handleUserNameSubmit = (e) => {
    e.preventDefault();
    setUserName(userNameInput);
    setUserNameSubmitted(true);
    localStorage.setItem(LS_USER, userNameInput);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This will permanently remove all your data and cannot be undone.')) {
      localStorage.clear();
      setUserName('');
      setUserNameSubmitted(false);
      setCars([]);
      setTasks([]);
      setActiveTab('home');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'addremove':
        return (
          <AddRemoveVehicle
            cars={cars}
            onAddCar={(car) => setCars([...cars, car])}
            onRemoveCar={(carId) => {
              setCars(cars.filter(c => c.id !== carId));
              setTasks(tasks.filter(t => t.vehicleId !== carId));
            }}
          />
        );

      case 'home':
        return (
          <Card>
            <h2>Welcome, {userName}</h2>
            <div className="upcoming-maintenance">
              <h3>Upcoming Maintenance</h3>
              {tasks.map(task => {
                const dueDate = new Date(task.date);
                const now = new Date();
                const threeMontshFromNow = new Date();
                threeMontshFromNow.setMonth(now.getMonth() + 3);
                
                let statusColor = 'inherit';
                if (dueDate < now) {
                  statusColor = '#dc3545'; // red for overdue
                } else if (dueDate <= threeMontshFromNow) {
                  statusColor = '#ffc107'; // yellow for due soon
                }

                return (
                  <Card 
                    key={task.id}
                    style={{ 
                      borderLeft: `4px solid ${statusColor}`,
                      marginBottom: '16px'
                    }}
                  >
                    <h4>{task.title}</h4>
                    <p>Vehicle: {cars.find(car => car.id === task.vehicleId)?.name}</p>
                    <p style={{ color: statusColor, fontWeight: 'bold' }}>
                      Due: {new Date(task.date).toLocaleDateString()}
                    </p>
                    {task.mileage && 
                      <p>Due at: {task.mileage.toLocaleString()} miles</p>
                    }
                  </Card>
                );
              })}
            </div>
          </Card>
        );

      case 'vehicles':
        return (
          <div>
            <h2>My Vehicles</h2>
            {cars.map(car => (
              <Card key={car.id}>
                <h3>{car.name}</h3>
                <p>{car.year} {car.make} {car.model}</p>
                <p>Current Mileage: {car.mileage.toLocaleString()} miles</p>
              </Card>
            ))}
          </div>
        );

      case 'maintenance':
        return (
          <div style={{ padding: '20px' }}>
            {/* Add Maintenance Form */}
            <Card style={{ maxWidth: '800px', margin: '0 auto 32px', padding: '32px' }}>
              <h2 style={{ marginBottom: '24px' }}>Add Maintenance Task</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>Select Vehicle</label>
                  <Select style={{ width: '100%' }}>
                    <option value="">Choose a vehicle...</option>
                    {cars.map(car => (
                      <option key={car.id} value={car.id}>
                        {car.name} ({car.year} {car.make} {car.model})
                      </option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>Maintenance Task</label>
                  <Input
                    type="text"
                    placeholder="e.g., Oil Change, Tire Rotation"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>Due Date</label>
                  <Input
                    type="date"
                    style={{ width: '200px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>Due at Mileage</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Input
                      type="number"
                      placeholder="e.g., 50000"
                      style={{ width: '150px' }}
                    />
                    <span>miles</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>Recurrence (optional)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Input
                      type="number"
                      placeholder="e.g., 3000"
                      style={{ width: '150px' }}
                    />
                    <span>miles</span>
                  </div>
                  <p style={{ color: '#888', marginTop: '8px', fontSize: '0.9em' }}>
                    Set how often this maintenance should recur
                  </p>
                </div>

                <Button variant="primary" style={{ marginTop: '16px' }}>
                  Add Task
                </Button>
              </div>
            </Card>

            {/* Existing Maintenance Tasks */}
            <Card style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2>Existing Maintenance Tasks</h2>
                <Select 
                  style={{ width: '200px' }}
                  onChange={(e) => {
                    // Filter tasks by vehicle
                    const vehicleId = e.target.value;
                    setSelectedVehicle(vehicleId);
                  }}
                >
                  <option value="all">All Vehicles</option>
                  {cars.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.name}
                    </option>
                  ))}
                </Select>
              </div>

              {tasks
                .filter(task => selectedVehicle === 'all' || task.vehicleId === selectedVehicle)
                .map(task => {
                  const car = cars.find(c => c.id === task.vehicleId);
                  return (
                    <Card 
                      key={task.id} 
                      style={{ 
                        marginBottom: '16px',
                        position: 'relative',
                        paddingRight: '48px' // Make room for delete button
                      }}
                    >
                      <Button
                        variant="danger"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this maintenance task?')) {
                            setTasks(tasks.filter(t => t.id !== task.id));
                          }
                        }}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          padding: '8px',
                          minWidth: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </Button>
                      <h4>{task.title}</h4>
                      <p>Vehicle: {car?.name}</p>
                      <p>Due: {new Date(task.date).toLocaleDateString()}</p>
                      {task.mileage && <p>At: {task.mileage.toLocaleString()} miles</p>}
                      {task.recurrence && <p>Recurs every: {task.recurrence.toLocaleString()} miles</p>}
                    </Card>
                  );
                })}
              {tasks.length === 0 && (
                <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                  No maintenance tasks found.
                </p>
              )}
            </Card>
          </div>
        );

      case 'recommended':
        return (
          <div>
            <h2>Recommended Maintenance</h2>
            {cars.map(car => (
              <MaintenanceRecommendations key={car.id} car={car} />
            ))}
          </div>
        );

      case 'history':
        return (
          <div>
            <Card style={{ marginBottom: '24px' }}>
              <MaintenanceFilters
                selectedVehicle={selectedVehicle}
                onVehicleChange={(e) => setSelectedVehicle(e.target.value)}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                customRange={customDateRange}
                onCustomRangeChange={setCustomDateRange}
                cars={cars}
              />
            </Card>
            <div>
              {tasks
                .filter(task => selectedVehicle === 'all' || task.vehicleId === selectedVehicle)
                .filter(task => {
                  const taskDate = new Date(task.date);
                  let endDate = new Date();
                  let startDate = new Date();
                  
                  switch (timeRange) {
                    case '3':
                      startDate.setMonth(endDate.getMonth() - 3);
                      break;
                    case '6':
                      startDate.setMonth(endDate.getMonth() - 6);
                      break;
                    case '12':
                      startDate.setFullYear(endDate.getFullYear() - 1);
                      break;
                    case 'ytd':
                      startDate = new Date(endDate.getFullYear(), 0, 1);
                      break;
                    case 'custom':
                      startDate = new Date(customDateRange.start);
                      endDate = new Date(customDateRange.end);
                      break;
                    default:
                      startDate.setMonth(endDate.getMonth() - 3);
                  }
                  
                  return taskDate >= startDate && taskDate <= endDate;
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(task => (
                  <Card key={task.id}>
                    <div style={{ marginBottom: '8px', color: '#61dafb' }}>
                      {new Date(task.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <div style={{ marginTop: '8px', color: '#888' }}>
                      Vehicle: {cars.find(car => car.id === task.vehicleId)?.name}
                      {task.mileage && ` • Mileage: ${task.mileage.toLocaleString()} miles`}
                    </div>
                  </Card>
                ))}
              {tasks.length === 0 && (
                <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: '32px' }}>
                  No maintenance tasks found for the selected time period.
                </p>
              )}
            </div>
          </div>
        );

      case 'importexport':
        return <ImportExportSection />;

      case 'help':
        return (
          <div className="help-content">
            <h2>Help Center</h2>
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {SIDEBAR_TABS.map(tab => (
                <Card 
                  key={tab.key}
                  onClick={() => setSelectedHelpTopic(tab.key)}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <h3>{HELP_CONTENT[tab.key].title}</h3>
                  <p>{HELP_CONTENT[tab.key].description}</p>
                  <Button variant="secondary" style={{ marginTop: '12px' }}>
                    Learn More
                  </Button>
                </Card>
              ))}
            </div>
            {selectedHelpTopic && HELP_CONTENT[selectedHelpTopic] && (
              <HelpDetailPopup
                content={HELP_CONTENT[selectedHelpTopic]}
                onClose={() => setSelectedHelpTopic(null)}
              />
            )}
          </div>
        );

      case 'settings':
        return (
          <div>
            <h2>Settings</h2>
            <Card>
              <h3>Appearance</h3>
              <div>
                <label>Font Size:</label>
                <Select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </Select>
              </div>
              <div>
                <label>Theme:</label>
                <Select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System (Auto)</option>
                </Select>
              </div>
            </Card>
            <Card>
              <h3>Account Settings</h3>
              <div style={{
                background: 'rgba(220, 53, 69, 0.1)',
                border: '1px solid #dc3545',
                borderRadius: '8px',
                padding: '20px',
                marginTop: '24px'
              }}>
                <h4 style={{ color: '#dc3545', marginBottom: '12px' }}>Danger Zone</h4>
                <p style={{ marginBottom: '16px' }}>
                  Deleting your account will permanently remove all your data. 
                  This action cannot be undone.
                </p>
                <Button 
                  onClick={handleDeleteAccount} 
                  variant="danger"
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    '&:hover': {
                      background: '#bb2d3b'
                    }
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (!userNameSubmitted) {
    return (
      <ThemeProvider theme={THEMES[theme]}>
        <AppContainer style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: THEMES[theme].background
        }}>
          <Card style={{
            maxWidth: '400px',
            width: '90%',
            padding: '32px',
            textAlign: 'center'
          }}>
            <form onSubmit={handleUserNameSubmit}>
              <h2 style={{ 
                marginBottom: '16px',
                fontSize: '24px',
                fontWeight: '600'
              }}>
                Welcome to Car Maintenance
              </h2>
              <p style={{ 
                marginBottom: '24px',
                color: THEMES[theme].text + 'cc'
              }}>
                Please enter your name to get started:
              </p>
              <Input
                id="username"
                type="text"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                placeholder="Your name"
                required
                style={{
                  marginBottom: '24px',
                  padding: '12px',
                  width: '100%',
                  fontSize: '16px'
                }}
              />
              <Button 
                type="submit" 
                variant="primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px'
                }}
              >
                Continue
              </Button>
            </form>
          </Card>
        </AppContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={THEMES[theme]}>
      <AppContainer>
        <Sidebar>
          <Logo src={logo} alt="Logo" />
          <AppTitle>Car Maintenance</AppTitle>
          {SIDEBAR_TABS.map(tab => (
            <TabButton
              key={tab.key}
              isActive={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </TabButton>
          ))}
        </Sidebar>
        <MainContent>
          <ContentHeader>
            <h2>{SIDEBAR_TABS.find(tab => tab.key === activeTab)?.label}</h2>
            <HelpTooltip activeTab={activeTab} tabs={SIDEBAR_TABS} />
          </ContentHeader>
          <ContentBody>
            {renderContent()}
          </ContentBody>
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
