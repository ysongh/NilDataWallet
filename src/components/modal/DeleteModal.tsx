function DeleteModal({ setShowDeleteModal } : { setShowDeleteModal: Function}) {
   const handleDeleteDID = (): void => {
    // Implement delete logic
    console.log('Deleting DID...');
    setShowDeleteModal(false);
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-base font-bold text-gray-800">Delete DID?</h3>
          </div>
          <p className="text-xs text-gray-600 mb-4">
            This will permanently delete your DID and all associated data. This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium rounded-md transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteDID}
              className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal;
