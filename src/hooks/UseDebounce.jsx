import { useState, useEffect } from 'react'

// / Custom hook to delay updating a value
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // If the value changes before the delay finishes, cancel the previous timeout
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}