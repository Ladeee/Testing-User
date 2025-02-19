import { Link } from 'react-router-dom'
import './navbar.css'
import { useUserContext } from '../userContent';

export default function Navbar() {
  const { state, dispatch } = useUserContext();

  return (
    <nav>
      <Link to="/" className="link">
        <h2 className="logo">userTesting</h2>
      </Link>
      <input
        type="text"
        placeholder="Search for users"
        className="input"
        value={state.searchQuery}
        onChange={(e) =>
          dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })
        }
      />
    </nav>
  )
}
