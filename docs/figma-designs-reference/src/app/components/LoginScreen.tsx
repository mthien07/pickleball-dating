import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

interface LoginScreenProps {
  onBack: () => void;
  onLogin: () => void;
  onSignUp: () => void;
}

export function LoginScreen({ onBack, onLogin, onSignUp }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
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
          <h1 className="text-xl">Đăng nhập</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 px-6 py-12 flex flex-col">
          <div className="space-y-6 flex-1">
            {/* Email/Phone */}
            <div>
              <label className="text-sm text-red-500 mb-2 block">
                Email hoặc Số điện thoại
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com hoặc 0912345678"
                className="w-full px-4 py-3 bg-transparent border-2 border-red-500/50 rounded-lg outline-none focus:border-red-500 transition-colors text-white placeholder:text-gray-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Forgot password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-red-500 hover:text-red-400"
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>

          {/* Submit button */}
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full h-14 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            >
              ĐĂNG NHẬP
            </button>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-400">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={onSignUp}
                className="text-red-500 hover:text-red-400"
              >
                Đăng ký
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
