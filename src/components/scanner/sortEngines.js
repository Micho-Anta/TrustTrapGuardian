/**
 * Mengurutkan hasil modul untuk tampilan tanpa mengubah array asli:
 * status DANGER didahulukan berdasarkan poin tertinggi, disusul modul bersih
 * dengan mempertahankan urutan awal secara stabil.
 */
export function sortEnginesForDisplay(engines = []) {
  return engines
    .map((engine, index) => ({ engine, index }))
    .sort((a, b) => {
      const aDanger = a.engine.status === "DANGER" ? 1 : 0;
      const bDanger = b.engine.status === "DANGER" ? 1 : 0;
      if (aDanger !== bDanger) return bDanger - aDanger;
      if (aDanger === 1) {
        const scoreDiff = (b.engine.score || 0) - (a.engine.score || 0);
        if (scoreDiff !== 0) return scoreDiff;
      }
      return a.index - b.index;
    })
    .map(({ engine }) => engine);
}
