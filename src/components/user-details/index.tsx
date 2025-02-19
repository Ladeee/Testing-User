import { useLocation } from 'react-router-dom'
import './details.css'

export default function UserDetails() {
  const location = useLocation();
  const user = location.state?.user

  if (!user) {
    return <p>No user data found.</p>
  }

  return (
    <div className="user-details-container">
      <div className="user-details-wrapper">
        <h3 className="detail-heading">User Details</h3>
        <div className="user-info">
          <img src={user.image} alt="User Avatar" className="detail-image" />
          <p className="detail-test">
            <b>Full name:</b> {user.firstName} {user.lastName}
          </p>
          <p className="detail-test">
            <b>Email:</b> {user.email}
          </p>
          <p className="detail-test">
            <b>Gender:</b> {user.gender}
          </p>
          <p className="detail-test">
            <b>Age:</b> {user.age}
          </p>
          <p className="detail-test">
            <b>Phone number:</b> {user.phone}
          </p>
        </div>
      </div>
    </div>
  )
}
