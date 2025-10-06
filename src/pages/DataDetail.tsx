import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Keypair } from '@nillion/nuc';
import { SecretVaultUserClient } from '@nillion/secretvaults';

import { getLocalStorage } from '../utils/localStorage/localStorage';

interface ACL {
  grantee: string;
  read: boolean;
  write: boolean;
  execute: boolean;
}

interface UserData {
  _id: string;
  _created: string;
  _updated: string;
  _owner: string;
  _acl: ACL[];
  [key: string]: any; // For dynamic properties
}

function DataDetail() {
  const { collectionId, documentId } = useParams();

  const [data, setData] = useState<UserData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nillionapikey, setNillionapikey] = useState<string>("");

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
      console.log(userData.data);

      //@ts-ignore
      setData(userData.data);
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

  const [expandedACL, setExpandedACL] = useState<number | null>(null);

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatKey = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Separate system fields from custom fields
  const systemFields = ['_id', '_created', '_updated', '_owner', '_acl'];
  const customFields = Object.keys(data).filter(key => !systemFields.includes(key));

  return (
    <div>
      <div className="w-full h-full bg-gray-50">
        <div className="w-full h-full flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-gray-800">Data Details</h1>
                <p className="text-xs text-gray-600 mt-0.5">View record information</p>
              </div>
              <button
                onClick={() => window.history.back()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none"
                title="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-3">
              {/* System Metadata Section */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
                  <h2 className="text-xs font-semibold text-blue-800 uppercase">System Metadata</h2>
                </div>
                <div className="p-3 space-y-3">
                  {/* ID */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">ID</label>
                      <button
                        onClick={() => copyToClipboard(data._id)}
                        className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                        title="Copy ID"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <code className="text-xs font-mono text-gray-800 break-all bg-gray-50 px-2 py-1 rounded block">
                      {data._id}
                    </code>
                  </div>

                  {/* Owner */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Owner</label>
                      <button
                        onClick={() => copyToClipboard(data._owner)}
                        className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                        title="Copy owner"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <code className="text-xs font-mono text-gray-800 break-all bg-gray-50 px-2 py-1 rounded block">
                      {data._owner}
                    </code>
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Created</label>
                      <p className="text-xs text-gray-600">{formatDate(data._created)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Updated</label>
                      <p className="text-xs text-gray-600">{formatDate(data._updated)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Access Control List Section */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-3 py-2 bg-purple-50 border-b border-purple-100">
                  <h2 className="text-xs font-semibold text-purple-800 uppercase">Access Control List</h2>
                </div>
                <div className="p-3 space-y-2">
                  {data._acl?.map((acl, index) => (
                    <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                      <button
                        onClick={() => setExpandedACL(expandedACL === index ? null : index)}
                        className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 flex items-center justify-between focus:outline-none"
                      >
                        <span className="text-xs font-medium text-gray-700">
                          Grantee {index + 1}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform ${
                            expandedACL === index ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedACL === index && (
                        <div className="p-3 space-y-2 bg-white">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-semibold text-gray-700">Grantee DID</label>
                              <button
                                onClick={() => copyToClipboard(acl.grantee)}
                                className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                                title="Copy grantee"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <code className="text-xs font-mono text-gray-800 break-all bg-gray-50 px-2 py-1 rounded block">
                              {acl.grantee}
                            </code>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-3 h-3 rounded-full ${acl.read ? 'bg-green-500' : 'bg-gray-300'}`} />
                              <span className="text-xs text-gray-700">Read</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-3 h-3 rounded-full ${acl.write ? 'bg-green-500' : 'bg-gray-300'}`} />
                              <span className="text-xs text-gray-700">Write</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-3 h-3 rounded-full ${acl.execute ? 'bg-green-500' : 'bg-gray-300'}`} />
                              <span className="text-xs text-gray-700">Execute</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Fields Section */}
              {customFields.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-3 py-2 bg-green-50 border-b border-green-100">
                    <h2 className="text-xs font-semibold text-green-800 uppercase">Custom Fields</h2>
                  </div>
                  <div className="p-3 space-y-3">
                    {customFields.map((key) => (
                      <div key={key}>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                          {formatKey(key)}
                        </label>
                        {typeof data[key] === 'string' && data[key].length > 50 ? (
                          <div className="bg-gray-50 px-2 py-1.5 rounded border border-gray-200">
                            <p className="text-xs text-gray-800 whitespace-pre-wrap break-words">
                              {data[key]}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-800 bg-gray-50 px-2 py-1 rounded">
                            {typeof data[key] === 'object' 
                              ? JSON.stringify(data[key]) 
                              : String(data[key])}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

            <button onClick={readCollection} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>

            {error && (
              <div style={{ color: 'red', marginTop: '10px' }}>Error: {error}</div>
            )}
        </div>
      </div>
    </div>   
  );
}

export default DataDetail;