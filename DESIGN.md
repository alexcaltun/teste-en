# DESIGN.md — Teste EN (index personal al subiectelor de pe e3.ro)

Specificația vizuală a aplicației. Ecranele din `reference/` arată exact cum trebuie să arate; acest fișier dă valorile. Unde `reference/` și acest fișier diferă, are dreptate acest fișier. Comportamentul și datele sunt în `CLAUDE.md`.

---

## 1. Context

| | |
|---|---|
| **Produs** | „Teste EN” — index personal al testelor și subiectelor de Evaluare Națională (clasa a VIII-a) de pe e3.ro; trimite la PDF-urile originale |
| **Utilizator** | Unul singur: profesorul (proprietarul aplicației). Fără conturi, fără autentificare |
| **Sarcina principală (90%)** | An → subiect → exercițiu (ex: „2021, Subiectul II, Exercițiul 3”) |
| **Problema actuală** | O singură pagină lungă, ani de la nou la vechi, fără cuprins, filtre sau ancore → scroll lung, uneori treci de anul căutat |
| **Nevoie nouă** | Evidența pe grupe: ce an / subiect / exercițiu a fost deja dat fiecărei grupe |
| **Dispozitiv** | Desktop (proiectat la 1440 px lățime). Pe ecrane mai înguste nu trebuie să arate perfect, doar să nu se strice |
| **Stil** | Modern minimal: unealtă de lucru, rapidă, clară |
| **Referință de layout** | Google Classroom (bară sus + meniu lateral cu grupe ca „clase”, carduri de grupă cu bandă colorată) — familiar profesorilor și elevilor (legea lui Jakob) |

**Conținut real (de pe e3.ro):** fiecare an are exercițiile I.1–III.6. Pe e3.ro doar 2021 (set A) le are etichetate cu temă (ex: „cl. VI · triunghiul”); în aplicație insigna de temă apare doar unde sursa o are, altfel celula rămâne goală. Ecranele din `reference/` arată teme peste tot doar ca ilustrare. Anul 2021 are trei seturi (A, B, C). Exercițiile pe subiecte **nu au barem**; baremele există doar la testele complete (examen, simulări, modele ISJ), care stau pe o pagină separată.

---

## 2. Principii (din cursurile IOC) și unde se aplică

Lista completă (toate legile din cursurile 2, 7, 8, 9, cu auditul site-ului vechi și trimiteri la planșe): `LEGI-DIN-CURS.md`. Mai jos, rezumatul.

| Principiu | Aplicare concretă |
|---|---|
| Nielsen #7 – flexibilitate și eficiență | Anii sunt butoane-filtru; orice an e la 1 click, fără scroll |
| Nielsen #6 – recunoaștere, nu reamintire | Exercițiile deja date apar marcate „Făcut” pentru grupa selectată |
| Nielsen #1 – vizibilitatea stării | Filtrele active sunt evidențiate; rezumat „2021 · Subiectul II · Ex. 3 · 3 rezultate” |
| Nielsen #3 – control și libertate | Toast de confirmare cu „Anulează” după marcare |
| Nielsen #8 – design minimalist | Un singur meniu, fără blocuri dublate, fără texte de umplutură |
| Legea lui Hick | Alegerea se face în 3 pași mici (an → subiect → exercițiu), nu dintr-o listă de sute de rânduri |
| Legea lui Miller (7±2) | 8 ani (2027–2020), 3 subiecte, 6 exerciții — max. 8 opțiuni pe rând; meniul lateral are grupuri de max. 5 elemente |
| Dezvăluire progresivă | Se afișează doar anul selectat, nu toți anii deodată |
| Legea lui Fitts | Ținte de click ≥ 44 px înălțime; acțiunile stau pe rândul exercițiului |
| Legea lui Jakob | Layout tip Google Classroom; căutarea în bara de sus; logo stânga-sus |
| Gestalt – proximitate / regiune comună | Rândurile grupate sub antet de subiect; filtrele într-o bară delimitată |
| Gestalt – similaritate | Toate butoanele-filtru arată la fel; starea „Făcut” are mereu aceeași culoare |
| Wayfinding (curs 6) | Element activ marcat în meniul lateral; titlu de pagină + rezumat filtre |
| Legea lui Tesler | Evidența pe grupe mută complexitatea („ce le-am dat?”) de la profesor la sistem |
| WCAG 2.2 AA | Contrast text ≥ 4,5:1, componente ≥ 3:1, focus vizibil |

---

## 3. Culori

| Token | Hex | Utilizare | Contrast verificat |
|---|---|---|---|
| `bg` | `#FAFAF7` | Fundal pagină (alb cald) | — |
| `surface` | `#FFFFFF` | Bară sus, meniu lateral, carduri, tabel | — |
| `border` | `#E5E7EB` | Separatoare și contururi decorative (carduri, rânduri) | decorativ |
| `border-control` | `#848C98` | Contur câmpuri, dropdown-uri, butoane-filtru neselectate | 3,39:1 pe alb ✔ |
| `text` | `#1F2937` | Text principal, titluri | 14,0:1 pe bg ✔ |
| `text-secondary` | `#4B5563` | Subtitluri, descrieri | 7,2:1 pe bg ✔ |
| `text-muted` | `#6B7280` | Metadate, etichete mici | 4,6:1 pe bg ✔ |
| `accent` | `#2563EB` | Butoane principale, filtru selectat, linkuri | 5,2:1 pe alb ✔ (text alb pe accent 5,2:1 ✔) |
| `accent-hover` | `#1D4ED8` | Hover / pressed | 6,7:1 text alb ✔ |
| `accent-subtle` | `#EFF4FF` | Element activ în meniu, rând selectat | text `#1D4ED8` 6,1:1 ✔ |
| `success` | `#166534` pe `#DCFCE7` | Insigna „Făcut” | 6,5:1 ✔ |
| `error` | `#B91C1C` pe `#FEF2F2` | Erori (nu apar în ecranele de bază) | 5,9:1 ✔ |

**Culori de grupă** (bandă card + punct în meniu; text alb peste ele):
`group-teal #0F766E` (5,5:1) · `group-indigo #4338CA` (7,9:1) · `group-amber #B45309` (5,0:1) · `group-rose #BE123C` (6,3:1)

Reguli:
- Un singur accent (albastru). Verdele apare **doar** pentru „Făcut”.
- Culoarea nu e singurul semnal: „Făcut” are și bifă, și text.
- Fără gradienți, fără umbre grele.

---

## 4. Tipografie

Font: **Inter** (există implicit în Figma). Fallback: `system-ui, sans-serif`.

| Stil | Mărime / înălțime rând | Greutate | Utilizare |
|---|---|---|---|
| `display` | 32 / 40 | 700 | Titlul paginii (H1) |
| `h2` | 20 / 28 | 600 | Antet de secțiune (ex: „Subiectul II”) |
| `h3` | 16 / 24 | 600 | Titlu card, antet coloană |
| `body` | 16 / 24 | 400 | Text de bază |
| `body-sm` | 14 / 20 | 400 / 500 | Rânduri tabel, meniu lateral, butoane |
| `caption` | 12 / 16 | 500 | Etichete grup în meniu (MAJUSCULE, spațiere 0,04em), metadate |

Reguli: max. 2 greutăți pe ecran în afara titlului; text aliniat la stânga; numerele din tabel cu `font-variant-numeric: tabular-nums`.

---

## 5. Spațiere, grilă, forme

- **Grilă de 8 px.** Valori permise: 4, 8, 12, 16, 24, 32, 40, 48, 64.
- Colțuri: butoane și filtre `8 px`; filtre tip „pastilă” `999 px`; carduri `12 px`; element activ în meniu: `0 24px 24px 0` (ca în Google Classroom).
- Contur: 1 px. Umbră: doar `0 1px 2px rgba(0,0,0,0.05)` pe carduri și dropdown deschis (`0 8px 24px rgba(0,0,0,0.12)`).
- Înălțimi: bară sus 64; element meniu 44; rând tabel 56; buton 40 (zona de click 44 cu padding); filtru-pastilă 36 (zona de click 44).

---

## 6. Layout (toate ecranele)

```
┌──────────────────────────────────────────────────────────── 1440 ┐
│ BARĂ SUS 64: [☰] Teste EN matematică   [ Caută… 400 ]              │
├──────────────┬───────────────────────────────────────────────────┤
│ MENIU 272    │ CONȚINUT: padding 32 sus / 40 lateral              │
│ EVALUARE NAȚ.│ max. 1040 lățime                                   │
│ • Subiecte   │ H1 + subtitlu                                      │
│ • Teste și   │ Bară de filtre (fundal surface, contur, colțuri 12)│
│   bareme     │ Rezumat rezultate                                  │
│ • Programa   │ Tabel / carduri                                    │
│ GRUPELE MELE │                                                    │
│ • Toate grupe│                                                    │
│ ● Grupa A    │                                                    │
│ ● Grupa B    │                                                    │
│ ● Grupa C    │                                                    │
│ + Grupă nouă │                                                    │
│ ──────────── │                                                    │
│ Despre și surse│                                                  │
└──────────────┴───────────────────────────────────────────────────┘
```

**Bară sus:** fundal `surface`, contur jos `border`. Stânga: iconiță meniu, logo „Teste EN” (20/700, `accent`) + „matematică” (14, `text-muted`), pe un singur rând. Centru: câmp de căutare 400×40, placeholder „Caută: 2021 II.3, triunghi, Buzău…”. Fără avatar și fără cont: aplicația are un singur utilizator.

**Meniu lateral:** fundal `surface`, contur dreapta `border`. Etichete de grup în stil `caption`, `text-muted`. Elemente 44 înălțime, iconiță 20 + text `body-sm` 500. Activ: fundal `accent-subtle`, text `accent-hover`, colțuri `0 24 24 0`. Grupele au un punct colorat de 10 px în culoarea grupei.

Un singur meniu pe pagină (fără dublare în footer). Fără Bacalaureat, fără Contact. Jos în meniul lateral stă doar „Despre și surse” (de unde vine conținutul).

---

## 7. Componente

**Filtru-pastilă (chip):** 36 înălțime, padding 0 16, colțuri 999, text `body-sm` 500.
- Neselectat: fundal `surface`, contur `border-control`, text `text`.
- Selectat: fundal `accent`, text alb, fără contur, bifă 16 în stânga.
- Rânduri de filtre: eticheta („An”, „Subiect”, „Exercițiu”) în `caption` deasupra.

**Butoane:**
- Principal: fundal `accent`, text alb, 40 înălțime, padding 0 16, colțuri 8.
- Secundar: fundal `surface`, contur `border-control`, text `text`.
- Text (ghost): fără fundal, text `accent`; pentru acțiuni pe rând.
- Neutru: fără fundal, text `text-secondary`; pentru acțiuni distructive mărunte („Șterge”), ca să nu concureze cu acțiunile principale.
- Etichete cu verb: „Deschide”, „Printează”, „Marchează făcut”, „Anulează”.

**Selector de grupă (dropdown):** 40 înălțime, contur `border-control`, punct colorat + „Grupa A · clasa a VIII-a” + săgeată. Meniul deschis: card `surface`, umbră de dropdown, opțiuni 44, căsuțe de bifat pentru marcare multiplă.

**Insignă „Făcut”:** fundal `#DCFCE7`, text `#166534`, 24 înălțime, colțuri 999, bifă + „Făcut · 12 nov.”. Când nu e făcut: liniuță „—” în `text-muted`.

**Insignă temă:** fundal `#F3F4F6`, text `text-secondary`, ex: „VI · triunghiul”.

**Tabel:** fundal `surface`, contur `border`, colțuri 12. Antet de coloană 40 înălțime, `caption`, `text-muted`. Rânduri 56, separator `border`. Rânduri grupate sub antet de subiect (`h2`, deasupra tabelului fiecărui subiect).

**Toast:** jos-centru, fundal `text` (#1F2937), text alb `body-sm`, 48 înălțime, colțuri 8, buton text „Anulează” în `#93C5FD`.

**Card de grupă (stil Classroom):** 330 lățime (3 pe rând × 330 + 2 × 24 = 1038), colțuri 12, contur `border`. Bandă sus 96 în culoarea grupei, cu numele grupei (20/600, alb) și descriere (14, alb). Corp: ultimul exercițiu dat, număr total, link „Vezi istoricul”.

**Iconițe:** stil linie (tip Lucide), 20 px, grosime 1,75, culoare `text-secondary`; SVG inline.

---

## 8. Ecrane

### 01 — Subiecte pe exerciții (stare inițială)
- H1 „Subiecte pe exerciții”, subtitlu „Exercițiile din fiecare an, grupate pe subiect și număr. Alege anul, apoi subiectul.”
- Bară de filtre: **An** 2027 · **2026 (selectat)** · 2025 · 2024 · 2023 · 2022 · 2021 · 2020; **Subiect** Toate (selectat) · I · II · III; **Exercițiu** Toate (selectat) · 1–6. Dreapta: selector „Arată ce a făcut: Grupa A”.
- Rezumat: „2026 · toate subiectele · 18 exerciții · 5 făcute de Grupa A”.
- Trei tabele (Subiectul I, II, III), câte 6 rânduri. Coloane: **Ex.** (I.1) · **Temă** (insignă clasă + capitol) · **Grupa A** (insignă Făcut / —) · **Acțiuni** (Deschide · Printează · Marchează făcut).

### 02 / 02a / 02b — Subiecte, filtrat: 2021 · Subiectul II · Exercițiul 3
- Aceleași filtre: **2021**, **II**, **3** selectate.
- Rezumat: „2021 · Subiectul II · Exercițiul 3 · 3 rezultate”.
- Un tabel cu 3 rânduri: Set A (modele 0–15 · examenul · simularea), Set B (testele 1–20), Set C (testele 21–40). Tema stă în antetul secțiunii: „cl. VI · triunghiul”.
- Trei stări, trei fișiere:
  - **02:** rezultatul filtrării, fără nimic deschis.
  - **02a:** dropdown „Marchează făcut” deschis pe rândul Set A (Grupa A bifată, Grupa B și C nebifate, buton „Salvează”).
  - **02b:** după salvare — rândul Set A are insigna „Făcut · azi”, jos apare toast-ul „Marcat ca făcut pentru Grupa A · Anulează”.

### 03 — Teste și bareme
- H1 „Teste și bareme”, subtitlu „Teste complete: examene, simulări și modele, cu barem.”
- Filtre: **An** (2024 selectat) · **Tip** Toate · Examen · Simulări · Modele · Teste ISJ.
- Tabel: **Test** (ex: „Test 12 – Buzău, martie 2024”) · **Tip** (insignă) · **Subiect** (Deschide) · **Barem** (Deschide) · **Grupa A** (Făcut / —) · acțiune Marchează.

### 04 — Grupele mele
- H1 „Grupele mele”, buton principal „+ Grupă nouă” dreapta.
- Grilă de carduri Classroom (3 pe rând × 330 px, gap 24): Grupa A · clasa a VIII-a (teal), Grupa B · meditații (indigo), Grupa C · recapitulare (amber).
- Sub carduri, „Istoric” cu filtre Grupa A / B / C: tabel Data · An · Exercițiu / test · Temă · acțiuni Deschide și Șterge.

---

## 9. Conținut și ton
- Română cu diacritice corecte (ș, ț cu virgulă).
- Ton direct, de unealtă: fără exclamări, fără texte de umplutură.
- Date: „12 nov. 2026”. Exerciții: „II.3”. Ani fără „anul”.
- Fără placeholdere („Lorem ipsum”, „Your Content Goes Here”), fără linkuri moarte, fără copyright vechi.

---

## 10. Reguli pentru implementare
- Tokenii de mai sus devin variabile CSS (`--bg`, `--accent` etc.) într-un singur fișier; componentele nu folosesc culori sau distanțe scrise direct.
- Bara de filtre poate rămâne fixă sus la derulare (`position: sticky`) — în aplicația reală e permis.
- Inter din Google Fonts; iconițe SVG inline (stil Lucide).
- Stările din `reference/02a` (meniu de marcare deschis) și `reference/02b` (confirmare) sunt stări reale ale aceleiași pagini, nu pagini separate.
- Focus vizibil (contur 2 px `accent`) pe tot ce se poate apăsa.
