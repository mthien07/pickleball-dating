import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Building, Users, GraduationCap } from "lucide-react";

interface SignUpScreenProps {
  onBack: () => void;
  onSignUp: () => void;
}

type UserRole = "owner" | "player" | "coach" | null;

export function SignUpScreen({ onBack, onSignUp }: SignUpScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl">Đăng ký</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-6">
          {/* Email/Phone */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Email hoặc Số điện thoại
            </label>
            <input
              type="text"
              placeholder=""
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-red-500 transition-colors text-white placeholder:text-gray-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=""
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-red-500 transition-colors text-white pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder=""
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-red-500 transition-colors text-white pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Role selection */}
          <div>
            <label className="text-sm text-gray-400 mb-3 block">Bạn là:</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("owner")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  selectedRole === "owner"
                    ? "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <Building className="w-8 h-8" />
                <span className="text-xs">Chủ sân</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("player")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  selectedRole === "player"
                    ? "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <Users className="w-8 h-8" />
                <span className="text-xs">Người chơi</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("coach")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  selectedRole === "coach"
                    ? "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <GraduationCap className="w-8 h-8" />
                <span className="text-xs">HLV</span>
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-red-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-400 flex-1">
              Tôi đồng ý với{" "}
              <span className="text-red-500">Điều khoản sử dụng</span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!agreed || !selectedRole}
            className="w-full h-14 bg-white/5 text-gray-400 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            ĐĂNG KÝ
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-400">
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={onBack}
              className="text-red-500 hover:text-red-400"
            >
              Đăng nhập
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
