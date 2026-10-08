import React, { useState } from 'react'
import { 
  Wallet, 
  TrendingDown, 
  Plus, 
  Trash2, 
  Edit3, 
  PiggyBank, 
  Calendar,
  ShieldCheck
} from 'lucide-react'
import { triggerConfetti } from '../utils/confetti'

export default function FinanceView({ state, updateState, onAddXP }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [payAmount, setPayAmount] = useState('')
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0])
  const [payNote, setPayNote] = useState('')

  const [showDebtConfig, setShowDebtConfig] = useState(false)
  const [totalDebtInput, setTotalDebtInput] = useState(state.finance.totalDebt)
  const [salaryInput, setSalaryInput] = useState(state.finance.salary)
  const [targetPercentInput, setTargetPercentInput] = useState(state.finance.debtPayoffTargetPercent)

  // Log Payment
  const handleLogPayment = (e) => {
    e.preventDefault()
    const amount = Number(payAmount)
    if (isNaN(amount) || amount <= 0) return

    const newPayment = {
      id: 'pay_' + Date.now(),
      date: payDate,
      amount: amount,
      note: payNote || 'Borc ödənişi'
    }

    const nextPayments = [newPayment, ...state.finance.debtPayments]
    updateState({
      finance: {
        ...state.finance,
        debtPayments: nextPayments
      }
    })

    setShowPaymentModal(false)
    setPayAmount('')
    setPayNote('')
    triggerConfetti()
    onAddXP(Math.round(amount / 5), `${amount} AZN borc ödənildi! Möhtəşəm irəliləyiş!`)
  }

  // Delete payment
  const deletePayment = (id) => {
    const nextPayments = state.finance.debtPayments.filter(p => p.id !== id)
    updateState({
      finance: {
        ...state.finance,
        debtPayments: nextPayments
      }
    })
  }

  // Save Debt Configuration
  const handleSaveDebtConfig = (e) => {
    e.preventDefault()
    updateState({
      finance: {
        ...state.finance,
        totalDebt: Number(totalDebtInput) || 1200,
        salary: Number(salaryInput) || 800,
        debtPayoffTargetPercent: Number(targetPercentInput) || 50
      }
    })
    setShowDebtConfig(false)
    triggerConfetti()
    onAddXP(20, 'Maliyyə planı tənzimləndi!')
  }

  const totalPaid = state.finance.debtPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0)
  const totalDebt = state.finance.totalDebt || 1200
  const remainingDebt = Math.max(0, totalDebt - totalPaid)
  const targetToPay = Math.round(totalDebt * (state.finance.debtPayoffTargetPercent / 100))
  const targetProgress = Math.min(100, Math.round((totalPaid / (targetToPay || 1)) * 100))

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-100/80 via-teal-50 to-green-50 border border-emerald-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4" /> 4-cü Təməl Sütun · Maliyyə Azadlığı
          </div>
          <h2 className="text-2xl font-black text-slate-900">Maliyyə & Borcun 50%-ni Bağlamaq Planı</h2>
          <p className="text-xs text-slate-600">
            Maaşın var (800 AZN)! Qarşıdakı 3 ayda borcu yarıya endirərək 2027-yə yüngül və güclü daxil oluruq.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> + Ödəniş Qeyd Et
          </button>
          <button
            onClick={() => setShowDebtConfig(true)}
            className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 text-slate-700 text-xs font-bold border border-stone-300 shadow-2xs cursor-pointer"
            title="Məbləğləri redaktə et"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Debt & Target */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold">Borc & 50% Hədəfi</span>
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700"><TrendingDown className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{totalPaid}</span>
            <span className="text-xs text-slate-500 font-mono font-medium">/ {targetToPay} AZN hədəf</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${targetProgress}%` }} 
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Ödənilən: {targetProgress}%</span>
            <span className="text-emerald-700 font-bold">Qalan Hədəf: {Math.max(0, targetToPay - totalPaid)} AZN</span>
          </div>
        </div>

        {/* Remaining Total Debt */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold">Qalan Ümumi Borc</span>
            <span className="p-2 rounded-xl bg-rose-100 text-rose-600"><Wallet className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 font-mono">{remainingDebt}</span>
            <span className="text-xs text-slate-500 font-medium">AZN</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Ümumi başlanğıc: {totalDebt} AZN (50% = {targetToPay} AZN)
          </p>
        </div>

        {/* Monthly Income */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold">Aylıq Əməkhaqqı</span>
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700"><PiggyBank className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600 font-mono">{state.finance.salary}</span>
            <span className="text-xs text-slate-500 font-medium">AZN / ay</span>
          </div>
          <p className="text-[11px] text-slate-500">
            3 ay (Oktyabr, Noyabr, Dekabr) = 2400 AZN dövriyyə
          </p>
        </div>

      </div>

      {/* Payment History & Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Payment History */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-lg text-slate-900">Ödəniş Tarixçəsi</h3>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="text-xs text-emerald-700 hover:underline font-bold cursor-pointer"
            >
              + Ödəniş Əlavə Et
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {state.finance.debtPayments.map(p => (
              <div key={p.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-700 font-mono text-base">-{p.amount} AZN</span>
                    <span className="text-xs text-slate-400">· {p.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{p.note || 'Borc ödəməsi'}</p>
                </div>
                <button
                  onClick={() => deletePayment(p.id)}
                  className="text-slate-400 hover:text-rose-600 p-2 cursor-pointer"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Month Strategy */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> 3 Aylıq Qızıl Bölüşdürmə
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <strong className="text-amber-800 block font-bold">1. Maaş Gələn Gün:</strong>
              Maaş hesaba oturan kimi borc üçün ayrılan məbləği dərhal ödə və ya ayrı karta keçir. Gözlətmə!
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <strong className="text-emerald-800 block font-bold">2. Artlab & Stok Əlavələri:</strong>
              Şam satışlarından və stokdan gələn hər qəpik birbaşa sənin əlavə sərbəst pulundur!
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <strong className="text-blue-800 block font-bold">3. 50% İxtisar:</strong>
              İlin sonuna 50% bağlamaq möhtəşəm psixoloji rahatlıq və güc verəcək.
            </div>
          </div>
        </div>

      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900">Borc Ödənişini Qeyd Et 💰</h3>
            <form onSubmit={handleLogPayment} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Ödənilən Məbləğ (AZN)</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="məs: 150"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-lg"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Ödəniş Tarixi</label>
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Qeyd (Kimə / Hansı borc üçün)</label>
                <input
                  type="text"
                  placeholder="məs: Kredit kartı / Şəxsi borc"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-xs text-slate-700 hover:bg-stone-200 cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Ödənişi Yadda Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Debt Config Modal */}
      {showDebtConfig && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900">Maliyyə Rəqəmlərini Dəqiqləşdir</h3>
            <form onSubmit={handleSaveDebtConfig} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Ümumi Borc Məbləği (AZN)</label>
                <input
                  type="number"
                  value={totalDebtInput}
                  onChange={(e) => setTotalDebtInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Aylıq Əməkhaqqı (AZN)</label>
                <input
                  type="number"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">İl Sonu Bağlama Hədəfi (%)</label>
                <input
                  type="number"
                  value={targetPercentInput}
                  onChange={(e) => setTargetPercentInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDebtConfig(false)}
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
