# Movie

## About The App
A React-based web application that allows users to search for movies using the OMDb API, view details, and organize favorites into custom collections. Features include debounced search, URL-based filtering, local collection storage, and responsive design.

## Getting Started
Follow the instructions below to run the project locally.

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
### 1. Clone the Repository
```
git clone git@github.com:Mandipppp/Movie.git
cd Movie
```
### 2. Install Dependencies
```
npm install
```
For yarn
```
yarn install
```
### 3. Start the Development Server
```
npm run dev
```
for yarn
```
yarn dev
```
### Features
- Search with Debounce: Delays API requests until the user stops typing (500ms) to reduce unnecessary calls and improve performance.

- Context API for Global State: Movie collections are managed using useContext via a CollectionProvider, allowing any component to access or update them.

- URL Search Parameters: Search query, movie type, and year are synced to the URL using useSearchParams, making filters sharable.

- LocalStorage Persistence: Collections persist between page reloads by saving data to localStorage.

- Toast Notifications: User feedback is handled using react-hot-toast for actions like creating collections or adding/removing movies.

- Responsive Layout: Optimized for mobile and desktop with Tailwind CSS.

### Challenge
Managing collection uniqueness required checking for duplicates across collections to prevent the same movie from appearing in multiple places unintentionally.

### Bonus Features
- Web Share API (optional): The app can be extended to support native sharing of movie links via the Web Share API on supported devices.

- Dynamic Filtering: Users can filter results by type (movie, series, episode) and release year directly through the UI.

- Collection Modal: A modal UI allows users to view, add to, and delete collections dynamically.

