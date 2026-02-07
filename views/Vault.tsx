
import React from 'react';
import { Memory } from '../types';
import { Icons } from '../constants';

interface VaultProps {
  memories: Memory[];
  onBack: () => void;
}

const Vault: React.FC<VaultProps> = ({ memories, onBack }) => {
  return (
    <div className="flex-1 flex flex-col bg-[#0F1115] animate-in slide-in-from-right duration-500">
      <div className="p-8 flex items-center justify-between border-b border-[#2A2F38]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#9AA0AA] hover:text-[#4FD1C5] transition-colors p-2 -ml-2">
            <Icons.ArrowLeft />
          </button>
          <h2 className="font-serif text-2xl text-[#E6E6E6]">Memory Vault</h2>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-[#9AA0AA]/40 font-bold">
          {memories.length} Records
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
        {memories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-20">
            <div className="p-10 bg-[#1A1D23] rounded-full">
              <Icons.Lock />
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold">The vault is silent.</p>
          </div>
        ) : (
          memories.map((m, idx) => (
            <div key={m.id} className="space-y-4 fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase tracking-[0.3em] font-bold px-2 py-1 rounded-md ${m.triggerType === 'Reverse Regret' ? 'bg-[#F6C177]/10 text-[#F6C177]' : 'bg-[#4FD1C5]/10 text-[#4FD1C5]'}`}>
                  {m.triggerType}
                </span>
                <span className="text-[10px] text-[#9AA0AA]/30 font-light tracking-widest">
                  {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="bg-[#1A1D23] p-8 rounded-3xl border border-[#2A2F38]/50">
                <p className="text-[#E6E6E6] font-serif italic text-xl leading-relaxed">
                  "{m.text}"
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-10 bg-[#0F1115]">
        <p className="text-[10px] text-[#9AA0AA]/20 text-center uppercase tracking-[0.5em] font-light">
          Your future is built on these words.
        </p>
      </div>
    </div>
  );
};

export default Vault;
