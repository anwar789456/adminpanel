import { useState } from 'react';
import './Settings.scss';

const Settings = () => {
  const [primaryColor, setPrimaryColor] = useState('#007bff');

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setPrimaryColor(newColor);
    document.documentElement.style.setProperty('--primary-color', newColor);
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      
      <div className="settings-section">
        <h3>Theme Customization</h3>
        
        <div className="color-picker">
          <label>Primary Color</label>
          <input 
            type="color" 
            value={primaryColor}
            onChange={handleColorChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;