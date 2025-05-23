import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../assets/dp.jpg";
import "../styles/UserManagement.css";

const UserManagement = () => {
  const navigate = useNavigate();

  const users = [
    {
      id: 1,
      name: "Michael Holz",
      dateCreated: "04/10/2013",
      role: "Admin",
      status: "Active",
      image: Profile,
    },
    {
      id: 2,
      name: "Paula Wilson",
      dateCreated: "05/08/2014",
      role: "Publisher",
      status: "Active",
      image: Profile,
    },
    {
      id: 3,
      name: "Antonio Moreno",
      dateCreated: "11/05/2015",
      role: "Publisher",
      status: "Suspended",
      image: Profile,
    },
    {
      id: 4,
      name: "Mary Saveley",
      dateCreated: "06/09/2016",
      role: "Reviewer",
      status: "Active",
      image: Profile,
    },
    {
      id: 5,
      name: "Martin Sommer",
      dateCreated: "12/08/2017",
      role: "Moderator",
      status: "Inactive",
      image: Profile,
    },
  ];

  // Check if user is authenticated
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
        <h1>User Management Page</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date Created</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <img src={user.image} alt={user.name} className="user-image" />
                {user.name}
              </td>
              <td>{user.dateCreated}</td>
              <td>{user.role}</td>
              <td>
                <span
                  className={`status-dot ${
                    user.status == "Active"
                      ? "status-active"
                      : user.status == "Suspended"
                      ? "status-suspended"
                      : "status-inactive"
                  }`}
                ></span>
                {user.status}
              </td>
              <td>
                <span className="action-icon edit">
                  <i class="fa-solid fa-pen"></i>
                </span>
                <span className="action-icon delete">
                  <i class="fa-solid fa-xmark"></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
