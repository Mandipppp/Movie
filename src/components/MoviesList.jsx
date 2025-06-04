import React from 'react'
import MovieCard from './MovieCard'

const MoviesList = ({ movies, loading, query }) => {
  // Show loading message while movies are being fetched
  if (loading) {
    return <div className="text-center text-white">Loading...</div>
  }

  // If user hasn’t searched anything yet
  if(!query){
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-white text-lg">Search to see result.</p>
      </div>
    )
  } 

  // If no movies are found for the search
  if (!movies || movies.length === 0) {
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-white text-lg">Sorry, no results found.</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </div>
  )
}

export default MoviesList