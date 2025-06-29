export default function FriendList({ friends }) {
  return (
    <div>
      <h2 className="text-lg text-muted">Friends List</h2>
      <ul className="space-y-1">
        {friends.map((friend) => (
          <li key={friend.id} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-overlay rounded-full flex items-center justify-center">
              <span className="text-text font-medium">J</span>
            </div>
            <span className="text-text">{friend.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
