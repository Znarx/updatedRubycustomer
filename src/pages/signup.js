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
        } else {
          await fetchProfile();
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/login?redirect=/profile');
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setProfile(response.data.customer);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-200">
      <SideNavbar />
      <div className="flex-1 p-10">
        {profile ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
            <p><strong>Full Name:</strong> {profile.fullname}</p>
            <p><strong>Email:</strong> {profile.emailaddress}</p>
            <p><strong>Contact Number:</strong> {profile.contactnumber}</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-blue-500 text-white rounded px-4 py-2"
            >
              Edit Profile
            </button>
            {showModal && <ProfileModal profile={profile} onClose={() => setShowModal(false)} />}
            {showDeleteModal && <ConfirmationModal onClose={() => setShowDeleteModal(false)} />}
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;