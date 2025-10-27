import { useState } from 'react';

// Mock networks - replace with your actual network data
const networks = [
  { id: 1, name: "Mainnet", rpc: "https://mainnet.example.com", status: "active" },
  { id: 2, name: "Testnet", rpc: "https://testnet.example.com", status: "active" },
  { id: 3, name: "Local", rpc: "http://localhost:8545", status: "inactive" }
];

function NetworkSelector() {
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState<boolean>(false);
  const [currentNetwork, setCurrentNetwork] = useState<string>("Mainnet");

  const handleNetworkSelect = (networkName: string) => {
    setCurrentNetwork(networkName);
    // Save to localStorage
    // setLocalStorage("currentNetwork", networkName);
    setNetworkDropdownOpen(false);
  };

  const handleAddNetwork = () => {
    setNetworkDropdownOpen(false);
    // Navigate to add network page
    // navigate("/add-network");
    console.log("Navigate to add network");
  };

  const handleNetworkDetails = (networkName: string) => {
    setNetworkDropdownOpen(false);
    // Navigate to network details page
    // navigate(`/network-details/${networkName}`);
    console.log("View details for:", networkName);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-800 mb-3">Network</h3>
      
      <div className="relative">
        <button
          onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-gray-800">{currentNetwork}</span>
          </div>
          <svg 
            className={`w-5 h-5 text-gray-600 transition-transform ${networkDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {networkDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg z-10 overflow-hidden">
            {/* Network List */}
            <div className="max-h-60 overflow-y-auto">
              {networks.map((network) => (
                <div
                  key={network.id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <button
                      onClick={() => handleNetworkSelect(network.name)}
                      className="flex-1 flex items-center gap-3 text-left"
                    >
                      <div className={`w-2 h-2 rounded-full ${network.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{network.name}</p>
                        <p className="text-xs text-gray-500 truncate">{network.rpc}</p>
                      </div>
                      {currentNetwork === network.name && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleNetworkDetails(network.name)}
                      className="ml-2 p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-all"
                      title="View details"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Network Button */}
            <button
              onClick={handleAddNetwork}
              className="w-full p-3 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 transition-colors border-t border-gray-200"
            >
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium text-blue-700">Add New Network</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NetworkSelector;