import { ProfileData } from "./ChatData";

export default function ChatRoom() {
  return (
    <div className="flex h-screen bg-base">
      {/* Left Panel */}
      <div className="w-80 bg-surface border-r border-highlight-high flex flex-col">
        {/* Profile Section */}
        <div className="p-6 border-b border-highlight-high">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-overlay rounded-full flex items-center justify-center">
              <span className="text-text font-medium">J</span>
            </div>
            <ProfileData />
          </div>
        </div>

        {/* Channels/Rooms */}
        <div className="flex-1 overflow-y-auto p-4">
          <h4 className="text-xs font-semibold text-subtle uppercase tracking-wider mb-3">
            Channels
          </h4>
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
            {/*
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            */}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-base overflow-y-auto p-6 space-y-4">
        </div>

        {/* Input Area */}
        <div className="bg-surface text-text border-t border-highlight-high p-4">
        </div>
      </div>
    </div>
  );
};
