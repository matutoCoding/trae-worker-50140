import { useState } from 'react';
import {
  Handshake,
  TrendingUp,
  ShoppingCart,
  Tag,
  ArrowRightLeft,
  Search,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import StatCard from '@/components/StatCard';
import { formatPrice, formatDate, getStatusColor, getStatusText } from '@/utils/format';

type TabType = 'match' | 'buy' | 'sell' | 'records';

export default function Trading() {
  const {
    tradeRecords,
    buyIntents,
    sellIntents,
    customers,
    collections,
    addTradeRecord,
  } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('match');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const totalTradeValue = tradeRecords
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.price, 0);

  const pendingTradeCount = tradeRecords.filter(
    (t) => t.status === 'pending' || t.status === 'confirmed'
  ).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-warm-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-sky-500" />;
    }
  };

  const filteredRecords = tradeRecords.filter((t) => {
    const matchSearch =
      t.collectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.buyerName.includes(searchTerm) ||
      t.sellerName.includes(searchTerm);
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleMatch = (buyId: string, sellId: string) => {
    const buy = buyIntents.find((b) => b.id === buyId);
    const sell = sellIntents.find((s) => s.id === sellId);
    if (!buy || !sell) return;

    const trade = {
      id: 'TR' + Date.now().toString().slice(-6),
      collectionId: sell.collectionId,
      collectionName: sell.collectionName,
      buyerId: buy.customerId,
      buyerName: buy.customerName,
      sellerId: sell.customerId,
      sellerName: sell.customerName,
      price: sell.expectedPrice,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      type: 'direct' as const,
      notes: '系统智能撮合匹配',
    };
    addTradeRecord(trade);
  };

  const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
    { key: 'match', label: '智能撮合', icon: Handshake },
    { key: 'buy', label: '买入意向', icon: ShoppingCart },
    { key: 'sell', label: '卖出意向', icon: Tag },
    { key: 'records', label: '交易记录', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="交易总额"
          value={formatPrice(totalTradeValue)}
          icon={TrendingUp}
          subtitle="累计成交金额"
        />
        <StatCard
          title="交易笔数"
          value={tradeRecords.length}
          icon={ArrowRightLeft}
          subtitle="累计交易笔数"
        />
        <StatCard
          title="进行中"
          value={pendingTradeCount}
          icon={Clock}
          subtitle="待完成交易"
        />
        <StatCard
          title="撮合意向"
          value={buyIntents.length + sellIntents.length}
          icon={Handshake}
          subtitle="买卖意向总数"
        />
      </div>

      <div className="bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
        <div className="border-b border-paper-200">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-vermilion-600 border-vermilion-500 bg-vermilion-50/50'
                      : 'text-warm-gray-500 border-transparent hover:text-ink-700 hover:bg-paper-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'match' && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="font-serif text-lg font-semibold text-ink-800 mb-2">
                智能撮合推荐
              </h3>
              <p className="text-sm text-warm-gray-500">
                系统根据买卖双方意向自动匹配，撮合成功率更高
              </p>
            </div>

            <div className="space-y-4">
              {buyIntents.slice(0, 3).map((buy, index) => {
                const matchedSell = sellIntents[index % sellIntents.length];
                const collection = collections.find(
                  (c) => c.id === matchedSell?.collectionId
                );
                const matchRate = 75 + Math.floor(Math.random() * 20);

                return (
                  <div
                    key={buy.id}
                    className="border border-paper-200 rounded-xl p-5 bg-paper-50/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full">
                            买方
                          </span>
                          <span className="font-medium text-ink-800">
                            {buy.customerName}
                          </span>
                        </div>
                        <p className="text-sm text-warm-gray-600">
                          意向：{buy.category}
                        </p>
                        <p className="text-sm text-bronze-600 font-medium mt-1">
                          预算：{formatPrice(buy.budgetMin)} - {formatPrice(buy.budgetMax)}
                        </p>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vermilion-500 to-bronze-500 flex items-center justify-center mb-1">
                          <Handshake className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-sm font-bold text-vermilion-600">
                          匹配度 {matchRate}%
                        </span>
                        <button
                          onClick={() => handleMatch(buy.id, matchedSell.id)}
                          className="mt-2 px-4 py-1.5 text-xs bg-vermilion-600 text-white rounded-full hover:bg-vermilion-700 transition-colors"
                        >
                          立即撮合
                        </button>
                      </div>

                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-end gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                            卖方
                          </span>
                          <span className="font-medium text-ink-800">
                            {matchedSell?.customerName}
                          </span>
                        </div>
                        {collection && (
                          <div className="flex items-center justify-end gap-2">
                            <img
                              src={collection.imageUrl}
                              alt={collection.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-sm text-ink-700 font-medium">
                                {collection.name}
                              </p>
                              <p className="text-xs text-warm-gray-500">
                                {collection.dynasty}
                              </p>
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-bronze-600 font-medium mt-1">
                          报价：{formatPrice(matchedSell?.expectedPrice || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'buy' && (
          <div className="p-6">
            <div className="space-y-3">
              {buyIntents.map((intent) => {
                const customer = customers.find((c) => c.id === intent.customerId);
                return (
                  <div
                    key={intent.id}
                    className="flex items-center gap-4 p-4 border border-paper-200 rounded-xl hover:bg-paper-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-5 h-5 text-sky-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-ink-800 truncate">
                          {intent.customerName}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(
                            intent.status
                          )}`}
                        >
                          {getStatusText(intent.status)}
                        </span>
                      </div>
                      <p className="text-sm text-warm-gray-600 mt-1">
                        求购：{intent.category}
                      </p>
                      <p className="text-sm text-warm-gray-500 mt-0.5 line-clamp-1">
                        {intent.description}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-bronze-600 font-semibold">
                        {formatPrice(intent.budgetMin)} - {formatPrice(intent.budgetMax)}
                      </p>
                      <p className="text-xs text-warm-gray-400 mt-1">
                        {formatDate(intent.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'sell' && (
          <div className="p-6">
            <div className="space-y-3">
              {sellIntents.map((intent) => {
                const collection = collections.find(
                  (c) => c.id === intent.collectionId
                );
                return (
                  <div
                    key={intent.id}
                    className="flex items-center gap-4 p-4 border border-paper-200 rounded-xl hover:bg-paper-50 transition-colors"
                  >
                    {collection ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-paper-200 flex-shrink-0">
                        <img
                          src={collection.imageUrl}
                          alt={collection.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Tag className="w-6 h-6 text-amber-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-ink-800 truncate">
                          {intent.collectionName}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(
                            intent.status
                          )}`}
                        >
                          {getStatusText(intent.status)}
                        </span>
                      </div>
                      <p className="text-sm text-warm-gray-600 mt-1">
                        卖家：{intent.customerName}
                      </p>
                      <p className="text-sm text-warm-gray-500 mt-0.5 line-clamp-1">
                        {intent.description}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-bronze-600 font-semibold">
                        报价 {formatPrice(intent.expectedPrice)}
                      </p>
                      <p className="text-xs text-warm-gray-400 mt-1">
                        {formatDate(intent.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div>
            <div className="p-4 border-b border-paper-200 flex flex-wrap items-center justify-between gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
                <input
                  type="text"
                  placeholder="搜索藏品或客户..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-warm-gray-300 rounded-lg w-64 focus:border-bronze-400 transition-colors"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-warm-gray-300 rounded-lg focus:border-bronze-400 transition-colors"
              >
                <option value="">全部状态</option>
                <option value="pending">待确认</option>
                <option value="confirmed">已确认</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-paper-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                      交易编号
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                      藏品
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                      买方
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                      卖方
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                      成交价
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                      日期
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper-100">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-paper-50">
                      <td className="px-4 py-3 text-sm text-ink-700">
                        {record.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-800 font-medium">
                        {record.collectionName}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-700">
                        {record.buyerName}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-700">
                        {record.sellerName}
                      </td>
                      <td className="px-4 py-3 text-sm text-bronze-600 font-medium">
                        {formatPrice(record.price)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(record.status)}
                          <span className="text-sm text-warm-gray-600">
                            {getStatusText(record.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-warm-gray-500">
                        {formatDate(record.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
