// src/components/user/AvatarUpload.js
import React, { useState, useRef } from "react";
import { Button, Image, Spinner } from "react-bootstrap";
import { uploadProfileImage } from "../../services/userService";
import useAuth from "../../hooks/useAuth";

const AvatarUpload = ({ currentImage, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { updateProfile } = useAuth();

  // Default profile image
  const defaultImage = "https://via.placeholder.com/150?text=User";

  // Format image URL
  const getImageUrl = () => {
    if (!currentImage) return defaultImage;

    // Check if it's already a full URL
    if (currentImage.startsWith("http")) {
      return currentImage;
    }

    // Otherwise, assume it's a relative path
    return `/uploads/profiles/${currentImage}`;
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      onError("Please select a valid image file (JPG, PNG, GIF)");
      return;
    }

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      onError("Image size should not exceed 1MB");
      return;
    }

    try {
      setLoading(true);
      const response = await uploadProfileImage(file);
      await updateProfile("profilePicture", response.profilePicture);
      onSuccess("Profile picture updated successfully");
      setLoading(false);
    } catch (err) {
      onError(err.response?.data?.message || "Failed to upload image");
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="position-relative d-inline-block">
        <Image
          src={getImageUrl()}
          roundedCircle
          width={150}
          height={150}
          className="object-fit-cover border"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />

        {loading && (
          <div
            className="position-absolute top-0 start-0 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 rounded-circle"
            style={{ width: "150px", height: "150px" }}
          >
            <Spinner animation="border" variant="light" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          accept="image/jpeg, image/png, image/gif"
          onChange={handleFileChange}
        />
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleClick}
          disabled={loading}
        >
          Change Photo
        </Button>
      </div>
    </div>
  );
};

export default AvatarUpload;
