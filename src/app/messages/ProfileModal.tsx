import UserDetails from "@/app/profile/UserDetails";

import { useState } from "react";
import { Friend, RequestData } from "@/types/User";
import Requests from "./Requests";
import AddFriend from "./AddFriend";
import FriendList from "./FriendList";

enum ModalTabs {
  PROFILE = 'Profile',
  REQUESTS = 'Friend Requests',
  OUTGOING_REQUESTS = 'Add Friend',
  FRIENDS = 'Friends'
}

interface ProfileModalProps {
  setModalOpen: (open: boolean) => void;
  incomingReqs: RequestData[];
  outgoingReqs: RequestData[];
  handleAddingReqs: (newReq: RequestData, outgoing: boolean) => void;
  handleRemovingReqs: (removeReq: RequestData, outgoing: boolean) => void;
  handleAddingFriend: (newFriend: Friend) => void;
  handleRemovingFriend: (removeFriend: string) => void;
  friends: Friend[];
}

export default function ProfileModal({ setModalOpen, incomingReqs, outgoingReqs, friends, handleAddingReqs, handleRemovingReqs, handleAddingFriend, handleRemovingFriend }: ProfileModalProps) {
  const [tab, setTab] = useState < ModalTabs > (ModalTabs.PROFILE);
  const tabList = Object.values(ModalTabs);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-overlay z-50">
      <div className="relative flex flex-row w-180 h-140 shadow-2xl rounded-lg p-4">
        {/* sidebar */}
        <div id="sidebar" className="flex flex-col items-center justify-center bg-surface rounded-lg p-4 w-44 h-full">
          <div className="flex w-full flex-col items-center space-y-4">
            {tabList.map((tabName) => (
              <button
                key={tabName}
                className={`w-full border-highlight-high text-center p-2 hover:bg-highlight-med rounded-lg ${tab === tabName as ModalTabs ? 'bg-highlight-med' : 'bg-overlay'}`}
                onClick={() => setTab(tabName as ModalTabs)}
              >
                {tabName}
              </button>
            ))}
          </div>
        </div>

        {/* main content */}
        <div className="bg-overlay flex-1 rounded-lg p-8 mt-8">
          {{
            [ModalTabs.PROFILE]: <ProfileTabContent />,
            [ModalTabs.REQUESTS]: <IncomingRequestsTabContent incomingReqs={incomingReqs} handleAddingReqs={handleAddingReqs} handleRemovingReqs={handleRemovingReqs} handleAddingFriend={handleAddingFriend} handleRemovingFriend={handleRemovingFriend} />,
            [ModalTabs.OUTGOING_REQUESTS]: <OutgoingRequestsTabContent outgoingReqs={outgoingReqs} handleAddingReqs={handleAddingReqs} handleRemovingReqs={handleRemovingReqs} handleAddingFriend={handleAddingFriend} handleRemovingFriend={handleRemovingFriend} />,
            [ModalTabs.FRIENDS]: <FriendsTabContent friends={friends} handleRemovingFriend={handleRemovingFriend} />
          }[tab]}
        </div>

        {/* close button */}
        <button
          className="absolute top-2 right-2 w-8 h-8 hover:bg-love text-muted hover:text-text rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg group"
          onClick={() => setModalOpen(false)}
        >
          <svg
            className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ProfileTabContent() {
  return (
    <UserDetails />
  );
}

function IncomingRequestsTabContent({ incomingReqs, handleAddingReqs, handleRemovingReqs, handleAddingFriend, handleRemovingFriend }: any){
  return (
    <Requests
      reqs={incomingReqs}
      outgoing={false}
      handleAddingReqs={handleAddingReqs}
      handleRemovingReqs={handleRemovingReqs}
      handleAddingFriend={handleAddingFriend}
      handleRemovingFriend={handleRemovingFriend}  />
  )
}

function OutgoingRequestsTabContent({ outgoingReqs, handleAddingReqs, handleRemovingReqs, handleAddingFriend, handleRemovingFriend }: any) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col bg-surface rounded-lg p-4 shadow-lg">
        <h2 className="text-lg text-muted">Add Friend</h2>
        <AddFriend handleAddingReq={handleAddingReqs} />
      </div>
      {outgoingReqs.length > 0 && <div className="flex flex-col bg-surface rounded-lg p-4 shadow-lg">
        <h2 className="text-lg text-muted">Sent Requests</h2>
        <Requests
          reqs={outgoingReqs}
          outgoing={true}
          handleAddingReqs={handleAddingReqs}
          handleRemovingReqs={handleRemovingReqs}
          handleAddingFriend={handleAddingFriend}
          handleRemovingFriend={handleRemovingFriend}  />
      </div>}
    </div>
  )
}

function FriendsTabContent({ friends, handleRemovingFriend }: any) {
  return (
    <FriendList friends={friends} handleRemovingFriend={handleRemovingFriend} />
  );
}

