/**
 * Allowlist Domain Resmi (Brands & Platform Indonesia)
 * Digunakan untuk validasi deteksi brand spoofing pada URL.
 */

export const OFFICIAL_DOMAIN_ALLOWLIST = [
  "shopee.co.id",
  "shopee.com",
  "tokopedia.com",
  "gopay.co.id",
  "dana.id",
  "ovo.id",
  "bca.co.id",
  "klikbca.com",
  "bri.co.id",
  "bni.co.id",
  "bankmandiri.co.id",
  "mandiri.co.id",
  "jne.co.id",
  "jnt.co.id",
  "jet.co.id",
  "sicepat.com",
  "pln.co.id",
  "bpjs-kesehatan.go.id",
  "bpjsketenagakerjaan.go.id",
  "lazada.co.id",
  "traveloka.com",
  "telkomsel.com",
  "whatsapp.com",
  "wa.me",
  "instagram.com",
  "tiktok.com"
];

/**
 * Memeriksa apakah hostname merupakan domain resmi atau subdomain dari domain resmi.
 */
export function isOfficialDomain(hostname) {
  if (!hostname || typeof hostname !== "string") return false;
  const host = hostname.toLowerCase().trim();
  return OFFICIAL_DOMAIN_ALLOWLIST.some(
    (official) => host === official || host.endsWith("." + official)
  );
}
