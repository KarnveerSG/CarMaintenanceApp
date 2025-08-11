import React, { useState } from 'react';
import { exportData, importData } from '../utils';

const ImportExportSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleExport = () => {
    exportData();
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      alert('Please select a file to import');
      return;
    }

    const confirmImport = window.confirm(
      'Warning: Importing data will overwrite your current settings and data. ' +
      'Please make sure you have exported your current data if you want to keep it. ' +
      'Do you want to continue?'
    );

    if (confirmImport) {
      try {
        await importData(selectedFile);
        alert('Data imported successfully! The page will now reload.');
        window.location.reload();
      } catch (error) {
        alert('Error importing data: ' + error.message);
      }
    }
  };

  return (
    <div className="import-export-container">
      <div className="export-section">
        <h3>Export Data</h3>
        <p>Save your current data and settings to a file</p>
        <button onClick={handleExport} className="export-button">
          Export to File
        </button>
      </div>
      
      <div className="import-section">
        <h3>Import Data</h3>
        <p>Load data from a previously exported file</p>
        <div className="import-controls">
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="file-input"
          />
          <button 
            onClick={handleImport}
            className="import-button"
            disabled={!selectedFile}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportExportSection;
