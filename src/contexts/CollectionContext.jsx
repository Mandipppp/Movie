import React, { createContext, useContext, useState } from 'react'

// Create the context to share collection data
const CollectionContext = createContext()

export const CollectionProvider = ({ children }) => {
  const [collections, setCollections] = useState(() => {
    return JSON.parse(localStorage.getItem('movieCollections')) || []
  })

  // Update both state and localStorage
  const updateCollections = (newCollections) => {
    setCollections(newCollections)
    localStorage.setItem('movieCollections', JSON.stringify(newCollections))
  }

  const addToCollection = (collectionId, movie) => {
    const existingCollection = collections.find(collection => 
      collection.movies.some(m => m.imdbID === movie.imdbID)
    )
    let updatedCollections = [...collections]

     // If movie already exists in another collection, remove it from there first
    if (existingCollection) {
      updatedCollections = updatedCollections.map(collection => {
        if (collection.id === existingCollection.id) {
          return {
            ...collection,
            movies: collection.movies.filter(m => m.imdbID !== movie.imdbID)
          }
        }
        return collection
      })
    }

    // Add to new collection
    updatedCollections = updatedCollections.map(collection => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          movies: [...collection.movies, movie]
        }
      }
      return collection
    })

    updateCollections(updatedCollections)
  }

  const removeFromCollection = (collectionId, movieId) => {
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          movies: collection.movies.filter(movie => movie.imdbID !== movieId)
        }
      }
      return collection
    })
    // console.log('Removing movie:', movieId, 'from collection:', collectionId)
    // console.log('Updated collections:', updatedCollections)
    updateCollections(updatedCollections)
  }

  const createCollection = (newCollection) => {
    // Check if collection name already exists
    const nameExists = collections.some(
      collection => collection.name.toLowerCase() === newCollection.name.toLowerCase()
    )

    if (nameExists) {
      throw new Error(`Collection "${newCollection.name}" already exists`)
    }
    updateCollections([...collections, newCollection])
  }

  const deleteCollection = (collectionId) => {
    const updatedCollections = collections.filter(collection => collection.id !== collectionId)
    updateCollections(updatedCollections)
  }

  // Provide all collections and functions to components using this context
  return (
    <CollectionContext.Provider value={{ 
      collections, 
      addToCollection, 
      removeFromCollection,
      createCollection,
      deleteCollection
    }}>
      {children}
    </CollectionContext.Provider>
  )
}

export const useCollections = () => useContext(CollectionContext)