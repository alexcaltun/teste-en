# Teste EN

Index personal al testelor și subiectelor de Evaluare Națională la matematică de pe [e3.ro](https://www.e3.ro).
Aplicația păstrează doar metadate (an, tip, nume, adresa fișierului) și deschide PDF-urile originale pe e3.ro.
Tot conținutul aparține e3.ro (prof. Valeriu Mocanu) și autorilor testelor.

## Comenzi (PowerShell, în folderul proiectului)

```powershell
npm install        # o singură dată
npm run dev        # aplicația local, la http://localhost:5173/teste-en/
npm run data       # reia datele de pe e3.ro (o singură cerere) și tipărește raportul
npm run build      # versiunea de publicat, în dist/
```

După `npm run data`, verifică raportul, apoi publică:

```powershell
git add src/data/en.json
git commit -m "Date actualizate de pe e3.ro"
git push
```

## Corecturi de mână

În `src/data/overrides.json` poți schimba `nume` sau `tip` (`Examen`, `Simulare`, `Model`, `Test`) pentru un test, după `id`-ul lui din `en.json`:

```json
{
  "t2024-0abc123": { "nume": "Test 3 · Buzău, nov. 2023", "tip": "Test" }
}
```
