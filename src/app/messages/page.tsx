'use client'

import { useEffect, useState } from "react";
import { ProfileData } from "./ProfileData";
import { useRetryConnection } from "@/hooks/useRetryConnection";
import { apiClient } from "@/lib/api";
import ProfileModal from "./ProfileModal";
import { useAuth } from "@/contexts/AuthContext";
import { Friend, MessageData, MessageMap, RecievedMessageData, RecievedMessageDataMap, RequestData, Room } from "@/types/User";
import FriendChat from "./FriendChatList";
import ChatComponent from "./ChatComponent";
import RoomChatList from "./RoomChatList";
import CreateRoomModal from "./RoomCreationModal";
import ChatHeader from "./ChatHeader";
import { useWebSocket } from "@/contexts/WebSocketContext";

export default function ChatRoom() {
  const { startRetryLoop } = useRetryConnection();

  // user profile data
  const { user, loading: loadingUser, error: errorUser } = useAuth();

  // websocket
  const stompClient = useWebSocket();

  // modes - friend and room
  const [isFriendsMode, setIsFriendsMode] = useState(true);

  // selected chat
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // friends
  const [friends, setFriends] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<MessageMap | null>(null);

  // friend requests
  const [incomingRequests, setIncomingRequests] = useState<RequestData[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<RequestData[]>([]);

  // rooms
  const [roomMessages, setRoomMessages] = useState<MessageMap | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  // modals
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  // fetch private messages
  useEffect(() => {
    startRetryLoop(
      async () => {
        const data = await apiClient.get("/api/get-pms");
        return await data.json();
      },
      (data: Record<string, RecievedMessageDataMap>) => {
        const convertedMessages: MessageMap = {}

        for (const [userId, messages] of Object.entries(data.messages)) {
          convertedMessages[parseInt(userId)] = messages.map((msg: RecievedMessageData) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }

        setMessages(convertedMessages);
      },
      () => {
        console.error("failed to fetch messages");
      }
    );
  }, [])

  // fetch room messages
  useEffect(() => {
    startRetryLoop(
      async () => {
        const data = await apiClient.get("/get-room-msg");
        return await data.json();
      },
      (data: { messages: Record<string, RecievedMessageData[]> }) => {
        const convertedMessages: MessageMap = {}

        Object.entries(data.messages).forEach(([roomId, messages]) => {
          convertedMessages[parseInt(roomId)] = messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })

        setRoomMessages(convertedMessages);
      },
      () => {
        console.log("failed to fetch messages");
      }
    );
  }, [])

  // fetch rooms
  useEffect(() => {
    startRetryLoop(
      async () => {
        const data = await apiClient.get("/api/rooms/get-rooms");
        return await data.json();
      },
      (data: Record<string, Room[]>) => {
        setRooms(data.rooms);
      },
      () => {
        console.log("failed to fetch rooms");
      }
    );
  }, [])

  // fetch friends
  useEffect(() => {
    startRetryLoop(
      async () => {
        const data = await apiClient.get("/api/friends/get-friends");
        return await data.json();
      },
      (data: any) => {
        setFriends(data.friends);
      },
      () => {
        console.log("failed to fetch messages");
      }
    );
  }, [])

  // fetch friend requests
  useEffect(() => {
    startRetryLoop(
      async () => {
        const data = await apiClient.get("/api/friends/get-requests");
        const dat = await data.json();
        return dat;
      },
      (data: any) => {
        setIncomingRequests(data.pendingRequests.filter((req: any) => !req.outgoing));
        setOutgoingRequests(data.pendingRequests.filter((req: any) => req.outgoing));
      },
      () => {
        console.log("failed to fetch messages");
      }
    );
  }, [])

  // subscribe to messages
  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const roomMessageUrl = '/user/queue/room-messages' ;
      const roomSub = stompClient.subscribe(roomMessageUrl, (message) => {
        const receivedMessage = JSON.parse(message.body);
        addMessage(receivedMessage, true);
      });

      const privateMessageUrl = '/user/queue/private-messages';
      const privateSub = stompClient.subscribe(privateMessageUrl, (message) => {
        const receivedMessage = JSON.parse(message.body);
        addMessage(receivedMessage, false);
      });

      // Subscribe to errors
      const errorSub = stompClient.subscribe('/user/queue/errors', (error) => {
        console.error('Received an error from the server:', error.body);
      });

      // Cleanup function
      return () => {
        roomSub.unsubscribe();
        privateSub.unsubscribe();
        errorSub.unsubscribe();
      };
    }
  }, [stompClient]);

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
    setFriends(prevState => prevState.filter(friend => friend.name !== removeFriend));
  }

  const addMessage = (message: RecievedMessageData, isRoom: boolean) => {
    const currentUser = user;
    const id = isRoom ? message.recipientId : (message.senderId === currentUser?.id ? message.recipientId : message.senderId);

    const converted: MessageData = {
      ...message,
      timestamp: new Date(message.timestamp)
    }

    const setFunction = isRoom ? setRoomMessages : setMessages;
    setFunction(prevMessages => {
      prevMessages = prevMessages || {};
      const userMessages = prevMessages[id] || [];
      return {
        ...prevMessages,
        [id]: [...userMessages, converted]
      };
    });
  }

  return (
    <div className="flex h-screen bg-base max-w-full">
      {isProfileOpen && <ProfileModal
        setModalOpen={setProfileOpen}
        incomingReqs={incomingRequests}
        outgoingReqs={outgoingRequests}
        friends={friends}
        handleAddingReqs={handleAddingReqs}
        handleRemovingReqs={handleRemovingReqs}
        handleAddingFriend={handleAddingFriend}
        handleRemovingFriend={handleRemovingFriend} />}

      {isCreatingRoom && <CreateRoomModal setIsCreatingRoomAction={setIsCreatingRoom} />}

      {/* Left Panel */}
      <div className="w-60 bg-surface border-r border-highlight-med flex flex-col min-w-0">
        {/* Profile Section */}
        <div className="p-6 border-b border-highlight-med">
          <div className="flex items-center space-x-3">
            <button onClick={() => setProfileOpen(true)} className="w-10 h-10 bg-overlay rounded-full flex items-center justify-center">
              <span className="text-text font-medium">{user?.username[0] || "L"}</span>
            </button>
            <ProfileData user={user} loading={loadingUser} error={errorUser} />
          </div>
        </div>

        {/* switch friends/room mode */}
        <div className="p-2 h-14 mt-2 w-full self-center">
          <div className="h-full rounded-lg border-highlight-low shadow-sm text-text bg-overlay">
            <div className="p-1 h-full flex flex-row justify-center justify-items-center">
              <button className={`flex-1 ${!isFriendsMode ? `bg-highlight-med` : ``} rounded-sm text-center justify-items-center`}
                onClick={() => setIsFriendsMode(false)}>
                rooms
              </button>
              <button className={`flex-1 ${isFriendsMode ? `bg-highlight-med` : ``} rounded-sm text-center justify-items-center`}
                onClick={() => setIsFriendsMode(true)}>
                friends
              </button>
            </div>
          </div>
        </div>

        {/* Channels/Rooms */}
        <div className="flex-1 overflow-y-auto p-2">
          {isFriendsMode ? (
            <FriendChat
              friends={friends}
              selectedFriend={selectedFriend}
              setSelectedFriend={setSelectedFriend} />
          ) : (
            <RoomChatList
              rooms={rooms}
              selectedRoom={selectedRoom}
              setSelectedRoomAction={setSelectedRoom}
              setIsCreatingRoomAction={setIsCreatingRoom} />
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
      <div className="flex-1 flex flex-col max-w-full min-w-0">
        {/* Chat Header */}
        <ChatHeader
          recipient={isFriendsMode ? selectedFriend : selectedRoom}
          isFriend={isFriendsMode}
          friends={friends} />

        {/* Messages Area */}
        <div className="flex-1 bg-base overflow-hidden space-y-4">
          {isFriendsMode ? (
            selectedFriend && <ChatComponent
              recipient={selectedFriend}
              messages={messages} />
          ) :
            (
              selectedRoom && <ChatComponent
                recipient={selectedRoom}
                messages={roomMessages} />
            )
          }
        </div>
      </div>
    </div>
  );
};
