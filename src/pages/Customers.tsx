import { useState } from 'react';
import {
  Users,
  Crown,
  Wallet,
  ShoppingBag,
  Tag,
  Search,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  Calendar,
  X,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import StatCard from '@/components/StatCard';
import {
  formatPrice,
  formatDate,
  getCustomerLevelText,
  getCustomerLevelColor,
} from '@/utils/format';

export default function Customers() {
  const { customers, tradeRecords } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    const matchLevel = !levelFilter || c.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const totalCustomers = customers.length;
  const vipCount = customers.filter((c) => c.level === 'gold' || c.level === 'platinum').length;
  const totalDeposit = customers.reduce((sum, c) => sum + c.deposit, 0);
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  const selectedCustomerData = customers.find((c) => c.id === selectedCustomer);
  const customerTrades = tradeRecords.filter(
    (t) => t.buyerId === selectedCustomer || t.sellerId === selectedCustomer
  );

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'platinum':
        return <Crown className="w-4 h-4" />;
      case 'gold':
        return <Star className="w-4 h-4" />;
      case 'silver':
        return <Tag className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="客户总数"
          value={totalCustomers}
          icon={Users}
          subtitle="注册客户数量"
        />
        <StatCard
          title="VIP客户"
          value={vipCount}
          icon={Crown}
          subtitle="黄金及以上等级"
        />
        <StatCard
          title="保证金总额"
          value={formatPrice(totalDeposit)}
          icon={Wallet}
          subtitle="客户保证金"
        />
        <StatCard
          title="累计消费"
          value={formatPrice(totalSpent)}
          icon={TrendingUp}
          subtitle="所有客户消费总额"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
          <div className="p-4 border-b border-paper-200 flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-serif font-semibold text-ink-800">客户列表</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
                <input
                  type="text"
                  placeholder="搜索客户姓名或电话..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-warm-gray-300 rounded-lg w-56 focus:border-bronze-400 transition-colors"
                />
              </div>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-warm-gray-300 rounded-lg focus:border-bronze-400 transition-colors"
              >
                <option value="">全部等级</option>
                <option value="platinum">铂金会员</option>
                <option value="gold">黄金会员</option>
                <option value="silver">白银会员</option>
                <option value="bronze">青铜会员</option>
              </select>
            </div>
          </div>

          <div className="overflow-auto max-h-[600px]">
            <div className="divide-y divide-paper-100">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedCustomer === customer.id
                      ? 'bg-bronze-50'
                      : 'hover:bg-paper-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white ${getCustomerLevelColor(
                          customer.level
                        )}`}
                      >
                        {getLevelIcon(customer.level)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-ink-800">
                          {customer.name}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getCustomerLevelColor(
                            customer.level
                          )}`}
                        >
                          {getCustomerLevelText(customer.level)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-warm-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" />
                          {customer.totalPurchases + customer.totalSales} 笔交易
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-bronze-600">
                        消费 {formatPrice(customer.totalSpent)}
                      </p>
                      <p className="text-xs text-warm-gray-400 mt-0.5">
                        保证金 {formatPrice(customer.deposit)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
          {selectedCustomerData ? (
            <div className="p-6">
              <div className="text-center pb-6 border-b border-paper-200">
                <div className="relative inline-block">
                  <img
                    src={selectedCustomerData.avatar}
                    alt={selectedCustomerData.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white ${getCustomerLevelColor(
                      selectedCustomerData.level
                    )}`}
                  >
                    {getLevelIcon(selectedCustomerData.level)}
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-ink-800 mt-3">
                  {selectedCustomerData.name}
                </h3>
                <p className="text-sm text-warm-gray-500 mt-1">
                  {getCustomerLevelText(selectedCustomerData.level)}
                </p>
                <p className="text-xs text-warm-gray-400 mt-1">
                  注册于 {formatDate(selectedCustomerData.registerDate)}
                </p>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-paper-100 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-warm-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-warm-gray-500">联系电话</p>
                    <p className="text-ink-700">{selectedCustomerData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-paper-100 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-warm-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-warm-gray-500">电子邮箱</p>
                    <p className="text-ink-700">{selectedCustomerData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-paper-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-warm-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-warm-gray-500">地址</p>
                    <p className="text-ink-700 text-xs">
                      {selectedCustomerData.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-4 border-y border-paper-200">
                <p className="text-xs text-warm-gray-500 mb-2">收藏偏好</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCustomerData.preferences.map((pref, index) => (
                    <span
                      key={index}
                      className="text-xs px-2.5 py-1 bg-bronze-50 text-bronze-700 rounded-full"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>

              <div className="py-4 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-paper-50 rounded-lg">
                  <p className="text-lg font-bold text-bronze-600">
                    {formatPrice(selectedCustomerData.totalSpent)}
                  </p>
                  <p className="text-xs text-warm-gray-500 mt-1">累计消费</p>
                </div>
                <div className="p-3 bg-paper-50 rounded-lg">
                  <p className="text-lg font-bold text-emerald-600">
                    {selectedCustomerData.totalPurchases}
                  </p>
                  <p className="text-xs text-warm-gray-500 mt-1">买入次数</p>
                </div>
                <div className="p-3 bg-paper-50 rounded-lg">
                  <p className="text-lg font-bold text-amber-600">
                    {formatPrice(selectedCustomerData.deposit)}
                  </p>
                  <p className="text-xs text-warm-gray-500 mt-1">保证金</p>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-ink-800 text-sm">近期交易</h4>
                  <span className="text-xs text-warm-gray-400">
                    共 {customerTrades.length} 笔
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {customerTrades.slice(0, 5).map((trade) => (
                    <div
                      key={trade.id}
                      className="flex items-center justify-between py-2 border-b border-paper-100 last:border-0"
                    >
                      <div>
                        <p className="text-sm text-ink-700 font-medium">
                          {trade.collectionName}
                        </p>
                        <p className="text-xs text-warm-gray-500">
                          {trade.buyerId === selectedCustomer ? '买入' : '卖出'} ·{' '}
                          {formatDate(trade.date)}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          trade.buyerId === selectedCustomer
                            ? 'text-red-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {trade.buyerId === selectedCustomer ? '-' : '+'}
                        {formatPrice(trade.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center">
              <Users className="w-16 h-16 text-warm-gray-200 mb-3" />
              <p className="text-warm-gray-500">请从左侧选择客户</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
        <div className="p-4 border-b border-paper-200 bg-paper-50">
          <h3 className="font-serif font-semibold text-ink-800">会员等级体系</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                level: 'bronze',
                name: '青铜会员',
                color: 'from-amber-700 to-amber-800',
                benefits: ['基础交易服务', '藏品鉴赏资讯', '生日专属优惠'],
                condition: '注册即享',
              },
              {
                level: 'silver',
                name: '白银会员',
                color: 'from-gray-400 to-gray-500',
                benefits: ['专属客服', '优先鉴定服务', '交易手续费9折'],
                condition: '累计消费满5万',
              },
              {
                level: 'gold',
                name: '黄金会员',
                color: 'from-yellow-500 to-amber-600',
                benefits: ['专家一对一咨询', '优先参与拍卖', '交易手续费8折'],
                condition: '累计消费满20万',
              },
              {
                level: 'platinum',
                name: '铂金会员',
                color: 'from-slate-300 to-slate-400',
                benefits: ['VIP专属通道', '私人定制服务', '交易手续费5折'],
                condition: '累计消费满50万',
              },
            ].map((item) => (
              <div
                key={item.level}
                className="bg-gradient-to-br from-paper-50 to-white rounded-xl p-5 border border-paper-200"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg`}
                >
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-serif font-bold text-lg text-ink-800">
                  {item.name}
                </h4>
                <p className="text-xs text-warm-gray-500 mt-1">{item.condition}</p>
                <div className="mt-3 pt-3 border-t border-paper-200">
                  <ul className="space-y-1.5">
                    {item.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-warm-gray-600 flex items-center gap-2"
                      >
                        <Star className="w-3 h-3 text-bronze-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
