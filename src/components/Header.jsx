import React, { useState, useEffect } from 'react'
import { Flame, Trophy, Sparkles, Clock, RefreshCw } from 'lucide-react'
import { getDaysRemainingInYear, calculateXPAndLevel } from '../utils/storage'
import { MOTIVATIONAL_QUOTES } from '../data/defaultState'
import { triggerConfetti } from '../utils/confetti'

export default function Header({ state, onAddXP, onOpenDataModal }) {
  const [countdown, setCountdown] = useState(getDaysRemainingInYear())
  const [quoteIndex, setQuoteIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getDaysRemainingInYear())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)
  }

  const { level, xpInCurrentLevel } = calculateXPAndLevel(state.profile.xp)

  return (
    <header className="w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        {/* Top bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-pink-500 flex items-center justify-center shadow-md shadow-rose-400/20 text-white font-black text-lg">
              84
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 m-0">
                  Sprint 84 <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">· 27 Yaş Qələbəsi</span>
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                  2026 Final
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Sağlamlıq · Artlab Şamları · 1000 Stok · Borc İxtisarı · Alman dili & Kitab
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/80 rounded-2xl px-4 py-2 shadow-xs">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <div className="flex items-baseline gap-1.5 text-xs text-slate-600">
              <span className="text-base sm:text-lg font-black text-amber-600 font-mono">{countdown.days}</span> gün
              <span className="text-base sm:text-lg font-black text-slate-800 font-mono">{String(countdown.hours).padStart(2, '0')}</span> saat
              <span className="text-base sm:text-lg font-black text-slate-800 font-mono">{String(countdown.minutes).padStart(2, '0')}</span> dəq
              <span className="text-base sm:text-lg font-black text-rose-600 font-mono">{String(countdown.seconds).padStart(2, '0')}</span> san
            </div>
          </div>

          {/* Gamification Level & Streak */}
          <div className="flex items-center gap-3">
            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl shadow-xs">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-bounce" />
              <div className="text-left">
                <div className="text-[10px] text-orange-600 uppercase tracking-wider font-bold">Streak</div>
                <div className="text-sm font-black text-slate-900">{state.profile.streak} Gün</div>
              </div>
            </div>

            {/* Level & XP */}
            <div className="flex items-center gap-2.5 bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-xl shadow-xs">
              <Trophy className="w-5 h-5 text-purple-600" />
              <div>
                <div className="flex items-center justify-between text-xs gap-3">
                  <span className="font-bold text-purple-900">Səviyyə {level}</span>
                  <span className="text-[10px] text-purple-700 font-mono font-bold">{xpInCurrentLevel}/100 XP</span>
                </div>
                <div className="w-24 bg-purple-200/80 h-1.5 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${xpInCurrentLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Confetti Trigger */}
            <button
              onClick={() => {
                triggerConfetti()
                onAddXP(10, 'Uğur təbriki!')
              }}
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition shadow-xs cursor-pointer"
              title="Motivasiya Atəşfəşanlığı (+10 XP)"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="mt-3 flex items-center justify-between bg-gradient-to-r from-rose-50 via-amber-50 to-purple-50 border border-rose-100 rounded-xl px-4 py-2 text-xs text-slate-700">
          <div className="flex items-center gap-2 truncate">
            <span className="text-rose-600 font-bold flex-shrink-0">⚡ Günün Şüarı:</span>
            <span className="italic text-slate-700 truncate font-medium">"{MOTIVATIONAL_QUOTES[quoteIndex]}"</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={nextQuote}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-white transition cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Dəyiş
            </button>
            <button 
              onClick={onOpenDataModal}
              className="text-[11px] text-rose-600 hover:text-rose-800 underline font-bold ml-2 cursor-pointer"
            >
              ⚙️ Hədəfləri Tənzimlə
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
