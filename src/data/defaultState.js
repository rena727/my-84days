export const MOTIVATIONAL_QUOTES = [
  "27 yaşın qələbəsi hər gün atdığın kiçik addımlarla yazılır!",
  "Ferritin qalxır, enerjin qayıdır, hədəflər bir-bir fəth olunur.",
  "Böyük nəticələr sadə gündəlik vərdişlərin təkrarından doğur.",
  "İşə girmək ən böyük təməl idi, indi isə parlamaq vaxtıdır!",
  "Hər gün 5-6 stok seti = İlin sonunda 1000-lik nəhəng portfel!",
  "Dekabr ayı Artlab üçün qızıl aydır. Sənin şamların evləri bəzəyəcək.",
  "84 gün az deyil, bu bir bütöv dəyişim hekayəsidir."
]

export const INITIAL_STATE = {
  profile: {
    name: "Döyüşçü",
    age: 27,
    level: 1,
    xp: 120,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
  health: {
    ferritin: {
      current: 10,
      target: 50,
      history: [
        { id: '1', date: '2026-10-01', value: 10, note: 'Başlanğıc analizi: Çox aşağı, müalicə başladı' }
      ]
    },
    supplements: [
      { id: 's1', name: 'Dəmir takviyəsi (Hemo)', timing: 'Səhər (Acqarına / C vitamini ilə)', restriction: 'Kofe və çaydan 2 saat uzaq!', takenToday: false, xpReward: 25 },
      { id: 's2', name: 'Kollagen', timing: 'Səhər / Dəri & toxuma üçün', restriction: 'Su ilə', takenToday: false, xpReward: 15 },
      { id: 's3', name: 'Maqnezium', timing: 'Axşam / Əzələ və yuxu üçün', restriction: 'Yatmazdan əvvəl', takenToday: false, xpReward: 15 },
      { id: 's4', name: 'D Vitamini', timing: 'Günorta yeməyi ilə', restriction: 'Yağlı qida ilə', takenToday: false, xpReward: 15 },
      { id: 's5', name: 'Balqabaq Tumu', timing: 'Ara öyün (Təbii dəmir mənbəyi)', restriction: 'Çeynəyərək', takenToday: false, xpReward: 10 }
    ],
    water: {
      currentGlasses: 2, // 250ml each
      targetGlasses: 7, // ~1.75 Liters
      logHistory: []
    },
    steps: {
      today: 7500,
      target: 8000,
      history: [
        { id: 'st1', date: '2026-10-07', count: 8400, note: 'Normal gün' },
        { id: 'st2', date: '2026-10-08', count: 7500, note: 'Bugünkü gəzinti' }
      ]
    }
  },
  artlab: {
    brandName: 'Artlab',
    instagramHandle: '@artlab_candles',
    followers: 8,
    targetFollowers: 100,
    salesGoal: 2,
    sales: [],
    reelsIdeas: [
      { id: 'r1', title: 'Qoxulu şamın hazırlanma prosesi (ASMR)', status: 'Hazırlanır', views: 0 },
      { id: 'r2', title: 'Yeni İl hədiyyəlik zərif qutulama', status: 'İdeya', views: 0 },
      { id: 'r3', title: 'Şamın otağa yaydığı relaks qoxusu', status: 'İdeya', views: 0 }
    ]
  },
  stock: {
    shutterstock: {
      current: 561,
      target: 1000,
      dailyTarget: 5
    },
    vecteezy: {
      current: 0,
      target: 200,
      status: 'Təsdiq gözlənilir'
    },
    adobe: {
      current: 0,
      target: 200,
      status: 'Təsdiq gözlənilir'
    },
    uploads: [
      { id: 'u1', date: '2026-10-08', platform: 'Shutterstock', count: 5, description: 'Payız və Yeni İl vektor ikonkaları' }
    ]
  },
  finance: {
    salary: 800,
    currency: 'AZN',
    totalDebt: 1200, // editable
    debtPayoffTargetPercent: 50, // 50%
    debtPayments: [
      { id: 'dp1', date: '2026-10-01', amount: 0, note: 'Başlanğıc borc balansı' }
    ]
  },
  learning: {
    german: {
      streak: 1,
      dailyGoalMinutes: 15,
      wordsLearned: 15,
      vocabulary: [
        { id: 'g1', word: 'Guten Morgen', translation: 'Sabahınız xeyir', example: 'Guten Morgen, wie geht es dir?' },
        { id: 'g2', word: 'Danke schön', translation: 'Çox sağ olun', example: 'Danke schön für deine Hilfe.' },
        { id: 'g3', word: 'Ich schaffe das', translation: 'Mən bunu bacaracam', example: 'Ich schaffe das in 84 Tagen!' },
        { id: 'g4', word: 'Erfolg', translation: 'Uğur / Müvəffəqiyyət', example: 'Viel Erfolg bei der Arbeit.' },
        { id: 'g5', word: 'Gesundheit', translation: 'Sağlamlıq', example: 'Gesundheit ist das Wichtigste.' }
      ]
    },
    books: [
      {
        id: 'b1',
        title: 'Atomik Vərdişlər (və ya Seçdiyin 1-ci Kitab)',
        author: 'James Clear',
        totalPages: 280,
        currentPage: 25,
        status: 'Oxunur',
        notes: 'Kiçik 1%-lik irəliləyişlər böyük nəticələr verir.'
      },
      {
        id: 'b2',
        title: 'Seçdiyin 2-ci Kitab',
        author: 'Müəllif adı',
        totalPages: 250,
        currentPage: 0,
        status: 'Növbədə',
        notes: ''
      }
    ]
  },
  journal: [
    {
      id: 'j1',
      date: '2026-10-08',
      mood: '💪 Məhsuldar',
      wins: 'Sprint 84 planımı qurdum, dəmir müalicəsinə başladım və 7500 addım atdım!',
      lessons: 'Özümü qınamaq yerinə sistem qurmaq daha çox enerji verir.',
      note: 'Bu ilin qalan 84 günündə 27 yaşımı fəxrlə yekunlaşdıracam.'
    }
  ]
}
