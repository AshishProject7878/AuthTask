import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Profile from "../assets/dp.jpg";
import "../styles/UserManagement.css";

const UserManagement = () => {
  const navigate = useNavigate();

  const users = [
    {
      id: 1,
      name: "Mohan Gupta",
      dateCreated: "01/01/2010",
      role: "Admin",
      status: "Active",
      image: Profile,
    },
    {
      id: 2,
      name: "Ajay Mishra",
      dateCreated: "05/11/2014",
      role: "Publisher",
      status: "Active",
      image: Profile,
    },
    {
      id: 3,
      name: "Rahul Sharma",
      dateCreated: "01/01/2015",
      role: "Publisher",
      status: "Suspended",
      image: Profile,
    },
    {
      id: 4,
      name: "Suresh Kumar",
      dateCreated: "02/10/2016",
      role: "Reviewer",
      status: "Active",
      image: Profile,
    },
    {
      id: 5,
      name: "Ravi Singh",
      dateCreated: "07/12/2018",
      role: "Moderator",
      status: "Inactive",
      image: Profile,
    },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="user-management-container">
      <div className="banner1">
        <h1>User Management</h1>
        <button
          className="logout-button"
          onClick={handleLogout}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Name</th>
              <th>Date Created</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="user-row">
                <td>{user.id}</td>
                <td>
                  <img
                    src={user.image}
                    alt={user.name}
                    className="user-image"
                  />
                  {user.name}
                </td>
                <td>{user.dateCreated}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={`status-dot status-${user.status.toLowerCase()}`}
                    title={`Status: ${user.status}`}
                  ></span>
                  {user.status}
                </td>
                <td>
                  <button
                    className="action-icon edit"
                    aria-label={`Edit ${user.name}`}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="action-icon delete"
                    aria-label={`Delete ${user.name}`}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;