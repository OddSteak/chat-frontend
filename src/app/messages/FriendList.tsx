'use client';

import { apiClient } from "@/lib/api";
import { Friend } from "@/types/User";

interface FriendListProps {
  friends: Friend[];
  removeOption?: boolean;
  handleRemovingFriend?: (removeFriend: string) => void;
}

export default function FriendList({ friends, removeOption = false, handleRemovingFriend }: FriendListProps) {
  const removeFriend = async (username: string) => {
    try {
      const response = await apiClient.post(`/api/friends/remove-friend?friendName=${username}`, {});

      if (!response.ok) {
        throw new Error('Failed to remove friend');
      }

      handleRemovingFriend?.(username);
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-surface rounded-lg shadow-lg">
      <h2 className="text-lg text-muted">Friends List</h2>
      <ul className="space-y-1">
        {friends.map((friend) => (
          <li key={friend.id} className="flex flex-row items-center space-x-2">
            <div className="w-7 h-7 bg-overlay rounded-full flex items-center justify-center">
              <span className="text-text font-medium">J</span>
            </div>
            <span className="text-text">{friend.username}</span>
            {removeOption && <button
              className={"ml-auto h-5 w-5 bg-love text-text hover:bg-red-600 transition-colors rounded-lg"}
              onClick={() => removeFriend(friend.username)}>
              ✗
            </button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
