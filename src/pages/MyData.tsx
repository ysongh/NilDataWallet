import { useEffect, useState } from 'react';
import { Keypair } from '@nillion/nuc';
import { SecretVaultUserClient } from '@nillion/secretvaults';

import { getLocalStorage } from '../utils/localStorage/localStorage';
import Document from '../components/Document';

function MyData() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nillionapikey, setNillionapikey] = useState<string>("");
  const [nillionDiD, setNillionDiD] = useState<string>("");

  const readCollection = async () => {
    setLoading(true);
    setError(null);

    try {
      const userKeypair = Keypair.from(nillionapikey);

      // Create user client
      const user = await SecretVaultUserClient.from({
        baseUrls: "https://nildb-stg-n1.nillion.network,https://nildb-stg-n2.nillion.network,https://nildb-stg-n3.nillion.network".split(','),
        keypair: userKeypair,
      });

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
      //@ts-ignore
      setNillionDiD(identity.did);
    }
  }, [])

  useEffect(() => {
    if (nillionapikey) {
      readCollection();
    }
  }, [nillionapikey]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Data</h1>

      <p>{nillionDiD}</p>

      <p>Reading all records in your Nillion Private Storage collection</p>

      <button onClick={readCollection} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Data'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>Error: {error}</div>
      )}

      {/* Data List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {data.length && data.map((item, index) => (
            <Document key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyData;
