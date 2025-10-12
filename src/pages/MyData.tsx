import { useEffect, useState } from 'react';

import { getLocalStorage } from '../utils/localStorage/localStorage';
import { createSecretVaultUserClient } from '../services/secretVaultClient';
import Document from '../components/Document';

function MyData() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nillionapikey, setNillionapikey] = useState<string>("");

  const readCollection = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await createSecretVaultUserClient(nillionapikey);

      const references = await user.listDataReferences();
      console.log(references);

      //@ts-ignore
      setData(references.data);
    } catch (err) {
      setError((err as Error).message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const identity = getLocalStorage("apikey");
    console.log(identity);
    if (identity) {
      //@ts-ignore
      setNillionapikey(identity.privateKey);
    }
  }, [])

  useEffect(() => {
    if (nillionapikey) {
      readCollection();
    }
  }, [nillionapikey]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
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
            <h1 className="text-lg font-bold text-gray-800">My Documents</h1>
            <p className="text-xs text-gray-600 mt-0.5">Manage your {data.length} documents</p>
          </div>
        </div>
      </div>

      {/* Data List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {data.length && data.map((item, index) => (
            <Document key={index} item={item} />
          ))}
        </div>

        <button onClick={readCollection} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>

        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>Error: {error}</div>
        )}
      </div>
    </div>
  );
}

export default MyData;
