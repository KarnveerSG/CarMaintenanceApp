import React, { useState, useEffect } from 'react';
import './App.css';
import {
  LS_USER, LS_CARS, LS_TASKS,
  saveToLocalStorage, loadFromLocalStorage,
  exportData, importData,
  getCarMileage, getUpcomingTasks
} from './utils';
import logo from './logo.svg';

const SIDEBAR_TABS = [
  { key: 'home', label: 'Home' },
  { key: 'vehicles', label: 'My Vehicles' },
  { key: 'addremove', label: 'Add/Remove Vehicle' },
  { key: 'history', label: 'Previous Maintenance' },
  { key: 'importexport', label: 'Import/Export Data' },
  { key: 'settings', label: 'Settings' }
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

const THEMES = {
  light: {
    background: '#ffffff',
    text: '#000000',
    primary: '#1e90ff',
    secondary: '#61dafb',
    danger: '#dc3545',
    success: '#28a745',
    warning: '#ffc107',
    cardBg: '#f8f9fa',
    sidebarBg: '#e9ecef'
  },
  dark: {
    background: '#181818',
    text: '#ffffff',
    primary: '#1e90ff',
    secondary: '#61dafb',
    danger: '#dc3545',
    success: '#28a745',
    warning: '#ffc107',
    cardBg: '#1e1e1e',
    sidebarBg: '#181818'
  }
};

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [userName, setUserName] = useState(() => localStorage.getItem(LS_USER) || '');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'medium');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  const [userNameInput, setUserNameInput] = useState('');
  const [userNameSubmitted, setUserNameSubmitted] = useState(!!localStorage.getItem(LS_USER));
  const [cars, setCars] = useState(() => loadFromLocalStorage(LS_CARS));
  const [tasks, setTasks] = useState(() => loadFromLocalStorage(LS_TASKS) || []);
  const [taskInput, setTaskInput] = useState('');
  const [carInput, setCarInput] = useState({ name: '', make: '', model: '', year: '', mileage: '' });
  const [editingCarId, setEditingCarId] = useState(null);
  const [collapsedStates, setCollapsedStates] = useState({});
  const [timeRange, setTimeRange] = useState('3');
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

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

  const saveUserData = (data) => {
    try {
      localStorage.setItem('userData', JSON.stringify(data));
    } catch (err) {
      console.error('Error saving user data:', err);
    }
  };

  const handleUserNameChange = (e) => {
    setUserNameInput(e.target.value);
  };

  const handleUserNameSubmit = (e) => {
    e.preventDefault();
    setUserName(userNameInput);
    setUserNameSubmitted(true);
    localStorage.setItem(LS_USER, userNameInput);
    saveUserData({ userName: userNameInput, cars, tasks });
  };

  const handleRemoveCar = (id) => {
    const car = cars.find(c => c.id === id);
    if (window.confirm(`Are you sure you want to delete ${car.name}? All maintenance records and tasks associated with this vehicle will be permanently deleted.`)) {
      const updatedCars = cars.filter(car => car.id !== id);
      const updatedTasks = tasks.filter(task => task.vehicleId !== id);
      setCars(updatedCars);
      setTasks(updatedTasks);
      saveUserData({ userName, cars: updatedCars, tasks: updatedTasks });
    }
  };

  const handleCarInputChange = (e) => {
    const { name, value } = e.target;
    setCarInput(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCar = (e) => {
    e.preventDefault();
    const newCar = { ...carInput, id: Date.now().toString() };
    const updatedCars = [...cars, newCar];
    setCars(updatedCars);
    setCarInput({ name: '', make: '', model: '', year: '', mileage: '' });
    saveUserData({ userName, cars: updatedCars, tasks });
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskInput(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskInput.vehicleId) return;
    const newTask = { ...taskInput, id: Date.now().toString(), completed: false };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setTaskInput({ vehicleId: '', title: '', dueDate: '', dueMileage: '', recurrenceMiles: '', completed: false });
    saveUserData({ userName, cars, tasks: updatedTasks });
  };

  const handleCompleteTask = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    saveUserData({ userName, cars, tasks: updatedTasks });
  };

  const handleRemoveTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveUserData({ userName, cars, tasks: updatedTasks });
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

  return (
    <div style={{display:'flex',height:'100vh'}}>
      <nav style={{width:'250px',background:'#181818',color:'#fff',display:'flex',flexDirection:'column',alignItems:'stretch',padding:'32px 0',boxShadow:'2px 0 12px #000'}}>
        <img src={logo} alt="Logo" style={{width:'120px',height:'120px',margin:'0 auto 20px',borderRadius:'10px'}} />
        <h2 style={{textAlign:'center',marginBottom:'32px',fontSize:'24px',letterSpacing:'0.5px'}}>Car Maintenance</h2>
        {SIDEBAR_TABS.map(tab => (
          <button
            key={tab.key}
            style={{
              background: activeTab === tab.key ? 'linear-gradient(90deg,#61dafb,#1e90ff)' : 'none',
              color: activeTab === tab.key ? '#181818' : '#fff',
              border: 'none',
              borderRadius: '0 24px 24px 0',
              padding: '16px 24px',
              margin: '8px 0',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="dashboard-container" style={{flex:1,margin:'40px auto',maxWidth:'800px',padding:'0 20px'}}>
        {!userNameSubmitted ? (
          <form className="user-prompt" onSubmit={handleUserNameSubmit} style={{background:'#1e1e1e',padding:'30px',borderRadius:'10px',boxShadow:'0 4px 6px rgba(0,0,0,0.1)'}}>
            <label htmlFor="username" style={{display:'block',marginBottom:'10px'}}>Enter your name:</label>
            <input
              id="username"
              type="text"
              value={userNameInput}
              onChange={handleUserNameChange}
              placeholder="Your name"
              required
              style={{width:'100%',padding:'10px',marginBottom:'20px',borderRadius:'4px',border:'1px solid #ddd'}}
            />
            <button type="submit" style={{padding:'10px 20px',background:'#1e90ff',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}>Continue</button>
          </form>
        ) : (
          <div>
            {activeTab === 'home' && (
              <div>
                <h1 style={{marginBottom:'30px'}}>Welcome, {userName || userNameInput}!</h1>
                <div style={{marginBottom:'24px',padding:'20px',background:'#1e1e1e',borderRadius:'12px',boxShadow:'0 4px 6px rgba(0,0,0,0.1)'}}>
                  <h3 style={{marginBottom:'20px'}}>Upcoming & Overdue Maintenance</h3>
                  <ul style={{listStyle:'none',padding:0}}>
                    {getUpcomingTasks(tasks, cars).length === 0 && (
                      <li style={{padding:'15px',background:'#222',borderRadius:'8px'}}>All tasks up to date!</li>
                    )}
                    {getUpcomingTasks(tasks, cars).map(task => {
                      const car = cars.find(c => c.id === task.vehicleId);
                      const overdue = task.dueDate <= new Date().toISOString().slice(0,10) || 
                        Number(task.dueMileage) <= getCarMileage(cars, task.vehicleId);
                      return (
                        <li 
                          key={task.id} 
                          style={{
                            background:overdue?'#c00':'#1e90ff',
                            color:'#fff',
                            fontWeight:'bold',
                            padding:'15px',
                            borderRadius:'8px',
                            marginBottom:'10px'
                          }}
                        >
                          {task.title} for {car ? car.name : 'Unknown'} - Due {task.dueDate} / {task.dueMileage} miles
                          {overdue && <span style={{marginLeft:'10px',color:'#fff'}}>Overdue!</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'vehicles' && (
              <div>
                <h2 style={{marginBottom:'30px'}}>Your Vehicles</h2>
                <ul style={{listStyle:'none',padding:0}}>
                  {cars.length === 0 && (
                    <li style={{padding:'20px',background:'#1e1e1e',borderRadius:'8px',marginBottom:'20px'}}>
                      No vehicles added yet.
                    </li>
                  )}
                  {cars.map(car => (
                    <li key={car.id} style={{marginBottom:'20px',background:'#1e1e1e',padding:'20px',borderRadius:'8px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'15px'}}>
                        <span style={{fontSize:'18px'}}>{car.name} ({car.make} {car.model}, {car.year}) - {car.mileage} miles</span>
                        <button 
                          onClick={() => {
                            const newState = {...collapsedStates};
                            newState[car.id] = !newState[car.id];
                            setCollapsedStates(newState);
                          }}
                          style={{
                            background:'none',
                            border:'none',
                            color:'#fff',
                            cursor:'pointer',
                            fontSize:'24px',
                            transform: collapsedStates[car.id] ? 'rotate(0deg)' : 'rotate(180deg)',
                            transition:'transform 0.3s ease'
                          }}
                        >
                          ▼
                        </button>
                      </div>
                      <div style={{
                        marginTop:'15px',
                        maxHeight: collapsedStates[car.id] ? '0' : '1000px',
                        overflow:'hidden',
                        transition:'max-height 0.3s ease-in-out'
                      }}>
                        <h4 style={{marginBottom:'15px'}}>Upcoming Maintenance</h4>
                        <ul style={{listStyle:'none',padding:0}}>
                          {tasks.filter(task => task.vehicleId === car.id && !task.completed).length === 0 && (
                            <li style={{padding:'15px',background:'#222',borderRadius:'8px',marginBottom:'15px'}}>
                              All tasks up to date!
                            </li>
                          )}
                          {tasks.filter(task => task.vehicleId === car.id && !task.completed).map(task => {
                            const overdue = task.dueDate <= new Date().toISOString().slice(0,10) || 
                              Number(task.dueMileage) <= Number(car.mileage);
                            return (
                              <li key={task.id} style={{
                                background: task.completed ? '#222' : overdue ? '#c00' : '#1e90ff',
                                color: task.completed ? '#aaa' : '#fff',
                                fontWeight: overdue ? 'bold' : 'normal',
                                padding:'15px',
                                borderRadius:'8px',
                                marginBottom:'10px',
                                display:'flex',
                                justifyContent:'space-between',
                                alignItems:'center'
                              }}>
                                <div>
                                  {task.title} - Due {task.dueDate} / {task.dueMileage} miles
                                  {overdue && !task.completed && (
                                    <span style={{marginLeft:'10px',color:'#fff'}}>Overdue!</span>
                                  )}
                                </div>
                                <div>
                                  {task.completed ? (
                                    <span style={{marginLeft:'10px',color:'#0f0'}}>Completed</span>
                                  ) : (
                                    <button 
                                      style={{
                                        marginLeft:'10px',
                                        padding:'5px 10px',
                                        background:'#0f0',
                                        color:'#000',
                                        border:'none',
                                        borderRadius:'4px',
                                        cursor:'pointer'
                                      }} 
                                      onClick={() => handleCompleteTask(task.id)}
                                    >
                                      Mark Complete
                                    </button>
                                  )}
                                  <button 
                                    style={{
                                      marginLeft:'10px',
                                      padding:'5px 10px',
                                      background:'#c00',
                                      color:'#fff',
                                      border:'none',
                                      borderRadius:'4px',
                                      cursor:'pointer'
                                    }} 
                                    onClick={() => handleRemoveTask(task.id)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        <form 
                          onSubmit={handleAddTask} 
                          className="add-car-form" 
                          style={{marginTop:'20px',display:'grid',gap:'15px'}}
                        >
                          <input
                            name="title"
                            type="text"
                            value={taskInput.title}
                            onChange={handleTaskInputChange}
                            placeholder="Task (e.g. Oil Change)"
                            required
                            style={{padding:'8px',borderRadius:'4px',border:'1px solid #ddd'}}
                          />
                          <input
                            name="dueDate"
                            type="date"
                            value={taskInput.dueDate}
                            onChange={handleTaskInputChange}
                            required
                            style={{padding:'8px',borderRadius:'4px',border:'1px solid #ddd'}}
                          />
                          <input
                            name="dueMileage"
                            type="number"
                            value={taskInput.dueMileage}
                            onChange={handleTaskInputChange}
                            placeholder="Due Mileage"
                            required
                            style={{padding:'8px',borderRadius:'4px',border:'1px solid #ddd'}}
                          />
                          <input
                            name="recurrenceMiles"
                            type="number"
                            value={taskInput.recurrenceMiles}
                            onChange={handleTaskInputChange}
                            placeholder="Recurrence (miles)"
                            style={{padding:'8px',borderRadius:'4px',border:'1px solid #ddd'}}
                          />
                          <input
                            name="vehicleId"
                            type="hidden"
                            value={car.id}
                          />
                          <button 
                            type="submit" 
                            onClick={() => setTaskInput({...taskInput, vehicleId: car.id})}
                            style={{
                              padding:'10px',
                              background:'#1e90ff',
                              color:'#fff',
                              border:'none',
                              borderRadius:'4px',
                              cursor:'pointer',
                              fontWeight:'bold'
                            }}
                          >
                            Add Task
                          </button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'addremove' && (
              <div>
                <h2 style={{marginBottom:'30px'}}>Add or Remove Vehicle</h2>
                <form 
                  onSubmit={handleAddCar} 
                  className="add-car-form"
                  style={{
                    background:'#1e1e1e',
                    padding:'20px',
                    borderRadius:'8px',
                    marginBottom:'30px',
                    display:'grid',
                    gap:'15px'
                  }}
                >
                  <input 
                    name="name" 
                    type="text" 
                    value={carInput.name} 
                    onChange={handleCarInputChange} 
                    placeholder="Car name (e.g. My Civic)" 
                    required 
                    style={{padding:'8px',borderRadius:'4px',border:'1px solid #ddd'}}
                  />
                  <input 
                    name="make" 
                    type="text" 
                    value={carInput.make} 
                    onChange={handleCarInputChange} 
                    placeholder="Make (e.g. Honda)" 
                    required 
                    style={{padding:'8px',borderRadius:'4px',border:'1px solid #ddd'}}
                  />
                  <input 
                    name="model" 
                    type="text" 
                    value={carInput.model} 
                    onChange={handleCarInputChange} 
                    placeholder="Model (e.g. Civic)" 
                    required 
                    style={{padding:'8px',borderRadius:'4px',border:'1px solid #ddd'}}
                  />
                  <input 
                    name="year" 
                    type="number" 
                    value={carInput.year} 
                    onChange={handleCarInputChange} 
                    placeholder="Year (e.g. 2018)" 
                    required 
                    style={{padding:'8px',borderRadius:'4px',border:'1px solid #ddd'}}
                  />
                  <input 
                    name="mileage" 
                    type="number" 
                    value={carInput.mileage} 
                    onChange={handleCarInputChange} 
                    placeholder="Mileage (e.g. 45000)" 
                    required 
                    style={{padding:'8px',borderRadius:'4px',border:'1px solid #ddd'}}
                  />
                  <button 
                    type="submit"
                    style={{
                      padding:'10px',
                      background:'#1e90ff',
                      color:'#fff',
                      border:'none',
                      borderRadius:'4px',
                      cursor:'pointer',
                      fontWeight:'bold'
                    }}
                  >
                    Add Vehicle
                  </button>
                </form>
                <h3 style={{marginBottom:'20px'}}>Remove Vehicle</h3>
                <ul style={{listStyle:'none',padding:0}}>
                  {cars.map(car => (
                    <li 
                      key={car.id} 
                      style={{
                        background:'#1e1e1e',
                        padding:'15px',
                        borderRadius:'8px',
                        marginBottom:'10px',
                        display:'flex',
                        justifyContent:'space-between',
                        alignItems:'center'
                      }}
                    >
                      {car.name} ({car.make} {car.model}, {car.year})
                      <button 
                        style={{
                          marginLeft:'10px',
                          padding:'5px 15px',
                          background:'#c00',
                          color:'#fff',
                          border:'none',
                          borderRadius:'4px',
                          cursor:'pointer'
                        }} 
                        onClick={() => handleRemoveCar(car.id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'history' && (
              <div>
                <h2 style={{marginBottom:'30px'}}>Previous Maintenance</h2>
                <div style={{
                  display:'grid',
                  gap:'20px',
                  marginBottom:'30px',
                  background:'#1e1e1e',
                  padding:'20px',
                  borderRadius:'8px'
                }}>
                  <div>
                    <label htmlFor="carSelect" style={{display:'block',marginBottom:'8px'}}>Select Vehicle:</label>
                    <select 
                      id="carSelect" 
                      onChange={e => setEditingCarId(e.target.value)} 
                      value={editingCarId || ''}
                      style={{width:'100%',padding:'8px',borderRadius:'4px'}}
                    >
                      <option value="">-- Select --</option>
                      {cars.map(car => (
                        <option key={car.id} value={car.id}>
                          {car.name} ({car.make} {car.model}, {car.year})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timeRange" style={{display:'block',marginBottom:'8px'}}>Time Range:</label>
                    <select 
                      id="timeRange" 
                      onChange={e => setTimeRange(e.target.value)}
                      value={timeRange}
                      style={{width:'100%',padding:'8px',borderRadius:'4px'}}
                    >
                      <option value="3">Last 3 months</option>
                      <option value="6">Last 6 months</option>
                      <option value="9">Last 9 months</option>
                      <option value="12">Last 12 months</option>
                      <option value="custom">Custom Date Range</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>
                  {timeRange === 'custom' && (
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'15px'}}>
                      <div>
                        <label htmlFor="startDate" style={{display:'block',marginBottom:'8px'}}>Start Date:</label>
                        <input
                          type="date"
                          id="startDate"
                          value={customDateRange.start}
                          onChange={e => setCustomDateRange(prev => ({...prev, start: e.target.value}))}
                          style={{width:'100%',padding:'8px',borderRadius:'4px'}}
                        />
                      </div>
                      <div>
                        <label htmlFor="endDate" style={{display:'block',marginBottom:'8px'}}>End Date:</label>
                        <input
                          type="date"
                          id="endDate"
                          value={customDateRange.end}
                          onChange={e => setCustomDateRange(prev => ({...prev, end: e.target.value}))}
                          style={{width:'100%',padding:'8px',borderRadius:'4px'}}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {editingCarId && (
                  <ul style={{listStyle:'none',padding:0}}>
                    {(() => {
                      const filteredTasks = tasks.filter(task => {
                        if (task.vehicleId !== editingCarId || !task.completed) return false;
                        
                        if (timeRange === 'all') return true;
                        
                        const taskDate = new Date(task.dueDate);
                        const now = new Date();
                        
                        if (timeRange === 'custom') {
                          const start = new Date(customDateRange.start);
                          const end = new Date(customDateRange.end);
                          return taskDate >= start && taskDate <= end;
                        }
                        
                        const months = parseInt(timeRange);
                        const cutoff = new Date(now.setMonth(now.getMonth() - months));
                        return taskDate >= cutoff;
                      });

                      if (filteredTasks.length === 0) {
                        return (
                          <li style={{
                            padding:'15px',
                            background:'#1e1e1e',
                            borderRadius:'8px',
                            textAlign:'center'
                          }}>
                            No maintenance records found for the selected time range.
                          </li>
                        );
                      }

                      return filteredTasks.map(task => (
                        <li 
                          key={task.id} 
                          style={{
                            background:'#1e1e1e',
                            padding:'15px',
                            borderRadius:'8px',
                            marginBottom:'10px'
                          }}
                        >
                          {task.title} - Completed on {task.dueDate} / {task.dueMileage} miles
                        </li>
                      ));
                    })()}
                  </ul>
                )}
              </div>
            )}
            {activeTab === 'importexport' && (
              <div style={{background: THEMES[theme].cardBg, padding:'20px',borderRadius:'8px'}}>
                <h2 style={{marginBottom:'20px'}}>Import/Export Data</h2>
                <div style={{display:'flex',gap:'20px',alignItems:'center'}}>
                  <button 
                    onClick={() => exportData(userName, cars, tasks)}
                    style={{
                      padding:'10px 20px',
                      background: THEMES[theme].primary,
                      color: THEMES[theme].text,
                      border:'none',
                      borderRadius:'4px',
                      cursor:'pointer',
                      fontWeight:'bold'
                    }}
                  >
                    Export Data
                  </button>
                  <input 
                    type="file" 
                    accept="application/json" 
                    onChange={e => importData(e.target.files[0], (data) => {
                      setUserName(data.userName || '');
                      setCars(data.cars || []);
                      setTasks(data.tasks || []);
                    })} 
                    style={{flex:1}}
                  />
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div>
                <h2 style={{marginBottom:'30px'}}>Settings</h2>
                <div style={{
                  background: THEMES[theme].cardBg,
                  padding:'20px',
                  borderRadius:'8px',
                  marginBottom:'20px'
                }}>
                  <h3 style={{marginBottom:'20px'}}>Appearance</h3>
                  
                  <div style={{marginBottom:'20px'}}>
                    <label style={{display:'block', marginBottom:'10px'}}>Font Size:</label>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      style={{
                        width:'100%',
                        padding:'8px',
                        borderRadius:'4px',
                        marginBottom:'10px',
                        background: THEMES[theme].cardBg,
                        color: THEMES[theme].text,
                        border: `1px solid ${THEMES[theme].text}`
                      }}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                    <div style={{fontSize: THEMES[theme].small}}>Preview text in different sizes</div>
                  </div>

                  <div style={{marginBottom:'20px'}}>
                    <label style={{display:'block', marginBottom:'10px'}}>Theme:</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      style={{
                        width:'100%',
                        padding:'8px',
                        borderRadius:'4px',
                        background: THEMES[theme].cardBg,
                        color: THEMES[theme].text,
                        border: `1px solid ${THEMES[theme].text}`
                      }}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System (Auto)</option>
                    </select>
                  </div>
                </div>

                <div style={{
                  background: THEMES[theme].cardBg,
                  padding:'20px',
                  borderRadius:'8px',
                  marginBottom:'20px'
                }}>
                  <h3 style={{marginBottom:'20px'}}>Account Settings</h3>
                  <div style={{
                    background: THEMES[theme].danger,
                    padding:'20px',
                    borderRadius:'8px',
                    marginTop:'40px'
                  }}>
                    <h4 style={{color:'#fff',marginBottom:'15px'}}>Danger Zone</h4>
                    <p style={{color:'#fff',marginBottom:'20px'}}>
                      Deleting your account will permanently remove all your data. This action cannot be undone.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      style={{
                        padding:'10px 20px',
                        background:'#fff',
                        color: THEMES[theme].danger,
                        border:'none',
                        borderRadius:'4px',
                        cursor:'pointer',
                        fontWeight:'bold',
                        width:'100%'
                      }}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
