import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Users from './components/users'
import UserDetails from './components/user-details'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/user-details/:id" element={<UserDetails />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
