/**
 * Residence La Caletta — Configurazione centralizzata
 *
 * Modifica qui per aggiornare unità, prezzi e tipologie
 * senza toccare il resto del codice.
 */

export const PROPERTY_NAME = "Residence La Caletta";
export const PROPERTY_LOCATION = "Capo Piccolo, Crotone (KR)";

/**
 * Prezzi di riferimento per notte (€).
 * Usati come valore predefinito nel form prenotazione.
 * Modifica liberamente in base alla stagione o accordi.
 */
export const LODGE_BASE_PRICES: Record<string, number> = {
  "Standard 1": 125,
  "Standard 2": 125,
  "Standard 3": 125,
  "Standard 4": 125,
  "Standard 5": 125,
  "Standard 6": 125,
  "Standard 7": 125,
  "Standard 8": 125,
  "Attico A":   140,
  "Attico B":   130,
};

/**
 * Descrizione breve delle tipologie (opzionale — per uso futuro).
 */
export const LODGE_TYPE: Record<string, string> = {
  "Standard 1": "T1 — Pianoterra con giardino privato",
  "Standard 2": "T1 — Pianoterra con giardino privato",
  "Standard 3": "T1 — Pianoterra con giardino privato",
  "Standard 4": "T1 — Pianoterra con giardino privato",
  "Standard 5": "T2 — Primo piano con balcone vista mare",
  "Standard 6": "T2 — Primo piano con balcone vista mare",
  "Standard 7": "T2 — Primo piano con balcone vista mare",
  "Standard 8": "T2 — Primo piano con balcone vista mare",
  "Attico A":   "T3 — Attico bilocale panoramico (360°)",
  "Attico B":   "T4 — Attico monolocale vista due mari",
};
