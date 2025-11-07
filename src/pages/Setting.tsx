import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteModal from '../components/modal/DeleteModal';
import ExportModal from '../components/modal/ExportModal';

export default function Setting() {
  const navigate = useNavigate();

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
                    onClick={() => navigate("/createdid")}
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
                <a
                  href="https://github.com/ysongh/NilDataWallet/blob/master/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-md transition-colors focus:outline-none mt-2"
                >
                  View Documentation
                </a>
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
          <ExportModal setShowExportModal={setShowExportModal} />
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <DeleteModal setShowDeleteModal={setShowDeleteModal} />
        )}
      </div>
    </div>
  );
}
