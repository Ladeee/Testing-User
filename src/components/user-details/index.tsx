import axios from 'axios';
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import './details.css'

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  gender: string;
  age: number;
  phone: number;
}


export default function UserDetails() {
  const fetchUserDetails = async (id: string | undefined): Promise<User> => {
    if (!id) throw new Error("No user ID provided");
    const { data } = await axios.get(`${process.env.REACT_APP_USERS_API}/users/${id}`);
    return data;
  };
  
  const { id } = useParams();
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserDetails(id),
    enabled: !!id, 
    retry: false
  });
  
  if (isLoading) return <p>Loading user details...</p>;
  if (error) return <p>Error loading user details.</p>;
  if (!user) {
    return <p>No user data found.</p>
  }

  return (
    <div className="user-details-container">
      <div className="user-details-wrapper">
        <h3 className="detail-heading">User Details</h3>
        <div className="user-info">
          <img src={user.image} alt="User Avatar" className="detail-image" />
          <div className="detail-test">
            <b>Full name:</b>{' '}
            <span>
              {user.firstName} {user.lastName}
            </span>
          </div>
          <div className="detail-test">
            <b>Email:</b> {user.email}
          </div>
          <div className="detail-test">
            <b>Gender:</b> {user.gender}
          </div>
          <div className="detail-test">
            <b>Age:</b> {user.age}
          </div>
          <div className="detail-test">
            <b>Phone number:</b> {user.phone}
          </div>
        </div>
      </div>
    </div>
  )
}
