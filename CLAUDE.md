# Teste EN — index personal al subiectelor de Evaluare Națională

Instrucțiunile proiectului pentru Claude Code. Aspectul e în `DESIGN.md`; ecranele de referință sunt în `reference/html` (deschizi fișierele în browser) și `reference/png`.

## Ce construim

O aplicație web statică pentru un singur utilizator (eu, profesor de matematică). Listează testele și subiectele de Evaluare Națională la matematică de pe e3.ro, le filtrează pe an, subiect și exercițiu, și ține evidența a ce am dat fiecărei grupe de elevi. Fișierele PDF rămân pe e3.ro: aplicația doar trimite la ele.

## Reguli de neîncălcat

- **Nu copia, nu descărca și nu găzdui PDF-urile.** Aplicația păstrează doar metadate (an, tip, nume, adresa fișierului) și deschide PDF-ul original de pe e3.ro într-un tab nou (`target="_blank" rel="noopener noreferrer"`).
- **Nu folosi numele, logo-ul sau identitatea e3.ro.** Aplicația se numește „Teste EN”. Pagina „Despre și surse” spune clar că tot conținutul aparține e3.ro (prof. Valeriu Mocanu) și autorilor testelor, cu link la https://www.e3.ro.
- **Doar Evaluarea Națională.** Fără Bacalaureat, fără testele de clasa a VI-a.
- **Un singur utilizator:** fără conturi, login, backend sau bază de date.
- **Tot ce modific se salvează doar local**, în browser (`localStorage`). Aplicația nu trimite date nicăieri.
- **Public, dar neindexat:** `<meta name="robots" content="noindex, nofollow">` și `public/robots.txt` cu `User-agent: *` / `Disallow: /`.
- **Datele se iau o singură dată:** scriptul de mai jos rulează doar când îl pornesc eu și face o singură cerere la pagină.
- Nu adăuga funcții care nu sunt în acest fișier.

## Mediul meu

- Windows, PowerShell. WSL nu merge pe calculatorul meu: nu-l folosi.
- Lucrez din VS Code. Comenzile pe care trebuie să le rulez eu, scrie-le pentru PowerShell și spune-mi exact ce să tastez.

## Stack

- Vue 3 + Vite, JavaScript (fără TypeScript), `vue-router` în mod hash (merge pe GitHub Pages fără configurare de server).
- Fără librării de componente UI: CSS propriu, cu tokenii din `DESIGN.md` ca variabile CSS.
- Node.js 20 sau mai nou. Pentru scriptul de date: `cheerio`.

## Datele

**Sursa:** https://www.e3.ro/teste-evaluare-nationala-2022/ — o singură pagină cu toți anii, 2027–2020, deși adresa zice „2022”.

**Cum e făcută pagina:**
- Pentru fiecare an există un tabel „TESTE și BAREME <an>” (primul rând e antetul). Prima coloană e numele testului, cu link la PDF-ul subiectului. Coloana „BAREM” are link sau „–” când baremul lipsește. La 2021 (A) mai există o coloană „grila”.
- Alături stă tabelul „SUBIECTE <an>”, cu linkurile „Subiect I.1” … „Subiect III.6”. Fiecare duce la un PDF cu toate variantele acelui exercițiu din anul respectiv. La 2021 (A) etichetele arată așa: „SUBIECTUL II. Exercitiul 3 (VI, triunghiul)”, adică au clasa și tema.
- Anul 2021 are trei seturi: **A** (teste, bareme și grilă, plus tabel de subiecte), **B** (testele 1–20 și subiectele lor, fără barem) și **C** (testele 21–40 și subiectele lor, fără barem). La B și C testele și subiectele stau în același tabel, pe două coloane.
- 2027 nu are încă subiecte pe exerciții („–”).

**Rânduri de date per tabel de teste** (fără antet; numărate pe 18 nov. 2026, pot include câte un rând de subtitlu): 2027: 2 · 2026: 34 · 2025: 23 · 2024: 23 · 2023: 33 · 2022: 14 · 2021 (A): 18 · 2021 (B): 20 · 2021 (C): 20 · 2020: 41.

**Scriptul `scripts/scrape-e3.mjs`** (`npm run data`):
- face o singură cerere la pagină, o parsează cu `cheerio` și scrie `src/data/en.json`, cu data actualizării;
- **teste:** `id`, `an`, `set` (`"A"`/`"B"`/`"C"` sau `null`), `numeOriginal`, `nume` (același text, cu spațiile normalizate și majuscule consecvente, de ex. „MODEL TEST 9. 2021” → „Model test 9 · 2021”; nu inventa informații care nu sunt în text), `tip` (`Examen` dacă textul conține „EXAMEN” sau „EVALUAREA NAȚIONALĂ”; `Simulare` pentru „SIMULARE”; `Model` pentru „MODEL”; altfel `Test`), `urlSubiect`, `urlBarem` (sau `null`), `urlGrila` (sau `null`);
- **subiecte:** `id`, `an`, `set`, `subiect` (`I`/`II`/`III`), `exercitiu` (1–6), `clasa` și `tema` doar dacă există în etichetă, `url`;
- **programa:** linkul „Programa EVALUARE NATIONALA” din meniul site-ului;
- la final tipărește un **raport**: rândurile găsite per tabel față de numerele de mai sus, linkurile lipsă și rândurile pe care nu le-a putut încadra;
- `src/data/overrides.json` (gol la început, `{}`) îmi permite să corectez de mână `nume` sau `tip` pentru un `id`; aplicația îl aplică peste `en.json`.

## Ecranele

Arată exact ca în `reference/` și `DESIGN.md`, cu diferențele de mai jos.

1. **Subiecte pe exerciții** (`#/subiecte`, pagina de start)
   - Filtre: an (2027–2020, implicit cel mai recent an care are subiecte), subiect (Toate / I / II / III), exercițiu (Toate / 1–6). La 2021 apare și un rând „Set”: Toate / A / B / C.
   - Filtrele se văd în adresă (`#/subiecte?an=2021&s=II&ex=3`), ca să meargă butonul Înapoi și refresh-ul.
   - Rezumatul („2021 · Subiectul II · Exercițiul 3 · 3 rezultate”) și „Resetează filtrele”.
   - Tabele grupate pe subiect. Coloane: Ex., Temă (insigna doar unde există în date), starea pentru grupa selectată („Făcut · dată” sau „—”), acțiuni.
   - Selectorul „Arată ce a făcut: <grupa>” și bara de progres „X / 18” pentru grupa și anul selectate.
2. **Teste și bareme** (`#/teste`)
   - Filtre: an și tip (Toate / Examen / Simulări / Modele / Teste).
   - Coloane: nume, tip (insignă; Examen are insigna albastră), starea pentru grupă, „Subiect”, „Barem” sau textul „Fără barem” (nu buton), „Marchează”.
   - Primele 12 rânduri, apoi butonul „Arată toate (N)”.
3. **Grupele mele** (`#/grupe`)
   - Carduri de grupă: nume, descriere, culoare (una din cele 4 culori de grupă din `DESIGN.md`), ultimul lucru marcat, totalul, progresul pe cel mai recent an.
   - „Grupă nouă”: un dialog cu nume, descriere și culoare. Grupa se poate redenumi și șterge (cu confirmare).
   - Istoricul: filtrat pe grupă, cel mai recent sus, cu „Deschide” și „Șterge”.
   - Fără grupe: o stare goală cu butonul „Creează prima grupă”. **Fără date demonstrative**: grupele A, B, C din `reference/` sunt doar ilustrații.
4. **Despre și surse** (`#/despre`): ce face aplicația, de unde vine conținutul (link la e3.ro), data ultimei actualizări a datelor.

**Comportament comun:**
- **Căutarea** din bara de sus înțelege „2021 II.3”, „ii 3 2021”, „II.3”, un an, o temă („triunghi”) sau un loc („Buzău”), cu sau fără diacritice, și duce la pagina potrivită cu filtrele setate.
- **Marcarea:** „Marchează” deschide lista grupelor cu căsuțe de bifat. „Salvează” pune insigna „Făcut · azi” și arată jos un mesaj „Marcat ca făcut pentru <grupa> · Anulează”, timp de 5 secunde.
- **„Deschide” / „Subiect” / „Barem”** deschid PDF-ul original într-un tab nou.
- **Butonul „Printează”** din `reference/` nu se pune: PDF-ul e pe alt domeniu și nu poate fi printat din aplicație. Pe rânduri rămân „Deschide” și „Marchează”.
- Meniul lateral: „Subiecte pe exerciții”, „Teste și bareme”, „Programa (PDF)” (link extern), grupele mele, „Grupă nouă”, iar jos „Despre și surse”. Elementul paginii curente e evidențiat.

## Stocarea locală

- `localStorage`, cheia `testeEN:v1`, un singur obiect JSON: `{ "grupe": [{ "id", "nume", "descriere", "culoare" }], "facute": [{ "id", "grupaId", "tip": "subiect" | "test", "itemId", "data" }], "grupaSelectata": "<id>" }`.
- Toate citirile și scrierile trec printr-un singur modul (`src/store.js`), cu `try/catch`. Dacă `localStorage` nu e disponibil, aplicația merge mai departe, nu salvează și arată un mesaj discret.

## Publicarea

- GitHub Pages, prin GitHub Actions: un workflow care rulează `npm ci` și `npm run build` și publică `dist/`. Setează `base` în Vite pentru numele repo-ului.
- Pentru Pages gratuit, repo-ul trebuie să fie public. Conține doar cod și metadate (linkuri), nu PDF-uri.
- Când am nevoie să mă autentific (`gh auth login`), spune-mi exact ce să fac.
- La final, dă-mi linkul aplicației.

## Cum lucrezi

1. Întâi un plan scurt: fișierele și pașii. Aștepți OK-ul meu.
2. Scriptul de date și raportul lui. Mi-l arăți înainte să mergi mai departe.
3. Ecranele, în ordinea: Subiecte → Teste → Grupe → Despre. După fiecare, îl compari cu `reference/`.
4. Publicarea.
- Commit-uri mici, cu mesaje în română.
- Dacă ai un skill de design de interfețe (de ex. `frontend-design`), folosește-l doar pentru detalii; `DESIGN.md` are prioritate.

## E gata când

- Din pagina de start ajung la „2021 · Subiectul II · Exercițiul 3” în 3 click-uri.
- Marchez un exercițiu pentru o grupă, dau refresh și marcajul e tot acolo.
- În DevTools → Network nu apare nicio cerere în afară de fișierele aplicației și fonturi (PDF-urile se deschid doar la click).
- `npm run build` trece fără erori, iar linkul de GitHub Pages se deschide și de pe telefon.
- Paginile au `noindex`, iar `robots.txt` blochează indexarea.
