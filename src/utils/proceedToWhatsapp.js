export const proceedToWhatsapp = () => {
  const phoneNumber = "6285121536011";

  const text = encodeURIComponent(
    "Hi, I'm interested in subscribing to the *PRO Nova AI* package for Rp. 1.000.000/month. Please provide more information.",
  );
  window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
};
