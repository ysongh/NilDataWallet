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
    <div className="p-4">
      <h1 className="text-2xl">
        My Documents
      </h1>

      {/* Data List */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-right text-md mb-2 text-gray-500">
          {data.length} Documents
        </h2>
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
