import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import DashboardView from './components/DashboardView'
import HealthView from './components/HealthView'
import ArtlabView from './components/ArtlabView'
import StockView from './components/StockView'
import FinanceView from './components/FinanceView'
import LearningView from './components/LearningView'
import JournalView from './components/JournalView'
import DataManageModal from './components/DataManageModal'
import { loadState, saveState } from './utils/storage'
import { INITIAL_STATE } from './data/defaultState'
import { 
  LayoutDashboard, 
  HeartPulse, 
  Flame, 
  Layers, 
  Wallet, 
  Languages, 
  PenTool
} from 'lucide-react'

export default function App() {
  const [state, setState] = useState(() => loadState())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isDataModalOpen, setIsDataModalOpen] = useState(false)
  const [notification, setNotification] = useState(null)

  // Auto-save to localStorage
  useEffect(() => {
    saveState(state)
  }, [state])

  const updateState = (partial) => {
    setState(prev => ({
      ...prev,
      ...partial
    }))
  }

  const handleAddXP = (amount, reason = '') => {
    const nextXP = state.profile.xp + amount
    updateState({
      profile: {
        ...state.profile,
        xp: nextXP
      }
    })

    if (reason) {
      setNotification(`+${amount} XP · ${reason}`)
      setTimeout(() => {
        setNotification(null)
      }, 3500)
    }
  }

  const handleResetAll = () => {
    setState(INITIAL_STATE)
    saveState(INITIAL_STATE)
  }

  const TABS = [
    { id: 'dashboard', label: 'İdarə Paneli', icon: LayoutDashboard },
    { id: 'health', label: 'Sağlamlıq & Enerji', icon: HeartPulse, badge: state.health.ferritin.current < 20 ? 'Ferritin: 10' : null },
    { id: 'artlab', label: 'Artlab Şamları', icon: Flame, badge: `${state.artlab.sales.length}/${state.artlab.salesGoal}` },
    { id: 'stock', label: 'Stok Portfeli', icon: Layers, badge: `${state.stock.shutterstock.current}` },
    { id: 'finance', label: 'Maliyyə & Borc', icon: Wallet },
    { id: 'learning', label: 'Alman Dili & Kitab', icon: Languages },
    { id: 'journal', label: 'Mənim Günlüyüm', icon: PenTool, badge: 'Gündəlik' }
  ]

  return (
    <div className="min-h-screen bg-[#faf7f2] text-slate-800 flex flex-col selection:bg-rose-200 selection:text-rose-900 pb-16">
      
      {/* Top Header & Countdown Bar */}
      <Header 
        state={state} 
        onAddXP={handleAddXP} 
        onOpenDataModal={() => setIsDataModalOpen(true)} 
      />

      {/* Floating XP Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-xl shadow-rose-500/20 flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-400/25' 
                    : 'bg-white hover:bg-rose-50/60 text-slate-600 hover:text-slate-900 border border-stone-200/80 shadow-xs'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Dynamic Views */}
        <div className="transition-all duration-300">
          {activeTab === 'dashboard' && (
            <DashboardView 
              state={state} 
              updateState={updateState} 
              setActiveTab={setActiveTab}
              onAddXP={handleAddXP} 
            />
          )}

          {activeTab === 'health' && (
            <HealthView 
              state={state} 
              updateState={updateState} 
              onAddXP={handleAddXP} 
            />
          )}

          {activeTab === 'artlab' && (
            <ArtlabView 
              state={state} 
              updateState={updateState} 
              onAddXP={handleAddXP} 
            />
          )}

          {activeTab === 'stock' && (
            <StockView 
              state={state} 
              updateState={updateState} 
              onAddXP={handleAddXP} 
            />
          )}

          {activeTab === 'finance' && (
            <FinanceView 
              state={state} 
              updateState={updateState} 
              onAddXP={handleAddXP} 
            />
          )}

          {activeTab === 'learning' && (
            <LearningView 
              state={state} 
              updateState={updateState} 
              onAddXP={handleAddXP} 
            />
          )}

          {activeTab === 'journal' && (
            <JournalView 
              state={state} 
              updateState={updateState} 
              onAddXP={handleAddXP} 
            />
          )}
        </div>

      </main>

      {/* Settings / Goal Customization Modal */}
      <DataManageModal 
        isOpen={isDataModalOpen} 
        onClose={() => setIsDataModalOpen(false)} 
        state={state} 
        updateState={updateState} 
        onResetAll={handleResetAll} 
      />

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-slate-400 border-t border-stone-200 mt-auto">
        <p>Sprint 84 · 27 Yaşının Zəfər Hekayəsi 👑 · İşıqlı, zərif və motivasiya dolu dizayn</p>
      </footer>
    </div>
  )
}
