import interiorImg from "@/assets/restaurant-interior.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/const";

const About = () => {
  const { lang, t } = useLanguage();

  return (
    <section id="about" className="relative scroll-mt-20 overflow-hidden bg-[#30251f] py-16 text-[#fff8ee] md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="order-first lg:order-none"
          >
            <img
              src={interiorImg}
              alt="Mix Food restaurant interior"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-[2rem_5rem_2rem_2rem] object-cover shadow-layered"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="space-y-4 md:space-y-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#eabda4]">{lang === "vn" ? "Câu chuyện của chúng tôi" : "Our story"}</p>
            <h2 className="font-serif text-3xl font-semibold text-balance md:text-4xl lg:text-5xl">
              {t.aboutTitle}
            </h2>
            <p className="max-w-[65ch] text-sm leading-7 text-[#e4d4c8] md:text-base">
              {t.aboutText}
            </p>
            <div className="flex flex-wrap gap-3 pt-2 md:pt-4">
              {[t.aboutSalt, t.aboutSweet, t.aboutSpicy, t.aboutSour].map((flavor) => (
                <span key={flavor} className="rounded-full border border-[#eabda4]/30 px-4 py-2 text-xs font-medium text-[#f6d3bb]">
                  {flavor}
                </span>
              ))}
            </div>
            <Link to={ROUTES.BOOKING} className="inline-flex min-h-12 items-center gap-3 border-b border-[#eabda4]/50 text-sm font-semibold text-[#f6d3bb] transition-colors hover:text-white">{t.reserveTable}<ArrowUpRight className="h-4 w-4" /></Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
