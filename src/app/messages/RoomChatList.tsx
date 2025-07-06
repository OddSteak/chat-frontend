'use client'

import { Room } from "@/types/User";
import { Dispatch, SetStateAction } from "react";

interface RoomChatListProps {
  rooms: Room[];
  selectedRoom: Room | null;
  setSelectedRoomAction: Dispatch<SetStateAction<Room | null>>;
  setIsCreatingRoomAction: Dispatch<SetStateAction<boolean>>;
}

export default function RoomChatList({ rooms, selectedRoom, setSelectedRoomAction, setIsCreatingRoomAction }: RoomChatListProps) {
  return (
    <div className="flex flex-col space-y-4 rounded-lg shadow-lg">
      {/* add room bubble */}
      <button className="flex items-center justify-center text-text font-medium h-10 bg-overlay rounded-lg hover:bg-highlight-med cursor-pointer"
        onClick={() => setIsCreatingRoomAction(true)}>
        Create Room
      </button>

      {/* Room Chat List */}
      <h2 className="text-lg text-subtle">Rooms</h2>
      <ul className="space-y-1">
        {rooms.map((room) => (
          <li key={room.id} onClick={() => setSelectedRoomAction(room)} className={`${selectedRoom?.id === room.id ? `bg-highlight-med` : `bg-overlay`} flex flex-row bg-opacity-50 space-x-2 rounded-lg items-center h-12 hover:bg-highlight-med`}>
            <div className="w-7 h-7 ml-2 bg-overlay rounded-full flex items-center justify-center">
              <span className="text-text font-medium">{room.name[0]}</span>
            </div>
            <span className="text-text">{room.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
