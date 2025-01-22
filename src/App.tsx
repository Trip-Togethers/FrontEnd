import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react';
import Login from "./pages/Login"
import AddPost from "./pages/AddPost"
import Board from "./pages/Board"
import Calendar from "./pages/Calendar"
import Detail from "./pages/Detail"
import Home from "@/pages/Home"
import Join from "./pages/Join"
import Map from "./pages/Map"
import Post from "./pages/Post"
import User from "./pages/User"
import Navbar from "./components/common/Navbar"
import Sidebar from "./components/common/Sidebar"


function App() {
   
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState<'user' | 'notifications'>('profile');

  const handleToggleSidebar = (content: 'user' | 'notifications') => {
    if (sidebarOpen && sidebarContent === content) {
      setSidebarOpen(false);
    } else {
      setSidebarContent(content);
      setSidebarOpen(true);
    }
  };
  return (
    <BrowserRouter>
    <>
    <Navbar onToggleSidebar={handleToggleSidebar} />
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          content={sidebarContent}
        />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/user" element={<User />} />
          <Route path="/board" element={<Board />} />
          <Route path="/post" element={<Post />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/map" element={<Map />} />
        </Routes>
    </>
    </BrowserRouter>
  )
}

export default App
