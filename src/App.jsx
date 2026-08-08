import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import RedirectPage from './pages/RedirectPage'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/redirect" element={<RedirectPage />} />
      </Routes>
    </div>
  )
}

export default App
