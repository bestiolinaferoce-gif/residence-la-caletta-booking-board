# Audit Report — Villa Olimpia Booking Board
**Data:** 2026-03-03  
**Scope:** Codice modificato (Gantt cell-based, iCal, Sync, merge-local)

---

## 1. Build & TypeScript

| Check | Risultato |
|-------|-----------|
| `npm run build` | ✅ Successo |
| Linting | ✅ Nessun errore |
| TypeScript (via Next) | ✅ Compilazione OK |

**Nota:** `npx tsc --noEmit` può fallire per file `.next/types/**` mancanti (generati solo dopo build). Usare `npm run build` come verifica principale.

---

## 2. GanttBoard.tsx — Audit

### ✅ Corretto
- **buildCellMap**: Gestisce correttamente prenotazioni che iniziano prima del mese (`barStart = firstDay`) e finiscono dopo (`barEnd = addDays(lastDay, 1)`).
- **renderLodgeCells**: Iterazione con `i += span` per celle occupate, nessuna cella duplicata.
- **Colori**: `CHANNEL_BAR_COLORS` e `STATUS_BAR_OVERRIDES` allineati alla spec (airbnb=rose, direct=emerald, ecc.).
- **Filtri**: Duplicazione logica di `matchesFilters` inline — funzionale ma ridondante (vedi sotto).
- **Edge cases**: `monthDays` vuoto gestito implicitamente (getMonthDays non restituisce mai array vuoto).

### ⚠️ Miglioramento consigliato
- **Ridondanza filtri**: `visibleBookings` ricalcola `matchesFilters` invece di usare `matchesFilters` da `@/lib/utils`. Consiglio: `bookings.filter((b) => matchesFilters(b, filters))` per coerenza.

---

## 3. Toolbar.tsx — Audit

### ✅ Corretto
- Props complete: `onCopyIcal`, `onForceSync`, `onSyncLocal`, `syncError`, `hasNewBookings`, `onClearNotification`, `newBookingsCount`.
- Pulsanti iCal, Sync, Sync locale renderizzati con condizioni corrette.
- `onSyncLocal` opzionale: pulsante mostrato solo se la prop è passata.
- `syncError` mostra indicatore "⚠ Offline" inline.

### ✅ Nessun problema rilevato

---

## 4. page.tsx — Audit

### ✅ Corretto
- Tutte le callback passate al Toolbar: `onCopyIcal`, `onForceSync`, `onSyncLocal`, `syncError`, `hasNewBookings`, `onClearNotification`, `newBookingsCount`.
- `onCopyIcal` copia URL e mostra toast.
- `syncLocalToCloud` e `forceSyncToCloud` collegati correttamente.
- `lodgeSummaries`: la variabile `b` nel filter è corretta (parametro della callback).

### ✅ Nessun problema rilevato

---

## 5. lib/store.ts — Audit

### ✅ Corretto
- `syncLocalToCloud`: Legge da `STORAGE_KEY`, chiama `/api/bookings/merge-local`, gestisce errori, chiama `load()` dopo successo.
- `forceSyncToCloud`: POST a `/api/bookings` con `{ bookings: cur }`, aggiorna `serverVersion` e `syncError`.
- `hasNewBookings` impostato nel polling quando `v > currentVersion`.
- `clearNewBookingsNotification` resetta il flag.

### ✅ Nessun problema rilevato

---

## 6. app/api/calendar/route.ts — Audit

### ✅ Corretto
- Lettura KV: `parsed.data` per payload `{ v, ts, data }`, array diretto per formato legacy.
- Filtro `lodge` e `cancelled` applicati correttamente.
- Formato iCal: `UID`, `DTSTART`, `DTEND`, `SUMMARY`, `DESCRIPTION`, `STATUS` conformi RFC 5545.
- `LAST-MODIFIED`: formato `YYYYMMDDTHHMMSSZ` con `.replace(/\.\d+Z?$/, 'Z')` per evitare doppia Z.
- Headers: `Content-Type`, `Content-Disposition: attachment`, `Cache-Control: no-store`.

### ✅ Nessun problema rilevato

---

## 7. app/api/bookings/merge-local/route.ts — Audit

### ✅ Corretto
- Validazione payload: `body?.bookings` array richiesto.
- Lettura KV: stessa logica di `app/api/bookings/route.ts` (REST API, chiave `vob_bookings`).
- Merge: deduplicazione per `id`, `toAdd` = incoming non presenti in existing.
- Scrittura: `writeKV` con pipeline SET, incremento versione.
- Risposta: `{ merged, total }`.

### ⚠️ Nota
- Nessuna validazione dei singoli `Booking` in `toAdd`. Se un oggetto malformato viene inviato, potrebbe essere salvato. Per maggiore robustezza si potrebbe aggiungere una validazione minima (id, guestName, checkIn, checkOut).

---

## 8. globals.css — Audit

### ✅ Corretto
- Classi Gantt: `.gantt-cell-empty`, `.gantt-cell-booked`, `.gantt-cell-name`, `.gantt-cell-nights`, `.gantt-cell-amount`, `.gantt-new-dot`, `.gantt-add`.
- `.btn-notify`, `.notify-dot`, `.sync-error` per Toolbar.
- Animazione `pulse-green` per pulsante notifiche.
- Nessun conflitto con stili esistenti.

### ✅ Nessun problema rilevato

---

## 9. Riepilogo

| Componente | Stato | Note |
|------------|-------|------|
| GanttBoard | ✅ OK | Opzionale: usare `matchesFilters` da utils |
| Toolbar | ✅ OK | — |
| page.tsx | ✅ OK | — |
| store.ts | ✅ OK | — |
| calendar API | ✅ OK | — |
| merge-local API | ✅ OK | Opzionale: validazione Booking |
| globals.css | ✅ OK | — |

---

## 10. Raccomandazioni

1. **GanttBoard**: Sostituire il filter inline con `matchesFilters` da `@/lib/utils` per evitare drift.
2. **merge-local**: Aggiungere validazione base sui campi obbligatori di ogni `Booking` prima del merge.
3. **tsconfig**: Considerare di escludere `.next/types` dall'include quando si esegue `tsc --noEmit` standalone, oppure usare solo `npm run build` per la verifica.

---

*Audit completato — codice pronto per produzione.*
