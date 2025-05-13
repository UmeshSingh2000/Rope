import React from "react";

const Setting = () => {
  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your account preferences</p>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <img
            src="https://i.pravatar.cc/80?img=3"
            alt="Avatar"
            className="w-16 h-16 rounded-full border-2 border-white shadow-md"
          />
          <div>
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">John Doe</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">john.doe@example.com</p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Account</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-4">
              <SettingToggle label="Enable 2FA" />
              <SettingToggle label="Show online status" />
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Privacy</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-4">
              <SettingToggle label="Profile visible to public" />
              <SettingToggle label="Allow friend requests" />
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Notifications</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-4">
              <SettingToggle label="Email notifications" />
              <SettingToggle label="Push notifications" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable toggle switch component
const SettingToggle = ({ label }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};

export default Setting;
