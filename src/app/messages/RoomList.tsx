export default function RoomList() {
  return (
    <div className="flex flex-col space-y-2">
      <h2 className="text-lg font-semibold text-text">Channels</h2>
      <ul className="space-y-1">
        <li className="p-2 rounded hover:bg-highlight-low cursor-pointer">
          <span className="text-text"># general</span>
        </li>
        <li className="p-2 rounded hover:bg-highlight-low cursor-pointer">
          <span className="text-text"># random</span>
        </li>
      </ul>
    </div>
  )
}
