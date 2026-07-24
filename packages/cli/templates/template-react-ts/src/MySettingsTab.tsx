import React, { useState } from 'react';
import './style.css';

export default function MySettingsTab() {
  const [count, setCount] = useState(0);

  return (
    <div className="plugin-settings-container">
      <h2 className="plugin-title">Hello from React Plugin!</h2>
      <p className="plugin-text">This is a custom settings tab rendered using React.</p>
      <button className="plugin-btn" onClick={() => setCount(c => c + 1)}>
        Count is: {count}
      </button>
    </div>
  );
}
