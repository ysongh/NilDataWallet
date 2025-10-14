import { useState } from 'react';
import { Keypair } from '@nillion/nuc';

import { setLocalStorage } from '../utils/localStorage/localStorage';
import { encryptPrivateKey, decryptPrivateKey } from '../utils/keyEncryption/KeyEncryption';

export default function CreateDID() {
  const [privateKey, setPrivateKey] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'import'>('generate');

  const generateDID = async (): Promise<void> => {
    try {
      setIsGenerating(true);
      const keypair = Keypair.generate();

      const encrypted = await encryptPrivateKey(keypair.privateKey('hex'), password);
      console.log(encrypted);

      const identity = {
        privateKey: encrypted,
        publicKey: keypair.publicKey('hex'),
        did: keypair.toDidString(),
        didObj: keypair.toDid(),
      };
      console.log(identity);

      const decrypted = await decryptPrivateKey(encrypted, password);
      console.log(decrypted);

      setLocalStorage("apikey", identity);
      setIsGenerating(false);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  };

  const handleImport = async (): Promise<void> => {
     try {
      setIsGenerating(true);
      const UserKeypair = Keypair.from(privateKey);

      const encrypted = await encryptPrivateKey(UserKeypair.privateKey('hex'), password);
      console.log(encrypted);

      const identity = {
        privateKey: encrypted,
        publicKey: UserKeypair.publicKey('hex'),
        did: UserKeypair.toDidString(),
        didObj: UserKeypair.toDid(),
      };

      setLocalStorage("apikey", identity);
      console.log(identity);
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
    }
  }

  const validatePKey = (value: string): boolean => {
    return value.length === 64;
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            DID Manager
          </h1>
          <p className="text-gray-600 text-sm">
            Generate or import a Decentralized Identifier
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'generate'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Generate DID
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Import DID
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="import-did" className="block text-sm font-medium text-gray-700">
              Enter Password:
            </label>
            <input
              id="import-privatekey"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
           {/* Generate Tab */}
          {activeTab === 'generate' && (
            <>
              {/* Generate Button */}
              <button
                onClick={generateDID}
                disabled={isGenerating}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
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
                    <span>Generating...</span>
                  </div>
                ) : (
                  'Generate New DID'
                )}
              </button>
            </>
          )}

          {/* Import Tab */}
          {activeTab === 'import' && (
            <>
              <div className="space-y-2">
                <label htmlFor="import-did" className="block text-sm font-medium text-gray-700">
                  Enter your DID:
                </label>
                <textarea
                  id="import-privatekey"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="did:example:123456789abcdefghi"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <button
                onClick={handleImport}
                disabled={!privateKey.trim() || !validatePKey(privateKey.trim())}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  !privateKey.trim() || !validatePKey(privateKey.trim())
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                }`}
              >
                Import DID
              </button>

              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Valid DID format:</span> did:method:identifier
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Example: did:web:example.com or did:key:z6MkpTHR8VN...
                </p>
              </div>
            </>
          )}

          {/* Info Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">About DIDs</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Decentralized Identifiers (DIDs) are a new type of identifier that enables verifiable, self-sovereign digital identity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}