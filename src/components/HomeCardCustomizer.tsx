import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical } from "lucide-react";

export type HomeCard = {
  id: string;
  label: string;
  visible: boolean;
};

const DEFAULT_CARDS: HomeCard[] = [
  { id: "summary", label: "Resumo Financeiro", visible: true },
  { id: "categories", label: "Categorias", visible: true },
  { id: "transactions", label: "Últimos Lançamentos", visible: true },
];

const STORAGE_KEY = "home-cards-config";

export function useHomeCards() {
  const [cards, setCards] = useState<HomeCard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_CARDS;
      }
    }
    return DEFAULT_CARDS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const toggleCard = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    );
  };

  const isVisible = (id: string) => cards.find((c) => c.id === id)?.visible ?? true;

  return { cards, toggleCard, isVisible };
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cards: HomeCard[];
  onToggle: (id: string) => void;
}

export function HomeCardCustomizer({ open, onOpenChange, cards, onToggle }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Personalizar cards da Home</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Marque/desmarque os cards que deseja exibir.
          </p>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              <Checkbox
                checked={card.visible}
                onCheckedChange={() => onToggle(card.id)}
                id={card.id}
              />
              <label
                htmlFor={card.id}
                className="text-sm font-medium cursor-pointer flex-1"
              >
                {card.label}
              </label>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
