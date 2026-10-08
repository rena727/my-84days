import React, { useState } from 'react'
import { 
  Layers, 
  Trash2, 
  UploadCloud, 
  Calendar,
  Zap
} from 'lucide-react'
import { triggerConfetti } from '../utils/confetti'

export default function StockView({ state, updateState, onAddXP }) {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [batchCount, setBatchCount] = useState(5)
  const [batchDesc, setBatchDesc] = useState('Yeni İl və Qış temalı vektor ikonkaları')
  const [batchDate, setBatchDate] = useState(new Date().toISOString().split('T')[0])
  const [targetPlatform, setTargetPlatform] = useState('Hamısına (Cross-Upload)')

  // Log new upload
  const handleLogUpload = (e) => {
    e.preventDefault()
    const count = Number(batchCount) || 1
    const newUpload = {
      id: 'up_' + Date.now(),
      date: batchDate,
      count: count,
      platform: targetPlatform,
      description: batchDesc || 'Stok dəsti'
    }

    const nextShutter = state.stock.shutterstock.current + count
    const nextAdobe = targetPlatform.includes('Adobe') || targetPlatform.includes('Hamısına') 
      ? state.stock.adobe.current + count 
      : state.stock.adobe.current
    const nextVecteezy = targetPlatform.includes('Vecteezy') || targetPlatform.includes('Hamısına') 
      ? state.stock.vecteezy.current + count 
      : state.stock.vecteezy.current

    updateState({
      stock: {
        ...state.stock,
        shutterstock: {
          ...state.stock.shutterstock,
          current: nextShutter
        },
        adobe: {
          ...state.stock.adobe,
          current: nextAdobe
        },
        vecteezy: {
          ...state.stock.vecteezy,
          current: nextVecteezy
        },
        uploads: [newUpload, ...state.stock.uploads]
      }
    })

    setShowUploadModal(false)
    setBatchDesc('')
    triggerConfetti()
    onAddXP(count * 10, `+${count} Stok seti yükləndi!`)
  }

  // Delete upload entry
  const deleteUpload = (id) => {
    const upload = state.stock.uploads.find(u => u.id === id)
    if (!upload) return

    const count = upload.count || 0
    const nextShutter = Math.max(0, state.stock.shutterstock.current - count)
    const nextUploads = state.stock.uploads.filter(u => u.id !== id)

    updateState({
      stock: {
        ...state.stock,
        shutterstock: {
          ...state.stock.shutterstock,
          current: nextShutter
        },
        uploads: nextUploads
      }
    })
  }

  const shutterCurrent = state.stock.shutterstock.current
  const shutterTarget = state.stock.shutterstock.target
  const remainingSets = Math.max(0, shutterTarget - shutterCurrent)
  const shutterPercent = Math.min(100, Math.round((shutterCurrent / shutterTarget) * 100))

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-100/80 via-pink-50 to-indigo-50 border border-purple-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" /> 3-cü Təməl Sütun · Passiv Gəlir
          </div>
          <h2 className="text-2xl font-black text-slate-900">Stok Portfeli — 1000 Set Hədəfi</h2>
          <p className="text-xs text-slate-600">
            561 setlə möhkəm təməlin var. Gündə cəmi 5-6 set yükləməklə ilin sonunda 1000-lik nəhəng passiv aktivə sahib olacaqsan!
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-md shadow-purple-500/25 flex items-center gap-1.5 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" /> + Set Yüklədim (Qeyd Et)
          </button>
        </div>
      </div>

      {/* 3 Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Shutterstock */}
        <div className="glass-card p-6 rounded-3xl space-y-4 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <h3 className="font-bold text-slate-900 text-base">Shutterstock</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              Aktiv
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 font-mono">{shutterCurrent}</span>
              <span className="text-xs text-slate-500 font-mono">/ {shutterTarget} set</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${shutterPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1 font-medium">
              <span>Tərəqqi: {shutterPercent}%</span>
              <span className="text-amber-800 font-bold font-mono">Qalan: {remainingSets} set</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 text-xs text-purple-900 font-medium">
            ⚡ <strong>Gündəlik Hədəf:</strong> ~5-6 set / gün yükləyərək 84 günə 1000-i keçirsən!
          </div>
        </div>

        {/* Adobe Stock */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">Adobe Stock</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
              {state.stock.adobe.status}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 font-mono">{state.stock.adobe.current}</span>
              <span className="text-xs text-slate-500 font-mono">/ {state.stock.adobe.target} set</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (state.stock.adobe.current / state.stock.adobe.target) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1 font-medium">
              <span>Hədəf: 200 set</span>
              <span className="text-slate-500">Təsdiq alan kimi yüklə</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-xs text-amber-900 font-medium">
            💡 Hazır Shutterstock fayllarını birbaşa Adobe-a da yükləyəcəksən.
          </div>
        </div>

        {/* Vecteezy */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <h3 className="font-bold text-slate-900 text-base">Vecteezy</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-200">
              {state.stock.vecteezy.status}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 font-mono">{state.stock.vecteezy.current}</span>
              <span className="text-xs text-slate-500 font-mono">/ {state.stock.vecteezy.target} set</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (state.stock.vecteezy.current / state.stock.vecteezy.target) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1 font-medium">
              <span>Hədəf: 200 set</span>
              <span className="text-slate-500">Təsdiq alan kimi yüklə</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-900 font-medium">
            ⚡ Eyni fayllarla 3 fərqli platformadan gəlir axını yaranacaq!
          </div>
        </div>

      </div>

      {/* Upload Log & Strategy Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload History */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-lg text-slate-900">Yükləmə Qeydləri</h3>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-xs text-purple-700 hover:underline font-bold cursor-pointer"
            >
              + Yükləmə Yaz
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {state.stock.uploads.map(item => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">+{item.count} Set</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                      {item.platform}
                    </span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </div>
                <button
                  onClick={() => deleteUpload(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-2 cursor-pointer"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Upload Taktikası */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
            <Zap className="w-5 h-5 text-amber-600" /> Cross-Upload Qızıl Qaydası
          </div>
          
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              1. <strong>Bir dəfə çək / hazırla:</strong> 5 vektor dəsti hazırlayırsan.
            </p>
            <p>
              2. <strong>Eyni vaxtda 3 yerə at:</strong> Shutterstock, Adobe Stock və Vecteezy-yə eyni faylları və teqləri yükləyirsən.
            </p>
            <p>
              3. <strong>Nəticə:</strong> Gündə 15 deyil, cəmi 5 set hazırlamaqla hər 3 platformanın hədəfini 100% vurursan!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-[11px] text-purple-900 font-medium">
            🎯 <strong>Aktual Mövzular:</strong> Yeni İl (New Year 2027 / Winter / Candles / Cozy patterns / Gift boxes). İndi yükləsən, dekabrda satışlar partlayacaq!
          </div>
        </div>

      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900">Yüklənən Stok Setlərini Qeyd Et 🎨</h3>
            <form onSubmit={handleLogUpload} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Set Sayı</label>
                <input
                  type="number"
                  min="1"
                  value={batchCount}
                  onChange={(e) => setBatchCount(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-base"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Hansı Platformalara?</label>
                <select
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                >
                  <option value="Hamısına (Cross-Upload)">Hamısına (Shutterstock + Adobe + Vecteezy)</option>
                  <option value="Təkcə Shutterstock">Təkcə Shutterstock</option>
                  <option value="Shutterstock + Adobe">Shutterstock + Adobe</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Mövzu / Təsvir</label>
                <input
                  type="text"
                  placeholder="məs: Yeni İl qış vektorları"
                  value={batchDesc}
                  onChange={(e) => setBatchDesc(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Tarix</label>
                <input
                  type="date"
                  value={batchDate}
                  onChange={(e) => setBatchDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-xs text-slate-700 hover:bg-stone-200 cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Yadda Saxla (+{batchCount * 10} XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
