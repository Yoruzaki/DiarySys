import React, { useState } from 'react';

const Login = ({ onLogin, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side: Welcome Section with Gradient Background */}
        <div className="hidden md:flex w-1/2 relative">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
            {/* Abstract Shapes */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-300 bg-opacity-20 rounded-full blur-lg"></div>
          </div>
          
          {/* Content: Only the logo, centered and bigger */}
          <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-12 text-white w-full">
            <img 
              src="..\images\massinissa-logo.png" 
              alt="Massinissa Logo" 
              className="h-64 w-auto drop-shadow-2xl transition-transform duration-300 hover:scale-105" 
            />
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {/* Mobile Logo - Only logo, bigger */}
          <div className="md:hidden flex flex-col items-center justify-center mb-8">
            <img 
              src="..\images\massinissa-logo.png" 
              alt="Massinissa Logo" 
              className="h-36 w-auto mb-3 drop-shadow-lg" 
            />
          </div>

          {/* Greeting */}
          <div className="mb-8">
            <p className="text-gray-600 text-lg">Hello!</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Good Morning</h2>
          </div>

          {/* Login Form Title */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800">
              Login <span className="text-purple-600">Your Account</span>
            </h3>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-0 py-3 text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-0 transition-colors duration-200"
                placeholder="Enter your username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-0 py-3 text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-0 transition-colors duration-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                  Remember
                </label>
              </div>
              <button
                type="button"
                aria-label="Forgot Password"
                className="text-sm text-purple-600 hover:text-purple-500 font-medium transition-colors duration-200 underline underline-offset-2"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-3 px-6 text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.03] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
