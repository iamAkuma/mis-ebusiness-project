import React, { useEffect, useState } from 'react';
import AdminNavBar from './AdminNavBar';
import Loading from '../Loading';
import { Link } from 'react-router-dom';

const UserInfo = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banMessage, setBanMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users");
        const data = await response.json();

        // Sort the user data by date in descending order
        const sortedUsers = data.sort((a, b) => new Date(b.date) - new Date(a.date));

        setUserData(sortedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBanUser = async (userId) => {
    const isConfirmed = window.confirm("Are you sure you want to ban this user?");
    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/users/ban/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUserData((prevUsers) => prevUsers.filter((user) => user._id !== userId));
          setBanMessage('User banned successfully');

          // Clear the ban message after 3 seconds (adjust the timeout duration as needed)
          setTimeout(() => {
            setBanMessage('');
          }, 1800);
        } else {
          setBanMessage('Failed to ban user.');
        }
      } catch (error) {
        console.error('Error banning user:', error);
      }
    }
  };

  return (
    <div>
      <AdminNavBar />
      <br /> <br /> <br /> <br /> <br />
      <div className='d-flex justify-content-center'>
      <Link to="/admin" className='btn btn-success mx-2'>
        View Products
      </Link>
        <Link to="/admin/ordersdata" className="btn btn-success">
          View Orders
        </Link>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className='container'>
          <h3 className="fs-7 mt-4 mb-4 d-flex justify-content-center">User Information</h3>
          <table className="table">
            <thead>
              <tr className='userinfo'>
                <th>Name</th>
                <th>Email</th>
                <th>Date Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.date}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleBanUser(user._id)}>
                      Ban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {banMessage && (
            <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-body">
                    <p>{banMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
