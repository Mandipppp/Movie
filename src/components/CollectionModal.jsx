import React, { useState } from 'react'
import { FaTimes, FaTrash, FaChevronDown, FaChevronUp, FaShare } from 'react-icons/fa'
import { useCollections } from '../contexts/CollectionContext'
import toast from 'react-hot-toast'

const CollectionModal = ({ isOpen, onClose }) => {
  const [newCollectionName, setNewCollectionName] = useState('')
  const [expandedCollection, setExpandedCollection] = useState(null)
  const { collections, createCollection, deleteCollection, removeFromCollection } = useCollections()

  // Handles sharing a collection using Web Share API
  const handleShare = async (collection) => {
    const shareData = {
      title: `Movie Collection: ${collection.name}`,
      text: `Check out my movie collection "${collection.name}" with ${collection.movies.length} movies!`,
      url: window.location.href // shares current URL(shall be editied later to point to a specific collection)
    }
  
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success('Shared successfully!')
      } else {
        toast.error('Web Share API is not supported in your browser')
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return
      }
      toast.error('Error sharing collection')
      console.error('Error sharing:', error)
    }
  }

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return // don't allow empty names
    
    const newCollection = {
      id: Date.now(),
      name: newCollectionName,
      movies: []
    }
    try { //check for issues
      createCollection(newCollection)
      toast.success(`Created new collection "${newCollectionName}"`)
      setNewCollectionName('')
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Deletes a collection by its ID
  const handleDeleteCollection = (id) => {
    const collection = collections.find(c => c.id === id)
    deleteCollection(id)
    toast.success(`Deleted collection "${collection.name}"`)

    // collapse the section if the deleted one was expanded
    if (expandedCollection === id) {
      setExpandedCollection(null)
    }
  }

  // Removes a movie from a specific collection
  const handleRemoveMovie = (collectionId, movieId) => {
    const collection = collections.find(c => c.id === collectionId)
    const movie = collection.movies.find(m => m.imdbID === movieId)
    removeFromCollection(collectionId, movieId)
    toast.success(`Removed "${movie.Title}" from "${collection.name}"`)
  }

  // Expand or collapse the collection to show or hide its movies
  const toggleCollection = (collectionId) => {
    setExpandedCollection(expandedCollection === collectionId ? null : collectionId)
  }

  const removeMovieFromCollection = (collectionId, movieId) => {
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          movies: collection.movies.filter(movie => movie.imdbID !== movieId)
        }
      }
      return collection
    })
    // setCollections(updatedCollections)
    localStorage.setItem('movieCollections', JSON.stringify(updatedCollections))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">My Collections</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Create new collection */}
        <div className="flex gap-2 mb-6 flex-shrink-0">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="New collection name"
            className="flex-1 bg-black/30 text-white rounded-full px-4 py-2 outline-none"
          />
          <button
            onClick={handleCreateCollection}
            className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-500 transition-colors"
          >
            Create
          </button>
        </div>

        {/* Collections list */}
        <div className="overflow-y-auto flex-1 space-y-2 min-h-0">
          {collections.map(collection => (
            <div 
              key={collection.id}
              className="bg-black/30 rounded-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-3">
                <button 
                  className="text-white hover:text-gray-300 transition-colors flex-1 text-left flex items-center"
                  onClick={() => toggleCollection(collection.id)}
                >
                  {expandedCollection === collection.id ? <FaChevronUp className="mr-2" /> : <FaChevronDown className="mr-2" />}
                  {collection.name}
                  <span className="text-gray-400 text-sm ml-2">
                    ({collection.movies.length})
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(collection)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    aria-label="Share collection"
                  >
                    <FaShare />
                  </button>
                  <button
                    onClick={() => handleDeleteCollection(collection.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete collection"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Movies in collection */}
              {expandedCollection === collection.id && collection.movies.length > 0 && (
                <div className="border-t border-gray-700 p-3 space-y-2">
                  {collection.movies.map(movie => (
                    <div 
                      key={movie.imdbID}
                      className="flex items-center justify-between bg-black/20 p-2 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <img 
                          src={movie.Poster !== 'N/A' ? movie.Poster : 'placeholder-image-url'}
                          alt={movie.Title}
                          className="w-10 h-14 object-cover rounded"
                        />
                        <div>
                          <p className="text-white text-sm">{movie.Title}</p>
                          <p className="text-gray-400 text-xs">{movie.Year}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMovie(collection.id, movie.imdbID)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CollectionModal