import { Link, useSearchParams } from 'react-router-dom'
import './navbar.css'

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (query) {
      searchParams.set("search", query);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };
  return (
    <nav>
      <Link to="/" className="link">
        <h2 className="logo">userTesting</h2>
      </Link>
      <input
        type="text"
        placeholder="Search for users"
        className="input"
        value={searchParams.get("search") || ""}
        onChange={handleSearch}
      />
    </nav>
  )
}
