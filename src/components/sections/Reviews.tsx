import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";

const reviews = [
  {
    name: "Bảo Yến",
    meta: "Local Guide · 137 bài đánh giá · 935 ảnh",
    time: "12 tuần trước",
    rating: 5,
    en: "A varied Thai menu with rich flavours and tender food. The upstairs air-conditioned area is comfortable; the restaurant is in an alley, but the food is worth finding.",
    vn: "Đồ Thái ở đây siêu nhiều, vị đậm đà mà giá mềm. Ngồi tầng 2 có điều hoà khá thoải mái. Quán nằm trong hẻm nên đi ô tô hơi bất tiện, đồ ăn chế biến hơi lâu nhưng xứng đáng chờ.",
    details: "Đồ ăn: 5/5 · Dịch vụ: 5/5 · Bầu không khí: 5/5",
  },
  {
    name: "RJC",
    meta: "Local Guide · 69 bài đánh giá · 134 ảnh",
    time: "8 tuần trước",
    rating: 5,
    en: "Really good food from Mix Food Am Thuc Thai! Everything was tasty and full of flavour. I really enjoyed the meal and would definitely recommend giving them a try. I’ll be ordering again from them!",
    vn: "Really good food from Mix Food Am Thuc Thai! Everything was tasty and full of flavour. I really enjoyed the meal and would definitely recommend giving them a try. I’ll be ordering again from them!",
    details: "Giao tận nơi · Bữa tối · 100–200 N ₫",
  },
  {
    name: "Hiếu",
    meta: "Local Guide · 45 bài đánh giá · 18 ảnh",
    time: "5 tuần trước",
    rating: 5,
    en: "The food is delicious and more affordable than many nearby places. The air-conditioned dining room is pleasant, and it is worth trying.",
    vn: "Đồ ăn ngon và rẻ hơn mấy quán Thái khác, có phòng điều hòa, đáng để thử.",
    details: "Ăn tại chỗ · Bữa tối · 100–200 N ₫",
  },
];

const Reviews = () => {
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
                  <p className="font-semibold text-sm text-foreground">{review.name} <ExternalLink className="ml-0.5 inline size-3 text-primary" /></p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{review.meta}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{review.time}</span>
              </div>
              <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed">
                {lang === "vn" ? review.vn : review.en}
              </p>
              <p className="border-t border-border/70 pt-3 text-xs font-medium text-muted-foreground">{review.details}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">Nguồn đánh giá: Google Maps.</p>
      </div>
    </section>
  );
};

export default Reviews;
