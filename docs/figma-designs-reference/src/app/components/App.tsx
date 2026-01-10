import { useState } from 'react';
import { Heart, MessageCircle, User, Users, MapPin } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { SwipeCard } from './components/SwipeCard';
import { ProfileModal } from './components/ProfileModal';
import { MatchModal } from './components/MatchModal';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { FindOpponentView } from './components/FindOpponentView';
import { CourtFinderView } from './components/CourtFinderView';

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

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: 'Irene Fox',
    age: 27,
    distance: 3,
    bio: "Hi there! 👋 I'm 25, into coffee ☕, travel ✈️, and late-night talks ✨. Always open to new people and good vibes 🌊.",
    images: [
      'https://images.unsplash.com/photo-1685703206731-0bcd26546754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhc2hpb25hYmxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3NDM3NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1648065460033-5c59f2ef1d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGVsZWdhbnQlMjBzdHlsZXxlbnwxfHx8fDE3Njc0Mzc1MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    interests: ['Travel', 'Coffee', 'Digital Art', 'Beach Time'],
    matchPercentage: 86,
  },
  {
    id: 2,
    name: 'Lay M',
    age: 25,
    distance: 5,
    bio: "Software engineer by day, amateur chef by night. Let's cook something amazing together! 👨‍🍳",
    images: [
      'https://images.unsplash.com/flagged/photo-1594170954639-ff95b015b546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBzdHlsaXNoJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3NDM3NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1642886512785-b5fee9faad7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzY3MzU2MTYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    interests: ['Food', 'Books', 'Coffee', 'Travel'],
    matchPercentage: 92,
  },
  {
    id: 3,
    name: 'Emily',
    age: 26,
    distance: 2,
    bio: "Artist and yoga instructor. Life's too short not to laugh every day 😊🎨",
    images: [
      'https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzY3Mzc5NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1525713542480-f82dc1e28a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGhhcHB5JTIwYmVhY2h8ZW58MXx8fHwxNzY3NDM3MTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    interests: ['Digital Art', 'Beach Time', 'Books', 'Travel'],
    matchPercentage: 78,
  },
  {
    id: 4,
    name: 'David',
    age: 30,
    distance: 7,
    bio: 'Adventure seeker and photography enthusiast. Always ready for the next big trip! 📸🏔️',
    images: [
      'https://images.unsplash.com/photo-1609228579945-4067c8186939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMGNvbmZpZGVudHxlbnwxfHx8fDE3Njc0MDczMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1636287868360-4070b2d75ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjB0cmF2ZWwlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY3NDM3MTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    interests: ['Travel', 'Street Food', 'Coffee', 'Digital Art'],
    matchPercentage: 84,
  },
];

type AppScreen = 'splash' | 'signup' | 'login' | 'onboarding' | 'main';
type MainView = 'dating' | 'opponents' | 'courts' | 'messages' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [currentView, setCurrentView] = useState<MainView>('dating');
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);

  const currentProfile = profiles[currentIndex];

  // Splash screen
  if (currentScreen === 'splash') {
    return (
      <SplashScreen
        onSignUp={() => setCurrentScreen('signup')}
        onLogin={() => setCurrentScreen('login')}
      />
    );
  }

  // Sign up screen
  if (currentScreen === 'signup') {
    return (
      <SignUpScreen
        onBack={() => setCurrentScreen('splash')}
        onSignUp={() => setCurrentScreen('onboarding')}
      />
    );
  }

  // Login screen
  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onBack={() => setCurrentScreen('splash')}
        onLogin={() => setCurrentScreen('main')}
        onSignUp={() => setCurrentScreen('signup')}
      />
    );
  }

  // Onboarding screen
  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onGetStarted={() => setCurrentScreen('main')} />;
  }

  // Main app handlers
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Simulate match (50% chance)
      if (Math.random() > 0.5) {
        setMatchedProfile(currentProfile);
        setShowMatchModal(true);
      }
    }

    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset to beginning (in real app, would load more profiles)
      setCurrentIndex(0);
    }
  };

  const handleSendMessage = () => {
    setShowMatchModal(false);
    setCurrentView('messages');
  };

  const handleLikeFromModal = () => {
    setShowProfileModal(false);
    setShowMatchModal(true);
    setMatchedProfile(currentProfile);
  };

  // Find opponents view
  if (currentView === 'opponents') {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <FindOpponentView onBack={() => setCurrentView('dating')} />
      </div>
    );
  }

  // Courts view
  if (currentView === 'courts') {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <CourtFinderView onBack={() => setCurrentView('dating')} />
      </div>
    );
  }

  // Messages view
  if (currentView === 'messages') {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <MessagesView onBack={() => setCurrentView('dating')} />
      </div>
    );
  }

  // Profile view
  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <ProfileView onBack={() => setCurrentView('dating')} />
      </div>
    );
  }

  // Main dating view
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-xl text-white leading-none">PickleBall</h1>
              <span className="text-sm bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Dating
              </span>
            </div>
          </div>
        </header>

        {/* Swipe area */}
        <div className="flex-1 relative px-4 pb-24">
          {currentProfile && (
            <SwipeCard
              key={currentProfile.id}
              profile={currentProfile}
              onSwipe={handleSwipe}
              onShowProfile={() => setShowProfileModal(true)}
            />
          )}
        </div>

        {/* Bottom navigation */}
        <nav className="bg-[#2a2a2a] border-t border-white/10 p-4">
          <div className="flex justify-around">
            <button
              onClick={() => setCurrentView('dating')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                currentView === 'dating'
                  ? 'text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Heart
                className={`w-6 h-6 ${currentView === 'dating' ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span className="text-xs">Hẹn hò</span>
            </button>
            <button
              onClick={() => setCurrentView('opponents')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                currentView === 'opponents'
                  ? 'text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Users className={`w-6 h-6 ${currentView === 'opponents' ? 'text-red-500' : ''}`} />
              <span className="text-xs">Đối thủ</span>
            </button>
            <button
              onClick={() => setCurrentView('courts')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                currentView === 'courts'
                  ? 'text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <MapPin className={`w-6 h-6 ${currentView === 'courts' ? 'text-red-500' : ''}`} />
              <span className="text-xs">Sân</span>
            </button>
            <button
              onClick={() => setCurrentView('messages')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                currentView === 'messages'
                  ? 'text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <MessageCircle
                className={`w-6 h-6 ${currentView === 'messages' ? 'text-red-500' : ''}`}
              />
              <span className="text-xs">Tin nhắn</span>
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                currentView === 'profile'
                  ? 'text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <User className={`w-6 h-6 ${currentView === 'profile' ? 'text-red-500' : ''}`} />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Modals */}
      {showProfileModal && currentProfile && (
        <ProfileModal
          profile={currentProfile}
          onClose={() => setShowProfileModal(false)}
          onLike={handleLikeFromModal}
        />
      )}

      {showMatchModal && matchedProfile && (
        <MatchModal
          name={matchedProfile.name}
          image={matchedProfile.images[0]}
          onClose={() => setShowMatchModal(false)}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}
