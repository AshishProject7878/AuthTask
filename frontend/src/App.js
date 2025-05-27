import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import PostList from "./pages/PostList";
import EditPost from "./pages/EditPost";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/postList" element={<PostList />} />
        <Route path="/edit-post/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
        <Route path="/user-management" element={<ProtectedRoute> <UserManagement /> </ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
