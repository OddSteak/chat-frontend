import { Friend } from "@/types/User";

export default function FriendList({ friends }: { friends: Friend[] }) {
  return (
    <div className="flex flex-col space-y-4 p-4 bg-surface rounded-lg shadow-lg">
      <h2 className="text-lg text-muted">Friends List</h2>
      <ul className="space-y-1">
        {friends.map((friend) => (
          <li key={friend.id} className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-overlay rounded-full flex items-center justify-center">
              <span className="text-text font-medium">J</span>
            </div>
            <span className="text-text">{friend.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
