import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import Playlist from "./pages/Playlist/Playlist";
import Roast from "./pages/Roast/Roast";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/roast" element={<Roast />} />
      </Route>
    </Routes>
  );
}

export default App;
