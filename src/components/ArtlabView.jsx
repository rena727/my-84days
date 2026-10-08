import React, { useState } from 'react'
import { 
  Flame, 
  ShoppingBag, 
  Camera, 
  Plus, 
  Trash2, 
  Video, 
  DollarSign, 
  Gift
} from 'lucide-react'
import { triggerConfetti, triggerBigCelebration } from '../utils/confetti'

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

export default function ArtlabView({ state, updateState, onAddXP }) {
  const [showAddSale, setShowAddSale] = useState(false)
  const [saleCustomer, setSaleCustomer] = useState('')
  const [saleScent, setSaleScent] = useState('Vanil & Darçın')
  const [salePrice, setSalePrice] = useState(25)
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0])
  const [saleNote, setSaleNote] = useState('')

  const [showAddReel, setShowAddReel] = useState(false)
  const [reelTitle, setReelTitle] = useState('')

  const [followerInput, setFollowerInput] = useState(state.artlab.followers)
  const [showFollowerModal, setShowFollowerModal] = useState(false)

  // Add new sale
  const handleAddSale = (e) => {
    e.preventDefault()
    const newSale = {
      id: 'sale_' + Date.now(),
      customer: saleCustomer || 'Anonim Müştəri',
      scent: saleScent,
      price: Number(salePrice) || 20,
      date: saleDate,
      note: saleNote
    }

    const nextSales = [newSale, ...state.artlab.sales]
    updateState({
      artlab: {
        ...state.artlab,
        sales: nextSales
      }
    })

    setShowAddSale(false)
    setSaleCustomer('')
    setSaleNote('')

    triggerBigCelebration()
    onAddXP(100, `TƏBRİKLƏR! Artlab-dan ${salePrice} AZN satış qeydə alındı! 🕯️`)
  }

  // Delete sale
  const deleteSale = (id) => {
    const nextSales = state.artlab.sales.filter(s => s.id !== id)
    updateState({
      artlab: {
        ...state.artlab,
        sales: nextSales
      }
    })
  }

  // Update followers
  const handleUpdateFollowers = (e) => {
    e.preventDefault()
    const count = Number(followerInput) || state.artlab.followers
    updateState({
      artlab: {
        ...state.artlab,
        followers: count
      }
    })
    setShowFollowerModal(false)
    if (count > state.artlab.followers) {
      triggerConfetti()
      onAddXP(20, `Instagram izləyici sayı artdı: ${count}!`)
    }
  }

  // Add Reel Idea
  const handleAddReel = (e) => {
    e.preventDefault()
    if (!reelTitle.trim()) return
    const newReel = {
      id: 'reel_' + Date.now(),
      title: reelTitle,
      status: 'İdeya',
      views: 0
    }
    updateState({
      artlab: {
        ...state.artlab,
        reelsIdeas: [...state.artlab.reelsIdeas, newReel]
      }
    })
    setReelTitle('')
    setShowAddReel(false)
    onAddXP(15, 'Yeni Reels ideyası əlavə edildi')
  }

  // Toggle Reel Status
  const toggleReelStatus = (id) => {
    const updated = state.artlab.reelsIdeas.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === 'İdeya' ? 'Hazırlanır' : r.status === 'Hazırlanır' ? 'Paylaşıldı' : 'İdeya'
        return { ...r, status: nextStatus }
      }
      return r
    })
    updateState({
      artlab: {
        ...state.artlab,
        reelsIdeas: updated
      }
    })
  }

  // Delete Reel
  const deleteReel = (id) => {
    const updated = state.artlab.reelsIdeas.filter(r => r.id !== id)
    updateState({
      artlab: {
        ...state.artlab,
        reelsIdeas: updated
      }
    })
  }

  const totalRevenue = state.artlab.sales.reduce((acc, s) => acc + Number(s.price || 0), 0)
  const salesCount = state.artlab.sales.length
  const salesGoal = state.artlab.salesGoal || 2

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-100/80 via-rose-50 to-orange-50 border border-amber-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4" /> 2-ci Təməl Sütun · Brend & Biznes
          </div>
          <h2 className="text-2xl font-black text-slate-900">Artlab — Qoxulu Şamlar və İlk Satışlar</h2>
          <p className="text-xs text-slate-600">
            Məhsulların hazırdır! Qarşıdan gələn Yeni İl ərəfəsi (Dekabr) şam satışı üçün ilin ən qızıl fürsətidir.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddSale(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-bold transition shadow-md shadow-amber-400/25 flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> + Yeni Satış Qeyd Et
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Sales Target */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold">İl Sonu Satış Hədəfi</span>
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700"><Flame className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{salesCount}</span>
            <span className="text-xs text-slate-500 font-medium">/ {salesGoal} satış</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (salesCount / salesGoal) * 100)}%` }} 
            />
          </div>
          <span className="text-[11px] text-amber-800 font-bold block">
            {salesCount >= salesGoal ? '🎉 Hədəf fəth olundu!' : `Qalan: ${Math.max(0, salesGoal - salesCount)} satış`}
          </span>
        </div>

        {/* Total Revenue */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold">Toplam Şam Gəliri</span>
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700"><DollarSign className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 font-mono">{totalRevenue}</span>
            <span className="text-xs text-slate-500 font-medium">AZN</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Hər satış birbaşa borclarının azalmasına kömək edəcək.
          </p>
        </div>

        {/* Instagram Tracker */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold">Instagram İzləyici</span>
            <button 
              onClick={() => setShowFollowerModal(true)}
              className="p-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 cursor-pointer"
              title="İzləyici sayını yenilə"
            >
              <InstagramIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-pink-600 font-mono">{state.artlab.followers}</span>
            <span className="text-xs text-slate-500 font-medium">izləyici</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Hədəf: 100</span>
            <button onClick={() => setShowFollowerModal(true)} className="text-pink-600 hover:underline font-bold cursor-pointer">Yenilə</button>
          </div>
        </div>

      </div>

      {/* Grid: Sales Log & Reels Idea Bank */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales Table / List */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-lg text-slate-900">Satış Tarixçəsi</h3>
            </div>
            <button
              onClick={() => setShowAddSale(true)}
              className="text-xs text-amber-700 hover:underline font-bold cursor-pointer"
            >
              + Satış Əlavə Et
            </button>
          </div>

          {state.artlab.sales.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-amber-200 bg-amber-50/40 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-800">Hələ satış qeyd olunmayıb</div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                İlk şamını satdığın an buradan qeyd et və möhtəşəm bayram atəşfəşanlığını başlat!
              </p>
              <button
                onClick={() => setShowAddSale(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                İlk Satışı Yaz
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {state.artlab.sales.map(sale => (
                <div key={sale.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{sale.scent}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                        +{sale.price} AZN
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Müştəri: <span className="text-slate-800 font-semibold">{sale.customer}</span> · <span className="text-slate-400">{sale.date}</span>
                    </p>
                    {sale.note && <p className="text-[11px] text-slate-600 italic mt-1">{sale.note}</p>}
                  </div>
                  <button
                    onClick={() => deleteSale(sale.id)}
                    className="text-slate-400 hover:text-rose-600 p-2 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reels Content Bank & Marketing Tips */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-pink-600" />
              <h3 className="font-bold text-lg text-slate-900">Reels & Video İdeyaları</h3>
            </div>
            <button
              onClick={() => setShowAddReel(!showAddReel)}
              className="text-xs text-pink-600 hover:underline font-bold cursor-pointer"
            >
              + İdeya Əlavə Et
            </button>
          </div>

          {showAddReel && (
            <form onSubmit={handleAddReel} className="p-3 rounded-xl bg-pink-50/60 border border-pink-200 flex gap-2">
              <input
                type="text"
                placeholder="məs: Şamın qutulanması və təbii fitili"
                value={reelTitle}
                onChange={(e) => setReelTitle(e.target.value)}
                className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                required
              />
              <button type="submit" className="px-3 py-1.5 bg-pink-500 text-white rounded-lg text-xs font-bold cursor-pointer">
                Əlavə et
              </button>
            </form>
          )}

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {state.artlab.reelsIdeas.map(reel => (
              <div key={reel.id} className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={() => toggleReelStatus(reel.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                      reel.status === 'Paylaşıldı' 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : reel.status === 'Hazırlanır'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-white text-slate-600 border-stone-300'
                    }`}
                  >
                    {reel.status}
                  </button>
                  <span className="text-xs text-slate-800 font-semibold">{reel.title}</span>
                </div>
                <button
                  onClick={() => deleteReel(reel.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Holiday Sales Strategy Tips */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs text-slate-700">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              💡 1-2 Satış Üçün Qızıl Taktika (Dekabr):
            </span>
            <p className="text-[11px] leading-relaxed">
              1. İş yerində və ya yaxın rəfiqələrinə: <em>"Yeni İl üçün fərdi əl işi qoxulu şam hazırlayıram, hədiyyə etmək istəyirsənsə ilk sifarişləri götürürəm"</em> de.<br />
              2. Qutulamaya qırmızı lent və ya qısa zərif Yeni İl təbrik kartı əlavə et.<br />
              3. Qoxu olaraq: Vanil, Darçın, Qəhvə və ya Şam ağacı qoxusu ən çox satılanlardır!
            </p>
          </div>
        </div>

      </div>

      {/* Add Sale Modal */}
      {showAddSale && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900">Yeni Şam Satışını Qeyd Et 🕯️</h3>
            <form onSubmit={handleAddSale} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Müştəri / Ad / Profil</label>
                <input
                  type="text"
                  placeholder="məs: Leyla xanım / İş yoldaşı"
                  value={saleCustomer}
                  onChange={(e) => setSaleCustomer(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Şamın Qoxusu / Növü</label>
                  <input
                    type="text"
                    value={saleScent}
                    onChange={(e) => setSaleScent(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Satış Qiyməti (AZN)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Satış Tarixi</label>
                <input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Qeyd (Hədiyyəlik qutulama və s.)</label>
                <input
                  type="text"
                  placeholder="məs: Qırmızı lentli xüsusi qutu"
                  value={saleNote}
                  onChange={(e) => setSaleNote(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSale(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-xs text-slate-700 hover:bg-stone-200 cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Satışı Təsdiqlə (+100 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Follower Modal */}
      {showFollowerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900">Instagram İzləyici Sayı</h3>
            <form onSubmit={handleUpdateFollowers} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Hazırkı İzləyici</label>
                <input
                  type="number"
                  value={followerInput}
                  onChange={(e) => setFollowerInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFollowerModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-xs text-slate-700 hover:bg-stone-200 cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Yenilə
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
