import { motion } from 'motion/react';
import { Heart, ChevronRight } from 'lucide-react';

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a1a1a] to-[#1a1a1a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl"
      />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10 }}
        className="mb-12"
      >
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#1a1a1a]"
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white text-center mb-4"
      >
        <div className="text-5xl mb-2">Find Your</div>
        <div className="text-5xl">
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Perfect
          </span>{' '}
          Match
        </div>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 text-center max-w-sm mb-12 px-4"
      >
        Meet New People, Spark Real Connections,
        <br />
        And See Where It Goes.
      </motion.p>

      {/* Profile images preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative w-72 h-96 mb-12"
      >
        {/* Card 1 */}
        <motion.div
          animate={{
            rotate: -8,
            y: [0, -5, 0],
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute top-0 left-8 w-56 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
        >
          <img
            src="https://images.unsplash.com/flagged/photo-1594170954639-ff95b015b546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBzdHlsaXNoJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3NDM3NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-blue-500 rounded-full p-2">
            <Heart className="w-4 h-4 text-white" />
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          animate={{
            rotate: 8,
            y: [0, 5, 0],
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          }}
          className="absolute top-8 right-8 w-56 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
        >
          <img
            src="https://images.unsplash.com/photo-1685703206731-0bcd26546754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhc2hpb25hYmxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3NDM3NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-sm opacity-90">Julia Ledo, 25</p>
          </div>
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-2">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
        </motion.div>
      </motion.div>

      {/* Get Started button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={onGetStarted}
        className="group relative w-full max-w-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:shadow-2xl transition-all">
          <Heart className="w-5 h-5" />
          <span>Get Started</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </motion.button>

      {/* Terms */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-gray-500 text-xs text-center mt-8 max-w-xs"
      >
        By tapping Get Started, you agree to our Terms.
        <br />
        Learn how we process your data in our Privacy Policy.
      </motion.p>
    </div>
  );
}
