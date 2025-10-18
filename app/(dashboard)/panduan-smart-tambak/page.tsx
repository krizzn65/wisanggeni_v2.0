"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  Droplets,
  Thermometer,
  Activity,
  Waves,
  Fish,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  Bug,
  Calculator,
  Lightbulb,
  HelpCircle,
} from "lucide-react"

export default function PanduanSmartTambakPage() {
  const [expandedSection, setExpandedSection] = useState(null)
  const [expandedDisease, setExpandedDisease] = useState(null)
  const [expandedFaq, setExpandedFaq] = useState(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const cardHoverVariants = {
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  }

  const expandVariants = {
    collapsed: { opacity: 0, height: 0 },
    expanded: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-foreground p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div className="mb-12" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div className="flex items-center gap-3 mb-4" variants={itemVariants}>
            <motion.div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h1 className="text-4xl font-bold text-white" variants={headerVariants}>
              Panduan Smart Tambak
            </motion.h1>
          </motion.div>
          <motion.p className="text-lg text-slate-300" variants={itemVariants}>
            Panduan lengkap budidaya Udang Vaname (Litopenaeus vannamei) berbasis teknologi
          </motion.p>
        </motion.div>

        <motion.div
          className="mb-12"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg border border-blue-400/30"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                <Fish className="w-8 h-8 flex-shrink-0 mt-1" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Tentang Udang Vaname</h2>
                <p className="text-blue-100 leading-relaxed">
                  Udang Vaname (Litopenaeus vannamei) adalah komoditas perikanan unggulan dengan tingkat produktivitas
                  tinggi. Sistem smart tambak membantu mengoptimalkan kualitas air dan meningkatkan hasil panen melalui
                  monitoring real-time.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="mb-12" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" variants={itemVariants}>
            <Droplets className="w-6 h-6 text-blue-400" />
            Parameter Kualitas Air Optimal
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Droplets,
                title: "pH Air",
                desc: "Tingkat keasaman/kebasaan air",
                range: "7.5 - 8.5",
                color: "blue",
                issues: ["pH < 7.5: Stres pada udang, pertumbuhan lambat", "pH > 8.5: Toksisitas amonia meningkat"],
                solution:
                  "Gunakan kapur pertanian (CaCO₃) untuk menaikkan pH atau asam organik untuk menurunkan pH secara bertahap.",
              },
              {
                icon: Thermometer,
                title: "Suhu Air",
                desc: "Temperature kolam tambak",
                range: "28 - 32°C",
                color: "orange",
                issues: [
                  "Suhu < 25°C: Metabolisme lambat, nafsu makan turun",
                  "Suhu > 33°C: Stres, konsumsi oksigen tinggi",
                ],
                solution:
                  "Aktifkan aerator untuk sirkulasi air dan pertukaran panas. Gunakan shading net saat suhu terlalu tinggi.",
              },
            ].map((param, idx) => (
              <motion.div
                key={idx}
                className={`bg-slate-800 rounded-lg p-6 shadow-md border border-${param.color}-500/20 hover:border-${param.color}-500/50`}
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 bg-${param.color}-500/20 rounded-lg`}>
                    <param.icon className={`w-5 h-5 text-${param.color}-400`} />
                  </div>
                  <h3 className="font-bold text-white">{param.title}</h3>
                </div>
                <p className="text-sm text-slate-400 mb-3">{param.desc}</p>
                <div className={`bg-${param.color}-500/10 rounded p-3 mb-3 border border-${param.color}-500/30`}>
                  <p className={`font-bold text-${param.color}-400`}>Range Optimal: {param.range}</p>
                </div>
                <div className="text-sm text-slate-400 space-y-2 mb-3">
                  {param.issues.map((issue, i) => (
                    <p key={i}>• {issue}</p>
                  ))}
                </div>
                <motion.div
                  className={`p-3 bg-${param.color}-500/10 rounded border-l-4 border-${param.color}-500`}
                  whileHover={{ x: 4 }}
                >
                  <p className={`text-sm font-semibold text-${param.color}-400`}>💡 Solusi:</p>
                  <p className="text-sm text-slate-400">{param.solution}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="mb-12" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" variants={itemVariants}>
            <Activity className="w-6 h-6 text-green-400" />
            Tahapan Budidaya Udang Vaname
          </motion.h2>

          <div className="space-y-3">
            <motion.div
              className="bg-slate-800 rounded-lg shadow-md overflow-hidden border border-green-500/20 hover:border-green-500/50"
              variants={itemVariants}
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.2)" }}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === "tahap1" ? null : "tahap1")}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 text-white flex items-center justify-center font-bold"
                    whileHover={{ scale: 1.1 }}
                  >
                    1
                  </motion.div>
                  <span className="font-semibold text-white text-left">Persiapan Kolam</span>
                </div>
                <motion.div animate={{ rotate: expandedSection === "tahap1" ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>
              <motion.div
                variants={expandVariants}
                initial="collapsed"
                animate={expandedSection === "tahap1" ? "expanded" : "collapsed"}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-0 border-t border-slate-700 space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Pengeringan</p>
                      <p className="text-sm text-slate-400">
                        Keringkan kolam 7-10 hari, bersihkan lumpur dan sisa budidaya sebelumnya
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="mb-12" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" variants={itemVariants}>
            <Bug className="w-6 h-6 text-orange-400" />
            Troubleshooting Penyakit Umum
          </motion.h2>

          <div className="space-y-3">
            <motion.div
              className="bg-slate-800 rounded-lg shadow-md overflow-hidden border border-orange-500/20 hover:border-orange-500/50"
              variants={itemVariants}
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.2)" }}
            >
              <button
                onClick={() => setExpandedDisease(expandedDisease === "disease1" ? null : "disease1")}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <span className="font-semibold text-white">White Spot Syndrome Virus (WSSV)</span>
                </div>
                <motion.div
                  animate={{ rotate: expandedDisease === "disease1" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>
              <motion.div
                variants={expandVariants}
                initial="collapsed"
                animate={expandedDisease === "disease1" ? "expanded" : "collapsed"}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-0 border-t border-slate-700 space-y-3">
                  <div>
                    <p className="font-semibold text-white mb-2">Gejala:</p>
                    <p className="text-sm text-slate-400">
                      Bintik putih pada kulit, udang lemah, tidak mau makan, kematian massal dalam 3-7 hari
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="mb-12" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" variants={itemVariants}>
            <Calculator className="w-6 h-6 text-purple-400" />
            Kalkulasi Produktivitas
          </motion.h2>

          <motion.div
            className="bg-slate-800 rounded-lg p-6 border border-purple-500/30 hover:border-purple-500/50"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-bold text-white mb-4">Estimasi Hasil Panen</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400 mb-1">Rumus:</p>
                <motion.p
                  className="font-mono bg-slate-900 p-3 rounded text-cyan-400 border border-cyan-500/30"
                  whileHover={{ scale: 1.05 }}
                >
                  Hasil = Luas × Padat Tebar × SR × Berat Akhir
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="mb-12" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" variants={itemVariants}>
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            Tips Hemat Biaya Operasional
          </motion.h2>

          <motion.div
            className="bg-slate-800 rounded-lg p-6 shadow-md border-l-4 border-yellow-500 hover:border-yellow-400"
            variants={itemVariants}
            whileHover={cardHoverVariants.hover}
          >
            <h3 className="font-bold text-white mb-3">⚡ Efisiensi Energi</h3>
            <ul className="text-sm text-slate-400 space-y-2">
              <motion.li whileHover={{ x: 4 }}>
                • Gunakan aerator berkualitas tinggi dengan efisiensi energi baik
              </motion.li>
              <motion.li whileHover={{ x: 4 }}>• Aktifkan aerator sesuai kebutuhan</motion.li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div className="mb-12" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" variants={itemVariants}>
            <HelpCircle className="w-6 h-6 text-purple-400" />
            Pertanyaan Umum (FAQ)
          </motion.h2>

          <div className="space-y-3">
            {[
              {
                q: "Berapa lama waktu budidaya udang Vaname?",
                a: "Waktu budidaya udang Vaname biasanya 90-120 hari (DOC/Days of Culture) tergantung target ukuran panen.",
                id: "faq1",
              },
              {
                q: "Apa perbedaan sistem intensif dan semi-intensif?",
                a: "Sistem Intensif: Padat tebar tinggi (80-150 ekor/m²), aerasi 24 jam. Semi-Intensif: Padat tebar sedang (40-80 ekor/m²), aerasi 12-16 jam/hari.",
                id: "faq2",
              },
              {
                q: "Bagaimana cara mengatasi pH air yang terlalu tinggi?",
                a: "Untuk menurunkan pH air yang terlalu tinggi (> 8.5), Anda dapat: • Gunakan asam organik (asam sitrat, asam asetat) secara bertahap • Lakukan partial water exchange dengan air yang pH-nya lebih rendah • Tingkatkan aerasi untuk mengurangi CO₂ terlarut",
                id: "faq3",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                className="bg-slate-800 rounded-lg shadow-md overflow-hidden border border-purple-500/20 hover:border-purple-500/50"
                variants={itemVariants}
                whileHover={{ boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.2)" }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-slate-700 transition-colors"
                >
                  <span className="font-semibold text-white text-left">{faq.q}</span>
                  <motion.div animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-5 h-5 flex-shrink-0 ml-4" />
                  </motion.div>
                </button>
                <motion.div
                  variants={expandVariants}
                  initial="collapsed"
                  animate={expandedFaq === faq.id ? "expanded" : "collapsed"}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-0 border-t border-slate-700">
                    <p className="text-sm text-slate-400">{faq.a}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="mb-12" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" variants={itemVariants}>
            <Info className="w-6 h-6 text-cyan-400" />
            Peran Teknologi Smart Tambak
          </motion.h2>

          <motion.div
            className="bg-slate-800 rounded-xl p-8 border border-cyan-500/30 shadow-lg hover:border-cyan-500/50"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="space-y-6">
              {[
                {
                  icon: Activity,
                  title: "Monitoring Real-Time",
                  desc: "Sensor IoT mengukur parameter kualitas air secara real-time dan mengirimkan data ke cloud.",
                  color: "orange",
                },
                {
                  icon: Waves,
                  title: "Otomasi Sistem",
                  desc: "Sistem otomatis mengontrol aerator, pompa, dan pemberian pakan berdasarkan kondisi air.",
                  color: "blue",
                },
              ].map((tech, idx) => (
                <motion.div key={idx} className="flex gap-4" whileHover={{ x: 8 }} transition={{ duration: 0.3 }}>
                  <motion.div
                    className={`flex-shrink-0 h-12 w-12 rounded-md bg-gradient-to-br from-${tech.color}-500 to-${tech.color}-600 text-white flex items-center justify-center`}
                  >
                    <tech.icon className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{tech.title}</h3>
                    <p className="text-slate-400">{tech.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center py-8 border-t border-slate-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-slate-400 mb-2">
            Panduan ini dibuat untuk membantu petani udang Vaname mengoptimalkan budidaya dengan teknologi smart tambak.
          </p>
          <p className="text-sm text-slate-500">
            Untuk informasi lebih lanjut, hubungi tim support atau kunjungi website resmi Smart Tambak.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
