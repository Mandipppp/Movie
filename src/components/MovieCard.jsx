import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaCheck } from 'react-icons/fa'
import AddToCollectionModal from './AddToCollectionModal'
import { useCollections } from '../contexts/CollectionContext'
import toast from 'react-hot-toast'

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false) // for opening the "add to collection" modal
  const [showConfirmDialog, setShowConfirmDialog] = useState(false) // for showing confirm remove popup
  const { collections, removeFromCollection } = useCollections()

  // check if the movie is already in any collection
  const isInCollection = collections.some(collection => 
    collection.movies.some(m => m.imdbID === movie.imdbID)
  )

   // get the collection the movie currently belongs to (if any)
  const getExistingCollection = () => {
    return collections.find(collection => 
      collection.movies.some(m => m.imdbID === movie.imdbID)
    )
  }

  // when card is clicked, go to movie detail page (unless a modal/dialog is open)
  const handleCardClick = (e) => {
    if (isModalOpen || showConfirmDialog) return
    navigate(`/movie/${movie.imdbID}`)
  }

  // handle click on add/remove button
  const handleButtonClick = (e) => {
    e.stopPropagation()
    if (isInCollection) {
      setShowConfirmDialog(true)
    } else {
      setIsModalOpen(true)
    }
  }

  // confirm and remove movie from the collection
  const handleRemove = () => {
    const collection = getExistingCollection()
    if (collection) {
      removeFromCollection(collection.id, movie.imdbID)
      toast.success(`Removed "${movie.Title}" from "${collection.name}"`)
    }
    setShowConfirmDialog(false)
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-black/60 rounded-lg p-4 hover:bg-black/70 transition-colors cursor-pointer transform hover:scale-105 duration-200 flex flex-col h-full relative group"
    >
      {/* Add to collection button */}
      <button 
        className={`absolute top-2 right-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200
          ${isInCollection ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-500'}`}
        onClick={handleButtonClick}
      >
        {isInCollection ? (
          <FaCheck className="text-white" />
        ) : (
          <FaPlus className="text-white" />
        )}
      </button>

      <div className="flex-1 flex mb-2">
        <img 
          src={movie.Poster !== 'N/A' ? movie.Poster : 'placeholder-image-url'} 
          alt={movie.Title}
          className="w-auto h-auto max-h-64 rounded-lg object-contain"
        />
      </div>
      <div>
        <h3 className="text-white font-semibold">{movie.Title}</h3>
        <p className="text-gray-400">{movie.Year}</p>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Remove from Collection?</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to remove "{movie.Title}" from its collection?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowConfirmDialog(false)
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding to a collection */}
      <AddToCollectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={movie}
      />
    </div>
  )
}

export default MovieCard