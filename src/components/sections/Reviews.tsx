
import { useUiText } from '@/contexts/LanguageContext';
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Bảo Yến",
    rating: 5,
    en: "A varied Thai menu with rich flavours and tender food. The upstairs air-conditioned area is comfortable; the restaurant is in an alley, but the food is worth finding.",
    vn: "Đồ Thái ở đây siêu nhiều, vị đậm đà mà giá mềm. Ngồi tầng 2 có điều hoà khá thoải mái. Quán nằm trong hẻm nên đi ô tô hơi bất tiện, đồ ăn chế biến hơi lâu nhưng xứng đáng chờ.",
  },
  {
    name: "RJC",
    rating: 5,
    en: "Really good food from Mix Food Am Thuc Thai! Everything was tasty and full of flavour. I really enjoyed the meal and would definitely recommend giving them a try. I’ll be ordering again from them!",
    vn: "Đồ ăn ở Mix Food Ẩm Thực Thái rất ngon! Món nào cũng đậm đà. Tôi rất thích bữa ăn này và sẽ giới thiệu mọi người đến thử. Tôi nhất định sẽ đặt lại!",
  },
  {
    name: "Hiếu",
    rating: 5,
    en: "The food is delicious and more affordable than many nearby places. The air-conditioned dining room is pleasant, and it is worth trying.",
    vn: "Đồ ăn ngon và rẻ hơn mấy quán Thái khác, có phòng điều hòa, đáng để thử.",
  },
];

const Reviews = () => {
  const ui = useUiText();
  const { lang, t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-center mb-8 md:mb-16"
        >
          {t.reviews}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="bg-card rounded-2xl p-5 md:p-6 shadow-layered space-y-3 md:space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-foreground">{review.name}</p>
                </div>
              </div>
              <div className="flex gap-1" aria-label={ui('{rating} out of 5 stars', { rating: review.rating })}>
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed">
                {lang === "vn" ? review.vn : review.en}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">{ui("Nguồn đánh giá: Google Maps.") }</p>
      </div>
    </section>
  );
};

export default Reviews;
