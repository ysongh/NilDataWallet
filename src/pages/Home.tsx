import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLocalStorage } from '../utils/localStorage/localStorage';

export default function Home() {
  const navigate = useNavigate();

  const [userDID, setUserDID] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const identity = getLocalStorage("apikey");
    if (identity) {
      //@ts-ignore
      setUserDID(identity.did);
    }
    else {
      navigate("/createdid");
    }
  }, [])

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const truncateDID = (did: string, startChars: number = 20, endChars: number = 20): string => {
    if (did.length <= startChars + endChars) return did;
    return `${did.slice(0, startChars)}...${did.slice(-endChars)}`;
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full h-full flex flex-col">
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Welcome Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-800">Your Identity</h2>
                  <p className="text-xs text-gray-600">Active and ready</p>
                </div>
              </div>

              {/* DID Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                <label className="text-xs font-semibold text-blue-800 block mb-2">Your DID</label>
                
                {/* Desktop view - full DID */}
                <div className="hidden sm:block">
                  <code className="text-xs font-mono text-gray-800 break-all block mb-2">
                    {userDID}
                  </code>
                </div>

                {/* Mobile view - truncated DID */}
                <div className="sm:hidden">
                  <code className="text-xs font-mono text-gray-800 block mb-2">
                    {truncateDID(userDID)}
                  </code>
                </div>

                <button
                  onClick={() => copyToClipboard(userDID)}
                  className={`w-full py-2 px-3 rounded-md text-xs font-medium transition-all ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copied ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy to Clipboard
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate("/mydata")}
                  className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 text-blue-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">View Data</span>
                </button>

                <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500">
                  <svg className="w-5 h-5 text-green-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">Create Data</span>
                </button>

                <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <svg className="w-5 h-5 text-purple-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">Settings</span>
                </button>

                <button className="p-3 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <svg className="w-5 h-5 text-amber-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">Requests</span>
                </button>
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-600">Connection</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-green-700">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-600">Data Records</span>
                  <span className="text-xs font-medium text-gray-800">6 items</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-gray-600">Last Sync</span>
                  <span className="text-xs font-medium text-gray-800">Just now</span>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
              <div className="flex gap-2">
                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-blue-900 mb-0.5">About DIDs</p>
                  <p className="text-xs text-blue-700">
                    Your DID is your unique decentralized identity. Keep it safe and use it to manage your data securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}