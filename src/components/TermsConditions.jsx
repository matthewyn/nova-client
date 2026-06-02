import { useEffect } from "react";

function TermsConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="border-y-1 border-gray-200/70 px-8">
      <div className="border-x-1 border-gray-200/70 py-12 px-8">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Syarat & Ketentuan</h1>
          <p className="mb-8">
            Harap membaca Syarat dan Ketentuan ini dengan seksama sebelum
            menggunakan Nova AI. Dengan membuat akun, mengakses, atau
            menggunakan layanan Nova AI, Anda menyatakan telah membaca,
            memahami, dan menyetujui seluruh ketentuan yang tercantum dalam
            dokumen ini.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Definisi</h2>
          <p className="mb-4">
            <span className="font-bold">Nova AI</span> adalah platform analisis
            investasi berbasis data dan kecerdasan buatan yang menyediakan
            insight, forecasting, risk modeling, scenario analysis, dan fitur
            pendukung pengambilan keputusan investasi.
          </p>
          <p className="mb-4">
            <span className="font-bold">Pengguna</span> adalah individu yang
            mendaftar dan menggunakan layanan Nova AI.
          </p>
          <p className="mb-4">
            <span className="font-bold">Insight</span> adalah hasil analisis
            yang dihasilkan oleh model Nova AI berdasarkan data historis,
            statistik, machine learning, dan parameter sistem yang digunakan
            pada saat analisis dilakukan.
          </p>
          <p className="mb-8">
            <span className="font-bold">Akun</span> adalah identitas pengguna
            yang digunakan untuk mengakses layanan Nova AI.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Sifat Layanan</h2>
          <p className="mb-4">
            Nova AI merupakan platform analisis dan intelligence investasi yang
            bertujuan membantu pengguna memahami peluang, risiko, dan berbagai
            kemungkinan skenario pasar. Nova AI:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Bukan penasihat investasi.</li>
            <li>Bukan manajer investasi.</li>
            <li>Bukan broker atau perantara perdagangan efek.</li>
            <li>Tidak melakukan pengelolaan dana pengguna.</li>
            <li>
              Tidak melakukan eksekusi transaksi investasi atas nama pengguna.
            </li>
          </ul>
          <p className="mb-8">
            Seluruh informasi yang tersedia pada platform bersifat informatif
            dan edukatif.
          </p>
          <h2 className="text-2xl font-semibold mb-2">
            Bukan Nasihat Investasi
          </h2>
          <p className="mb-4">
            Seluruh insight, forecast, risk score, scenario projection, position
            sizing, maupun informasi lain yang tersedia pada Nova AI tidak
            dimaksudkan sebagai:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Nasihat investasi.</li>
            <li>Rekomendasi membeli efek.</li>
            <li>Rekomendasi menjual efek.</li>
            <li>Ajakan melakukan transaksi tertentu.</li>
          </ul>
          <p className="mb-8">
            Pengguna memahami bahwa seluruh keputusan investasi sepenuhnya
            merupakan tanggung jawab pribadi pengguna.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Risiko Investasi</h2>
          <p className="mb-4">
            Pengguna memahami bahwa investasi di pasar modal mengandung risiko
            termasuk, namun tidak terbatas pada:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Kehilangan sebagian modal.</li>
            <li>Kehilangan seluruh modal.</li>
            <li>Volatilitas harga.</li>
            <li>Risiko likuiditas.</li>
            <li>Risiko pasar.</li>
            <li>Risiko perusahaan.</li>
            <li>Risiko ekonomi dan regulasi.</li>
          </ul>
          <p className="mb-8">
            Nova AI tidak menjamin keuntungan, profit tertentu, tingkat
            keberhasilan tertentu, ataupun hasil investasi tertentu. Kinerja
            historis tidak menjamin hasil di masa mendatang.
          </p>
          <h2 className="text-2xl font-semibold mb-2">
            Akurasi dan Keterbatasan Sistem
          </h2>
          <p className="mb-4">
            Nova AI menggunakan data, algoritma, model statistik, machine
            learning, dan sumber informasi pihak ketiga yang dapat mengalami:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Keterlambatan data.</li>
            <li>Kesalahan data.</li>
            <li>Gangguan sistem.</li>
            <li>Ketidakakuratan model.</li>
            <li>Perubahan kondisi pasar yang tidak terduga.</li>
          </ul>
          <p className="mb-8">
            Pengguna memahami bahwa hasil analisis yang ditampilkan dapat
            berubah sewaktu-waktu dan tidak selalu mencerminkan kondisi pasar
            yang sebenarnya. Nova AI tidak menjamin akurasi, kelengkapan, atau
            kesesuaian informasi untuk tujuan tertentu.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Akun Pengguna</h2>
          <p className="mb-8">
            Pengguna bertanggung jawab menjaga kerahasiaan akun dan kredensial
            login. Seluruh aktivitas yang dilakukan melalui akun pengguna
            dianggap dilakukan oleh pemilik akun tersebut. Nova AI berhak
            menangguhkan atau menghentikan akun yang melanggar ketentuan
            penggunaan.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Biaya dan Langganan</h2>
          <p className="mb-8">
            Beberapa fitur Nova AI dapat diakses melalui paket berlangganan
            berbayar. Dengan melakukan pembayaran, pengguna menyetujui biaya
            yang berlaku pada saat transaksi dilakukan. Nova AI berhak mengubah
            harga langganan sewaktu-waktu untuk periode berlangganan berikutnya.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Kebijakan Refund</h2>
          <p className="mb-4">
            Kecuali diwajibkan oleh hukum yang berlaku, seluruh pembayaran yang
            telah dilakukan tidak dapat dikembalikan. Refund hanya dapat
            dipertimbangkan apabila terjadi:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Kesalahan sistem yang menyebabkan pembayaran ganda.</li>
            <li>
              Gangguan teknis yang menyebabkan transaksi tidak tercatat dengan
              benar.
            </li>
          </ul>
          <p className="mb-8">
            Permohonan refund harus diajukan paling lambat 7 (tujuh) hari
            setelah transaksi dilakukan.
          </p>
          <h2 className="text-2xl font-semibold mb-2">
            Penggunaan yang Dilarang
          </h2>
          <p className="mb-4">Pengguna dilarang:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Membagikan akun kepada pihak lain.</li>
            <li>Menjual kembali akses Nova AI.</li>
            <li>
              Menyalin atau mendistribusikan insight Nova AI secara massal.
            </li>
            <li>Menggunakan layanan untuk aktivitas yang melanggar hukum.</li>
            <li>Melakukan reverse engineering terhadap sistem Nova AI.</li>
            <li>Mengganggu atau mencoba mengakses sistem tanpa izin.</li>
          </ul>
          <p className="mb-8">
            Pelanggaran terhadap ketentuan ini dapat mengakibatkan penghentian
            akun tanpa kompensasi.
          </p>
          <h2 className="text-2xl font-semibold mb-2">
            Hak Kekayaan Intelektual
          </h2>
          <p className="mb-4">Seluruh hak atas:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Nama Nova AI.</li>
            <li>Logo.</li>
            <li>Desain.</li>
            <li>Algoritma.</li>
            <li>Kode program.</li>
            <li>Database.</li>
            <li>Konten.</li>
            <li>Model analisis.</li>
          </ul>
          <p className="mb-8">
            merupakan milik eksklusif Nova AI dan dilindungi oleh peraturan
            perundang-undangan yang berlaku. Pengguna tidak memperoleh hak
            kepemilikan apa pun atas layanan Nova AI.
          </p>
          <h2 className="text-2xl font-semibold mb-2">
            Batasan Tanggung Jawab
          </h2>
          <p className="mb-4">
            Dalam keadaan apa pun Nova AI tidak bertanggung jawab atas:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Kerugian investasi.</li>
            <li>Kehilangan keuntungan.</li>
            <li>Kehilangan peluang.</li>
            <li>Kerugian tidak langsung.</li>
            <li>Kerugian akibat keputusan investasi pengguna.</li>
          </ul>
          <p className="mb-8">
            Tanggung jawab maksimum Nova AI kepada pengguna, apabila ada,
            dibatasi sebesar total biaya langganan yang telah dibayarkan
            pengguna dalam 12 bulan terakhir.
          </p>
          <h2 className="text-2xl font-semibold mb-2">
            Keadaan Kahar (Force Majeure)
          </h2>
          <p className="mb-4">
            Nova AI tidak bertanggung jawab atas keterlambatan atau kegagalan
            layanan yang disebabkan oleh kejadian di luar kendali yang wajar,
            termasuk namun tidak terbatas pada:
          </p>
          <ul className="list-disc list-inside mb-8">
            <li>Bencana alam.</li>
            <li>Gangguan internet.</li>
            <li>Gangguan penyedia layanan pihak ketiga.</li>
            <li>Serangan siber.</li>
            <li>Pemadaman listrik.</li>
            <li>Perubahan regulasi.</li>
            <li>Keadaan darurat nasional.</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-2">Perubahan Ketentuan</h2>
          <p className="mb-8">
            Nova AI berhak mengubah Syarat dan Ketentuan ini sewaktu-waktu.
            Perubahan akan diumumkan melalui website atau sarana komunikasi
            resmi lainnya. Penggunaan layanan secara berkelanjutan setelah
            perubahan dilakukan dianggap sebagai persetujuan terhadap ketentuan
            yang diperbarui.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Hukum yang Berlaku</h2>
          <p className="mb-8">
            Syarat dan Ketentuan ini diatur dan ditafsirkan berdasarkan hukum
            Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan
            terlebih dahulu secara musyawarah. Apabila tidak tercapai
            penyelesaian, sengketa akan diselesaikan melalui pengadilan yang
            berwenang sesuai hukum Republik Indonesia.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Persetujuan Pengguna</h2>
          <p className="mb-4">
            Dengan membuat akun atau menggunakan layanan Nova AI, pengguna
            menyatakan telah membaca, memahami, dan menyetujui seluruh isi
            Syarat dan Ketentuan ini.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsConditions;
