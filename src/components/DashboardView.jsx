import React from 'react'
import { 
  HeartPulse, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ShoppingBag, 
  Wallet, 
  Languages, 
  BookOpen, 
  Droplet, 
  Footprints,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react'
import { triggerConfetti } from '../utils/confetti'

export default function DashboardView({ state, updateState, setActiveTab, onAddXP }) {
  const stockProgress = Math.min(100, Math.round((state.stock.shutterstock.current / state.stock.shutterstock.target) * 100))
  const salesProgress = Math.min(100, Math.round((state.artlab.sales.length / state.artlab.salesGoal) * 100))
  const booksReadCount = state.learning.books.filter(b => b.currentPage >= b.totalPages).length
  const bookProgress = Math.round((state.learning.books.reduce((acc, b) => acc + (b.currentPage / b.totalPages), 0) / state.learning.books.length) * 100)

  // Debt calculation
  const totalPaid = state.finance.debtPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0)
  const targetToPay = (state.finance.totalDebt * (state.finance.debtPayoffTargetPercent / 100))
  const debtProgress = Math.min(100, Math.round((totalPaid / (targetToPay || 1)) * 100))

  const quickActions = [
    {
      id: 'iron',
      title: 'Dəmir takviyəsi (Hemo)',
      desc: 'Səhər acqarına / Çay-kofedən 2 saat uzaq',
      icon: HeartPulse,
      done: state.health.supplements.find(s => s.id === 's1')?.takenToday,
      toggle: () => {
        const next = state.health.supplements.map(s => s.id === 's1' ? { ...s, takenToday: !s.takenToday } : s)
        updateState({ health: { ...state.health, supplements: next } })
        if (!state.health.supplements.find(s => s.id === 's1')?.takenToday) {
          triggerConfetti()
          onAddXP(25, 'Dəmir qəbul edildi!')
        }
      }
    },
    {
      id: 'stock-today',
      title: 'Stok: Gündəlik 5 Set Yükləmə',
      desc: 'Shutterstock + Adobe + Vecteezy',
      icon: Layers,
      done: state.stock.uploads.some(u => u.date === new Date().toISOString().split('T')[0]),
      action: () => setActiveTab('stock')
    },
    {
      id: 'water-today',
      title: `Su: ${state.health.water.currentGlasses}/${state.health.water.targetGlasses} stəkan`,
      desc: 'Kofe/çay yanında 1 stəkan əlavə su',
      icon: Droplet,
      done: state.health.water.currentGlasses >= state.health.water.targetGlasses,
      action: () => setActiveTab('health')
    },
    {
      id: 'german-today',
      title: 'Alman dili: 15 dəqiqə fokus',
      desc: 'Baza sözlər & Duolingo',
      icon: Languages,
      done: false,
      action: () => setActiveTab('learning')
    },
    {
      id: 'book-today',
      title: 'Kitab: 8-10 səhifə oxu',
      desc: '84 günə 2 tam kitab bitir',
      icon: BookOpen,
      done: false,
      action: () => setActiveTab('learning')
    }
  ]

  return (
    <div className="space-y-6">
      
      {/* Welcome & Mindset Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-rose-100/70 via-amber-50 to-purple-100/60 border border-rose-200/90 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-200/60 text-amber-900 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" /> 84 Günlük Əsas Missiya
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              27 Yaşının Ən Güclü Versiyasına Xoş Gəldin! 👑
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              İşə girməklə ən böyük təməli artıq qoymusan. İndi isə <strong>Ferritinini qaldırıb enerjini bərpa edirik</strong>, <strong>1000 stok setini</strong> tamamlayırıq və <strong>Artlab şamlarının ilk satışlarını</strong> edirik!
            </p>
          </div>

          <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('journal')}
              className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-rose-400/30 transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              ✍️ Bugünkü Günlüyü Yaz
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-white hover:bg-stone-50 text-slate-800 font-bold text-sm border border-stone-300 transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              🩺 Sağlamlıq Paneli
            </button>
          </div>
        </div>
      </div>

      {/* Critical Medical Reminder Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-950 text-xs sm:text-sm shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-900 block mb-0.5 font-bold">Qızıl Sağlamlıq Qaydası (Ferritin = 10 üçün):</strong>
          Dəmir takviyəsini və balqabaq tumunu qəbul etdikdən <strong>2 saat əvvəl və 2 saat sonra çay və kofe içmək olmaz</strong>. Kofe dəmiri yuyub aparır. Çay/kofe içəndə yanında 1 stəkan ilıq su içməyi vərdiş et!
        </div>
      </div>

      {/* 6 Key Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* 1. Health & Ferritin */}
        <div 
          onClick={() => setActiveTab('health')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 border border-rose-200 group-hover:scale-110 transition">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Sağlamlıq & Enerji</h3>
                <span className="text-xs text-slate-500">Ferritin & Takviyələr</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Ferritin Səviyyəsi</span>
              <span className="text-rose-600 font-mono font-bold">{state.health.ferritin.current} / {state.health.ferritin.target} ng/mL</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (state.health.ferritin.current / state.health.ferritin.target) * 100)}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <span className="text-slate-500 block text-[10px]">Bugünkü Addım</span>
              <span className="font-bold text-slate-800 font-mono">{state.health.steps.today.toLocaleString()}</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <span className="text-slate-500 block text-[10px]">İçilən Su</span>
              <span className="font-bold text-blue-600 font-mono">{state.health.water.currentGlasses}/{state.health.water.targetGlasses} stəkan</span>
            </div>
          </div>
        </div>

        {/* 2. Artlab Candles */}
        <div 
          onClick={() => setActiveTab('artlab')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 group-hover:scale-110 transition">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Artlab Şamları</h3>
                <span className="text-xs text-slate-500">Qoxulu Mumlar & Satış</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">İl Sonu Satış Hədəfi</span>
              <span className="text-amber-700 font-mono font-bold">{state.artlab.sales.length} / {state.artlab.salesGoal} Satış</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${salesProgress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <span className="text-slate-500 block text-[10px]">Instagram İzləyici</span>
              <span className="font-bold text-pink-600 font-mono">{state.artlab.followers} İzləyici</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <span className="text-slate-500 block text-[10px]">Reels İdeyaları</span>
              <span className="font-bold text-slate-800 font-mono">{state.artlab.reelsIdeas.length} İdeya</span>
            </div>
          </div>
        </div>

        {/* 3. Stock Portfolio */}
        <div 
          onClick={() => setActiveTab('stock')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 group-hover:scale-110 transition">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Stok Portfeli</h3>
                <span className="text-xs text-slate-500">Shutterstock · Adobe · Vecteezy</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Shutterstock (1000 Hədəf)</span>
              <span className="text-purple-700 font-mono font-bold">{state.stock.shutterstock.current} / {state.stock.shutterstock.target}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${stockProgress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <span className="text-slate-500 block text-[10px]">Qalan Set</span>
              <span className="font-bold text-amber-700 font-mono">+{state.stock.shutterstock.target - state.stock.shutterstock.current} set</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <span className="text-slate-500 block text-[10px]">Gündəlik Hədəf</span>
              <span className="font-bold text-purple-800 font-mono">~5-6 set/gün</span>
            </div>
          </div>
        </div>

        {/* 4. Finance & Debt */}
        <div 
          onClick={() => setActiveTab('finance')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 group-hover:scale-110 transition">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Maliyyə & Borc Planı</h3>
                <span className="text-xs text-slate-500">Maaş 800 AZN · 50% İxtisar</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Borc Ödəmə Tərəqqisi</span>
              <span className="text-emerald-700 font-mono font-bold">{debtProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${debtProgress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <span className="text-slate-500 block text-[10px]">Aylıq Əməkhaqqı</span>
              <span className="font-bold text-slate-800 font-mono">800 AZN</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <span className="text-slate-500 block text-[10px]">Hədəflənən İxtisar</span>
              <span className="font-bold text-emerald-700 font-mono">50%</span>
            </div>
          </div>
        </div>

        {/* 5. German Language */}
        <div 
          onClick={() => setActiveTab('learning')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 group-hover:scale-110 transition">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Alman Dili</h3>
                <span className="text-xs text-slate-500">Gündəlik 15 dəqiqə fokus</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Öyrənilən Baza Sözlər</span>
              <span className="text-blue-700 font-mono font-bold">{state.learning.german.vocabulary.length} Söz</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (state.learning.german.vocabulary.length / 50) * 100)}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <span className="text-slate-500 block text-[10px]">Gündəlik Fokus</span>
              <span className="font-bold text-blue-800 font-mono">15 dəq</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <span className="text-slate-500 block text-[10px]">Taktika</span>
              <span className="font-bold text-slate-800">Duolingo + Kart</span>
            </div>
          </div>
        </div>

        {/* 6. Books Reading */}
        <div 
          onClick={() => setActiveTab('learning')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700 border border-teal-200 group-hover:scale-110 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">2 Kitab Hədəfi</h3>
                <span className="text-xs text-slate-500">84 günə 2 tam kitab</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Ümumi Oxu Tərəqqisi</span>
              <span className="text-teal-700 font-mono font-bold">{bookProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-teal-600 h-full rounded-full transition-all duration-500" style={{ width: `${bookProgress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <span className="text-slate-500 block text-[10px]">Tamamlanan Kitab</span>
              <span className="font-bold text-teal-800 font-mono">{booksReadCount} / 2 Kitab</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <span className="text-slate-500 block text-[10px]">Gündəlik Səhifə</span>
              <span className="font-bold text-slate-800 font-mono">~8-10 səh</span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Daily Action Checklist */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-lg text-slate-900">Bugünkü Əsas Fokus Tapşırıqları</h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">Hər addım sənə XP qazandırır!</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map(action => {
            const Icon = action.icon
            return (
              <div 
                key={action.id}
                className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  action.done 
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-xs' 
                    : 'bg-white border-stone-200 hover:border-rose-200 text-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${action.done ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{action.title}</h4>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                  </div>
                </div>

                {action.toggle ? (
                  <button
                    onClick={action.toggle}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      action.done 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {action.done ? '✓ İdildi' : 'Qəbul et'}
                  </button>
                ) : (
                  <button
                    onClick={action.action}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  >
                    Aç
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
