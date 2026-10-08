import React, { useState, useEffect } from 'react'
import { 
  Languages, 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw, 
  Trash2, 
  Edit3
} from 'lucide-react'
import { triggerConfetti } from '../utils/confetti'

export default function LearningView({ state, updateState, onAddXP }) {
  // German Timer state (15 mins = 900 secs)
  const [timerSeconds, setTimerSeconds] = useState(15 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // New German Word state
  const [showAddWord, setShowAddWord] = useState(false)
  const [newWord, setNewWord] = useState('')
  const [newTranslation, setNewTranslation] = useState('')
  const [newExample, setNewExample] = useState('')

  // Book Edit Modal state
  const [editingBook, setEditingBook] = useState(null)
  const [showAddBook, setShowAddBook] = useState(false)
  const [newBookTitle, setNewBookTitle] = useState('')
  const [newBookAuthor, setNewBookAuthor] = useState('')
  const [newBookTotalPages, setNewBookTotalPages] = useState(250)

  // Timer effect
  useEffect(() => {
    let interval = null
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1)
      }, 1000)
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      triggerConfetti()
      onAddXP(50, '15 Dəqiqəlik Alman Dili fokus sessiyası tamamlandı! 🎉')
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timerSeconds])

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Add German Word
  const handleAddWord = (e) => {
    e.preventDefault()
    if (!newWord.trim() || !newTranslation.trim()) return

    const newEntry = {
      id: 'g_' + Date.now(),
      word: newWord,
      translation: newTranslation,
      example: newExample || ''
    }

    const updatedVocab = [newEntry, ...state.learning.german.vocabulary]
    updateState({
      learning: {
        ...state.learning,
        german: {
          ...state.learning.german,
          vocabulary: updatedVocab
        }
      }
    })

    setNewWord('')
    setNewTranslation('')
    setNewExample('')
    setShowAddWord(false)
    triggerConfetti()
    onAddXP(10, `Yeni Alman sözü əlavə edildi: ${newWord}`)
  }

  // Delete German Word
  const deleteWord = (id) => {
    const updatedVocab = state.learning.german.vocabulary.filter(w => w.id !== id)
    updateState({
      learning: {
        ...state.learning,
        german: {
          ...state.learning.german,
          vocabulary: updatedVocab
        }
      }
    })
  }

  // Update Book progress
  const updateBookPages = (bookId, newPage) => {
    const updatedBooks = state.learning.books.map(b => {
      if (b.id === bookId) {
        const pages = Math.min(b.totalPages, Math.max(0, Number(newPage) || 0))
        const isFinished = pages >= b.totalPages
        return { 
          ...b, 
          currentPage: pages,
          status: isFinished ? 'Bitdi' : 'Oxunur'
        }
      }
      return b
    })

    updateState({
      learning: {
        ...state.learning,
        books: updatedBooks
      }
    })

    const currentBook = state.learning.books.find(b => b.id === bookId)
    if (Number(newPage) >= (currentBook?.totalPages || 0)) {
      triggerConfetti()
      onAddXP(100, `TƏBRİKLƏR! "${currentBook.title}" kitabını bitirdin! 📚`)
    } else {
      onAddXP(15, `Kitab səhifəsi yeniləndi: ${newPage}/${currentBook?.totalPages}`)
    }
  }

  // Save Book edit
  const handleSaveBookEdit = (e) => {
    e.preventDefault()
    if (!editingBook) return
    const updatedBooks = state.learning.books.map(b => b.id === editingBook.id ? editingBook : b)
    updateState({
      learning: {
        ...state.learning,
        books: updatedBooks
      }
    })
    setEditingBook(null)
  }

  // Add new custom book
  const handleAddBook = (e) => {
    e.preventDefault()
    if (!newBookTitle.trim()) return
    const newBook = {
      id: 'b_' + Date.now(),
      title: newBookTitle,
      author: newBookAuthor || 'Müəllif',
      totalPages: Number(newBookTotalPages) || 250,
      currentPage: 0,
      status: 'Növbədə',
      notes: ''
    }
    updateState({
      learning: {
        ...state.learning,
        books: [...state.learning.books, newBook]
      }
    })
    setNewBookTitle('')
    setNewBookAuthor('')
    setShowAddBook(false)
  }

  // Delete Book
  const deleteBook = (id) => {
    const updatedBooks = state.learning.books.filter(b => b.id !== id)
    updateState({
      learning: {
        ...state.learning,
        books: updatedBooks
      }
    })
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-100/80 via-teal-50 to-indigo-50 border border-blue-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Languages className="w-4 h-4" /> 5-ci & 6-cı Təməl Sütun · Şəxsi İnkişaf
          </div>
          <h2 className="text-2xl font-black text-slate-900">Alman Dili & 2 Kitab Bitirmə Hədəfi</h2>
          <p className="text-xs text-slate-600">
            Gündəlik cəmi 15 dəqiqə Alman dili və 8-10 səhifə kitabla 84 gün sonra inanılmaz bir intellektual baza qazanırsan.
          </p>
        </div>
      </div>

      {/* Grid: German & Books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* German Section */}
        <div className="space-y-6">
          
          {/* German 15-min Focus Timer */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Gündəlik 15 Dəqiqə Alman Dili</h3>
                  <span className="text-xs text-slate-500">Fokus Timer & Səs Təcrübəsi</span>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">
                Duolingo + Baza Sözlər
              </span>
            </div>

            <div className="text-center py-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
              <div className="text-5xl font-black font-mono text-blue-700 tracking-wider">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {isTimerRunning ? '🔥 Fokus rejimi aktivdir! Danış və təkrar et.' : '15 dəqiqəlik seansı başlat'}
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer ${
                    isTimerRunning 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  }`}
                >
                  {isTimerRunning ? <><Pause className="w-4 h-4" /> Pauza</> : <><Play className="w-4 h-4" /> Başla</>}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false)
                    setTimerSeconds(15 * 60)
                  }}
                  className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-slate-600 border border-stone-200 cursor-pointer"
                  title="Sıfırla"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Vocabulary Flashcards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Baza Sözlər & İfadə Bankı ({state.learning.german.vocabulary.length})</span>
                <button
                  onClick={() => setShowAddWord(!showAddWord)}
                  className="text-xs text-blue-700 hover:underline font-bold cursor-pointer"
                >
                  + Yeni Söz Əlavə Et
                </button>
              </div>

              {showAddWord && (
                <form onSubmit={handleAddWord} className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Almanca söz (məs: Schön)"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Tərcüməsi (məs: Gözəl)"
                      value={newTranslation}
                      onChange={(e) => setNewTranslation(e.target.value)}
                      className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Nümunə cümlə (İstəyə bağlı)"
                    value={newExample}
                    onChange={(e) => setNewExample(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddWord(false)}
                      className="px-3 py-1 rounded-lg bg-white border border-stone-200 text-xs text-slate-600 cursor-pointer"
                    >
                      Ləğv et
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer"
                    >
                      Əlavə et
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {state.learning.german.vocabulary.map(item => (
                  <div key={item.id} className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2 group shadow-2xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm font-mono">{item.word}</span>
                        <span className="text-xs text-blue-700 font-bold">→ {item.translation}</span>
                      </div>
                      {item.example && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">{item.example}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteWord(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Books Reading Section */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4 border-teal-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">2 Kitab Hədəfi (İl Sonu)</h3>
                  <span className="text-xs text-slate-500">Gündə cəmi 8-10 səhifə oxu</span>
                </div>
              </div>
              <button
                onClick={() => setShowAddBook(!showAddBook)}
                className="text-xs text-teal-700 hover:underline font-bold cursor-pointer"
              >
                + Kitab Əlavə Et
              </button>
            </div>

            {/* Add Book Form */}
            {showAddBook && (
              <form onSubmit={handleAddBook} className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
                <input
                  type="text"
                  placeholder="Kitabın adı"
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Müəllif"
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                  />
                  <input
                    type="number"
                    placeholder="Səhifə sayı (məs: 250)"
                    value={newBookTotalPages}
                    onChange={(e) => setNewBookTotalPages(e.target.value)}
                    className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBook(false)}
                    className="px-3 py-1 rounded-lg bg-white border border-stone-200 text-xs text-slate-600 cursor-pointer"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-teal-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Yadda saxla
                  </button>
                </div>
              </form>
            )}

            {/* Books List */}
            <div className="space-y-4">
              {state.learning.books.map((book, idx) => {
                const percent = Math.min(100, Math.round((book.currentPage / (book.totalPages || 1)) * 100))
                const remaining = Math.max(0, book.totalPages - book.currentPage)
                const pagesPerDay = Math.ceil(remaining / 84)

                return (
                  <div key={book.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 shadow-2xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                            Kitab #{idx + 1}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            book.currentPage >= book.totalPages 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {book.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{book.title}</h4>
                        <p className="text-xs text-slate-500">{book.author}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingBook(book)}
                          className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-slate-700 border border-stone-200 cursor-pointer"
                          title="Redaktə et"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-slate-400 hover:text-rose-600 border border-stone-200 cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-500 font-mono font-medium">{book.currentPage} / {book.totalPages} səhifə</span>
                        <span className="text-teal-700 font-bold font-mono">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }} 
                        />
                      </div>
                    </div>

                    {/* Quick Page Update & Daily Calc */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="text-[11px] text-slate-500">
                        Qalan: <span className="text-slate-800 font-bold">{remaining} səh</span> (~{pagesPerDay} səh/gün)
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateBookPages(book.id, book.currentPage + 5)}
                          className="px-2.5 py-1 bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          +5 səh
                        </button>
                        <button
                          onClick={() => updateBookPages(book.id, book.currentPage + 10)}
                          className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                        >
                          +10 səh
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Book Edit Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900">Kitab Məlumatlarını Redaktə Et</h3>
            <form onSubmit={handleSaveBookEdit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Kitabın Adı</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Müəllif</label>
                <input
                  type="text"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Oxunmuş Səhifə</label>
                  <input
                    type="number"
                    value={editingBook.currentPage}
                    onChange={(e) => setEditingBook({ ...editingBook, currentPage: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Ümumi Səhifə</label>
                  <input
                    type="number"
                    value={editingBook.totalPages}
                    onChange={(e) => setEditingBook({ ...editingBook, totalPages: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-xs text-slate-700 hover:bg-stone-200 cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer shadow-xs"
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
