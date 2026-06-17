import { useState } from 'react';
import {
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Clock,
  User,
  Award,
  Eye,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { formatDate, generateId } from '@/utils/format';

export default function Authentication() {
  const { collections, appraisals, addAppraisal } = useStore();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [appraisalForm, setAppraisalForm] = useState({
    expertName: '张墨涵',
    expertTitle: '首席鉴定专家',
    conclusion: 'authentic' as 'authentic' | 'replica' | 'suspicious',
    opinion: '',
    basis: '',
  });

  const pendingCollections = collections.filter((c) => c.status === 'pending');
  const authenticCount = appraisals.filter((a) => a.conclusion === 'authentic').length;
  const replicaCount = appraisals.filter((a) => a.conclusion === 'replica').length;
  const suspiciousCount = appraisals.filter((a) => a.conclusion === 'suspicious').length;

  const selectedCollection = collections.find((c) => c.id === selectedCollectionId);
  const existingAppraisal = appraisals.find((a) => a.collectionId === selectedCollectionId);

  const handleAppraisal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollectionId) return;

    const appraisal = {
      id: generateId('AP'),
      collectionId: selectedCollectionId,
      ...appraisalForm,
      date: new Date().toISOString().split('T')[0],
      certificateNo: `GS${Date.now().toString().slice(-10)}`,
      images: [],
    };

    addAppraisal(appraisal);

    setSelectedCollectionId(null);
    setAppraisalForm({
      expertName: '张墨涵',
      expertTitle: '首席鉴定专家',
      conclusion: 'authentic',
      opinion: '',
      basis: '',
    });
  };

  const getConclusionText = (conclusion: string) => {
    const map: Record<string, string> = {
      authentic: '真品',
      replica: '仿品',
      suspicious: '存疑',
    };
    return map[conclusion] || conclusion;
  };

  const getConclusionColor = (conclusion: string) => {
    const map: Record<string, string> = {
      authentic: 'text-emerald-600',
      replica: 'text-red-600',
      suspicious: 'text-amber-600',
    };
    return map[conclusion] || 'text-gray-600';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="待鉴定"
          value={pendingCollections.length}
          icon={Clock}
          subtitle="等待专家鉴定"
        />
        <StatCard
          title="已鉴定真品"
          value={authenticCount}
          icon={ShieldCheck}
          subtitle="通过鉴定的藏品"
        />
        <StatCard
          title="鉴定仿品"
          value={replicaCount}
          icon={AlertCircle}
          subtitle="已标记为仿品"
          valueColor="text-red-600"
        />
        <StatCard
          title="存疑待复核"
          value={suspiciousCount}
          icon={HelpCircle}
          subtitle="需进一步鉴定"
          valueColor="text-orange-600"
        />
        <StatCard
          title="鉴定证书"
          value={appraisals.length}
          icon={FileCheck}
          subtitle="累计出具证书"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
          <div className="p-4 border-b border-paper-200 bg-paper-50">
            <h3 className="font-serif font-semibold text-ink-800">待鉴定列表</h3>
            <p className="text-xs text-warm-gray-500 mt-1">
              共 {pendingCollections.length} 件待鉴定
            </p>
          </div>
          <div className="max-h-[600px] overflow-auto">
            {pendingCollections.length > 0 ? (
              <div className="divide-y divide-paper-100">
                {pendingCollections.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCollectionId(item.id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedCollectionId === item.id
                        ? 'bg-bronze-50'
                        : 'hover:bg-paper-50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-paper-200 flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-ink-800 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-warm-gray-500 mt-0.5">
                          {item.id} · {item.dynasty}
                        </p>
                        <p className="text-xs text-warm-gray-400 mt-1">
                          {formatDate(item.createdAt)} 入库
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <ShieldCheck className="w-10 h-10 text-warm-gray-300 mx-auto mb-2" />
                <p className="text-sm text-warm-gray-500">暂无待鉴定藏品</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
          {selectedCollection ? (
            <div className="p-6">
              <div className="flex gap-6 mb-6">
                <div className="w-40 h-40 rounded-xl overflow-hidden bg-paper-200 flex-shrink-0">
                  <img
                    src={selectedCollection.imageUrl}
                    alt={selectedCollection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-ink-800">
                        {selectedCollection.name}
                      </h3>
                      <p className="text-sm text-warm-gray-500 mt-1">
                        编号：{selectedCollection.id}
                      </p>
                    </div>
                    <StatusBadge status={selectedCollection.status} />
                  </div>
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
                  </div>
                  <p className="text-sm text-warm-gray-500 mt-4 line-clamp-2">
                    {selectedCollection.description}
                  </p>
                </div>
              </div>

              {existingAppraisal ? (
                <div className="border-t border-paper-200 pt-6">
                  <h4 className="font-serif font-semibold text-ink-800 mb-4">
                    鉴定结果
                  </h4>
                  <div className="bg-paper-50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-bronze-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-bronze-600" />
                        </div>
                        <div>
                          <p className="font-medium text-ink-800">
                            {existingAppraisal.expertName}
                          </p>
                          <p className="text-xs text-warm-gray-500">
                            {existingAppraisal.expertTitle}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-lg font-bold font-serif ${getConclusionColor(
                          existingAppraisal.conclusion
                        )}`}
                      >
                        {getConclusionText(existingAppraisal.conclusion)}
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-warm-gray-500 mb-1">鉴定意见：</p>
                        <p className="text-ink-700">{existingAppraisal.opinion}</p>
                      </div>
                      <div>
                        <p className="text-warm-gray-500 mb-1">鉴定依据：</p>
                        <p className="text-ink-700 whitespace-pre-line">
                          {existingAppraisal.basis}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-paper-200 flex items-center justify-between">
                      <span className="text-xs text-warm-gray-400">
                        证书编号：{existingAppraisal.certificateNo}
                      </span>
                      <button
                        onClick={() => setShowCertificate(true)}
                        className="flex items-center gap-1 text-sm text-bronze-600 hover:text-bronze-700"
                      >
                        <Eye className="w-4 h-4" />
                        查看证书
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAppraisal} className="border-t border-paper-200 pt-6">
                  <h4 className="font-serif font-semibold text-ink-800 mb-4">
                    专家鉴定
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-1">
                          鉴定专家
                        </label>
                        <input
                          type="text"
                          value={appraisalForm.expertName}
                          onChange={(e) =>
                            setAppraisalForm({
                              ...appraisalForm,
                              expertName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-1">
                          专家职称
                        </label>
                        <input
                          type="text"
                          value={appraisalForm.expertTitle}
                          onChange={(e) =>
                            setAppraisalForm({
                              ...appraisalForm,
                              expertTitle: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        鉴定结论
                      </label>
                      <div className="flex gap-3">
                        {[
                          { value: 'authentic', label: '真品', icon: ShieldCheck },
                          { value: 'replica', label: '仿品', icon: AlertCircle },
                          { value: 'suspicious', label: '存疑', icon: Clock },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <label
                              key={item.value}
                              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border cursor-pointer transition-colors ${
                                appraisalForm.conclusion === item.value
                                  ? 'border-bronze-500 bg-bronze-50 text-bronze-700'
                                  : 'border-warm-gray-200 text-warm-gray-600 hover:border-warm-gray-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="conclusion"
                                value={item.value}
                                checked={appraisalForm.conclusion === item.value}
                                onChange={(e) =>
                                  setAppraisalForm({
                                    ...appraisalForm,
                                    conclusion: e.target.value as
                                      | 'authentic'
                                      | 'replica'
                                      | 'suspicious',
                                  })
                                }
                                className="sr-only"
                              />
                              <Icon className="w-4 h-4" />
                              <span className="text-sm font-medium">{item.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-1">
                        鉴定意见
                      </label>
                      <textarea
                        rows={3}
                        value={appraisalForm.opinion}
                        onChange={(e) =>
                          setAppraisalForm({
                            ...appraisalForm,
                            opinion: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm resize-none"
                        placeholder="请详细描述鉴定意见..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-1">
                        鉴定依据
                      </label>
                      <textarea
                        rows={3}
                        value={appraisalForm.basis}
                        onChange={(e) =>
                          setAppraisalForm({
                            ...appraisalForm,
                            basis: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm resize-none"
                        placeholder="请列出鉴定依据要点..."
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedCollectionId(null)}
                      className="px-5 py-2 border border-warm-gray-300 text-ink-700 rounded-lg hover:bg-paper-100 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-vermilion-600 text-white rounded-lg hover:bg-vermilion-700 transition-colors btn-ripple"
                    >
                      出具鉴定
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center">
              <Award className="w-16 h-16 text-warm-gray-200 mb-3" />
              <p className="text-warm-gray-500">请从左侧选择待鉴定藏品</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
        <div className="p-4 border-b border-paper-200 bg-paper-50">
          <h3 className="font-serif font-semibold text-ink-800">鉴定记录</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-paper-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                  证书编号
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                  藏品名称
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                  鉴定专家
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                  鉴定结论
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                  鉴定日期
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray-600 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-100">
              {appraisals.map((appraisal) => {
                const collection = collections.find(
                  (c) => c.id === appraisal.collectionId
                );
                return (
                  <tr key={appraisal.id} className="hover:bg-paper-50">
                    <td className="px-4 py-3 text-sm text-ink-700">
                      {appraisal.certificateNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-800 font-medium">
                      {collection?.name || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-700">
                      {appraisal.expertName}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${getConclusionColor(
                          appraisal.conclusion
                        )}`}
                      >
                        {getConclusionText(appraisal.conclusion)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-warm-gray-500">
                      {formatDate(appraisal.date)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedCollectionId(appraisal.collectionId);
                          setShowCertificate(true);
                        }}
                        className="text-sm text-bronze-600 hover:text-bronze-700"
                      >
                        查看证书
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showCertificate && existingAppraisal && selectedCollection && (
        <div
          className="fixed inset-0 bg-ink-900/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCertificate(false)}
        >
          <div
            className="bg-paper-100 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              background:
                'linear-gradient(135deg, #faf7f0 0%, #f5f0e6 50%, #ede5d3 100%)',
            }}
          >
            <div className="p-8 border-pattern" style={{ position: 'relative' }}>
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-ink-800 tracking-wider">
                  鉴 定 证 书
                </h2>
                <div className="w-16 h-0.5 bg-bronze-400 mx-auto mt-3"></div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex">
                  <span className="text-warm-gray-600 w-24">证书编号：</span>
                  <span className="text-ink-800 font-medium">
                    {existingAppraisal.certificateNo}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-warm-gray-600 w-24">藏品名称：</span>
                  <span className="text-ink-800 font-medium">
                    {selectedCollection.name}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-warm-gray-600 w-24">藏品年代：</span>
                  <span className="text-ink-800">{selectedCollection.dynasty}</span>
                </div>
                <div className="flex">
                  <span className="text-warm-gray-600 w-24">材质规格：</span>
                  <span className="text-ink-800">
                    {selectedCollection.material} · {selectedCollection.dimensions}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-warm-gray-600 w-24">鉴定结论：</span>
                  <span
                    className={`text-ink-800 font-bold ${getConclusionColor(
                      existingAppraisal.conclusion
                    )}`}
                  >
                    {getConclusionText(existingAppraisal.conclusion)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-bronze-200/50">
                <p className="text-sm text-warm-gray-600 mb-2">鉴定意见：</p>
                <p className="text-sm text-ink-700 leading-relaxed">
                  {existingAppraisal.opinion}
                </p>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-sm text-warm-gray-600">鉴定专家：</p>
                  <p className="font-serif text-lg text-ink-800 mt-1">
                    {existingAppraisal.expertName}
                  </p>
                  <p className="text-xs text-warm-gray-500">
                    {existingAppraisal.expertTitle}
                  </p>
                </div>
                <div className="seal">古泉雅集鉴定专用章</div>
              </div>

              <div className="mt-6 pt-4 border-t border-bronze-200/50 text-center">
                <p className="text-xs text-warm-gray-400">
                  发证日期：{formatDate(existingAppraisal.date)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
