'use client'

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface UserData {
  id: number;
  email: string;
  username: string;
}

export default function UserDetails() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {
    const getData = async () => {
      try {
        const data = await apiClient.get("/api/auth/me");
        setUserData(data.user);
        setError(false);
      } catch (error) {
        console.error("Network error:", error);
        setError(true);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  return (
    <>
      {loading ? (
        <p className="text-text text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">Failed to load profile data.</p>
      ) : userData ? (
        <div className="text-text">
          <p className="mb-2">Email: {userData.email}</p>
          <p>Username: {userData.username}</p>
        </div>
      ) : (
        <p className="text-red-500 text-center">No user data available.</p>
      )}
    </>
  )
}
