import { useState } from 'react';
import { Categoria } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Trash2, Settings } from 'lucide-react';

export interface CategoryManagerProps {
  expense: Categoria[];
  income: Categoria[];
  onAdd: (cat: { nome: string; tipo: string; icone?: string; cor?: string }) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
  embedded?: boolean;
}

function CategoryList({
  categories,
  tipo,
  onAdd,
  onRemove,
}: {
  categories: Categoria[];
  tipo: string;
  onAdd: CategoryManagerProps['onAdd'];
  onRemove: CategoryManagerProps['onRemove'];
}) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('📁');

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd({ nome: newName.trim(), tipo, icone: newIcon });
    setNewName('');
    setNewIcon('📁');
    setAdding(false);
  };

  return (
    <div className="space-y-1">
      {categories.map((cat) => (
        <div key={cat.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/50 group">
          <span className="text-sm">{cat.icone || '📁'}</span>
          <span className="text-sm flex-1">{cat.nome}</span>
          {cat.cor && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.cor }} />}
          <button
            onClick={() => onRemove(cat.id)}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-expense p-0.5 transition-opacity"
            title="Excluir"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      {adding ? (
        <div className="flex items-center gap-2 pt-2">
          <Input value={newIcon} onChange={e => setNewIcon(e.target.value)} className="w-12 h-8 text-center text-sm p-0" maxLength={2} />
          <Input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Nova categoria"
            className="h-8 text-sm flex-1"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={handleAdd}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => setAdding(false)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" className="h-8 text-xs mt-2" onClick={() => setAdding(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar Categoria
        </Button>
      )}
    </div>
  );
}

export function CategoryManager({ expense, income, onAdd, onRemove, onClose, embedded }: CategoryManagerProps) {
  const [tab, setTab] = useState<'Despesa' | 'Receita'>('Despesa');

  const content = (
    <>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('Despesa')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'Despesa' ? 'bg-destructive/15 text-destructive' : 'text-muted-foreground hover:bg-muted'}`}
        >
          Despesas
        </button>
        <button
          onClick={() => setTab('Receita')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'Receita' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
        >
          Receitas
        </button>
      </div>
      <div className="overflow-y-auto flex-1 pr-1">
        <CategoryList
          categories={tab === 'Despesa' ? expense : income}
          tipo={tab}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      </div>
    </>
  );

  if (embedded) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-fade-in max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold font-display">Gerenciar Categorias</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        {content}
      </div>
    </div>
  );
}
