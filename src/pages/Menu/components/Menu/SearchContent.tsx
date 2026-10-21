import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group"
import { useLanguage } from "@/contexts/LanguageContext"
import { Search, X } from "lucide-react"

interface SearchContentProps {
    value: string
    onSearchChange?: (query: string) => void
}

export default function SearchContent({ value, onSearchChange }: SearchContentProps) {
    const { lang, t } = useLanguage()

    return (
        <InputGroup className="h-11 rounded-full bg-card">
            <InputGroupInput 
                placeholder={t.menuSearchPlaceholder} 
                aria-label={t.menuSearchPlaceholder}
                className="focus-visible:ring-offset-0 focus-visible:border-input"
                value={value}
                onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
            {value && <InputGroupAddon align="inline-end"><button type="button" onClick={() => onSearchChange?.("")} aria-label={lang === "vn" ? "Xóa tìm kiếm" : "Clear search"} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button></InputGroupAddon>}
        </InputGroup>
    )
}
