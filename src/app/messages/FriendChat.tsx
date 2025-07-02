'use client'

import { Friend } from "@/types/User";
import { Dispatch, SetStateAction } from "react";

interface FriendChatProps {
  friends: Friend[];
  selectedFriend: string | null;
  setSelectedFriend: Dispatch<SetStateAction<string | null>>;
}

export default function FriendChat({ friends, selectedFriend, setSelectedFriend }: FriendChatProps) {
  return (
    <div className="flex flex-col space-y-4 rounded-lg shadow-lg">
      <h2 className="text-lg text-subtle">Friends</h2>
      <ul className="space-y-1">
        {friends.map((friend) => (
          <li key={friend.id} onClick={() => setSelectedFriend(friend.username)} className={`${selectedFriend === friend.username ? `bg-highlight-med` : `bg-overlay`} flex flex-row bg-opacity-50 space-x-2 rounded-lg items-center h-12 hover:bg-highlight-med`}>
            <div className="w-7 h-7 ml-2 bg-overlay rounded-full flex items-center justify-center">
              <span className="text-text font-medium">J</span>
            </div>
            <span className="text-text">{friend.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
