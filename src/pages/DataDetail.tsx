import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Keypair } from '@nillion/nuc';
import { SecretVaultUserClient } from '@nillion/secretvaults';

import { getLocalStorage } from '../utils/localStorage/localStorage';

function DataDetail() {
  const { collectionId, documentId } = useParams();

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

      const userData = await user.readData({
        collection: collectionId || "",
        document: documentId || "",
      });
      console.log(userData);

      //@ts-ignore
      setData(userData);
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

      <div style={{ marginTop: '20px' }}>
        <p>Found {data.length} records:</p>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default DataDetail;