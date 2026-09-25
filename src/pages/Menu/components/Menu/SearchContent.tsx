import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group"
import { useLanguage } from "@/contexts/LanguageContext"
import { Search } from "lucide-react"

interface SearchContentProps {
    value: string
    onSearchChange?: (query: string) => void
}

export default function SearchContent({ value, onSearchChange }: SearchContentProps) {
    const { t } = useLanguage()

    return (
        <InputGroup className="h-10 rounded-xl">
            <InputGroupInput 
                placeholder={t.menuSearchPlaceholder} 
                className="focus-visible:ring-offset-0 focus-visible:border-input"
                value={value}
                onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
        </InputGroup>
    )
}
