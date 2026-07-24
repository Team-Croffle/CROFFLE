import { PluginContext } from "@croffledev/plugin-sdk";
import { createApp } from "vue";
import FeatureView from "./MyFeatureView.vue";
import MySettingsTab from "./MySettingsTab.vue";

let viewAppInstance: any = null;
let settingsAppInstance: any = null;

export function activated(context: PluginContext) {
  console.log("Test Plugin has been activated!");

  // 1. Register Feature View
  context.ui.registerView("test-feature-view", (container: HTMLElement) => {
    viewAppInstance = createApp(FeatureView);
    viewAppInstance.mount(container);
  });

  // 2. Register Settings Tab
  context.ui.registerSettingsTab("test-settings-tab", {
    label: "Test Tab",
    render: (container: HTMLElement) => {
      settingsAppInstance = createApp(MySettingsTab);
      settingsAppInstance.mount(container);
    },
  });

  // 3. Register Context Menu
  context.ui.registerContextMenu(
    "calendar",
    "test-context-hello",
    "Hello from Test Plugin",
    (element: string) => {
      console.log("Context menu clicked!", element);
      alert("Hello from Test Plugin!");
    },
  );
}

export function deactivated() {
  console.log("Test Plugin has been deactivated!");

  if (viewAppInstance) {
    viewAppInstance.unmount();
    viewAppInstance = null;
  }

  if (settingsAppInstance) {
    settingsAppInstance.unmount();
    settingsAppInstance = null;
  }
}
