'use client'

import { useAuth } from "@/contexts/AuthContext";

export function ProfileData() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="w-30 h-4 bg-overlay rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="text-center p-4">
        <p className="text-love mb-3">Connection failed</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-4">
        <p className="text-love">No user data available</p>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <h3 className="font-medium text-text">{user.username}</h3>
    </div>
  );
}

