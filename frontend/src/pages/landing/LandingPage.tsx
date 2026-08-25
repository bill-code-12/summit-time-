import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import Button from '../../components/Button';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-neutral-900">Summit Time</span>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
              <Button
                onClick={() => navigate('/register')}
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
              Connect Anywhere,<br />
              <span className="text-primary-500">Anytime</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Summit Time is a secure, user-friendly video conferencing platform designed for seamless remote communication. Whether it's team meetings, client calls, or group discussions, we make connecting simple and reliable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 4v12m6-6H6" />
                </svg>
                Start a Meeting
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto"
              >
                Join a Meeting
              </Button>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-md">
              {/* Animated video grid background */}
              <div className="absolute inset-0 grid grid-cols-2 gap-4">
                <div className="bg-primary-200 rounded-lg animate-pulse"></div>
                <div className="bg-primary-100 rounded-lg animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="bg-primary-100 rounded-lg animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="bg-primary-200 rounded-lg animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary-500 rounded-full p-8 text-white shadow-lg">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-neutral-900 mb-12">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎥',
                title: 'Crystal Clear Video',
                description: 'High-quality video streaming with automatic quality adjustment based on your connection.'
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                description: 'End-to-end encrypted meetings. Your conversations are always private and protected.'
              },
              {
                icon: '💬',
                title: 'Real-time Chat',
                description: 'Send messages, share links, and collaborate during meetings with our integrated chat.'
              },
              {
                icon: '📺',
                title: 'Screen Sharing',
                description: 'Share your screen for presentations, demos, and collaborative work.'
              },
              {
                icon: '👥',
                title: 'Waiting Room',
                description: 'Control who joins your meeting with our host-approval waiting room feature.'
              },
              {
                icon: '📱',
                title: 'Works Everywhere',
                description: 'Desktop, tablet, or mobile. Summit Time works seamlessly on all your devices.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Create your account and start hosting meetings in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/register')}
              className="border-white text-white hover:bg-primary-600"
            >
              Create Account
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/login')}
              className="text-white hover:bg-primary-600"
            >
              Already have an account?
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Summit Time</p>
              <p className="text-sm">© 2024 Made by Pincode. All rights reserved.</p>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
