import ReserveButton from "@/components/navigation/ReserveButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { INFORMATION_RESTAURANT } from "@/utils/const";
import { motion } from "framer-motion";
import { Clock, MapPin, Phone } from "lucide-react";

const Location = () => {
  const { lang, t } = useLanguage();

  return (
    <section id="location" className="py-24">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-16"
        >
          {t.location}
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="rounded-2xl overflow-hidden shadow-layered aspect-[4/3]"
          >
            <iframe
              src="
              https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1917.108723325348!2d108.23610931193348!3d16.054202099999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142177d7ff847cd%3A0x304e7f27b5c56286!2sMix%20Food!5e0!3m2!1svi!2s!4v1774321341710!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mix Food Da Nang location"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                  {lang === "vn" ? "Địa Chỉ" : "Address"}
                </h3>
                <p className="text-muted-foreground">{INFORMATION_RESTAURANT.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                  {t.hours}
                </h3>
                <p className="text-muted-foreground">{t.hoursValue}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <Phone size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                  {lang === "vn" ? "Điện Thoại" : "Phone"}
                </h3>
                <p className="text-muted-foreground">{INFORMATION_RESTAURANT.phone}</p>
              </div>
            </div>

            {/* <a
              href="/reserve"
              className="inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:-translate-y-0.5 transition-all active:scale-95 mt-4"
            >
              {t.reserveTable}
            </a> */}
            <div className="pt-2">
              <ReserveButton content={t.reserveTable} className="h-11 px-8 shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Location;
