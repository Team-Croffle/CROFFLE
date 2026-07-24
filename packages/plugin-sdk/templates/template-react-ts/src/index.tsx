import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PluginContext } from '@croffledev/plugin-sdk';
import MyFeatureView from './MyFeatureView';
import MySettingsTab from './MySettingsTab';

let viewRoot: Root | null = null;
let settingsRoot: Root | null = null;

export function activated(context: PluginContext) {
  console.log('React Plugin has been activated!');

  // 1. Register Feature View
  context.ui.registerView('react-feature-view', (container: HTMLElement) => {
    viewRoot = createRoot(container);
    viewRoot.render(<MyFeatureView />);
  });

  // 2. Register Settings Tab
  context.ui.registerSettingsTab('react-settings-tab', {
    label: 'React Tab',
    render: (container: HTMLElement) => {
      settingsRoot = createRoot(container);
      settingsRoot.render(<MySettingsTab />);
    },
  });

  // 3. Register Context Menu
  context.ui.registerContextMenu(
    'calendar',
    'react-context-hello',
    'Hello from React Plugin',
    (element: HTMLElement | null) => {
      console.log('Context menu clicked!', element);
      alert('Hello from React Plugin!');
    }
  );
}

export function deactivated() {
  console.log('React Plugin has been deactivated!');
  
  if (viewRoot) {
    viewRoot.unmount();
    viewRoot = null;
  }
  
  if (settingsRoot) {
    settingsRoot.unmount();
    settingsRoot = null;
  }
}
