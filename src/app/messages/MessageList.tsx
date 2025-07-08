import { MessageData } from "@/types/User";
import { useEffect, useState } from "react";

interface MessageListProps {
  messages: MessageData[];
}

interface TimeDiff {
  minutes: number;
  hours: number;
  days: number;
}

export default function MessageList({ messages }: MessageListProps) {
  const [renderKey, setRenderKey] = useState(0);
  let lastTime: Date | null = null;
  let lastSenderName: string | null = null;

  // force rerender to update the message time stamp every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRenderKey(prev => prev + 1);
    }, 5 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const getTimeDifference = (from: Date, to: Date): TimeDiff => {
    const diffMs = to.getTime() - from.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return { minutes, hours, days }
  };

  const formatMessageTime = (timestamp: Date): string => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const timeDiff = getTimeDifference(timestamp, now)

    if (timeDiff.minutes <= 70) {
      if (timeDiff.minutes < 1) return 'just now';
      if (timeDiff.minutes < 60) return `${timeDiff.minutes}m ago`;
      return 'an hr ago'
    }

    // Check if it's today
    if (isToday(messageDate)) {
      return messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }); // "2:43 PM"
    }

    // Check if it's yesterday
    if (isYesterday(messageDate)) {
      return "Yesterday " + messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }); // "Yesterday 2:43 PM"
    }

    // Check if it's this year
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString([], {
        month: 'short',
        day: 'numeric'
      }) + " " + messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }); // "Jul 4 2:43 PM"
    }

    // Different year
    return messageDate.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }); // "Jul 4, 2024"
  };

  // Helper functions
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isYesterday = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
  };

  return (
    <div className="w-full">
      {messages.map((msg) => {
        const diffMinutes = lastTime ? getTimeDifference(lastTime, msg.timestamp).minutes : null;

        if (!lastTime || (!lastSenderName || lastSenderName !== msg.senderName) || (diffMinutes && diffMinutes > 5)) {
          // take time difference from the last header
          lastSenderName = msg.senderName;
          lastTime = msg.timestamp;

          return (
            <div
              className="flex mt-4 flex-row space-x-3 hover:bg-highlight-low max-w-full min-w-0"
              key={msg.id}>
              <div className="ml-2 w-9 h-9 self-start bg-overlay rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-text font-medium">{msg.senderName[0]}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row space-x-3">
                  <h4 className="font-semibold text-text">{msg.senderName}</h4>
                  <span className="text-muted text-sm self-center">{formatMessageTime(msg.timestamp)}</span>
                </div>
                <span className="text-text break-all flex-1 min-w-0 max-w-full">
                  {msg.content}
                </span>
              </div>
            </div>
          )
        } else {
          return (
            <div
              className="flex flex-row space-x-3 hover:bg-highlight-low group max-w-full min-w-0"
              key={msg.id}>
              <span className="opacity-0 w-9 text-muted text-sm ml-2 group-hover:opacity-100 flex-shrink-0">{msg.timestamp.getHours()}:{msg.timestamp.getMinutes()}</span>
              <span className="text-text break-all min-w-0 max-w-full">
                {msg.content}
              </span>
            </div>
          )
        }
      })}
    </div>
  );
}
