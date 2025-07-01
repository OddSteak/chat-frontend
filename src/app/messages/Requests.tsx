'use client'

import React from "react";
import { Friend, RequestData } from "@/types/User";
import { apiClient } from "@/lib/api";

const RESPOND_URL = '/api/friends/respond-req';
const BLOCK_URL = '/api/friends/block-user';

interface RequestsProps {
  reqs: RequestData[];
  outgoing: boolean;
  handleAddingReqs: (newReq: RequestData, outgoing: boolean) => void;
  handleRemovingReqs: (removeReq: RequestData, outgoing: boolean) => void;
  handleAddingFriend: (newFriend: Friend) => void;
  handleRemovingFriend: (newFriend: Friend) => void;
}

enum RequestResponse {
  ACCEPT = 'accept',
  REJECT = 'reject',
  BLOCK = 'block',
  DELETE = 'delete'
}

export default function Requests({ reqs, outgoing, handleAddingReqs, handleRemovingReqs, handleAddingFriend, handleRemovingFriend }: RequestsProps) {
  const blockUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const id = parseInt(event.currentTarget.id);
    const req = reqs.find(req => req.id === id);
    const username = req?.username;

    const response = await apiClient.post(`${BLOCK_URL}?username=${username}`, {})

    if (response.ok) {
      if (req)
        handleAddingReqs(req, outgoing)
      console.log(`User with username: ${username} has been blocked.`);
    } else {
      console.log(`Failed to block user with username: ${username}.`);
    }
  }

  const replyReq = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const id = parseInt(event.currentTarget.id);
    const req = reqs.find(req => req.id === id);
    const response: RequestResponse = event.currentTarget.name as RequestResponse;

    const reqData = { reqId: id, accept: false };
    let serverResponse: Response | null = null;

    switch (response) {
      case RequestResponse.ACCEPT:
        reqData.accept = true;
        serverResponse = await apiClient.post(RESPOND_URL, reqData);
        const res = await serverResponse.json();

        // fetch the friend data if the request was accepted
        if (serverResponse.ok) {
          const fetchFriend = await apiClient.get(`/api/friends/get-friend-info?friendName=${res.username}`);
          const friendData: Friend = await fetchFriend.json();
          handleAddingFriend(friendData);
        }

        console.log(`Accepting request from user with ID: ${id}`);
        break;
      case RequestResponse.REJECT:
        serverResponse = await apiClient.post(RESPOND_URL, reqData);
        console.log(`Rejecting request from user with ID: ${id}`);
        break;
      case RequestResponse.DELETE:
        serverResponse = await apiClient.delete(RESPOND_URL + `?reqId=${id}`, {});
        console.log(`Deleting request with ID: ${id}`);
        break;
      default:
        console.error("Unknown request response action");
    }

    if (serverResponse && serverResponse.ok) {
      console.log("removing:", req);
      if (req)
        handleRemovingReqs(req, outgoing);
      console.log(`Request with ID: ${id} has been ${response}.`);
    } else {
      console.error(`Failed to ${response} request with ID: ${id}.`);
    }
  }

  return (
    <ol className="p-2 flex flex-col space-y-1">
      {reqs.map((req: RequestData) => (
        <li key={req.id} className="flex flex-row items-center space-x-2">
          <div className="w-10 h-10 bg-overlay rounded-full flex items-center justify-center">
            <span className="text-text font-medium">{req.username[0]}</span>
          </div>
          <span className="text-text">{req.username}</span>
          {outgoing ? (
            <button name={RequestResponse.DELETE} id={req.id.toString()} onClick={replyReq} className="ml-auto bg-love text-text hover:bg-red-600 transition-colors rounded-lg px-2 py-1">
              ✗
            </button>
          ) : (
            <>
              <button name={RequestResponse.BLOCK} id={req.id.toString()} onClick={blockUser} className="ml-auto bg-overlay text-text hover:bg-highlight-low transition-colors rounded-lg px-2 py-1">
                🛇
              </button>
              <button name={RequestResponse.REJECT} id={req.id.toString()} onClick={replyReq} className="ml-2 bg-love text-text hover:bg-red-600 transition-colors rounded-lg px-2 py-1">
                ✗
              </button>
              <button name={RequestResponse.ACCEPT} id={req.id.toString()} onClick={replyReq} className="ml-2 bg-highlight-low text-text hover:bg-highlight-high transition-colors rounded-lg px-2 py-1">
                ✓
              </button>
            </>
          )}
        </li>
      ))}
    </ol>
  )
}

