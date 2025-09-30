import { useState } from 'react';
import { Keypair } from '@nillion/nuc';

import { setLocalStorage } from '../utils/localStorage/localStorage';

export default function CreateDID() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateDID = async (): Promise<void> => {
    try {
      setIsGenerating(true);
      const keypair = Keypair.generate();
      const identity = {
        privateKey: keypair.privateKey('hex'),
        publicKey: keypair.publicKey('hex'),
        did: keypair.toDidString(),
        didObj: keypair.toDid(),
      };
      console.log(identity);
      setLocalStorage("apikey", identity);
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            DID Generator
          </h1>
          <p className="text-gray-600 text-sm">
            Generate a new Decentralized Identifier
          </p>
        </div>

        <div className="space-y-4">
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