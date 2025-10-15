export default function PanduanSmartTambakPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-semibold text-pretty">Panduan Smart Tambak</h1>
      <p className="text-muted-foreground">
        Tips, praktik terbaik, dan referensi desain sidebar yang digunakan pada aplikasi ini.
      </p>

      <figure className="rounded-xl overflow-hidden border bg-card">
        <img
          src="/images/sidebar-reference.png"
          alt="Referensi desain sidebar bergaya glassmorphism gelap dengan mode lebar dan ramping."
          className="w-full h-auto"
        />
        <figcaption className="p-3 text-sm text-muted-foreground">Referensi desain sidebar yang Anda kirim.</figcaption>
      </figure>
    </section>
  )
}
