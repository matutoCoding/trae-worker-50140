import { useState } from 'react';
import {
  Gavel,
  Clock,
  TrendingUp,
  Users,
  Wallet,
  ChevronRight,
  Timer,
  Star,
  Shield,
  DollarSign,
  Play,
  X,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import StatCard from '@/components/StatCard';
import {
  formatPrice,
  formatDate,
  formatDateTime,
  getStatusColor,
  getStatusText,
} from '@/utils/format';

type TabType = 'sessions' | 'lots' | 'deposit';

export default function Auction() {
  const { auctionSessions, auctionLots, auctionBids, customers, updateCustomerDeposit } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('sessions');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [depositModal, setDepositModal] = useState<{
    customerId: string;
    customerName: string;
    action: 'recharge' | 'refund';
    currentDeposit: number;
  } | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const upcomingSessions = auctionSessions.filter((s) => s.status === 'upcoming');
  const ongoingSessions = auctionSessions.filter((s) => s.status === 'ongoing');
  const totalLots = auctionLots.length;
  const totalDeposit = customers.reduce((sum, c) => sum + c.deposit, 0);

  const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
    { key: 'sessions', label: '拍卖专场', icon: Gavel },
    { key: 'lots', label: '拍品管理', icon: Star },
    { key: 'deposit', label: '保证金管理', icon: Wallet },
  ];

  const selectedSessionData = auctionSessions.find((s) => s.id === selectedSession);
  const sessionLots = auctionLots.filter((l) => l.sessionId === selectedSession);

  const getLotBids = (lotId: string) => {
    return auctionBids
      .filter((b) => b.lotId === lotId)
      .sort((a, b) => b.price - a.price);
  };

  const handleDepositConfirm = () => {
    if (!depositModal) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('请输入有效的金额');
      return;
    }
    if (depositModal.action === 'refund' && amount > depositModal.currentDeposit) {
      alert('退还金额不能超过当前保证金余额');
      return;
    }
    updateCustomerDeposit(depositModal.customerId, amount, depositModal.action);
    setDepositModal(null);
    setDepositAmount('');
  };

  const openDepositModal = (
    customerId: string,
    customerName: string,
    action: 'recharge' | 'refund',
    currentDeposit: number
  ) => {
    setDepositModal({ customerId, customerName, action, currentDeposit });
    setDepositAmount('');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="拍卖专场"
          value={auctionSessions.length}
          icon={Gavel}
          subtitle="累计举办专场"
        />
        <StatCard
          title="进行中"
          value={ongoingSessions.length}
          icon={Play}
          subtitle="正在进行的专场"
        />
        <StatCard
          title="拍品总数"
          value={totalLots}
          icon={Star}
          subtitle="所有拍品数量"
        />
        <StatCard
          title="保证金总额"
          value={formatPrice(totalDeposit)}
          icon={Wallet}
          subtitle="客户保证金余额"
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

        {activeTab === 'sessions' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {auctionSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    setSelectedSession(session.id);
                    setActiveTab('lots');
                  }}
                  className="bg-paper-50 rounded-xl border border-paper-200 overflow-hidden card-hover cursor-pointer"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={session.imageUrl}
                      alt={session.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                          session.status
                        )}`}
                      >
                        {session.status === 'ongoing' && (
                          <Timer className="w-3 h-3 animate-pulse" />
                        )}
                        {getStatusText(session.status)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-semibold text-ink-800">
                      {session.name}
                    </h3>
                    <p className="text-sm text-warm-gray-500 mt-1 line-clamp-2">
                      {session.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-paper-200 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-warm-gray-500">
                        <span className="flex items-center gap-1">
                          <Gavel className="w-3.5 h-3.5" />
                          {session.lotCount}件
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {formatPrice(session.depositAmount)}保证金
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-warm-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'lots' && (
          <div>
            {selectedSessionData && (
              <div className="p-4 bg-paper-50 border-b border-paper-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-semibold text-ink-800">
                      {selectedSessionData.name}
                    </h3>
                    <p className="text-xs text-warm-gray-500 mt-1">
                      {formatDateTime(selectedSessionData.startTime)} -{' '}
                      {formatDateTime(selectedSessionData.endTime)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      selectedSessionData.status
                    )}`}
                  >
                    {getStatusText(selectedSessionData.status)}
                  </span>
                </div>
              </div>
            )}
            <div className="p-6">
              {selectedSession ? (
                <div className="space-y-4">
                  {sessionLots.map((lot) => {
                    const topBid = getLotBids(lot.id)[0];
                    return (
                      <div
                        key={lot.id}
                        className="flex gap-4 p-4 bg-paper-50 rounded-xl border border-paper-200"
                      >
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-paper-200 flex-shrink-0">
                          <img
                            src={lot.collectionImage}
                            alt={lot.collectionName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-ink-800">
                                {lot.collectionName}
                              </h4>
                              <span className="text-xs text-warm-gray-500">
                                拍品编号：{lot.id}
                              </span>
                            </div>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                                lot.status
                              )}`}
                            >
                              {getStatusText(lot.status)}
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-warm-gray-500">起拍价</p>
                              <p className="text-sm font-medium text-ink-700">
                                {formatPrice(lot.startPrice)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-warm-gray-500">当前价</p>
                              <p className="text-sm font-bold text-vermilion-600">
                                {formatPrice(lot.currentPrice)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-warm-gray-500">出价次数</p>
                              <p className="text-sm font-medium text-ink-700">
                                {lot.bidCount} 次
                              </p>
                            </div>
                          </div>
                          {topBid && (
                            <div className="mt-2 text-xs text-warm-gray-500">
                              最高出价：{topBid.customerName} ·{' '}
                              {formatPrice(topBid.price)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Gavel className="w-12 h-12 text-warm-gray-300 mx-auto mb-3" />
                  <p className="text-warm-gray-500">请先选择一个拍卖专场</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'deposit' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-paper-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                    客户
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                    等级
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                    保证金余额
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                    累计竞拍
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-paper-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-ink-800">
                            {customer.name}
                          </p>
                          <p className="text-xs text-warm-gray-500">
                            {customer.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          customer.level === 'platinum'
                            ? 'bg-slate-200 text-slate-700'
                            : customer.level === 'gold'
                            ? 'bg-yellow-100 text-yellow-700'
                            : customer.level === 'silver'
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {customer.level === 'platinum'
                          ? '铂金'
                          : customer.level === 'gold'
                          ? '黄金'
                          : customer.level === 'silver'
                          ? '白银'
                          : '青铜'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-bronze-600">
                        {formatPrice(customer.deposit)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                        <Shield className="w-4 h-4" />
                        正常
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-700">
                      {Math.floor(Math.random() * 20) + 1} 次
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            openDepositModal(
                              customer.id,
                              customer.name,
                              'recharge',
                              customer.deposit
                            )
                          }
                          className="text-xs text-bronze-600 hover:text-bronze-700 font-medium"
                        >
                          充值
                        </button>
                        <button
                          onClick={() =>
                            openDepositModal(
                              customer.id,
                              customer.name,
                              'refund',
                              customer.deposit
                            )
                          }
                          className="text-xs text-warm-gray-500 hover:text-warm-gray-600 font-medium"
                        >
                          退还
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
        <div className="p-4 border-b border-paper-200 bg-paper-50">
          <h3 className="font-serif font-semibold text-ink-800">近期竞拍记录</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-paper-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                  拍品
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                  竞拍人
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                  出价
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                  时间
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                  状态
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-100">
              {auctionBids
                .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                .slice(0, 10)
                .map((bid) => {
                  const lot = auctionLots.find((l) => l.id === bid.lotId);
                  const isTop = getLotBids(bid.lotId)[0]?.id === bid.id;
                  return (
                    <tr key={bid.id} className="hover:bg-paper-50">
                      <td className="px-4 py-3 text-sm text-ink-800 font-medium">
                        {lot?.collectionName || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-700">
                        {bid.customerName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-sm font-semibold ${
                            isTop ? 'text-vermilion-600' : 'text-ink-700'
                          }`}
                        >
                          {formatPrice(bid.price)}
                          {isTop && (
                            <span className="ml-1 text-xs text-vermilion-500">
                              (最高)
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-warm-gray-500">
                        {formatDateTime(bid.time)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                          <TrendingUp className="w-3.5 h-3.5" />
                          有效
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {depositModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-paper-200 flex items-center justify-between">
              <h3 className="font-serif font-semibold text-ink-800 text-lg">
                {depositModal.action === 'recharge' ? '保证金充值' : '保证金退还'}
              </h3>
              <button
                onClick={() => setDepositModal(null)}
                className="text-warm-gray-400 hover:text-warm-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-paper-50 rounded-lg p-4">
                <p className="text-sm text-warm-gray-600">客户名称</p>
                <p className="text-base font-medium text-ink-800 mt-1">
                  {depositModal.customerName}
                </p>
                <p className="text-sm text-warm-gray-600 mt-3">当前保证金余额</p>
                <p className="text-lg font-bold text-bronze-600 mt-1">
                  {formatPrice(depositModal.currentDeposit)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-gray-700 mb-1">
                  {depositModal.action === 'recharge' ? '充值金额（元）' : '退还金额（元）'}
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder={`请输入${depositModal.action === 'recharge' ? '充值' : '退还'}金额`}
                  className="w-full px-3 py-2 border border-paper-300 rounded-lg focus:ring-2 focus:ring-bronze-400 focus:border-bronze-400 outline-none"
                />
              </div>
            </div>
            <div className="p-5 border-t border-paper-200 bg-paper-50 flex justify-end gap-3">
              <button
                onClick={() => setDepositModal(null)}
                className="px-4 py-2 text-sm text-warm-gray-600 hover:text-warm-gray-800 border border-paper-300 rounded-lg bg-white"
              >
                取消
              </button>
              <button
                onClick={handleDepositConfirm}
                className={`px-4 py-2 text-sm text-white rounded-lg font-medium ${
                  depositModal.action === 'recharge'
                    ? 'bg-bronze-500 hover:bg-bronze-600'
                    : 'bg-vermilion-500 hover:bg-vermilion-600'
                }`}
              >
                确认{depositModal.action === 'recharge' ? '充值' : '退还'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
