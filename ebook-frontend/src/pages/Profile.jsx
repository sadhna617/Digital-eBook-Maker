import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [username, setUsername] = useState(storedUser?.username || "");
  const [email, setEmail] = useState(storedUser?.email || "");
  const [createdAt, setCreatedAt] = useState(storedUser?.createdAt || "");
  const [isEditing, setIsEditing] = useState(false);
  const [gender, setGender] = useState(storedUser?.gender || "");
  const [city, setCity] = useState(storedUser?.city || "");
  const [profileImage, setProfileImage] = useState(storedUser?.profileImageUrl || "");
  const userId = storedUser?.id;

  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
    }
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      const res = await api.put(`/user/${userId}`, {
        username,
        email,
        gender,
        city
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  // Delete account
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account."
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/user/${userId}`);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert("Account deleted");
      navigate("/register");
    } catch {
      alert("Failed to delete account");
    }
  };

    const handlePhotoUpload = async (file) => {
  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.type)) {
    alert("Only JPG and PNG images are allowed.");
    return;
  }

  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    alert("Image size must be less than 2MB.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post(`/user/${userId}/upload-photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setProfileImage(res.data.imageUrl);

    const updatedUser = {
      ...storedUser,
      profileImageUrl: res.data.imageUrl
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
  } catch {
    alert("Failed to upload image");
  }
};



  return (
  <div className="container mt-5">
    <div className="card p-4 shadow rounded-4">

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
      <div className="text-center">
        <img
          src={
            profileImage
              ? `http://localhost:5261${profileImage}`
              : "https://via.placeholder.com/80"
          }
          alt="Profile"
          className="rounded-circle border"
          style={{ width: 80, height: 80, objectFit: "cover" }}
        />

        {isEditing && (
          <input
            type="file"
            accept="image/*"
            className="form-control form-control-sm mt-2"
            onChange={(e) => handlePhotoUpload(e.target.files[0])}
          />
        )}
      </div>

      <div>
        <h5 className="mb-0">{username}</h5>
        <small className="text-muted">{email}</small>
      </div>
    </div>


        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>

      {/* Form Fields */}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Username</label>
          <input
            disabled={!isEditing}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            disabled={!isEditing}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Gender</label>
          <select
            disabled={!isEditing}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="form-select"
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">City</label>
          <input
            disabled={!isEditing}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      {/* Save / Cancel */}
      {isEditing && (
        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-success" onClick={handleSave}>
            Save Changes
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <hr className="my-4" />

      {/* Account Actions (Logout + Delete) */}
      <div>
        <h6 className="text-muted mb-3">Account Actions</h6>

        <div className="d-flex gap-3 flex-wrap">
          <button className="btn btn-outline-dark" onClick={handleLogout}>
            Logout
          </button>

          <button className="btn btn-outline-danger" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
);

}

export default Profile;