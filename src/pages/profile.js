import React, { useState, useEffect } from "react";
import SideNavbar from "../components/sidenavbar";
import ProfileModal from "../components/profileModal";
import ConfirmationModal from "../components/confirmationModal";
import { useRouter } from 'next/router';
import axios from 'axios';

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/check-auth');
        if (!response.data.isAuthenticated) {
          router.push('/login?redirect=/profile');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/login?redirect=/profile');
      }
    };

    checkAuth();
  }, [router]);



  return (
    <div className="flex min-h-screen bg-gray-200">
      <SideNavbar />
    </div>
  );
};

export default Profile;
