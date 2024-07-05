'use client'
import Typewriter from 'typewriter-effect';

const TypewriterSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="animate-spin-slow rounded-full h-16 w-16 border-t-4 border-purple-700 border-solid"></div>
      <div className="mt-4 text-center">
        <p className="text-lg font-semibold text-gray-700">
          Loading site...
        </p>
        <h1 className="text-transparent text-3xl bg-clip-text bg-purple-700">
          <Typewriter
            options={{
              strings: [
                "Please wait...",
                "We are fetching your balance and transactions...",
                "Just a moment...",
                "Just a minute before a secure transaction..."
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </h1>
      </div>
    </div>
  );
};

export default TypewriterSpinner;