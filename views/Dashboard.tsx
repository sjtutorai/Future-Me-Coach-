
import React, { useState, useEffect, useRef } from 'react';
import { AppState, Memory } from '../types';
import { Icons } from '../constants';
import { generateDailyMessage, generateSilentJudge, generateReverseRegret, generateSpeech } from '../geminiService';

interface DashboardProps {
  state: AppState;
  onCheckIn: () => void;
  onOpenVault: () => void;
  addMemory: (text: string, type: Memory['triggerType']) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onCheckIn, onOpenVault, addMemory }) => {
  const [dailyMsg, setDailyMsg] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'judge' | 'regret'>('none');
  const [overlayText, setOverlayText] = useState('');
  const [regretSpan, setRegretSpan] = useState('1 year');
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const hasCheckedInToday = state.stats.lastActive === new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchDaily = async () => {
      if (state.user) {
        setLoading(true);
        try {
          const msg = await generateDailyMessage(state.user, state.stats);
          setDailyMsg(msg || '');
        } catch (e) {
          setDailyMsg("I am waiting for you at the finish line. Don't stop now.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDaily();

    return () => {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
      }
    };
  }, [state.user, state.stats.streak]);

  const handlePlayVoice = async () => {
    if (!dailyMsg || isVoiceLoading || !state.user) return;

    setIsVoiceLoading(true);
    try {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
      }

      const result = await generateSpeech(dailyMsg, state.user.personality);
      if (result) {
        const { audioBuffer, audioContext } = result;
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => setIsVoiceLoading(false);
        source.start();
        audioSourceRef.current = source;
      } else {
        setIsVoiceLoading(false);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsVoiceLoading(false);
    }
  };

  const handleSilentJudge = async () => {
    if (!state.user) return;
    setLoading(true);
    setActiveOverlay('judge');
    try {
      const msg = await generateSilentJudge(state.user, state.stats);
      setOverlayText(msg || '');
    } catch (e) {
      setOverlayText("Your actions speak louder than my words.");
    } finally {
      setLoading(false);
    }
  };

  const handleReverseRegret = async (span: string) => {
    if (!state.user) return;
    setLoading(true);
    setRegretSpan(span);
    setActiveOverlay('regret');
    try {
      const msg = await generateReverseRegret(state.user, span);
      setOverlayText(msg || '');
    } catch (e) {
      setOverlayText("The regret is too heavy to speak of right now.");
    } finally {
      setLoading(false);
    }
  };

  const saveToVault = () => {
    if (overlayText) {
      addMemory(overlayText, activeOverlay === 'judge' ? 'Manual' : 'Reverse Regret');
      setActiveOverlay('none');
      setOverlayText('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0F1115] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-16 fade-up">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#9AA0AA] font-semibold">{dateString}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-serif text-[#E6E6E6]">{state.stats.streak}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#9AA0AA]/60 font-light">Day Streak</span>
          </div>
        </div>
        <button 
          onClick={onOpenVault}
          className="p-3 bg-[#1A1D23] border border-[#2A2F38] rounded-full hover:bg-[#2A2F38] transition-colors text-[#9AA0AA]"
        >
          <Icons.History />
        </button>
      </div>

      {/* Main Message Card */}
      <div className="flex-1 flex flex-col justify-center mb-16 fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-[#1A1D23] p-10 rounded-[32px] border border-[#2A2F38]/50 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Icons.Eye />
          </div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#9AA0AA] font-bold text-center">Future Reflection</p>
          
          <div className="min-h-[140px] flex items-center justify-center">
            {loading && !dailyMsg ? (
              <div className="space-y-4 w-full">
                <div className="h-2 bg-[#2A2F38] rounded-full w-full animate-pulse" />
                <div className="h-2 bg-[#2A2F38] rounded-full w-2/3 mx-auto animate-pulse" />
              </div>
            ) : (
              <p className="text-2xl font-serif leading-relaxed italic text-[#E6E6E6] text-center">
                "{dailyMsg}"
              </p>
            )}
          </div>
          
          <div className="flex justify-center pt-2">
            <button 
              onClick={handlePlayVoice}
              disabled={isVoiceLoading || !dailyMsg}
              className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold transition-all ${isVoiceLoading ? 'text-[#9AA0AA] animate-pulse' : 'text-[#4FD1C5] hover:opacity-70'}`}
            >
              {isVoiceLoading ? (
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-current animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1 h-3 bg-current animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-3 bg-current animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              ) : <Icons.Play />}
              <span>{isVoiceLoading ? 'Transmitting...' : 'Play Message'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10 fade-up" style={{ animationDelay: '0.3s' }}>
        <button 
          onClick={handleSilentJudge}
          className="p-6 bg-[#1A1D23]/50 border border-[#2A2F38] rounded-3xl text-center space-y-3 hover:bg-[#1A1D23] transition-all group"
        >
          <div className="mx-auto text-[#9AA0AA] group-hover:text-[#4FD1C5] transition-colors">
            <Icons.Eye />
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#9AA0AA]">Silent Judge</p>
        </button>
        <button 
          onClick={() => setActiveOverlay('regret')}
          className="p-6 bg-[#1A1D23]/50 border border-[#2A2F38] rounded-3xl text-center space-y-3 hover:bg-[#1A1D23] transition-all group"
        >
          <div className="mx-auto text-[#9AA0AA] group-hover:text-[#F6C177] transition-colors">
            <Icons.Lock />
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#9AA0AA]">Reverse Regret</p>
        </button>
      </div>

      {/* Check-in Button */}
      <button
        disabled={hasCheckedInToday}
        onClick={onCheckIn}
        className={`w-full py-6 pill-button flex items-center justify-center gap-4 transition-all font-bold tracking-[0.3em] text-[11px] uppercase ${hasCheckedInToday ? 'bg-[#1A1D23] border border-[#2A2F38] text-[#2A2F38]' : 'bg-[#4FD1C5] text-[#0F1115] shadow-xl shadow-[#4FD1C5]/10'}`}
      >
        <Icons.Edit />
        <span>{hasCheckedInToday ? 'Commitment Secured' : 'Secure the Day'}</span>
      </button>

      {/* Overlays */}
      {activeOverlay !== 'none' && (
        <div className={`fixed inset-0 z-50 flex flex-col p-10 backdrop-blur-xl animate-in fade-in duration-500 ${activeOverlay === 'judge' ? 'bg-black' : 'bg-[#0F1115]/95'}`}>
          <div className="flex justify-end">
            <button onClick={() => setActiveOverlay('none')} className="p-4 text-[#9AA0AA] hover:text-[#E6E6E6]">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            {activeOverlay === 'regret' && !overlayText && (
              <div className="space-y-12 text-center fade-up">
                <div className="space-y-4">
                  <h3 className="font-serif text-3xl text-[#E6E6E6]">Point of no return.</h3>
                  <p className="text-sm text-[#9AA0AA] font-light">How far do you want to peer into your failures?</p>
                </div>
                <div className="flex flex-col gap-4">
                  {['6 months', '1 year', '5 years'].map(span => (
                    <button 
                      key={span}
                      onClick={() => handleReverseRegret(span)}
                      className="py-5 pill-button border border-[#2A2F38] text-[10px] uppercase tracking-widest text-[#9AA0AA] hover:border-[#F6C177] hover:text-[#F6C177] transition-all"
                    >
                      {span} in the future
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(overlayText || (activeOverlay === 'judge' && loading)) && (
              <div className="space-y-16 text-center fade-up">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.6em] text-[#9AA0AA] font-bold">
                    {activeOverlay === 'judge' ? 'The Truth' : `Regret from ${regretSpan} later`}
                  </p>
                  <div className="h-px bg-[#2A2F38] w-8 mx-auto" />
                </div>
                
                <div className="min-h-[100px] flex items-center justify-center">
                  {loading ? (
                    <div className="space-y-3 w-full animate-pulse">
                      <div className="h-2 bg-[#1A1D23] rounded-full w-full" />
                      <div className="h-2 bg-[#1A1D23] rounded-full w-2/3 mx-auto" />
                    </div>
                  ) : (
                    <p className={`text-3xl font-serif italic leading-relaxed ${activeOverlay === 'regret' ? 'text-[#F6C177]' : 'text-[#E6E6E6]'}`}>
                      "{overlayText}"
                    </p>
                  )}
                </div>
                
                {!loading && (
                  <div className="pt-12">
                    <button 
                      onClick={saveToVault}
                      className="w-full py-5 pill-button bg-transparent border border-[#2A2F38] text-[#9AA0AA] text-[10px] uppercase tracking-[0.3em] font-bold hover:border-[#E6E6E6] hover:text-[#E6E6E6] transition-all"
                    >
                      Archive this warning
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
