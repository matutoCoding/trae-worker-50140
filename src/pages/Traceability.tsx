import { useState } from 'react';
import {
  History,
  Archive,
  ShieldCheck,
  Award,
  Users,
  TrendingUp,
  AlertTriangle,
  Search,
  Eye,
  FileCheck,
  Package,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import StatCard from '@/components/StatCard';
import {
  formatPrice,
  formatDate,
  getRiskLevelColor,
  getRiskLevelText,
} from '@/utils/format';

export default function Traceability() {
  const { collections, traceRecords, appraisals, gradings, tradeRecords } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredCollections = collections.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTraces = traceRecords.length;
  const highRiskCount = collections.filter((c) => c.riskLevel === 'high').length;
  const soldCount = collections.filter((c) => c.status === 'sold').length;
  const inStockCount = collections.filter(
    (c) => c.status !== 'sold' && c.status !== 'replica'
  ).length;

  const selectedCollection = collections.find((c) => c.id === selectedCollectionId);
  const collectionTraces = traceRecords
    .filter((t) => t.collectionId === selectedCollectionId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return Archive;
      case 'appraisal':
        return ShieldCheck;
      case 'grading':
        return Award;
      case 'ownership':
        return Users;
      case 'trade':
        return TrendingUp;
      case 'auction':
        return Package;
      default:
        return History;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'registration':
        return 'bg-sky-100 text-sky-600';
      case 'appraisal':
        return 'bg-emerald-100 text-emerald-600';
      case 'grading':
        return 'bg-bronze-100 text-bronze-600';
      case 'ownership':
        return 'bg-amber-100 text-amber-600';
      case 'trade':
        return 'bg-vermilion-100 text-vermilion-600';
      case 'auction':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-warm-gray-100 text-warm-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      registration: '入库登记',
      appraisal: '真伪鉴定',
      grading: '品相评级',
      ownership: '持有人变更',
      trade: '交易记录',
      auction: '拍卖成交',
    };
    return map[type] || type;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="在库藏品"
          value={inStockCount}
          icon={Archive}
          subtitle="当前库存藏品"
        />
        <StatCard
          title="溯源记录"
          value={totalTraces}
          icon={History}
          subtitle="累计流转记录"
        />
        <StatCard
          title="已成交"
          value={soldCount}
          icon={TrendingUp}
          subtitle="完成交易藏品"
        />
        <StatCard
          title="风险预警"
          value={highRiskCount}
          icon={AlertTriangle}
          subtitle="高风险待处理"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
          <div className="p-4 border-b border-paper-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
              <input
                type="text"
                placeholder="搜索藏品名称或编号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-warm-gray-300 rounded-lg focus:border-bronze-400 transition-colors"
              />
            </div>
          </div>
          <div className="max-h-[550px] overflow-auto">
            <div className="divide-y divide-paper-100">
              {filteredCollections.map((collection) => (
                <div
                  key={collection.id}
                  onClick={() => setSelectedCollectionId(collection.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedCollectionId === collection.id
                      ? 'bg-bronze-50'
                      : 'hover:bg-paper-50'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-paper-200 flex-shrink-0">
                      <img
                        src={collection.imageUrl}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-ink-800 truncate">
                          {collection.name}
                        </h4>
                        {collection.riskLevel === 'high' && (
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-warm-gray-500 mt-0.5">
                        {collection.id} · {collection.dynasty}
                      </p>
                      <p className="text-xs text-warm-gray-400 mt-1">
                        入库：{formatDate(collection.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
          {selectedCollection ? (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-paper-200">
                <div className="flex gap-5">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-paper-200 flex-shrink-0">
                    <img
                      src={selectedCollection.imageUrl}
                      alt={selectedCollection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-ink-800">
                          {selectedCollection.name}
                        </h3>
                        <p className="text-sm text-warm-gray-500 mt-1">
                          编号：{selectedCollection.id}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full ${getRiskLevelColor(
                            selectedCollection.riskLevel
                          )}`}
                        >
                          {getRiskLevelText(selectedCollection.riskLevel)}
                        </span>
                        <button
                          onClick={() => setShowDetail(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-bronze-50 text-bronze-700 rounded-lg hover:bg-bronze-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          查看档案
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-warm-gray-500">朝代：</span>
                        <span className="text-ink-700">
                          {selectedCollection.dynasty}
                        </span>
                      </div>
                      <div>
                        <span className="text-warm-gray-500">材质：</span>
                        <span className="text-ink-700">
                          {selectedCollection.material}
                        </span>
                      </div>
                      <div>
                        <span className="text-warm-gray-500">规格：</span>
                        <span className="text-ink-700">
                          {selectedCollection.dimensions}
                        </span>
                      </div>
                    </div>
                    {selectedCollection.estimatedValue > 0 && (
                      <p className="text-sm text-bronze-600 font-medium mt-2">
                        参考估值：{formatPrice(selectedCollection.estimatedValue)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-auto">
                <h4 className="font-serif font-semibold text-ink-800 mb-5">
                  流转溯源
                </h4>
                <div className="relative pl-8">
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-bronze-300 via-bronze-200 to-paper-200" />

                  {collectionTraces.map((trace, index) => {
                    const Icon = getTypeIcon(trace.type);
                    const isLast = index === collectionTraces.length - 1;
                    return (
                      <div
                        key={trace.id}
                        className={`relative pb-6 ${isLast ? 'pb-0' : ''}`}
                      >
                        <div
                          className={`absolute -left-[30px] top-0 w-8 h-8 rounded-full ${getTypeColor(
                            trace.type
                          )} flex items-center justify-center ring-4 ring-white`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="bg-paper-50 rounded-xl p-4 ml-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-0.5 bg-white rounded-full text-warm-gray-600 border border-paper-200">
                                {getTypeLabel(trace.type)}
                              </span>
                              <span className="text-xs text-warm-gray-400">
                                {formatDate(trace.date)}
                              </span>
                            </div>
                          </div>
                          <h5 className="font-medium text-ink-800 mb-1">
                            {trace.title}
                          </h5>
                          <p className="text-sm text-warm-gray-600">
                            {trace.description}
                          </p>
                          <p className="text-xs text-warm-gray-400 mt-2">
                            操作人：{trace.operator}
                          </p>
                          {trace.details && (
                            <div className="mt-3 pt-3 border-t border-paper-200 grid grid-cols-2 gap-2">
                              {Object.entries(trace.details).map(([key, value]) => (
                                <div key={key} className="text-xs">
                                  <span className="text-warm-gray-500">{key}：</span>
                                  <span className="text-ink-700 font-medium">
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {collectionTraces.length === 0 && (
                    <div className="text-center py-12">
                      <History className="w-12 h-12 text-warm-gray-200 mx-auto mb-3" />
                      <p className="text-warm-gray-500">暂无流转记录</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[550px] flex flex-col items-center justify-center">
              <History className="w-16 h-16 text-warm-gray-200 mb-3" />
              <p className="text-warm-gray-500">请从左侧选择藏品查看溯源</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
        <div className="p-4 border-b border-paper-200 bg-red-50/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-serif font-semibold text-ink-800">风险预警</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections
              .filter((c) => c.riskLevel === 'high')
              .slice(0, 6)
              .map((collection) => (
                <div
                  key={collection.id}
                  className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-paper-200 flex-shrink-0">
                    <img
                      src={collection.imageUrl}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-ink-800 text-sm truncate">
                      {collection.name}
                    </h4>
                    <p className="text-xs text-warm-gray-500">{collection.id}</p>
                    <p className="text-xs text-red-600 mt-0.5">
                      疑似仿品，需复核
                    </p>
                  </div>
                </div>
              ))}
          </div>
          {collections.filter((c) => c.riskLevel === 'high').length === 0 && (
            <div className="text-center py-8">
              <ShieldCheck className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
              <p className="text-warm-gray-500 text-sm">暂无风险预警</p>
            </div>
          )}
        </div>
      </div>

      {showDetail && selectedCollection && (
        <div
          className="fixed inset-0 bg-ink-900/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-paper-200 bg-paper-50">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-ink-800">
                  藏品完整档案
                </h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-warm-gray-400 hover:text-ink-700"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
              <div className="flex gap-6 mb-6 pb-6 border-b border-paper-200">
                <img
                  src={selectedCollection.imageUrl}
                  alt={selectedCollection.name}
                  className="w-32 h-32 rounded-xl object-cover shadow"
                />
                <div className="flex-1">
                  <h4 className="font-serif text-xl font-bold text-ink-800">
                    {selectedCollection.name}
                  </h4>
                  <p className="text-warm-gray-500 mt-1">
                    藏品编号：{selectedCollection.id}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div>
                      <span className="text-warm-gray-500">朝代：</span>
                      <span className="text-ink-700">{selectedCollection.dynasty}</span>
                    </div>
                    <div>
                      <span className="text-warm-gray-500">材质：</span>
                      <span className="text-ink-700">{selectedCollection.material}</span>
                    </div>
                    <div>
                      <span className="text-warm-gray-500">规格：</span>
                      <span className="text-ink-700">{selectedCollection.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-warm-gray-500">重量：</span>
                      <span className="text-ink-700">{selectedCollection.weight}</span>
                    </div>
                    <div>
                      <span className="text-warm-gray-500">来源：</span>
                      <span className="text-ink-700">{selectedCollection.origin}</span>
                    </div>
                    <div>
                      <span className="text-warm-gray-500">入库时间：</span>
                      <span className="text-ink-700">
                        {formatDate(selectedCollection.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="font-medium text-ink-800 mb-3 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-bronze-500" />
                  鉴定信息
                </h5>
                {appraisals.find((a) => a.collectionId === selectedCollection.id) ? (
                  <div className="bg-paper-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-ink-700">
                        {
                          appraisals.find((a) => a.collectionId === selectedCollection.id)
                            ?.expertName
                        }
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                        已鉴定
                      </span>
                    </div>
                    <p className="text-sm text-warm-gray-600">
                      {
                        appraisals.find((a) => a.collectionId === selectedCollection.id)
                          ?.opinion
                      }
                    </p>
                    <p className="text-xs text-warm-gray-400 mt-2">
                      证书编号：
                      {
                        appraisals.find((a) => a.collectionId === selectedCollection.id)
                          ?.certificateNo
                      }
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-warm-gray-500">尚未鉴定</p>
                )}
              </div>

              <div className="mb-6">
                <h5 className="font-medium text-ink-800 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-bronze-500" />
                  评级信息
                </h5>
                {gradings.find((g) => g.collectionId === selectedCollection.id) ? (
                  <div className="bg-paper-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-serif text-lg font-bold text-bronze-600">
                        {
                          gradings.find((g) => g.collectionId === selectedCollection.id)
                            ?.grade
                        }
                      </span>
                      <span className="text-sm text-bronze-600">
                        估值：
                        {formatPrice(
                          gradings.find((g) => g.collectionId === selectedCollection.id)
                            ?.estimatedValueMin || 0
                        )}{' '}
                        -{' '}
                        {formatPrice(
                          gradings.find((g) => g.collectionId === selectedCollection.id)
                            ?.estimatedValueMax || 0
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-warm-gray-400">
                      评级师：
                      {gradings.find((g) => g.collectionId === selectedCollection.id)?.grader}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-warm-gray-500">尚未评级</p>
                )}
              </div>

              <div>
                <h5 className="font-medium text-ink-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-bronze-500" />
                  交易记录
                </h5>
                {tradeRecords.filter((t) => t.collectionId === selectedCollection.id)
                  .length > 0 ? (
                  <div className="space-y-2">
                    {tradeRecords
                      .filter((t) => t.collectionId === selectedCollection.id)
                      .map((trade) => (
                        <div
                          key={trade.id}
                          className="flex items-center justify-between p-3 bg-paper-50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-ink-700">
                              {trade.buyerName} 买入
                            </p>
                            <p className="text-xs text-warm-gray-500">
                              卖家：{trade.sellerName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-bronze-600">
                              {formatPrice(trade.price)}
                            </p>
                            <p className="text-xs text-warm-gray-400">
                              {formatDate(trade.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-warm-gray-500">暂无交易记录</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
