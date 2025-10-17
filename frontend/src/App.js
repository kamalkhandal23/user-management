import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-5xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateUser />} />
            <Route path="/edit/:id" element={<EditUser />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
