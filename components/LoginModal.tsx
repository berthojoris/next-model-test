import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const LoginModal: React.FC = () => {
  const { login } = useAppContext();
  const [email, setEmail] = useState('berthojoris@gmail.com');
  const [password, setPassword] = useState('mavendra');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'berthojoris@gmail.com' && password === 'mavendra') {
      setError('');
      login();
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-md">
      {/* Container with a vibrant gradient border to match dashboard colors */}
      <div className="w-full max-w-md m-4 p-[2px] rounded-2xl bg-gradient-to-br from-purple-600 via-cyan-500 to-green-400 animate-fade-in shadow-2xl animated-glow-border">
        <div className="bg-gray-900/90 rounded-[14px] p-8 backdrop-blur-xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">SurveySync Pro</h1>
              <p className="text-gray-400 mt-2">Please sign in to continue</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="berthojoris@gmail.com"
                  className="mt-1 block w-full rounded-md bg-white/5 border-white/20 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 py-2 px-3 text-gray-200 leading-tight"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="mavendra"
                  className="mt-1 block w-full rounded-md bg-white/5 border-white/20 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 py-2 px-3 text-gray-200 leading-tight"
                  required
                />
              </div>
              {error && <p className="text-red-400 text-xs italic mb-4 text-center">{error}</p>}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="w-full btn-gradient font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                >
                  Sign In
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;