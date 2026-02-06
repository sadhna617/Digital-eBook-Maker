import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";


import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Examples from "./components/Examples";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";


import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ExploreEbooks from "./pages/ExploreEbooks";
import Reader from "./pages/Reader";

import EbookDesignSelection from "./pages/EbookDesignSelection";
import EbookEditor from "./pages/EbookEditor";
import CustomTemplateEditor from "./pages/CustomTemplateEditor";
import CreateEbookModal from "./components/CreateEbookModal";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      <Hero />

      {/* Show Create Button only for logged-in users */}
      {isLoggedIn && (
        <div className="text-center my-4">
          <button
            className="btn btn-primary btn-lg px-5 rounded-pill shadow-sm"
            onClick={() => setShowModal(true)}
          >
            ✨ Create New Ebook
          </button>
        </div>
      )}

      <Features />
      <Examples />
      <Footer />

      {/* Modal */}
      <CreateEbookModal
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* EBOOK FLOW */}
        <Route path="/ebook-design/:id" element={<EbookDesignSelection />} />
        <Route path="/ebook-custom-template/:id" element={<CustomTemplateEditor />} />
        <Route path="/ebook-editor/:id" element={<EbookEditor />} />

        {/* OTHER */}
        <Route path="/explore" element={<ExploreEbooks />} />
        <Route path="/ebooks/:id" element={<Reader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
