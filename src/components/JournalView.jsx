import React, { useState } from 'react'
import { 
  PenTool, 
  Sparkles, 
  Calendar, 
  Trash2, 
  Edit3, 
  Search
} from 'lucide-react'
import { triggerConfetti } from '../utils/confetti'

const MOODS = [
  { label: '🌟 Möhtəşəm', color: 'amber' },
  { label: '💪 Məhsuldar', color: 'emerald' },
  { label: '🌿 Sakit & Dinc', color: 'blue' },
  { label: '😴 Yorğun amma davam', color: 'purple' },
  { label: '⚡ Yenidən başladım', color: 'rose' }
]

export default function JournalView({ state, updateState, onAddXP }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedMood, setSelectedMood] = useState('💪 Məhsuldar')
  const [wins, setWins] = useState('')
  const [lessons, setLessons] = useState('')
  const [note, setNote] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [editingEntry, setEditingEntry] = useState(null)

  // Save new journal entry
  const handleSaveEntry = (e) => {
    e.preventDefault()
    if (!wins.trim() && !note.trim()) return

    const newEntry = {
      id: 'j_' + Date.now(),
      date: date,
      mood: selectedMood,
      wins: wins,
      lessons: lessons,
      note: note
    }

    const filtered = state.journal.filter(j => j.date !== date)
    const nextJournal = [newEntry, ...filtered]

    updateState({
      journal: nextJournal
    })

    setWins('')
    setLessons('')
    setNote('')

    triggerConfetti()
    onAddXP(50, 'Gündəlik qeyd olundu! +50 XP 📖')
  }

  // Delete journal entry
  const deleteEntry = (id) => {
    const nextJournal = state.journal.filter(j => j.id !== id)
    updateState({
      journal: nextJournal
    })
  }

  // Update existing entry
  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editingEntry) return
    const nextJournal = state.journal.map(j => j.id === editingEntry.id ? editingEntry : j)
    updateState({
      journal: nextJournal
    })
    setEditingEntry(null)
  }

  const filteredEntries = state.journal.filter(entry => 
    (entry.wins && entry.wins.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (entry.note && entry.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (entry.date && entry.date.includes(searchTerm)) ||
    (entry.mood && entry.mood.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-rose-100/80 via-purple-50 to-pink-50 border border-rose-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1">
            <PenTool className="w-4 h-4" /> Şəxsi Günlük & Zehni Təmizlik
          </div>
          <h2 className="text-2xl font-black text-slate-900">Mənim 84 Günlük Səyahət Günlüyüm</h2>
          <p className="text-xs text-slate-600">
            Hər günün kiçik qələbəsini, hisslərini və dərslərini bura yaz. 27 yaşını fəxrlə bitirəcəyin gün bütün bu yolu oxuyub qürur duyacaqsan!
          </p>
        </div>
      </div>

      {/* Grid: Editor & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Journal Entry Form */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-lg text-slate-900">Bugünkü Qeyd</h3>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1 text-xs text-slate-800 font-semibold"
            />
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-4">
            
            {/* Mood Selector */}
            <div>
              <label className="text-xs text-slate-600 font-bold block mb-2">Bugünkü Əhval-Ruhiyyəm:</label>
              <div className="flex flex-wrap gap-1.5">
                {MOODS.map(m => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setSelectedMood(m.label)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedMood === m.label 
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs' 
                        : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border border-stone-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wins of the day */}
            <div>
              <label className="text-xs text-amber-900 font-bold block mb-1">
                🏆 Bugünkü Qələbələrim (Nəyi bacardım?):
              </label>
              <textarea
                rows={2}
                placeholder="məs: 5 stok seti yüklədim, dəmiri qəbul etdim, 8 min addım atdım..."
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                required
              />
            </div>

            {/* Lessons */}
            <div>
              <label className="text-xs text-blue-900 font-bold block mb-1">
                💡 Öyrəndiyim Dərs / Fərqinə Vardığım Şey:
              </label>
              <textarea
                rows={2}
                placeholder="məs: Kofedən sonra su içmək dərhal enerjimi bərpa etdi..."
                value={lessons}
                onChange={(e) => setLessons(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* Free Note */}
            <div>
              <label className="text-xs text-purple-900 font-bold block mb-1">
                💭 Sərbəst Düşüncələrim / Ürək Sözüm:
              </label>
              <textarea
                rows={2}
                placeholder="məs: Hər şey qaydasına düşür, addım-addım irəliləyirəm..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-xs shadow-md shadow-rose-400/25 transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Günlüyə Qeyd Et (+50 XP)
            </button>
          </form>
        </div>

        {/* Right: History & Search */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-lg text-slate-900">Günlük Tarixçəsi ({state.journal.length})</h3>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Qeydlərdə axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 w-full sm:w-48 focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                Heç bir qeyd tapılmadı.
              </div>
            ) : (
              filteredEntries.map(entry => (
                <div key={entry.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 group shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white text-slate-800 font-bold border border-stone-200 shadow-2xs">
                        {entry.mood}
                      </span>
                      <span className="text-xs text-slate-500 font-mono font-medium">{entry.date}</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => setEditingEntry(entry)}
                        className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-slate-700 border border-stone-200 cursor-pointer"
                        title="Redaktə et"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-slate-400 hover:text-rose-600 border border-stone-200 cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {entry.wins && (
                    <div className="text-xs text-slate-800">
                      <strong className="text-amber-800 font-bold">🏆 Qələbə:</strong> {entry.wins}
                    </div>
                  )}

                  {entry.lessons && (
                    <div className="text-xs text-slate-700">
                      <strong className="text-blue-800 font-bold">💡 Dərs:</strong> {entry.lessons}
                    </div>
                  )}

                  {entry.note && (
                    <div className="text-xs text-slate-600 italic">
                      "{entry.note}"
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Edit Entry Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900">Qeydi Redaktə Et ({editingEntry.date})</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Əhval</label>
                <select
                  value={editingEntry.mood}
                  onChange={(e) => setEditingEntry({ ...editingEntry, mood: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                >
                  {MOODS.map(m => (
                    <option key={m.label} value={m.label}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Qələbələr</label>
                <textarea
                  rows={2}
                  value={editingEntry.wins}
                  onChange={(e) => setEditingEntry({ ...editingEntry, wins: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Dərs</label>
                <textarea
                  rows={2}
                  value={editingEntry.lessons}
                  onChange={(e) => setEditingEntry({ ...editingEntry, lessons: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Qeyd</label>
                <textarea
                  rows={2}
                  value={editingEntry.note}
                  onChange={(e) => setEditingEntry({ ...editingEntry, note: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-xs text-slate-700 hover:bg-stone-200 cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Yadda saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
