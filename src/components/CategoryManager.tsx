import { useState } from 'react';
import { CategoryNode, CategoryStore } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Trash2, ChevronRight, ChevronDown, Settings } from 'lucide-react';

interface CategoryManagerProps {
  categories: CategoryStore;
  onAdd: (type: 'expense' | 'income', parentPath: string[], name: string, icon: string) => void;
  onRemove: (type: 'expense' | 'income', path: string[]) => void;
  onClose: () => void;
}

function CategoryTree({
  nodes,
  type,
  parentPath,
  onAdd,
  onRemove,
  depth = 0,
}: {
  nodes: CategoryNode[];
  type: 'expense' | 'income';
  parentPath: string[];
  onAdd: CategoryManagerProps['onAdd'];
  onRemove: CategoryManagerProps['onRemove'];
  depth?: number;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('📁');

  const handleAdd = (nodeName: string) => {
    if (!newName.trim()) return;
    const path = [...parentPath, nodeName];
    onAdd(type, path, newName.trim(), newIcon);
    setNewName('');
    setNewIcon('📁');
    setAddingTo(null);
  };

  const handleAddRoot = () => {
    if (!newName.trim()) return;
    onAdd(type, parentPath, newName.trim(), newIcon);
    setNewName('');
    setNewIcon('📁');
    setAddingTo(null);
  };

  return (
    <div className="space-y-1">
      {nodes.map((node) => {
        const currentPath = [...parentPath, node.name];
        const isExpanded = expanded[node.name];
        const hasChildren = node.children.length > 0;

        return (
          <div key={node.id}>
            <div
              className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/50 group"
              style={{ paddingLeft: `${depth * 20 + 8}px` }}
            >
              <button
                onClick={() => setExpanded(p => ({ ...p, [node.name]: !p[node.name] }))}
                className="w-4 h-4 flex items-center justify-center text-muted-foreground"
              >
                {hasChildren ? (isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />) : <span className="w-3" />}
              </button>
              <span className="text-sm">{node.icon}</span>
              <span className="text-sm flex-1">{node.name}</span>
              <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                {depth < 2 && (
                  <button
                    onClick={() => { setAddingTo(addingTo === node.name ? null : node.name); setExpanded(p => ({ ...p, [node.name]: true })); }}
                    className="text-muted-foreground hover:text-primary p-0.5"
                    title="Adicionar subcategoria"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onRemove(type, currentPath)}
                  className="text-muted-foreground hover:text-expense p-0.5"
                  title="Excluir"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {addingTo === node.name && (
              <div className="flex items-center gap-2 py-1 animate-fade-in" style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }}>
                <Input
                  value={newIcon}
                  onChange={e => setNewIcon(e.target.value)}
                  className="w-12 h-8 text-center text-sm p-0"
                  maxLength={2}
                />
                <Input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Nome da subcategoria"
                  className="h-8 text-sm flex-1"
                  onKeyDown={e => e.key === 'Enter' && handleAdd(node.name)}
                  autoFocus
                />
                <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => handleAdd(node.name)}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            {isExpanded && hasChildren && (
              <CategoryTree
                nodes={node.children}
                type={type}
                parentPath={currentPath}
                onAdd={onAdd}
                onRemove={onRemove}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}

      {depth === 0 && (
        <div className="flex items-center gap-2 pt-2">
          {addingTo === '__root__' ? (
            <>
              <Input value={newIcon} onChange={e => setNewIcon(e.target.value)} className="w-12 h-8 text-center text-sm p-0" maxLength={2} />
              <Input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Nova categoria"
                className="h-8 text-sm flex-1"
                onKeyDown={e => e.key === 'Enter' && handleAddRoot()}
                autoFocus
              />
              <Button size="sm" variant="ghost" className="h-8 px-2" onClick={handleAddRoot}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => setAddingTo(null)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setAddingTo('__root__')}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar Categoria
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function CategoryManager({ categories, onAdd, onRemove, onClose }: CategoryManagerProps) {
  const [tab, setTab] = useState<'expense' | 'income'>('expense');

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

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('expense')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'expense' ? 'bg-expense/15 text-expense' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Despesas
          </button>
          <button
            onClick={() => setTab('income')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'income' ? 'bg-income/15 text-income' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Receitas
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-1">
          <CategoryTree
            nodes={tab === 'expense' ? categories.expense : categories.income}
            type={tab}
            parentPath={[]}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        </div>
      </div>
    </div>
  );
}
