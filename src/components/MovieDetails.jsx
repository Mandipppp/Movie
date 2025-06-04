import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaPlus, FaCheck} from 'react-icons/fa'
import AddToCollectionModal from './AddToCollectionModal'
import toast from 'react-hot-toast'
import { useCollections } from '../contexts/CollectionContext'


const MovieDetails = () => {
  // Get movie ID from URL
  const { id } = useParams()
  const navigate = useNavigate()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const { collections, removeFromCollection } = useCollections()

  // Check if movie is in any collection
  const isInCollection = movie && collections.some(collection => 
    collection.movies.some(m => m.imdbID === movie.imdbID)
  )

  const getExistingCollection = () => {
    return collections.find(collection => 
      collection.movies.some(m => m.imdbID === movie.imdbID)
    )
  }

  const handleButtonClick = (e) => {
    e.stopPropagation()
    if (isInCollection) {
      setShowConfirmDialog(true)
    } else {
      setIsModalOpen(true)
    }
  }

  const handleRemove = () => {
    const collection = getExistingCollection()
    if (collection) {
      removeFromCollection(collection.id, movie.imdbID)
      toast.success(`Removed "${movie.Title}" from "${collection.name}"`)
    }
    setShowConfirmDialog(false)
  }
  

  // Fetch movie details from OMDb API
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=eea40552&i=${id}&plot=full`
        )
        const data = await response.json()
        setMovie(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching movie details:', error)
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id]) // run on load or when id changes

  if (loading) {
    return <div className="text-center text-white">Loading...</div>
  }

  if (!movie) {
    return <div className="text-center text-white">Movie not found</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-black/60 rounded-lg p-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
      >
        <FaArrowLeft />
        <span>Back to Movies</span>
      </button>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster Section */}
          <div className="md:w-1/3">
            <img 
              src={movie.Poster !== 'N/A' ? movie.Poster : 'placeholder-image-url'}
              alt={movie.Title}
              className="w-full rounded-lg shadow-xl"
            />
          </div>

          {/* Details Section */}
          <div className="md:w-2/3 flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-white">{movie.Title}</h1>
                <button 
                  className={`p-2 rounded-full transition-colors flex-shrink-0
                    ${isInCollection ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-500'}`}
                  onClick={handleButtonClick}
                >
                  {isInCollection ? (
                    <FaCheck className="text-white w-4 h-4" />
                  ) : (
                    <FaPlus className="text-white w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                <span>{movie.Year}</span>
                <span>•</span>
                <span>{movie.Runtime}</span>
                <span>•</span>
                <span>{movie.Rated}</span>
              </div>
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
                      onClick={() => setShowConfirmDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      onClick={handleRemove}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
            <AddToCollectionModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              movie={movie}
            />

            {/* Ratings Section */}
            <div className="flex gap-4 flex-wrap">
              {movie.Ratings?.map((rating) => (
                <div key={rating.Source} className="bg-black/40 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-400">{rating.Source}</p>
                  <p className="text-white font-semibold">{rating.Value}</p>
                </div>
              ))}
            </div>

            {/* Plot */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Plot</h2>
              <p className="text-gray-300 leading-relaxed">{movie.Plot}</p>
            </div>

            {/* Main Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Director" value={movie.Director} />
              <DetailItem label="Writers" value={movie.Writer} />
              <DetailItem label="Cast" value={movie.Actors} />
              <DetailItem label="Genre" value={movie.Genre} />
              <DetailItem label="Release Date" value={movie.Released} />
              <DetailItem label="Box Office" value={movie.BoxOffice} />
              <DetailItem label="Country" value={movie.Country} />
              <DetailItem label="Language" value={movie.Language} />
            </div>

            {/* Awards */}
            {movie.Awards !== "N/A" && (
              <div className="bg-black/40 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-2">Awards</h2>
                <p className="text-gray-300">{movie.Awards}</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}


const DetailItem = ({ label, value }) => {
  if (!value || value === "N/A") return null;
  return (
    <div>
      <span className="text-gray-400 font-medium">{label}: </span>
      <span className="text-white">{value}</span>
    </div>
  );
};

export default MovieDetails