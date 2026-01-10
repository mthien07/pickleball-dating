import { Settings, MapPin, Heart } from 'lucide-react';

interface ProfileViewProps {
  onBack: () => void;
}

export function ProfileView({ onBack }: ProfileViewProps) {
  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-white/10 p-4 flex justify-between items-center z-10">
        <button onClick={onBack} className="text-red-500">
          Done
        </button>
        <h1 className="text-xl text-white">Edit Profile</h1>
        <Settings className="w-6 h-6 text-gray-400" />
      </div>

      {/* Profile image */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzY3Mzc5NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Profile"
          className="w-full aspect-square object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-transparent to-orange-500/30" />
        <button className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-2 border-white">
          <span className="text-2xl text-white">+</span>
        </button>
      </div>

      {/* Profile info */}
      <div className="p-6 space-y-6">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Name</label>
          <input
            type="text"
            defaultValue="Sarah"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Age</label>
          <input
            type="number"
            defaultValue="28"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">About</label>
          <textarea
            defaultValue="Love traveling and trying new restaurants. Looking for someone to share adventures with! 🌎✨"
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-red-500 resize-none text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-2 block">Interests</label>
          <div className="flex flex-wrap gap-2">
            {['Travel', 'Food', 'Photography', 'Hiking', 'Music', 'Art'].map((interest) => (
              <button
                key={interest}
                className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30 rounded-full hover:from-red-500/30 hover:to-orange-500/30 transition-colors"
              >
                {interest}
              </button>
            ))}
            <button className="px-4 py-2 bg-white/5 text-gray-400 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
              + Add
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <MapPin className="w-5 h-5" />
          <span>Ho Chi Minh City, Vietnam</span>
        </div>
      </div>
    </div>
  );
}
