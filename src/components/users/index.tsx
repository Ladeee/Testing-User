import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './users.css'
import { useUserContext } from '../userContent'

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

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get('https://dummyjson.com/users?limit=20')
  console.log(data.users)
  return data.users
}

const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}

export default function Users() {
  const { data: users, isLoading, error } = useUsers()
  const [, setSelectedUser] = useState<User | null>(null)
  const { state, dispatch } = useUserContext();
  const navigate = useNavigate()
  
  useEffect(() => {
    if (users) {
      dispatch({ type: "SET_USERS", payload: users });
    }
  }, [users, dispatch]);

  if (isLoading) return <p>Loading users...</p>
  if (error) return <p>Error loading users.</p>

  const filteredUsers = users?.length
    ? users.filter((user) =>
        `${user.firstName} ${user.lastName} ${user.email}`
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase())
      )
    : [];

  console.log("Filtered Users:", filteredUsers);


  const handleUserClick = (user: User) => {
    dispatch({ type: "SET_SELECTED_USER", payload: user });
    setSelectedUser(user)
    navigate(`/user-details/${user.id}`, { state: {user} });
  }

  return (
    <div className="users-container">
      <div className="users-list-wrapper">
        <h3 className="user-heading">List of Users</h3>
        <div className="users-list-header">
          <p className="count-heading">S/N</p>
          <div className="list-heading">
            <p className="list-head">Name of Users</p>
            <p className="list-head">Email of Users</p>
          </div>
        </div>
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
