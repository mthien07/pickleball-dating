import { motion } from "motion/react";
import { Heart, MessageCircle } from "lucide-react";

interface MatchModalProps {
  name: string;
  image: string;
  onClose: () => void;
  onSendMessage: () => void;
}

export function MatchModal({ name, image, onClose, onSendMessage }: MatchModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-red-600 via-orange-600 to-red-600 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", damping: 15 }}
        className="text-center max-w-md w-full"
      >
        {/* Hearts animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <Heart className="w-20 h-20 text-white fill-white drop-shadow-2xl" />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0"
            >
              <Heart className="w-20 h-20 text-white fill-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-6xl text-white mb-8 drop-shadow-lg"
        >
          It's a Match!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-white/90 mb-12"
        >
          You and {name} have liked each other
        </motion.p>

        {/* Profile image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white shadow-2xl relative"
        >
          <img src={image} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-transparent to-orange-500/30" />
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={onSendMessage}
            className="w-full h-14 bg-white text-red-600 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-2xl"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Send Message</span>
          </button>
          <button
            onClick={onClose}
            className="w-full h-14 bg-transparent text-white border-2 border-white rounded-full hover:bg-white/10 transition-colors"
          >
            Keep Swiping
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}