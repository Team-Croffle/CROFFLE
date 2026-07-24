import React, { useState } from 'react';
import './style.css';

export default function MyFeatureView() {
  const [count, setCount] = useState(0);

  return (
    <div className="plugin-container">
      <h1 className="plugin-title">React Feature Plugin</h1>
      <div className="plugin-card">
        <p className="plugin-text">
          This is a feature view rendered by the React Plugin.
        </p>
        <button className="plugin-btn" onClick={() => setCount(c => c + 1)}>
          Clicked {count} times
        </button>
      </div>
    </div>
  );
}
