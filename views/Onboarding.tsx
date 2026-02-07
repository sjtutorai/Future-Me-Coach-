
import React, { useState } from 'react';
import { UserProfile, Timeline, Personality } from '../types';
import { Icons } from '../constants';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [timeline, setTimeline] = useState<Timeline>('5 years');
  const [career, setCareer] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [personality, setPersonality] = useState<Personality>('Calm');
  const [isLocking, setIsLocking] = useState(false);

  const timelines: Timeline[] = ['3 years', '5 years', '10 years'];
  const personalities: Personality[] = ['Strict', 'Calm', 'Friendly'];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleFinalize = () => {
    const lockDate = new Date();
    lockDate.setDate(lockDate.getDate() + 30);
    
    const profile: UserProfile = {
      name: 'User',
      email: '',
      futureYears: timeline,
      personality,
      careerGoals: career,
      lifestyleGoals: lifestyle,
      createdAt: new Date().toISOString(),
      lockedUntil: lockDate.toISOString(),
    };
    onComplete(profile);
  };

  return (
    <div className="flex-1 flex flex-col p-10 bg-[#0F1115] overflow-y-auto no-scrollbar">
      <div className="mb-16">
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-[#4FD1C5]' : 'bg-[#2A2F38]'}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-12 fade-up">
          <div className="space-y-4">
            <h2 className="font-serif text-4xl text-[#E6E6E6]">Perspective.</h2>
            <p className="text-[#9AA0AA] text-sm leading-relaxed font-light">Choose how far back your future self is reaching from. This defines the weight of your choices.</p>
          </div>
          <div className="space-y-3">
            {timelines.map(t => (
              <button
                key={t}
                onClick={() => setTimeline(t)}
                className={`w-full p-6 text-left rounded-2xl border transition-all duration-300 ${timeline === t ? 'border-[#4FD1C5] bg-[#1A1D23] text-[#E6E6E6]' : 'border-transparent bg-[#1A1D23]/40 text-[#9AA0AA]'}`}
              >
                <div className="text-lg font-medium">{t}</div>
                <div className="text-[10px] uppercase tracking-widest mt-1 opacity-50 font-light">Projection Span</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-10 fade-up">
          <div className="space-y-4">
            <h2 className="font-serif text-4xl text-[#E6E6E6]">The Outcome.</h2>
            <p className="text-[#9AA0AA] text-sm leading-relaxed font-light">What has the future version of you actually achieved? Be precise.</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#9AA0AA] font-semibold">Career Legacy</label>
              <textarea
                placeholder="Where do you stand professionally?"
                className="w-full bg-[#1A1D23] border border-transparent rounded-2xl p-5 text-sm focus:outline-none focus:border-[#2A2F38] min-h-[120px] transition-colors text-[#E6E6E6]"
                value={career}
                onChange={e => setCareer(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#9AA0AA] font-semibold">Lifestyle Integrity</label>
              <textarea
                placeholder="How does your body and mind feel?"
                className="w-full bg-[#1A1D23] border border-transparent rounded-2xl p-5 text-sm focus:outline-none focus:border-[#2A2F38] min-h-[120px] transition-colors text-[#E6E6E6]"
                value={lifestyle}
                onChange={e => setLifestyle(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-[#9AA0AA] font-semibold">Coach Disposition</label>
              <div className="grid grid-cols-3 gap-2">
                {personalities.map(p => (
                  <button
                    key={p}
                    onClick={() => setPersonality(p)}
                    className={`py-3 px-1 rounded-xl text-[10px] uppercase tracking-widest border transition-all ${personality === p ? 'border-[#4FD1C5] bg-[#1A1D23] text-[#4FD1C5]' : 'border-transparent bg-[#1A1D23] text-[#9AA0AA]'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && ( step === 3 && (
        <div className="space-y-12 fade-up">
          <div className="space-y-4">
            <h2 className="font-serif text-4xl text-[#E6E6E6]">Lock-in.</h2>
            <p className="text-[#9AA0AA] text-sm leading-relaxed font-light">This contract is binding. Once set, you cannot alter these parameters for <span className="text-[#F6C177] font-semibold">30 days</span>.</p>
          </div>
          <div className="bg-[#1A1D23] p-8 rounded-2xl border border-[#2A2F38] space-y-4">
            <div className="flex items-center gap-3 text-[#F6C177]">
              <Icons.Lock />
              <span className="text-[10px] uppercase tracking-widest font-bold">Unbreakable Bond</span>
            </div>
            <p className="text-sm text-[#9AA0AA] font-light italic leading-relaxed">
              "You are asking a wiser version of yourself to hold you accountable. If you change your mind, you are only hiding from your own potential."
            </p>
          </div>
          <button 
            onClick={() => setIsLocking(!isLocking)}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isLocking ? 'bg-[#4FD1C5] border-[#4FD1C5]' : 'border-[#2A2F38]'}`}>
              {isLocking && <div className="w-2 h-2 bg-[#0F1115] rounded-sm" />}
            </div>
            <span className="text-[10px] text-[#9AA0AA] uppercase tracking-widest group-hover:text-[#E6E6E6]">I accept the terms of my future.</span>
          </button>
        </div>
      ))}

      <div className="mt-auto pt-12">
        <button
          onClick={step === 3 ? handleFinalize : handleNext}
          disabled={step === 2 && (!career || !lifestyle) || (step === 3 && !isLocking)}
          className={`w-full py-5 pill-button text-xs uppercase tracking-widest transition-all font-bold ${((step === 2 && (!career || !lifestyle)) || (step === 3 && !isLocking)) ? 'bg-[#1A1D23] text-[#2A2F38]' : 'bg-[#4FD1C5] text-[#0F1115] shadow-lg shadow-[#4FD1C5]/10'}`}
        >
          {step === 3 ? 'Finalize Commitment' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
