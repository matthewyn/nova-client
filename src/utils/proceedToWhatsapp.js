export const proceedToWhatsapp = () => {
  const phoneNumber = "6285121536011";

  const text = encodeURIComponent(
    "Halo, saya tertarik untuk berlangganan paket *PRO Nova AI* seharga Rp. 1.000.000/bulan. Mohon info lebih lanjut.",
  );
  window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
};
