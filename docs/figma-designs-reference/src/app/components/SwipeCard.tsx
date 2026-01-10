import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Heart, X, Gift, MapPin, Info } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  age: number;
  distance: number;
  bio: string;
  images: string[];
  interests: string[];
  matchPercentage?: number;
}

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
  onShowProfile: () => void;
}

export function SwipeCard({ profile, onSwipe, onShowProfile }: SwipeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    }
  };

  const handleAction = (action: 'left' | 'right' | 'super') => {
    if (action === 'left') {
      onSwipe('left');
    } else if (action === 'right') {
      onSwipe('right');
    } else {
      onSwipe('right');
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <div className="relative w-full h-full bg-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl">
        {/* Image */}
        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-transparent to-orange-500/30 z-10" />
          <img
            src={profile.images[currentImageIndex]}
            alt={profile.name}
            className="w-full h-full object-cover"
          />

          {/* Match percentage badge */}
          {profile.matchPercentage && (
            <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full z-20 backdrop-blur-sm border border-white/20">
              <span>Match {profile.matchPercentage}%</span>
            </div>
          )}

          {/* Online status */}
          <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full z-20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white text-sm">Online</span>
          </div>

          {/* Image indicators */}
          <div className="absolute top-24 left-0 right-0 flex gap-2 px-6 z-20">
            {profile.images.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all ${
                    index === currentImageIndex ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />

          {/* Profile info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl">{profile.name}</h2>
                  <span className="text-3xl">{profile.age}</span>
                </div>
                <div className="flex items-center gap-1 mt-2 opacity-90">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.distance} km away</span>
                </div>
                <p className="mt-3 opacity-90 line-clamp-2">{profile.bio}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.interests.slice(0, 3).map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={onShowProfile}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
              >
                <Info className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons overlay */}
        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-4 px-6 z-30">
          <button
            onClick={() => handleAction('left')}
            className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border border-white/20"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          <button
            onClick={() => handleAction('super')}
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border border-white/20"
          >
            <Gift className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={() => handleAction('right')}
            className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border border-white/20"
          >
            <Heart className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
