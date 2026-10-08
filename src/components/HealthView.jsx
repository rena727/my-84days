import React, { useState } from 'react'
import { 
  HeartPulse, 
  Droplet, 
  Footprints, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Activity,
  Sparkles
} from 'lucide-react'
import { triggerConfetti } from '../utils/confetti'

export default function HealthView({ state, updateState, onAddXP }) {
  const [newSupplementName, setNewSupplementName] = useState('')
  const [newSupplementTiming, setNewSupplementTiming] = useState('')
  const [showAddSupplement, setShowAddSupplement] = useState(false)

  const [ferritinInput, setFerritinInput] = useState(state.health.ferritin.current)
  const [ferritinDate, setFerritinDate] = useState(new Date().toISOString().split('T')[0])
  const [ferritinNote, setFerritinNote] = useState('')
  const [showAddFerritin, setShowAddFerritin] = useState(false)

  const [stepInput, setStepInput] = useState(state.health.steps.today)
  const [showStepModal, setShowStepModal] = useState(false)

  // Toggle supplement
  const toggleSupplement = (id) => {
    const supplement = state.health.supplements.find(s => s.id === id)
    const isNowTaken = !supplement.takenToday
    
    const updated = state.health.supplements.map(s => 
      s.id === id ? { ...s, takenToday: isNowTaken } : s
    )
    
    updateState({ health: { ...state.health, supplements: updated } })
    
    if (isNowTaken) {
      triggerConfetti()
      onAddXP(supplement.xpReward || 15, `${supplement.name} qəbul edildi!`)
    }
  }

  // Delete supplement
  const deleteSupplement = (id) => {
    const updated = state.health.supplements.filter(s => s.id !== id)
    updateState({ health: { ...state.health, supplements: updated } })
  }

  // Add new supplement
  const handleAddSupplement = (e) => {
    e.preventDefault()
    if (!newSupplementName.trim()) return
    const newItem = {
      id: 's_' + Date.now(),
      name: newSupplementName,
      timing: newSupplementTiming || 'Gündəlik',
      restriction: 'Mütəmadi qəbul',
      takenToday: false,
      xpReward: 15
    }
    updateState({
      health: {
        ...state.health,
        supplements: [...state.health.supplements, newItem]
      }
    })
    setNewSupplementName('')
    setNewSupplementTiming('')
    setShowAddSupplement(false)
    onAddXP(10, 'Yeni takviyə əlavə edildi')
  }

  // Add Ferritin test result
  const handleAddFerritinTest = (e) => {
    e.preventDefault()
    const val = Number(ferritinInput)
    if (isNaN(val) || val <= 0) return

    const newTest = {
      id: 'f_' + Date.now(),
      date: ferritinDate,
      value: val,
      note: ferritinNote || 'Analiz nəticəsi'
    }

    updateState({
      health: {
        ...state.health,
        ferritin: {
          ...state.health.ferritin,
          current: val,
          history: [newTest, ...state.health.ferritin.history]
        }
      }
    })

    setShowAddFerritin(false)
    setFerritinNote('')
    triggerConfetti()
    onAddXP(50, `Ferritin analizi yeniləndi: ${val} ng/mL!`)
  }

  // Delete Ferritin test
  const deleteFerritinTest = (id) => {
    const updatedHistory = state.health.ferritin.history.filter(t => t.id !== id)
    const latest = updatedHistory[0]?.value || state.health.ferritin.current
    updateState({
      health: {
        ...state.health,
        ferritin: {
          ...state.health.ferritin,
          current: latest,
          history: updatedHistory
        }
      }
    })
  }

  // Water handlers
  const addWaterGlass = () => {
    const next = state.health.water.currentGlasses + 1
    updateState({
      health: {
        ...state.health,
        water: { ...state.health.water, currentGlasses: next }
      }
    })
    if (next === state.health.water.targetGlasses) {
      triggerConfetti()
      onAddXP(30, 'Gündəlik su hədəfinə çatdın!')
    } else {
      onAddXP(5, '1 stəkan su içildi')
    }
  }

  const removeWaterGlass = () => {
    if (state.health.water.currentGlasses <= 0) return
    updateState({
      health: {
        ...state.health,
        water: { ...state.health.water, currentGlasses: state.health.water.currentGlasses - 1 }
      }
    })
  }

  const resetWater = () => {
    updateState({
      health: {
        ...state.health,
        water: { ...state.health.water, currentGlasses: 0 }
      }
    })
  }

  // Step handlers
  const handleUpdateSteps = (e) => {
    e.preventDefault()
    const val = Number(stepInput)
    if (isNaN(val)) return

    const todayDate = new Date().toISOString().split('T')[0]
    const existingIndex = state.health.steps.history.findIndex(h => h.date === todayDate)
    
    let updatedHistory = [...state.health.steps.history]
    if (existingIndex >= 0) {
      updatedHistory[existingIndex] = { ...updatedHistory[existingIndex], count: val }
    } else {
      updatedHistory.unshift({ id: 'st_' + Date.now(), date: todayDate, count: val, note: 'Gündəlik addım' })
    }

    updateState({
      health: {
        ...state.health,
        steps: {
          ...state.health.steps,
          today: val,
          history: updatedHistory
        }
      }
    })

    setShowStepModal(false)
    if (val >= state.health.steps.target) {
      triggerConfetti()
      onAddXP(40, `Addım hədəfi fəth edildi (${val} addım)!`)
    }
  }

  const ferritinPercent = Math.min(100, Math.round((state.health.ferritin.current / state.health.ferritin.target) * 100))

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-rose-50 via-amber-50 to-pink-50 border border-rose-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
            <HeartPulse className="w-4 h-4" /> 1-ci Təməl Sütun
          </div>
          <h2 className="text-2xl font-black text-slate-900">Sağlamlıq, Qan Dəyərləri & Enerji Bərpası</h2>
          <p className="text-xs text-slate-600">
            Halsızlıq tənbəllik deyil — dəmiri bərpa edirik, bol su və takviyələrlə enerjini 100%-ə çatdırırıq!
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddFerritin(true)}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition shadow-md shadow-rose-400/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" /> Analiz Nəticəsi Yaz
          </button>
        </div>
      </div>

      {/* Grid: Ferritin & Water & Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ferritin Tracker Card */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Ferritin Səviyyəsi</h3>
                <span className="text-xs text-slate-500">Hədəf: Minimum 50 ng/mL</span>
              </div>
            </div>
            <span className="text-2xl font-black font-mono text-rose-600">{state.health.ferritin.current} <span className="text-xs text-slate-500 font-normal">ng/mL</span></span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Mövcud: {state.health.ferritin.current} (Aşağı)</span>
              <span>Hədəf: {state.health.ferritin.target} (Optimal)</span>
            </div>
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200">
              <div 
                className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${ferritinPercent}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Həkim Məsləhəti & Taktika:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
              <li>Dəmir takviyəsini C vitamini (portağal suyu və ya limonlu su) ilə qəbul et.</li>
              <li>Balqabaq tumunu hər gün ara öyün kimi çeynə.</li>
              <li>Kofe və qara çaydan dərhal sonra içmə!</li>
            </ul>
          </div>

          {/* Test History */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Analiz Tarixçəsi</span>
              <button onClick={() => setShowAddFerritin(true)} className="text-rose-600 hover:underline text-[11px] cursor-pointer">+ Əlavə et</button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {state.health.ferritin.history.map(test => (
                <div key={test.id} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 font-mono">{test.value} ng/mL</span>
                    <span className="text-slate-500 text-[10px] ml-2">{test.date}</span>
                    <p className="text-[10px] text-slate-600 truncate max-w-[150px]">{test.note}</p>
                  </div>
                  <button 
                    onClick={() => deleteFerritinTest(test.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Water Tracker Card */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Gündəlik Su Balansı</h3>
                <span className="text-xs text-slate-500">Hədəf: ~1.75 Litr (7 stəkan)</span>
              </div>
            </div>
            <button onClick={resetWater} className="text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer">
              Sıfırla
            </button>
          </div>

          <div className="text-center py-2">
            <div className="text-3xl font-black text-blue-600 font-mono">
              {(state.health.water.currentGlasses * 0.25).toFixed(2)} <span className="text-sm text-slate-500 font-normal">Litr</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {state.health.water.currentGlasses} / {state.health.water.targetGlasses} stəkan (hər biri 250ml)
            </div>
          </div>

          {/* Interactive Glasses */}
          <div className="grid grid-cols-7 gap-1.5 py-2">
            {Array.from({ length: state.health.water.targetGlasses }).map((_, idx) => {
              const isFilled = idx < state.health.water.currentGlasses
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isFilled && idx === state.health.water.currentGlasses - 1) {
                      removeWaterGlass()
                    } else if (!isFilled && idx === state.health.water.currentGlasses) {
                      addWaterGlass()
                    }
                  }}
                  className={`h-14 rounded-xl border flex flex-col items-center justify-end pb-1 cursor-pointer transition transform active:scale-95 ${
                    isFilled 
                      ? 'bg-blue-100 border-blue-400 text-blue-700 shadow-xs' 
                      : 'bg-stone-50 border-stone-200 text-slate-400 hover:border-blue-300'
                  }`}
                  title={`${(idx + 1) * 250} ml`}
                >
                  <Droplet className={`w-4 h-4 ${isFilled ? 'fill-blue-500 text-blue-500' : ''}`} />
                  <span className="text-[9px] font-mono mt-0.5 font-bold">{idx + 1}</span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={addWaterGlass}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> +1 Stəkan Su İçdim
            </button>
            <button
              onClick={removeWaterGlass}
              disabled={state.health.water.currentGlasses <= 0}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              -1
            </button>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
            💡 <strong>Qeyd:</strong> Çay və kofe bədəni susuzlaşdırır. Kofeni içdikdən sonra mütləq 1 stəkan su iç!
          </div>
        </div>

        {/* Steps & Walking Card */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Gündəlik Hərəkət</h3>
                <span className="text-xs text-slate-500">6,000 – 12,000 Addım Aralığı</span>
              </div>
            </div>
            <button 
              onClick={() => setShowStepModal(true)}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 cursor-pointer"
              title="Addımı Yenilə"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center py-2">
            <div className="text-3xl font-black text-emerald-600 font-mono">
              {state.health.steps.today.toLocaleString()} <span className="text-sm text-slate-500 font-normal">addım</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Gündəlik hədəf: {state.health.steps.target.toLocaleString()} addım
            </div>
          </div>

          <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (state.health.steps.today / state.health.steps.target) * 100)}%` }}
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-100">
            <span className="text-xs font-bold text-slate-600 block">Son Günlərin Qeydləri:</span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {state.health.steps.history.map(st => (
                <div key={st.id} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 font-mono">{st.count.toLocaleString()} addım</span>
                    <span className="text-slate-500 text-[10px] ml-2">{st.date}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">{st.count >= 8000 ? '🔥 Əla Nəticə' : '👍 Yaxşı'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Supplements Daily Protocol Section */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-lg text-slate-900">Gündəlik Takviyə & Müalicə Protokolu</h3>
            </div>
            <p className="text-xs text-slate-500">
              Ferritini qaldırmaq, dərini gözəlləşdirmək və yuxunu yaxşılaşdırmaq üçün gündəlik rejim
            </p>
          </div>

          <button
            onClick={() => setShowAddSupplement(!showAddSupplement)}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Yeni Takviyə Əlavə Et
          </button>
        </div>

        {/* Add Supplement Form */}
        {showAddSupplement && (
          <form onSubmit={handleAddSupplement} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-semibold">Takviyə / Vitamin Adı</label>
                <input
                  type="text"
                  placeholder="məs: Sink, B12 və s."
                  value={newSupplementName}
                  onChange={(e) => setNewSupplementName(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-semibold">Qəbul Vaxtı / Qaydası</label>
                <input
                  type="text"
                  placeholder="məs: Səhər yeməkdən sonra"
                  value={newSupplementTiming}
                  onChange={(e) => setNewSupplementTiming(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddSupplement(false)}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Ləğv et
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Yadda saxla
              </button>
            </div>
          </form>
        )}

        {/* Supplements List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.health.supplements.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition relative group ${
                item.takenToday 
                  ? 'bg-rose-50/90 border-rose-300 shadow-xs' 
                  : 'bg-white border-stone-200 hover:border-rose-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className={`font-bold text-sm ${item.takenToday ? 'text-rose-700 line-through' : 'text-slate-900'}`}>
                    {item.name}
                  </h4>
                  <span className="text-[11px] text-slate-500 block">{item.timing}</span>
                </div>
                <button
                  onClick={() => deleteSupplement(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-2 rounded-xl bg-amber-50/80 text-[10px] text-amber-900 border border-amber-200/80 mb-3 font-medium">
                ⚠️ {item.restriction}
              </div>

              <button
                onClick={() => toggleSupplement(item.id)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  item.takenToday 
                    ? 'bg-rose-500 text-white shadow-xs' 
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {item.takenToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Bugün Qəbul Edildi (+{item.xpReward} XP)
                  </>
                ) : (
                  <>
                    Qəbul etdim
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Ferritin Modal */}
      {showAddFerritin && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900">Yeni Qan Analizi Nəticəsi</h3>
            <form onSubmit={handleAddFerritinTest} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Ferritin Dəyəri (ng/mL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={ferritinInput}
                  onChange={(e) => setFerritinInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-base"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Analiz Tarixi</label>
                <input
                  type="date"
                  value={ferritinDate}
                  onChange={(e) => setFerritinDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Qeyd / Hissiyyat</label>
                <input
                  type="text"
                  placeholder="məs: Enerjim artıb, müalicə yaxşı gedir"
                  value={ferritinNote}
                  onChange={(e) => setFerritinNote(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFerritin(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-xs text-slate-700 hover:bg-stone-200 cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Yadda Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Step Update Modal */}
      {showStepModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900">Bugünkü Addım Sayı</h3>
            <form onSubmit={handleUpdateSteps} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Telefon / Saatdakı Addım</label>
                <input
                  type="number"
                  value={stepInput}
                  onChange={(e) => setStepInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStepModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-xs text-slate-700 hover:bg-stone-200 cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
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
