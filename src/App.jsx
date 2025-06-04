import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from "./components/Navigation"
import { Toaster } from 'react-hot-toast'
import Search from "./components/Search"
import MovieDetails from './components/MovieDetails'
import { CollectionProvider } from './contexts/CollectionContext'

export default function App() {
  return (
    // Wrap whole app in CollectionProvider so all components can use collections data
    <CollectionProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-900 text-white">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Search />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
            </Routes>
          </div>
        </div>
        {/* Toaster component to show popup messages at bottom right */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 2000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </Router>
    </CollectionProvider>
  )
}