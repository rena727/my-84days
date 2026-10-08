# 👑 Sprint 84 · 27 Yaş Qələbəsi & Hədəf Paneli

2026-cı ilin son 84 günündə (8 Oktyabr – 31 Dekabr) bütün hədəfləri fəth etmək üçün fərdi, oyunlaşdırılmış və estetik veb tətbiq.

---

## 🌟 Əsas Bölmələr və Funksionallıqlar

1. **⏱️ Canlı Geri Sayım & Gamification (XP / Level / Streak):**
   - 2026-cı ilin bitməsinə qalan gün, saat, dəqiqə və saniyələr.
   - Hər yerinə yetirilən tapşırıqda XP qazanmaq, səviyyə yüksəlməsi və bayram atəşfəşanlığı (Confetti).
   - Günün motivasiyaedici şüarları.

2. **🩺 Sağlamlıq & Enerji (Ferritin 10 Bərpası):**
   - **Ferritin Analiz İzləyicisi:** Nəticələri qeyd etmək, qrafik tərəqqi və analiz tarixçəsi.
   - **Gündəlik Takviyə Protokolu:** Dəmir takviyəsi (Hemo), Kollagen, Maqnezium, D Vitamini, Balqabaq tumu.
   - **Qızıl Qayda:** Kofe və çaydan 2 saat fasilə xəbərdarlığı.
   - **İnteraktiv Su İzləyicisi:** 7 stəkan (~1.75L) vizual stəkanlar.
   - **Addım İzləyicisi:** 6,000 - 12,000 addım qeydiyyatı.

3. **🕯️ Artlab — Qoxulu Şamlar & Satış Paneli:**
   - İlk 1-2 real satış hədəfi izləyicisi.
   - Satış qeydiyyatı (Müştəri, qoxu, qiymət AZN, tarix, qeyd).
   - Toplam gəlir kalkulyatoru.
   - Instagram izləyici sayğacı və Reels ideya bankı.

4. **🎨 Stok Portfeli (1000 Set Hədəfi):**
   - **Shutterstock:** 561-dən 1000-ə çatma sayğacı (gündə ~5 set).
   - **Adobe Stock & Vecteezy:** Təsdiq və yükləmə statusu.
   - **Cross-Upload Qeydiyyatı:** Bir kliklə gündəlik yükləmələri qeyd etmək.

5. **💰 Maliyyə & Borcun 50%-ni Bağlamaq:**
   - 800 AZN aylıq əməkhaqqı üzərindən 3 aylıq büdcə planı.
   - Borc ödənişlərini daxil etmək və qalan balansı izləmək.

6. **📚 Şəxsi İnkişaf (Alman Dili & 2 Kitab):**
   - **Alman Dili 15 Dəqiqəlik Fokus Timeri** + Səs/lüğət kartları (Flashcards).
   - **2 Kitab Tərəqqisi:** Səhifə sayğacı, gündəlik oxu tempi və qeydlər.

7. **📖 Mənim Günlüyüm (Şəxsi Diary):**
   - Gündəlik əhval-ruhiyyə (Mood).
   - "Bugünkü Qələbələrim", "Öyrəndiyim Dərs", "Sərbəst Qeydlərim".
   - Bütün keçmiş günləri axtarmaq, redaktə etmək və silmək.

8. **⚙️ Tam CRUD & JSON Backup:**
   - Hər bir elementi birbaşa redaktə etmək və ya silmək.
   - Export JSON (məlumatları kompüterə yükləmək) və Import JSON (bərpa etmək).

---

## 🚀 Lokal İşə Salma

```bash
# Layihə qovluğuna keçin:
cd C:\Users\User\.gemini\antigravity\scratch\sprint84

# Veb tətbiqi başladın:
npm run dev
```

Brauzerinizdə `http://localhost:5173` ünvanını açın!

---

## 🌐 Vercel-də Pulsuz Deploy Etmək

### Variant 1: GitHub vasitəsilə (Tövsiyə olunan)
1. Bu qovluğu GitHub-da yeni bir repoya push edin (`git init`, `git add .`, `git commit -m "feat: sprint84"`, `git push`).
2. [vercel.com](https://vercel.com) saytına daxil olub **"Add New Project"** seçin.
3. Reponu seçin və **"Deploy"** düyməsinə basın!

### Variant 2: Vercel CLI ilə birbaşa terminaldan
```bash
npm i -g vercel
vercel
```
