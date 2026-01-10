import {
  X,
  MapPin,
  Heart,
  Star,
  UtensilsCrossed,
  Book,
  Plane,
  Palette,
  Coffee,
  Waves,
} from 'lucide-react';
import { motion } from 'motion/react';

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

interface ProfileModalProps {
  profile: Profile;
  onClose: () => void;
  onLike: () => void;
}

const interestIcons: { [key: string]: any } = {
  Travel: Plane,
  Food: UtensilsCrossed,
  Photography: Palette,
  Books: Book,
  Coffee: Coffee,
  'Beach Time': Waves,
  'Digital Art': Palette,
  'Street Food': UtensilsCrossed,
};

export function ProfileModal({ profile, onClose, onLike }: ProfileModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-[#1a1a1a] w-full md:w-[600px] md:max-h-[90vh] rounded-t-3xl md:rounded-3xl overflow-hidden border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-white/10 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl text-white">
              {profile.name}, {profile.age}
            </h2>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-140px)] md:max-h-[calc(90vh-140px)]">
          {/* Images */}
          <div className="grid grid-cols-2 gap-1">
            {profile.images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={image}
                  alt={`${profile.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-orange-500/20" />
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="p-6">
            {/* Match badge */}
            {profile.matchPercentage && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full mb-4">
                <Star className="w-4 h-4 fill-white" />
                <span>Match {profile.matchPercentage}%</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-400 mb-6">
              <MapPin className="w-4 h-4" />
              <span>{profile.distance} km away</span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg text-white mb-2">ABOUT</h3>
              <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
            </div>

            <div>
              <h3 className="text-lg text-white mb-3">INTERESTS</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => {
                  const Icon = interestIcons[interest] || UtensilsCrossed;
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-gray-300 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {interest}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="sticky bottom-0 bg-[#1a1a1a]/95 backdrop-blur-sm border-t border-white/10 p-4 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 h-14 bg-white/5 rounded-full flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-white/10"
          >
            <X className="w-6 h-6 text-red-500" />
            <span className="text-white">Pass</span>
          </button>
          <button
            onClick={onLike}
            className="flex-1 h-14 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-colors shadow-lg"
          >
            <Heart className="w-6 h-6" />
            <span>Like</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
