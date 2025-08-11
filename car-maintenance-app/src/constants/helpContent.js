const HELP_CONTENT = {
  home: {
    title: 'Home',
    description: 'Dashboard overview of your vehicles and upcoming maintenance tasks.',
    instructions: [
      'View a summary of all your vehicles',
      'See upcoming maintenance tasks',
      'Quick access to important notifications',
      'Click on any vehicle to see its details'
    ]
  },
  vehicles: {
    title: 'My Vehicles',
    description: 'View and manage your saved vehicles.',
    instructions: [
      'See all your registered vehicles',
      'View current mileage and basic information',
      'Click the arrow to expand vehicle details',
      'View vehicle-specific maintenance history'
    ]
  },
  addremove: {
    title: 'Add/Remove Vehicle',
    description: 'Add new vehicles to your garage or remove existing ones.',
    instructions: [
      'Enter vehicle details (make, model, year)',
      'Add a nickname for easy identification',
      'Enter current mileage',
      'Vehicle details are validated automatically',
      'Remove vehicles you no longer own'
    ]
  },
  maintenance: {
    title: 'Add Maintenance',
    description: 'Record new maintenance tasks for your vehicles.',
    instructions: [
      'Select a vehicle from your garage',
      'Enter maintenance task details',
      'Set due date or mileage for the task',
      'Set up recurring maintenance intervals',
      'Task will appear in upcoming maintenance'
    ]
  },
  recommended: {
    title: 'Recommended Maintenance',
    description: 'Get manufacturer-recommended maintenance schedules for your vehicles.',
    instructions: [
      'Select a vehicle to view its maintenance schedule',
      'See service intervals based on mileage',
      'View estimated costs for services',
      'Based on manufacturer service manuals',
      'Click "Add to Tasks" to schedule recommended maintenance'
    ]
  },
  history: {
    title: 'Maintenance History',
    description: 'View past maintenance records and filter by date range.',
    instructions: [
      'View all completed maintenance tasks',
      'Filter by time period (3, 6, 12 months, YTD, or custom)',
      'Sort by date or vehicle',
      'Export maintenance records',
      'Track service costs and intervals'
    ]
  },
  importexport: {
    title: 'Import/Export',
    description: 'Backup your data or restore from a previous backup.',
    instructions: [
      'Export all data to a backup file',
      'Import data from a previous backup',
      'Warning: Import will overwrite current data',
      'Recommended to export before importing',
      'Keeps all vehicle and maintenance records'
    ]
  },
  settings: {
    title: 'Settings',
    description: 'Customize the application appearance and preferences.',
    instructions: [
      'Change theme (Light, Dark, or System)',
      'Adjust font size for better readability',
      'Set notification preferences',
      'Customize display units (miles/kilometers)',
      'Manage user profile'
    ]
  },
  help: {
    title: 'Help',
    description: 'Learn how to use the application and get support.',
    instructions: [
      'Access detailed guides for each feature',
      'View frequently asked questions',
      'Get troubleshooting tips',
      'Find contact information for support',
      'Access video tutorials and documentation'
    ]
  }
};

export default HELP_CONTENT;
