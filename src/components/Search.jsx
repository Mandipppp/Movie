import React, { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useDebounce } from '../hooks/UseDebounce'
import MoviesList from './MoviesList'
import { useSearchParams } from 'react-router-dom'
import CollectionModal from './CollectionModal'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false)
  // const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') || ''
  const year = searchParams.get('year') || ''

  // Debounce the query so it doesn't search on every keystroke
  const debouncedQuery = useDebounce(query, 500)
  const [error, setError] = useState(null)

  // Update URL params when filters change
  const updateFilters = (newParams) => {
    const current = Object.fromEntries(searchParams)
    setSearchParams({ ...current, ...newParams })
  }

  useEffect(() => {
    const fetchMovies = async () => {
      // Don't search if query is too short
      if (debouncedQuery.length < 3) {
        setMovies([])
        setError(null)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({
          apikey: 'eea40552',
          s: debouncedQuery,
          ...(type && { type }), // Only include if selected
          ...(year && { y: year })
        })

        const response = await fetch(`https://www.omdbapi.com/?${params}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.Error) {
          setError(data.Error)
          setMovies([])
        } else if (data.Search) {
          setMovies(data.Search)
        } else {
          setMovies([])
        }
      } catch (error) {
        console.error('Error fetching movies:', error)
        setError('Failed to fetch movies. Please check your internet connection.')
        setMovies([])
      }
      setLoading(false)
    }

    fetchMovies()
  }, [debouncedQuery, type, year])

  return (
    <div className="flex flex-col w-full">
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-4xl bg-black/60 rounded-xl p-4 space-y-4">
          {/* Search Bar and Create Collection Button */}
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center bg-black/30 rounded-full px-4 py-2">
              <input 
                type="text"
                value={query}
                onChange={(e) => updateFilters({ q: e.target.value })}
                placeholder="Search..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              />
            </div>
            <button 
              onClick={() => setIsCollectionModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded-full text-white hover:scale-105 transition-transform duration-200"
            >
              <FaPlus className="text-sm" />
              <span>View Collection</span>
            </button>
          </div>
  
          {/* Filters Row */}
          <div className="flex items-center gap-4">
            <select
              value={type}
              onChange={(e) => updateFilters({ type: e.target.value })}
              className="bg-black/30 text-white rounded-full px-4 py-2 outline-none cursor-pointer hover:bg-black/40 transition-colors"
            >
              <option value="">All Types</option>
              <option value="movie">Movies</option>
              <option value="series">Series</option>
              <option value="episode">Episodes</option>
            </select>
  
            <input
              type="number"
              value={year}
              onChange={(e) => updateFilters({ year: e.target.value })}
              placeholder="Year"
              min="1900"
              max={new Date().getFullYear()}
              className="bg-black/30 text-white rounded-full px-4 py-2 outline-none w-32 hover:bg-black/40 transition-colors"
            />
          </div>
        </div>
      </div>
      {error && (
        <div className="mx-auto mt-8 p-4 bg-red-500/10 text-red-500 rounded-lg max-w-4xl">
          <p>{error}</p>
        </div>
      )}
      <MoviesList movies={movies} loading={loading} query={query} />
      <CollectionModal 
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
      />
    </div>
  )
}

export default Search