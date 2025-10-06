import { useState, useEffect } from 'react';
import { Keypair } from '@nillion/nuc';
import { SecretVaultUserClient } from '@nillion/secretvaults';

import { getLocalStorage } from '../utils/localStorage/localStorage';

interface TabInfo {
  title?: string;
  url?: string;
}

interface AccessRequest {
  id: number;
  origin: string;
  timestamp: number;
  type: string;
  userPrivateData?: string;
}

function Requests() {
  const [currentTab, setCurrentTab] = useState<TabInfo>({})
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([])
  const [nillionDiD, setNillionDiD] = useState<string>("");
  const [nillionDiDObj, setNillionDiDObj] = useState<any>("");
  const [identity, setIdentity] = useState<any>("");

  useEffect(() => {
    const identity = getLocalStorage("apikey");
    if (identity) {
      //@ts-ignore
      setNillionDiD(identity.did);
      //@ts-ignore
      setNillionDiDObj(identity.didObj);
      setIdentity(identity);
    }
  }, [])

  useEffect(() => {
    // Get current tab information
    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          setCurrentTab({
            title: tabs[0].title,
            url: tabs[0].url
          })
        }
      })
    }

    // Get pending access requests
    chrome.runtime.sendMessage({ type: 'GET_PENDING_REQUESTS' }, (response) => {
      console.log(response);
      if (response?.requests) {
        setPendingRequests(response.requests)
      }
    })
  }, [])

  const handleAccessRequest = (requestId: number, granted: boolean) => {
    chrome.runtime.sendMessage({
      type: 'RESPOND_TO_REQUEST',
      requestId,
      granted,
      nillionDiD,
      nillionDiDObj
    })
    
    // Remove from local state
    setPendingRequests(prev => prev.filter(r => r.id !== requestId))
  }

  console.log(pendingRequests, "pendingRequests")

  const createData = async (requestId: number) => {
    console.log(pendingRequests[0]);

    const user = await SecretVaultUserClient.from({
      baseUrls: "https://nildb-stg-n1.nillion.network,https://nildb-stg-n2.nillion.network,https://nildb-stg-n3.nillion.network".split(','),
      keypair: Keypair.from(identity.privateKey),
    });
    // User uploads data and grants builder limited access
    // @ts-ignore
    const uploadResults = await user.createData(pendingRequests[0].delegationToken, {
       // @ts-ignore
      owner: nillionDiD,
      acl: {
         // @ts-ignore
        grantee: pendingRequests[0].builderDid, // Grant access to the builder
        read: true, // Builder can read the data
        write: false, // Builder cannot modify the data
        execute: true, // Builder can run queries on the data
      },
      // @ts-ignore
      collection: pendingRequests[0].collectionId,
      // @ts-ignore
      data: [pendingRequests[0].userPrivateData],
    });

    console.log(uploadResults);

    chrome.runtime.sendMessage({
      type: 'CREATE_DATA_SUCCESS',
      requestId
    })
    
    // Remove from local state
    setPendingRequests(prev => prev.filter(r => r.id !== requestId))
  }

  const rejectRequest = (requestId: number) => {
    chrome.runtime.sendMessage({
      type: 'REJECT',
      requestId
    })

    setPendingRequests(prev => prev.filter(r => r.id !== requestId))
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>My React Extension</h1>
      
      {/* Access Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="mb-5 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="m-0 mb-3 text-amber-800 font-semibold text-lg">Access Requests</h3>
          {pendingRequests.map(request => (
            <div key={request.id} className="mb-3 p-3 bg-white rounded-md shadow-sm border border-gray-100">
              <p className="m-0 mb-2 font-bold text-gray-800">{request.origin}</p>
              {request.type === "Get DID" ? (
                <>
                  <p className="m-0 mb-3 text-xs text-gray-600">
                    Requested: {new Date(request.timestamp).toLocaleTimeString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccessRequest(request.id, true)}
                      className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Allow
                    </button>
                    <button
                      onClick={() => rejectRequest(request.id)}
                      className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Reject
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="m-0 mb-3 text-xs text-gray-600">
                    <pre style={{ background: '#f5f5f5', padding: '10px' }}>
                      {JSON.stringify(request.userPrivateData, null, 2)}
                    </pre>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => createData(request.id)}
                      className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectRequest(request.id)}
                      className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current Tab:</h3>
        <p><strong>Title:</strong> {currentTab.title || 'Unknown'}</p>
        <p><strong>URL:</strong> {currentTab.url || 'Unknown'}</p>
      </div>
    </div>
  )
}

export default Requests;