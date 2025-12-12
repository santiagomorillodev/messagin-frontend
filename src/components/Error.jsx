import React from 'react'

export default function Error({ loading, error }) {
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-400">
        Error loading user.
      </div>
    );
  }
}
