import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import './users.css'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
  gender: string
  age: number
  phone: number
}

const USERS_URL = process.env.REACT_APP_USERS_API

const fetchUsers = async (): Promise<User[]> => {
  console.log('API URL:', USERS_URL)
  const { data } = await axios.get(`${USERS_URL}`)
  console.log(data)
  return data
}

const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    retry: false,
  })
}

export default function Users() {
  const { data: users, isLoading, error } = useUsers()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const navigate = useNavigate()

  if (isLoading) return <p>Loading users...</p>
  if (error) {
    console.log('error:', error)
    return <p>Error loading users.</p>
  }

  const filteredUsers = users?.length
    ? users.filter((user) =>
        `${user.firstName} ${user.lastName} ${user.email}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    : []

  const handleUserClick = (user: User) => {
    navigate(`/user-details/${user.id}`)
  }

  return (
    <div className="users-container">
      <div className="users-list-wrapper">
        <h3 className="user-heading">List of Users</h3>
        {filteredUsers?.map((user) => (
          <div className="users-list" key={user.id}>
            <p className="count">{user.id}.</p>
            <div key={user.id} className="users-image">
              <img src={user.image} alt="avatar" className="image" />
              <div className="name-email">
                <p className="user-name" onClick={() => handleUserClick(user)}>
                  {user.firstName} {user.lastName}
                </p>
                <p className="user-email" onClick={() => handleUserClick(user)}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
