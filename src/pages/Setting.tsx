import { useState } from 'react';

export default function Setting() {
  const [userDID] = useState<string>("did:nil:03c12280fb4e04d149f29e72e8df5aa44624acaa0746b24106837ce4a8baba3b1c");
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  
  // Settings states
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [autoApprove, setAutoApprove] = useState<boolean>(false);

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExportDID = (): void => {
    // Implement export logic
    console.log('Exporting DID...');
    setShowExportModal(false);
  };

  const handleDeleteDID = (): void => {
    // Implement delete logic
    console.log('Deleting DID...');
    setShowDeleteModal(false);
  };

  const handleClearCache = (): void => {
    console.log('Clearing cache...');
  };

  return (
    <div className="w-full h-full bg-gray-50">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none"
              title="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Settings</h1>
              <p className="text-xs text-gray-600 mt-0.5">Manage your preferences</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {/* DID Management Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
                <h2 className="text-xs font-semibold text-blue-800 uppercase">DID Management</h2>
              </div>
              <div className="p-3 space-y-3">
                {/* Current DID */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">Current DID</label>
                  <div className="flex items-start gap-2 p-2.5 bg-gray-50 rounded-md border border-gray-200">
                    <code className="flex-1 text-xs font-mono text-gray-800 break-all">
                      {userDID}
                    </code>
                    <button
                      onClick={() => copyToClipboard(userDID)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                      title="Copy DID"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Export DID
                  </button>
                  <button
                    className="w-full py-2.5 px-3 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Import DID
                  </button>
                  <button
                    className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Generate New DID
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-3 py-2 bg-purple-50 border-b border-purple-100">
                <h2 className="text-xs font-semibold text-purple-800 uppercase">Preferences</h2>
              </div>
              <div className="p-3 space-y-3">
                {/* Auto Sync Toggle */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Auto Sync</p>
                    <p className="text-xs text-gray-600 mt-0.5">Automatically sync data in background</p>
                  </div>
                  <button
                    onClick={() => setAutoSync(!autoSync)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      autoSync ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        autoSync ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Notifications</p>
                    <p className="text-xs text-gray-600 mt-0.5">Enable browser notifications</p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      notifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto Approve Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Auto Approve Requests</p>
                    <p className="text-xs text-gray-600 mt-0.5">Automatically approve trusted sites</p>
                  </div>
                  <button
                    onClick={() => setAutoApprove(!autoApprove)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      autoApprove ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        autoApprove ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Data Management Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-3 py-2 bg-green-50 border-b border-green-100">
                <h2 className="text-xs font-semibold text-green-800 uppercase">Data Management</h2>
              </div>
              <div className="p-3 space-y-2">
                <button
                  onClick={handleClearCache}
                  className="w-full py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Clear Cache
                </button>
                <button
                  className="w-full py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Export All Data
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xs font-semibold text-gray-800 uppercase">About</h2>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-gray-600">Version</span>
                  <span className="text-xs font-medium text-gray-800">1.0.0</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-gray-600">Build</span>
                  <span className="text-xs font-medium text-gray-800">2025.10.10</span>
                </div>
                <button className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-md transition-colors focus:outline-none mt-2">
                  View Documentation
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
              <div className="px-3 py-2 bg-red-50 border-b border-red-200">
                <h2 className="text-xs font-semibold text-red-800 uppercase">Danger Zone</h2>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-600 mb-3">
                  Deleting your DID will remove all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete DID
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
              <div className="p-4">
                <h3 className="text-base font-bold text-gray-800 mb-2">Export DID</h3>
                <p className="text-xs text-gray-600 mb-4">
                  Your DID will be exported as a secure file. Keep it safe and don't share it with anyone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium rounded-md transition-colors focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExportDID}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-base font-bold text-gray-800">Delete DID?</h3>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  This will permanently delete your DID and all associated data. This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium rounded-md transition-colors focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteDID}
                    className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
