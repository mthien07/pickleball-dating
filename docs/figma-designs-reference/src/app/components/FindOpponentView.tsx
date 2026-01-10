import { useState } from 'react';
import { ArrowLeft, MapPin, Star, Users, Target } from 'lucide-react';

interface Opponent {
  id: number;
  name: string;
  age: number;
  level: string;
  distance: number;
  image: string;
  rating: number;
  matchesPlayed: number;
}

interface FindOpponentViewProps {
  onBack: () => void;
}

const mockOpponents: Opponent[] = [
  {
    id: 1,
    name: 'Minh Tuấn',
    age: 28,
    level: 'Intermediate',
    distance: 2,
    image:
      'https://images.unsplash.com/photo-1609228579945-4067c8186939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMGNvbmZpZGVudHxlbnwxfHx8fDE3Njc0MDczMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.5,
    matchesPlayed: 124,
  },
  {
    id: 2,
    name: 'Phương Anh',
    age: 25,
    level: 'Advanced',
    distance: 3,
    image:
      'https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzY3Mzc5NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    matchesPlayed: 89,
  },
  {
    id: 3,
    name: 'Hoàng Nam',
    age: 32,
    level: 'Intermediate',
    distance: 5,
    image:
      'https://images.unsplash.com/flagged/photo-1594170954639-ff95b015b546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBzdHlsaXNoJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3NDM3NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.3,
    matchesPlayed: 67,
  },
];

export function FindOpponentView({ onBack }: FindOpponentViewProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Header */}
      <div className="sticky top-0 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-white/10 p-4 flex items-center gap-4 z-10">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl text-white">Tìm đối thủ</h1>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-white/10">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedLevel === 'all'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setSelectedLevel('beginner')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedLevel === 'beginner'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setSelectedLevel('intermediate')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedLevel === 'intermediate'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setSelectedLevel('advanced')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedLevel === 'advanced'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Opponents list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mockOpponents.map((opponent) => (
          <div
            key={opponent.id}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors"
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={opponent.image}
                  alt={opponent.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#1a1a1a]" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white">
                      {opponent.name}, {opponent.age}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-400">{opponent.distance} km away</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-400 text-xs rounded-full">
                    {opponent.level}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-300">{opponent.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">{opponent.matchesPlayed} matches</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 h-10 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors text-sm">
                Xem profile
              </button>
              <button className="flex-1 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white hover:from-green-600 hover:to-emerald-600 transition-colors text-sm">
                Thách đấu
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
