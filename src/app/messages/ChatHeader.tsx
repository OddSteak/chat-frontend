'use client'

import { apiClient } from "@/lib/api";
import { Friend, Room } from "@/types/User";
import { Dispatch, SetStateAction, useState } from "react";

interface ChatHeaderProps {
  recipient: Room | Friend | null;
  isFriend: boolean;
  friends: Friend[];
}

// recipient name as title and a three dot menu to open the about modal,
export default function ChatHeader({ recipient, isFriend, friends }: ChatHeaderProps) {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  return (
    <>
      {aboutModalOpen && recipient && <AboutModal recipient={recipient} setModalOpen={setAboutModalOpen} friends={friends} />}
      <div className="flex items-center h-16 justify-between p-4 bg-overlay rounded-t-lg shadow-lg">
        <h1 className="text-text font-semibold text-lg">{recipient && (isFriend ? "" : "# ") + recipient.name}</h1>
        {recipient && <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          onClick={() => setAboutModalOpen(true)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>}
      </div>
    </>
  );
}

// This modal will show details about the room/friend and allow actions like adding
// friends to the room or generating invite codes
function AboutModal({ recipient, setModalOpen, friends }: { setModalOpen: Dispatch<SetStateAction<boolean>>, recipient: Room | Friend, friends: Friend[] }) {
  const [inviteCode, setInviteCode] = useState<string>("");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Friend search and invite state
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [invitingFriends, setInvitingFriends] = useState<Set<number>>(new Set());
  const [invitedFriends, setInvitedFriends] = useState<Set<number>>(new Set());


  const isRoom = (recipient: Room | Friend): recipient is Room => {
    return 'role' in recipient;
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(friendSearchQuery.toLowerCase())
  );

  const generateInviteCode = async () => {
    if (!isRoom(recipient)) return;

    setIsGeneratingCode(true);
    try {
      const response = await apiClient.get(`/api/rooms/get-invite-code?roomId=${recipient.id}`);
      if (response.ok) {
        const data = await response.json();
        setInviteCode(data.inviteCode);
      } else {
        console.error('Failed to generate invite code');
      }
    } catch (error) {
      console.error('Error generating invite code:', error);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const inviteFriend = async (friendId: number) => {
    if (!isRoom(recipient)) return;

    setInvitingFriends(prev => new Set(prev).add(friendId));

    try {
      const response = await apiClient.post(`/api/rooms/add-friend-to-room?roomId=${recipient.id}&friendId=${friendId}`, { });

      if (response.ok) {
        setInvitedFriends(prev => new Set(prev).add(friendId));
      } else {
        console.error('Failed to invite friend');
      }
    } catch (error) {
      console.error('Error inviting friend:', error);
    } finally {
      setInvitingFriends(prev => {
        const newSet = new Set(prev);
        newSet.delete(friendId);
        return newSet;
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-surface rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text">
            {isRoom(recipient) ? 'Room Details' : 'Friend Details'}
          </h2>
          <button
            onClick={() => setModalOpen?.(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-overlay transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Room/Friend Info */}
        <div className="space-y-4 mb-6">
          {/* Name */}
          <div className="bg-overlay rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-highlight-med rounded-full flex items-center justify-center">
                {isRoom(recipient) ? (
                  <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-text font-medium">{recipient.name}</p>
              </div>
            </div>

          </div>

          {/* Description (for rooms) */}
          {isRoom(recipient) && recipient.description && (
            <div className="bg-overlay rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-highlight-med rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-text">{recipient.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Status (for rooms) */}
          {isRoom(recipient) && (
            <div className="bg-overlay rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${recipient.type === "PRIVATE" ? 'bg-red-500' : 'bg-green-500'
                  }`}>
                  {recipient.type === "PRIVATE" ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Privacy</p>
                  <p className={`font-medium ${recipient.type === "PRIVATE" ? 'text-red-400' : 'text-green-400'}`}>
                    {recipient.type === "PRIVATE" ? 'Private Room' : 'Public Room'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Invite Code Section (only for rooms) */}
        {isRoom(recipient) && (
          <div className="space-y-1">
            <div>
              <h3 className="text-md font-medium text-muted mb-3 mt-2">Invite Others</h3>
              {!inviteCode ? (
                <button
                  onClick={generateInviteCode}
                  disabled={isGeneratingCode}
                  className="w-full py-3 px-4 bg-highlight-med hover:bg-highlight-high text-text font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGeneratingCode ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Generate Invite Code</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Share this code with friends:</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inviteCode}
                      readOnly
                      className="flex-1 p-3 bg-overlay text-text rounded-lg border border-highlight-low focus:outline-none focus:ring-2 focus:ring-highlight-high"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="p-3 bg-highlight-med hover:bg-highlight-high text-text rounded-lg transition-colors flex items-center justify-center"
                      title="Copy to clipboard"
                    >
                      {copySuccess ? (
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {copySuccess && (
                    <p className="text-sm text-green-400">Copied to clipboard!</p>
                  )}
                </div>
              )}
            </div>

            {/* Friend Search and Invite Section */}
            <div className="relative">
              <div className="border-t border-highlight-low pt-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-md font-medium text-muted mb-3">
                      Invite Friends
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search friends..."
                        value={friendSearchQuery}
                        onChange={(e) => setFriendSearchQuery(e.target.value)}
                        className="w-full p-3 pl-10 bg-overlay text-text rounded-lg border border-highlight-low focus:outline-none focus:ring-2 focus:ring-highlight-high"
                      />
                      <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Dropdown - Friends List */}
                  {friendSearchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-highlight-low rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                      {filteredFriends.length > 0 ? (
                        <div className="py-2">
                          {filteredFriends.map((friend) => (
                            <div key={friend.id} className="flex items-center justify-between px-4 py-3 hover:bg-overlay transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-highlight-med rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-text">
                                    {friend.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-text font-medium">{friend.name}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  inviteFriend(friend.id);
                                  setFriendSearchQuery(''); // Clear search after inviting
                                }}
                                disabled={invitingFriends.has(friend.id) || invitedFriends.has(friend.id)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${invitedFriends.has(friend.id)
                                  ? 'bg-green-500 text-white cursor-not-allowed'
                                  : invitingFriends.has(friend.id)
                                    ? 'bg-gray-500 text-white cursor-not-allowed'
                                    : 'bg-highlight-med hover:bg-highlight-high text-text'
                                  }`}
                              >
                                {invitedFriends.has(friend.id) ? (
                                  <>
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Invited
                                  </>
                                ) : invitingFriends.has(friend.id) ? (
                                  <>
                                    <svg className="animate-spin w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Inviting
                                  </>
                                ) : (
                                  'Invite'
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-400">
                          No friends found matching "{friendSearchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
