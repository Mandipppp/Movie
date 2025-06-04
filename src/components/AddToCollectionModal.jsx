import React, { useState } from 'react'
import { FaTimes, FaPlus } from 'react-icons/fa'
import { useCollections } from '../contexts/CollectionContext'
import toast from 'react-hot-toast'

const AddToCollectionModal = ({ isOpen, onClose, movie }) => {
  const [newCollectionName, setNewCollectionName] = useState('')
  // Functions and data from the context
  const { collections, addToCollection, createCollection, removeFromCollection } = useCollections()
  
  const isMovieInAnyCollection = () => {
    return collections.some(collection => 
      collection.movies.some(m => m.imdbID === movie.imdbID)
    )
  }

  const getExistingCollection = () => {
    return collections.find(collection => 
      collection.movies.some(m => m.imdbID === movie.imdbID)
    )
  }
  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return

    const existingCollection = getExistingCollection()
  
    // If movie exists in another collection, remove it first
    if (existingCollection) {
      removeFromCollection(existingCollection.id, movie.imdbID)
      toast.success(`Moved "${movie.Title}" from "${existingCollection.name}"`)
    }

    const newCollection = {
      id: Date.now(), // unique ID based on date
      name: newCollectionName,
      movies: [movie]
    }
    try{
      createCollection(newCollection)
      toast.success(`${existingCollection ? 'to' : 'Added to'} "${newCollectionName}"`)
      setNewCollectionName('')
      onClose()
    }catch (error) {
      toast.error(error.message)
    }
    
  }

  const handleAddToCollection = (collectionId) => {
    const existingCollection = getExistingCollection()
  
    // Don't do anything if trying to add to the same collection
    if (existingCollection && existingCollection.id === collectionId) {
        toast.error(`"${movie.Title}" is already in this collection`)
        return
    }
    // If movie exists in another collection, remove it first
    if (existingCollection) {
        console.log('Removing from existing collection:', movie.imdbID)
        removeFromCollection(existingCollection.id, movie.imdbID)
        toast.success(`Moved "${movie.Title}" from "${existingCollection.name}"`)
    }
    const collection = collections.find(c => c.id === collectionId)
    addToCollection(collectionId, movie)
    toast.success(`Added "${movie.Title}" to "${collection.name}"`)
    onClose()
  }

  // If modal isn't open, don't render anything
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-1 bg-black/50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
    <div 
        className="bg-gray-800 rounded-xl p-2 w-full max-w-sm mx-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - non-scrollable */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Add to Collection</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Create new collection */}
        <div className="flex items-center gap-1 mb-4 flex-shrink-0">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Collection name"
            className="flex-1 bg-black/30 text-white rounded-full text-sm py-1.5 px-3 outline-none"
          />
          <button
            onClick={handleCreateCollection}
            className="bg-gray-600 text-white p-1.5 rounded-full hover:bg-gray-500 transition-colors"
          >
            <FaPlus className="w-3 h-3" />
          </button>
        </div>

        {/* Existing collections */}
        <div className="overflow-y-auto min-h-0 max-h-[calc(4*3.5rem)]">
          <div className="space-y-2">
            {collections.map(collection => (
              <button
                key={collection.id}
                onClick={() => handleAddToCollection(collection.id)}
                className="w-full text-left bg-black/30 text-white p-3 rounded-lg hover:bg-black/40 transition-colors"
              >
                {collection.name}
                <span className="text-gray-400 text-sm ml-2">
                  ({collection.movies.length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddToCollectionModal