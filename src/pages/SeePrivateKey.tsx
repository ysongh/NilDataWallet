import { useState } from 'react';

import { decryptPrivateKey } from '../utils/keyEncryption/KeyEncryption';
import { getLocalStorage } from '../utils/localStorage/localStorage';

export default function SeePrivateKey() {
  const [password, setPassword] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  const handleUnlock = async (): Promise<void> => {
    setError('');
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    try {
      const identity = getLocalStorage("apikey");
      //@ts-ignore
      const privateKey = await decryptPrivateKey(identity?.privateKey, password);
      setPrivateKey(privateKey);
    } catch (err) {
      setError('Invalid password');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && password && !isUnlocking) {
      handleUnlock();
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(privateKey);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
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
              <h1 className="text-xl font-bold text-gray-800 mb-1">See Private Key</h1>
              <p className="text-xs text-gray-600">Enter your password to unlock</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-6">
          
        </div>

        {/* Unlock Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-5">
          <div className="space-y-4">
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className={`w-full px-3 py-2.5 pr-10 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  autoFocus
                  disabled={isUnlocking}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <svg className="w-3.5 h-3.5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Unlock Button */}
            <button
              onClick={handleUnlock}
              disabled={isUnlocking || !password}
              className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                isUnlocking || !password
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {isUnlocking ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Unlocking...</span>
                </div>
              ) : (
                'Unlock'
              )}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
        </div>
        
        {privateKey && (
          <div className="space-y-4 mt-8">
            <div className="space-y-2">
              <label htmlFor="did-display" className="block text-sm font-medium text-gray-700">
                Your Private Key:
              </label>
              <div className="relative">
                <textarea
                  id="privatekey-display"
                  value={privateKey}
                  readOnly
                  placeholder="Your Private Key will appear here..."
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  title="Copy to clipboard"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}