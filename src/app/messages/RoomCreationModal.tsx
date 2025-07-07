'use client'

import { apiClient } from "@/lib/api";
import { FormEvent } from "react";

interface CreateRoomModalProps {
  setIsCreatingRoomAction: (open: boolean) => void;
}

export default function CreateRoomModal({ setIsCreatingRoomAction }: CreateRoomModalProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const roomName = formData.get("roomName") as string;
    const roomDescription = formData.get("roomDescription") as string;
    const type = formData.get("privateRoom") === "on" ? "PRIVATE" : "PUBLIC";

    if (!roomName || !roomDescription || !type) {
      console.error("Room name, description, and type are required.");
      return;
    }

    const response = await apiClient.post("/api/rooms/create-room", {
      roomName: roomName,
      description: roomDescription,
      type: type
    })

    if (!response.ok) {
      console.error("Failed to create room");
      setIsCreatingRoomAction(false);
      return;
    }

    const data = await response.json();
    console.log("Room created successfully:", data.roomId);
    setIsCreatingRoomAction(false);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="relative flex flex-col w-100 h-100 bg-surface shadow-2xl rounded-lg p-1">
        <div className="bg-overlay flex-1 rounded-lg p-6">
          <h2 className="text-lg text-text font-semibold mb-4">Create Room</h2>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="roomName"
              placeholder="Room Name"
              className="p-2 rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-highlight-high"
            />

            <input
              type="text"
              name="roomDescription"
              placeholder="Room Description"
              className="p-2 rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-highlight-high"
            />

            {/* checkbox for private room */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="privateRoom"
                id="privateRoom"
                className="h-4 w-4 text-highlight-med focus:ring-highlight-high border-gray-300 rounded"
              />
              <label htmlFor="privateRoom" className="text-text">Private Room</label>
            </div>

            <div className="flex flex-row justify-center mt-4 items-center space-x-5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsCreatingRoomAction(false)
                }}
                className="bg-highlight-med flex-1 text-text font-medium p-2 rounded-lg hover:bg-highlight-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-highlight-med flex-1 text-text font-medium p-2 rounded-lg hover:bg-highlight-high transition-colors"
              >
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
