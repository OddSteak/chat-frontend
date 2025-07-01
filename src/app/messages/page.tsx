'use client'

import { useEffect, useState } from "react";
import { ProfileData } from "./ChatData";
import { useRetryConnection } from "@/hooks/useRetryConnection";
import { apiClient } from "@/lib/api";
import FriendList from "./FriendList";
import ProfileModal from "./ProfileModal";
import { useAuth } from "@/contexts/AuthContext";
import { Friend, MessageData, RequestData } from "@/types/User";
import RoomList from "./RoomList";
import FriendChat from "./FriendChat";
import FriendChatComponent from "./FriendChatComponent";

type MessageMap = Record<string, MessageData[]>;

export default function ChatRoom() {
  const { startRetryLoop } = useRetryConnection();
  const { user, loading: loadingUser, error: errorUser } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // modes
  const [isFriendsMode, setIsFriendsMode] = useState(true);

  // selected chat
  const [selectedFriend, setSelectedFriend] = useState('');

  // api requests
  const [messages, setMessages] = useState<MessageMap | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<RequestData[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<RequestData[]>([]);

  useEffect(() => {
    startRetryLoop(
      async () => {
        const data = await apiClient.get("/api/get-pms");
        return await data.json();
      },
      (data: Record<string, MessageMap>) => {
        console.log("successfully fetched messages!")
        setLoading(false);
        setMessages(data.messages);
        setError(false);
      },
      () => {
        console.log("failed to fetch messages");
        setLoading(false);
        setError(true);
      }
    );
  }, [])

  useEffect(() => {
    startRetryLoop(
      async () => {
        const data = await apiClient.get("/api/friends/get-friends");
        return await data.json();
      },
      (data: any) => {
        console.log("successfully fetched messages!")
        setLoading(false);
        setFriends(data.friends);
        setError(false);
      },
      () => {
        console.log("failed to fetch messages");
        setLoading(false);
        setError(true);
      }
    );
  }, [])

  useEffect(() => {
    startRetryLoop(
      async () => {
        const data = await apiClient.get("/api/friends/get-requests");
        const dat = await data.json();
        console.log(dat);
        return dat;
      },
      (data: any) => {
        console.log("successfully fetched messages!")
        setLoading(false);
        setIncomingRequests(data.pendingRequests.filter((req: any) => !req.outgoing));
        setOutgoingRequests(data.pendingRequests.filter((req: any) => req.outgoing));
        setError(false);
      },
      () => {
        console.log("failed to fetch messages");
        setLoading(false);
        setError(true);
      }
    );
  }, [])

  const handleAddingReqs = (newReq: RequestData, outgoing: boolean) => {
    outgoing ?
      setOutgoingRequests(prevState => [...prevState, newReq]) :
      setIncomingRequests(prevState => [...prevState, newReq]);
  }

  const handleRemovingReqs = (removeReq: RequestData, outgoing: boolean) => {
    outgoing ?
      setOutgoingRequests(prevState => prevState.filter(req => req.id !== removeReq.id)) :
      setIncomingRequests(prevState => prevState.filter(req => req.id !== removeReq.id));
  }

  const handleAddingFriend = (newFriend: Friend) => {
    setFriends(prevState => [...prevState, newFriend]);
  }

  const handleRemovingFriend = (removeFriend: string) => {
    setFriends(prevState => prevState.filter(friend => friend.username !== removeFriend));
  }

  return (
    <div className="flex h-screen bg-base">
      {isModalOpen && <ProfileModal
        setModalOpen={setModalOpen}
        incomingReqs={incomingRequests}
        outgoingReqs={outgoingRequests}
        friends={friends}
        handleAddingReqs={handleAddingReqs}
        handleRemovingReqs={handleRemovingReqs}
        handleAddingFriend={handleAddingFriend}
        handleRemovingFriend={handleRemovingFriend} />}

      {/* Left Panel */}
      <div className="w-60 bg-surface border-r border-highlight-high flex flex-col">
        {/* Profile Section */}
        <div className="p-6 border-b border-highlight-high">
          <div className="flex items-center space-x-3">
            <button onClick={() => setModalOpen(true)} className="w-10 h-10 bg-overlay rounded-full flex items-center justify-center">
              <span className="text-text font-medium">J</span>
            </button>
            <ProfileData user={user} loading={loadingUser} error={errorUser} />
          </div>
        </div>

        {/* switch friends/room mode */}
        <div className="p-2 h-14 mt-2 w-full self-center">
          <div className="h-full rounded-lg border-highlight-low shadow-sm text-text bg-overlay">
            <div className="p-1 h-full flex flex-row justify-center justify-items-center">
              <button className={`flex-1 ${!isFriendsMode ? `bg-highlight-med` : ``} rounded-sm text-center justify-items-center`}>
                <span className="h-full text-center" onClick={() => setIsFriendsMode(false)}>
                  rooms
                </span>
              </button>
              <button className={`flex-1 ${isFriendsMode ? `bg-highlight-med` : ``} rounded-sm text-center justify-items-center`}>
                <span className="h-full text-center" onClick={() => setIsFriendsMode(true)}>
                  friends
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Channels/Rooms */}
        <div className="flex-1 overflow-y-auto p-2">
          {isFriendsMode ? (
            <FriendChat friends={friends} setSelectedFriend={setSelectedFriend} />
          ) : (
            <RoomList />
          )}
        </div>

        {/* User Status */}
        {/*
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">3 members online</span>
            <div className="flex space-x-1">
              <div className="w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
              <div className="w-6 h-6 bg-blue-400 rounded-full border-2 border-white -ml-2"></div>
              <div className="w-6 h-6 bg-purple-400 rounded-full border-2 border-white -ml-2"></div>
            </div>
          </div>
        </div>
        */}
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-surface border-b border-highlight-high px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text"># general</h2>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        {isFriendsMode ?
          <FriendChatComponent recipientUsername={selectedFriend} messages={messages?.selectedFriend} setMessages={setMessages} /> :
          (
            <div className="flex-1 bg-base overflow-y-auto p-6 space-y-4">
            </div>
          )
        }

        {/* Input Area */}
        <div className="bg-surface text-text border-t border-highlight-high p-4">
        </div>
      </div>
    </div>
  );
};
