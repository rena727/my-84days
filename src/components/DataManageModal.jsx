import React, { useState } from 'react'
import { 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle, 
  X
} from 'lucide-react'
import { exportDataAsJSON } from '../utils/storage'
import { triggerConfetti } from '../utils/confetti'

export default function DataManageModal({ isOpen, onClose, state, updateState, onResetAll }) {
  const [name, setName] = useState(state.profile.name)
  const [shutterTarget, setShutterTarget] = useState(state.stock.shutterstock.target)
  const [salesGoal, setSalesGoal] = useState(state.artlab.salesGoal)
  const [targetDebtPercent, setTargetDebtPercent] = useState(state.finance.debtPayoffTargetPercent)
  const [waterTarget, setWaterTarget] = useState(state.health.water.targetGlasses)
  const [stepsTarget, setStepsTarget] = useState(state.health.steps.target)

  if (!isOpen) return null

  const handleSaveProfileAndGoals = (e) => {
    e.preventDefault()
    updateState({
      profile: {
        ...state.profile,
        name: name
      },
      stock: {
        ...state.stock,
        shutterstock: {
          ...state.stock.shutterstock,
          target: Number(shutterTarget) || 1000
        }
      },
      artlab: {
        ...state.artlab,
        salesGoal: Number(salesGoal) || 2
      },
      finance: {
        ...state.finance,
        debtPayoffTargetPercent: Number(targetDebtPercent) || 50
      },
      health: {
        ...state.health,
        water: {
          ...state.health.water,
          targetGlasses: Number(waterTarget) || 7
        },
        steps: {
          ...state.health.steps,
          target: Number(stepsTarget) || 8000
        }
      }
    })
    triggerConfetti()
    onClose()
  }

  // Handle JSON Import
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result)
        updateState(imported)
        alert('Məlumatlar uğurla bərpa edildi!')
        onClose()
      } catch (err) {
        alert('JSON faylı oxunarkən xəta baş verdi!')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-xl w-full space-y-6 my-8 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Hədəf və Məlumat İdarəsi</h3>
              <p className="text-xs text-slate-500">Bütün parametrləri istədiyin vaxt dəyiş və ya nüsxəsini saxla</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Goals Form */}
        <form onSubmit={handleSaveProfileAndGoals} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">Ad / Təxəllüs</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">Shutterstock Set Hədəfi</label>
              <input
                type="number"
                value={shutterTarget}
                onChange={(e) => setShutterTarget(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">Artlab Şam Satış Hədəfi</label>
              <input
                type="number"
                value={salesGoal}
                onChange={(e) => setSalesGoal(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">Borc İxtisar Hədəfi (%)</label>
              <input
                type="number"
                value={targetDebtPercent}
                onChange={(e) => setTargetDebtPercent(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">Gündəlik Su Hədəfi (stəkan)</label>
              <input
                type="number"
                value={waterTarget}
                onChange={(e) => setWaterTarget(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">Gündəlik Addım Hədəfi</label>
              <input
                type="number"
                value={stepsTarget}
                onChange={(e) => setStepsTarget(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-rose-400/25 cursor-pointer"
            >
              Yenilikləri Yadda Saxla
            </button>
          </div>
        </form>

        {/* Backup / Export / Import */}
        <div className="pt-4 border-t border-stone-100 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Məlumatların Ehtiyat Nüsxəsi (Backup)</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => exportDataAsJSON(state)}
              className="px-4 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 border border-stone-200 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              Məlumatları Yüklə (Export JSON)
            </button>

            <label className="px-4 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 border border-stone-200 cursor-pointer">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Nüsxəni Bərpa Et (Import)</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>

        {/* Danger Zone / Reset */}
        <div className="pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" /> Bütün Məlumatları Sıfırla
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                İlk standart vəziyyətə qaytarmaq üçün
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Bütün qeydlərinizi ilkin standart vəziyyətə qaytarmaq istədiyinizdən əminsiniz?')) {
                  onResetAll()
                  onClose()
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Tam Sıfırla
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
