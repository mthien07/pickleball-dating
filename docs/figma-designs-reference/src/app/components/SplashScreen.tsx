import { motion } from "motion/react";

import { Users, MapPin, Heart } from "lucide-react";

interface SplashScreenProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export function SplashScreen({ onSignUp, onLogin }: SplashScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex flex-col items-center justify-between p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
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
          ease: "linear",
        }}
        className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl"
      />

      {/* Top section */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm pt-12">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl relative">
            {/* Pickleball icon - simplified */}
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-orange-500 rounded-full grid grid-cols-3 grid-rows-3 gap-0.5 p-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-orange-500 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* App name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-3"
        >
          <h1 className="text-5xl text-white mb-2">PickleBall</h1>
          <h2 className="text-4xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Dating
          </h2>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 text-center mb-3"
        >
          Kết nối cộng đồng
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent text-xl"
        >
          Pickleball
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-8 mt-12"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-gray-400">Tìm đối thủ</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-gray-400">Sân gần bạn</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-gray-400">Hẹn hò</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="w-full max-w-sm space-y-3 pb-8"
      >
        <button
          onClick={onSignUp}
          className="w-full h-14 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full hover:shadow-2xl transition-all"
        >
          ĐĂNG KÝ
        </button>
        <button
          onClick={onLogin}
          className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:shadow-2xl transition-all"
        >
          ĐĂNG NHẬP
        </button>
      </motion.div>
    </div>
  );
}
