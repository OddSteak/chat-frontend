'use client'

import { useState } from "react";
import { apiClient } from "@/lib/api";
import { httpStatus } from "@/lib/httpStatus";
import { RequestData } from "@/types/User";

interface AddFriendProps {
  handleAddingReq: (req: RequestData, outgoing: boolean) => void;
}

export default function AddFriend({ handleAddingReq }:  AddFriendProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = event.currentTarget.username.value.trim();
    setLoading(true);
    setError(false);

    try {
      const response = await apiClient.post("/api/friends/send-req", { recipientName: username });
      const res = await response.json();

      if (response.status === httpStatus.NOT_FOUND) {
        setError(true);
        setResult("User not found.");
      } else if (response.status === httpStatus.BAD_REQUEST) {
        setError(true);
        setResult("you cannot send a friend request to yourself.");
        console.log("yourself")
      } else if (response.status === httpStatus.CONFLICT) {
        setError(true);
        if (res.status == "pending") {
          setResult(res.outgoing ? "You already sent a friend request to this user." : "This user has already sent you a friend request.");
        } else if (res.status == "accepted") {
          setResult("You are already friends with this user.");
        } else if (res.status == "blocked") {
          setResult(res.outgoing ? "You have blocked this user." : "This user has blocked you.");
        } else {
          setResult("An unknown error occurred. Please try again later.");
        }
      } else if (response.ok) {
        setResult("successfully sent friend request");
        handleAddingReq({ id: res.id, username: res.username }, true);
      } else {
        setError(true);
        setResult("An unknown error occurred.");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-1 mt-2 self-center">
        <div className="h-12 w-100 focus-within:ring-2 focus-within:ring-highlight-high bg-overlay rounded-lg">
          <form className="flex flex-row flex-1 p-1 h-full w-full" onSubmit={handleSubmit}>
            <input name="username" className="rounded-lg h-full flex-3/4 focus:outline-none" placeholder="username"></input>
            <button className="flex-1/4 h-full text-sm rounded-lg bg-highlight-low text-text hover:bg-highlight-high transition-colors">
              Send
            </button>
          </form>
        </div>

        {result && (
          <div className={`${error ? `text-love` : `text-text`} text-xs mt-1`}>
            {loading ? "Loading..." : result}
          </div>
        )}
      </div>
    </>
  )
}
