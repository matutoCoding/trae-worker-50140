export function formatPrice(price: number): string {
  if (price >= 10000) {
    return `¥${(price / 10000).toFixed(1)}万`;
  }
  return `¥${price.toLocaleString()}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待鉴定',
    authentic: '已鉴定',
    replica: '仿品',
    suspicious: '存疑',
    graded: '已评级',
    listed: '已上架',
    sold: '已成交',
    active: '进行中',
    matched: '已匹配',
    completed: '已完成',
    cancelled: '已取消',
    confirmed: '已确认',
    upcoming: '即将开始',
    ongoing: '进行中',
    ended: '已结束',
    passed: '流拍',
  };
  return statusMap[status] || status;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    authentic: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    replica: 'bg-red-100 text-red-700 border-red-200',
    suspicious: 'bg-orange-100 text-orange-700 border-orange-200',
    graded: 'bg-sky-100 text-sky-700 border-sky-200',
    listed: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    sold: 'bg-gray-100 text-gray-700 border-gray-200',
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    matched: 'bg-amber-100 text-amber-700 border-amber-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
    confirmed: 'bg-sky-100 text-sky-700 border-sky-200',
    upcoming: 'bg-amber-100 text-amber-700 border-amber-200',
    ongoing: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    ended: 'bg-gray-100 text-gray-500 border-gray-200',
    sold_lot: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    passed: 'bg-gray-100 text-gray-500 border-gray-200',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
}

export function getRiskLevelText(level: string): string {
  const map: Record<string, string> = {
    low: '低风险',
    medium: '中风险',
    high: '高风险',
    warning: '待复核',
  };
  return map[level] || level;
}

export function getRiskLevelColor(level: string): string {
  const map: Record<string, string> = {
    low: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700',
    warning: 'bg-orange-100 text-orange-700',
  };
  return map[level] || 'bg-gray-100 text-gray-700';
}

export function getCustomerLevelText(level: string): string {
  const map: Record<string, string> = {
    bronze: '青铜会员',
    silver: '白银会员',
    gold: '黄金会员',
    platinum: '铂金会员',
  };
  return map[level] || level;
}

export function getCustomerLevelColor(level: string): string {
  const map: Record<string, string> = {
    bronze: 'bg-amber-700 text-amber-50',
    silver: 'bg-gray-400 text-gray-50',
    gold: 'bg-yellow-500 text-yellow-50',
    platinum: 'bg-slate-300 text-slate-800',
  };
  return map[level] || 'bg-gray-100 text-gray-700';
}

export function generateId(prefix: string): string {
  return prefix + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}
