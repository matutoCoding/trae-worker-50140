import { useState } from 'react';
import {
  Archive,
  Search,
  Plus,
  AlertTriangle,
  Filter,
  Calendar,
  Tag,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import {
  formatPrice,
  formatDate,
  getRiskLevelText,
  getRiskLevelColor,
  generateId,
} from '@/utils/format';
import { dynastyOptions, materialOptions } from '@/data/mockData';

export default function Collection() {
  const { collections, addCollection } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [dynastyFilter, setDynastyFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    dynasty: '',
    material: '',
    dimensions: '',
    weight: '',
    origin: '',
    description: '',
  });

  const filteredCollections = collections.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDynasty = !dynastyFilter || c.dynasty === dynastyFilter;
    return matchSearch && matchDynasty;
  });

  const highRiskCount = collections.filter((c) => c.riskLevel === 'high').length;
  const pendingCount = collections.filter((c) => c.status === 'pending').length;
  const authenticCount = collections.filter(
    (c) => c.status === 'authentic' || c.status === 'graded' || c.status === 'listed' || c.status === 'sold'
  ).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const collection = {
      id: generateId('CL'),
      ...newCollection,
      imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f3aed5508e9?w=400&h=400&fit=crop',
      status: 'pending' as const,
      estimatedValue: 0,
      riskLevel: 'medium' as const,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addCollection(collection);
    setShowAddModal(false);
    setNewCollection({
      name: '',
      dynasty: '',
      material: '',
      dimensions: '',
      weight: '',
      origin: '',
      description: '',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="藏品总数"
          value={collections.length}
          icon={Archive}
          subtitle="累计入库藏品"
        />
        <StatCard
          title="待鉴定"
          value={pendingCount}
          icon={Calendar}
          subtitle="等待专家鉴定"
        />
        <StatCard
          title="已鉴定真品"
          value={authenticCount}
          icon={Tag}
          subtitle="通过鉴定的藏品"
        />
        <StatCard
          title="高风险提示"
          value={highRiskCount}
          icon={AlertTriangle}
          subtitle="疑似仿品需关注"
        />
      </div>

      <div className="bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
        <div className="p-6 border-b border-paper-200 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-serif text-lg font-semibold text-ink-800">
            藏品列表
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
              <input
                type="text"
                placeholder="搜索藏品名称或编号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-warm-gray-300 rounded-lg w-64 focus:border-bronze-400 transition-colors"
              />
            </div>
            <select
              value={dynastyFilter}
              onChange={(e) => setDynastyFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-warm-gray-300 rounded-lg focus:border-bronze-400 transition-colors"
            >
              <option value="">全部朝代</option>
              {dynastyOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-vermilion-600 text-white rounded-lg hover:bg-vermilion-700 transition-colors btn-ripple"
            >
              <Plus className="w-4 h-4" />
              登记入库
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCollections.map((collection, index) => (
              <div
                key={collection.id}
                className="bg-paper-50 rounded-xl border border-paper-200 overflow-hidden card-hover"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative aspect-square overflow-hidden bg-paper-200">
                  <img
                    src={collection.imageUrl}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <StatusBadge status={collection.status} />
                  </div>
                  {collection.riskLevel === 'high' && (
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${getRiskLevelColor(
                          collection.riskLevel
                        )}`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {getRiskLevelText(collection.riskLevel)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-serif font-semibold text-ink-800">
                      {collection.name}
                    </h4>
                    <span className="text-xs text-warm-gray-400">
                      {collection.id}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-warm-gray-500">
                    <p>
                      朝代：
                      <span className="text-ink-700">{collection.dynasty}</span>
                    </p>
                    <p>
                      材质：
                      <span className="text-ink-700">{collection.material}</span>
                    </p>
                    <p>
                      规格：
                      <span className="text-ink-700">
                        {collection.dimensions}
                      </span>
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-paper-200 flex items-center justify-between">
                    <span className="text-sm text-warm-gray-500">
                      {collection.estimatedValue > 0
                        ? `估值 ${formatPrice(collection.estimatedValue)}`
                        : '待估值'}
                    </span>
                    <span className="text-xs text-warm-gray-400">
                      {formatDate(collection.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCollections.length === 0 && (
            <div className="text-center py-12">
              <Archive className="w-12 h-12 text-warm-gray-300 mx-auto mb-3" />
              <p className="text-warm-gray-500">暂无符合条件的藏品</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-ink-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-card-hover w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-paper-200">
              <h3 className="font-serif text-xl font-semibold text-ink-800">
                藏品登记入库
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">
                    藏品名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCollection.name}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm"
                    placeholder="请输入藏品名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">
                    朝代 *
                  </label>
                  <select
                    required
                    value={newCollection.dynasty}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        dynasty: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm"
                  >
                    <option value="">请选择朝代</option>
                    {dynastyOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">
                    材质
                  </label>
                  <select
                    value={newCollection.material}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        material: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm"
                  >
                    <option value="">请选择材质</option>
                    {materialOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">
                    尺寸规格
                  </label>
                  <input
                    type="text"
                    value={newCollection.dimensions}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        dimensions: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm"
                    placeholder="如：直径28mm 厚1.5mm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">
                    重量
                  </label>
                  <input
                    type="text"
                    value={newCollection.weight}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        weight: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm"
                    placeholder="如：7.5g"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">
                    来源
                  </label>
                  <input
                    type="text"
                    value={newCollection.origin}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        origin: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm"
                    placeholder="如：民间征集、藏家委托"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-ink-700 mb-1">
                    藏品描述
                  </label>
                  <textarea
                    rows={3}
                    value={newCollection.description}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm resize-none"
                    placeholder="请详细描述藏品特征、包浆、铸造工艺等信息"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2 border border-warm-gray-300 text-ink-700 rounded-lg hover:bg-paper-100 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-vermilion-600 text-white rounded-lg hover:bg-vermilion-700 transition-colors"
                >
                  确认入库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
