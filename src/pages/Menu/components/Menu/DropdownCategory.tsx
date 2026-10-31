
import { useUiText } from '@/contexts/LanguageContext';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { useLanguage } from "@/contexts/LanguageContext"
import { useMenu } from "@/hooks/api/useMenu"

interface DropdownCategoryProps {
    onSelectCategory?: (categoryId: string | null) => void
}

export default function DropdownCategory({ onSelectCategory }: DropdownCategoryProps) {
  const ui = useUiText();
    const { lang } = useLanguage()
    const { data: categories } = useMenu()

    return (
        <Select onValueChange={(value) => onSelectCategory?.(value === "all" ? null : value)}>
            <SelectTrigger className="md:w-[180px] rounded-xl">
                <SelectValue placeholder={lang === "vn" ? ui("Tất cả danh mục") : "All Categories"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="all">
                        {lang === "vn" ? ui("Tất cả") : ui("All")}
                    </SelectItem>
                    {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            {lang === "vn" ? category.vn : category.en}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
