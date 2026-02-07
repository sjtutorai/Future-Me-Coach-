
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-10 space-y-16 bg-[#0F1115]">
      <div className="text-center space-y-4 fade-up">
        <h1 className="font-serif text-5xl tracking-tight text-[#E6E6E6]">Future Me</h1>
        <p className="text-[#9AA0AA] font-light tracking-[0.3em] uppercase text-[10px]">A Coach Across Time</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-[#1A1D23] border border-[#2A2F38] rounded-2xl p-4 text-sm focus:outline-none focus:border-[#4FD1C5] transition-colors text-[#E6E6E6]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#1A1D23] border border-[#2A2F38] rounded-2xl p-4 text-sm focus:outline-none focus:border-[#4FD1C5] transition-colors text-[#E6E6E6]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-[#4FD1C5] text-[#0F1115] font-semibold py-4 pill-button hover:bg-[#3dbbb0] transition-colors text-xs uppercase tracking-widest"
        >
          Begin Journey
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2A2F38]"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#0F1115] px-4 text-[#9AA0AA]">or</span></div>
        </div>

        <button
          type="button"
          onClick={() => onLogin('google-user@gmail.com')}
          className="w-full border border-[#2A2F38] text-[#9AA0AA] font-medium py-4 pill-button hover:bg-[#1A1D23] transition-colors text-[10px] uppercase tracking-widest"
        >
          Google
        </button>
      </form>
      
      <p className="text-center text-[#9AA0AA]/30 text-[10px] font-light tracking-widest uppercase fade-up" style={{ animationDelay: '0.4s' }}>
        Serious. Discipline. Consistency.
      </p>
    </div>
  );
};

export default Auth;
