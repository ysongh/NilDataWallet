import { useEffect, useState } from 'react';
import { Keypair } from '@nillion/nuc';
import { SecretVaultBuilderClient } from '@nillion/secretvaults';

function ReadCollection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nillionapikey, setNillionapikey] = useState<string>("");
  const [nillioncollectionid, setNillioncollectionid] = useState<string>("");

  const readCollection = async () => {
    setLoading(true);
    setError(null);

    try {
      // get a Nillion API Key: https://docs.nillion.com/build/network-api-access
      // see Nillion Testnet Config: https://docs.nillion.com/build/network-config#nildb-nodes
      const builder = await SecretVaultBuilderClient.from({
        keypair: Keypair.from(nillionapikey),
        urls: {
          chain: 'http://rpc.testnet.nilchain-rpc-proxy.nilogy.xyz',
          auth: 'https://nilauth.sandbox.app-cluster.sandbox.nilogy.xyz',
          dbs: [
            'https://nildb-stg-n1.nillion.network',
            'https://nildb-stg-n2.nillion.network',
            'https://nildb-stg-n3.nillion.network',
          ],
        },
        blindfold: { operation: 'store' },
      });

      await builder.refreshRootToken();
      const response = await builder.findData({
        collection: nillioncollectionid,
        filter: {},
      });

      setData(response.data);
    } catch (err) {
      setError((err as Error).message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      nillionapikey &&
      nillioncollectionid &&
      nillionapikey !== 'your-api-key-here' &&
      nillioncollectionid !== 'your-collection-id-here'
    ) {
      readCollection();
    }
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Nillion Collection Reader</h1>

      <div>
        <div>
          <label htmlFor="nillionApiKey">Nillion API Key:</label>
          <input
            type="text"
            id="nillionApiKey"
            value={nillionapikey}
            onChange={(e) => setNillionapikey(e.target.value)}
            placeholder="Enter Nillion API Key"
          />
        </div>
        <div>
          <label htmlFor="nillionCollectionId">Nillion Collection ID:</label>
          <input
            type="text"
            id="nillionCollectionId"
            value={nillioncollectionid}
            onChange={(e) => setNillioncollectionid(e.target.value)}
            placeholder="Enter Nillion Collection ID"
          />
        </div>
      </div>

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

export default ReadCollection;
