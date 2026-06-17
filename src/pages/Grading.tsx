import { useState } from 'react';
import {
  Award,
  TrendingUp,
  Star,
  Scale,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { formatPrice, generateId } from '@/utils/format';
import { gradingStandards } from '@/data/mockData';

export default function Grading() {
  const { collections, gradings, addGrading, updateCollection } = useStore();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'grade' | 'standards'>('grade');
  const [gradingForm, setGradingForm] = useState({
    grade: '美品80分',
    score: 80,
    estimatedValueMin: 0,
    estimatedValueMax: 0,
    grader: '李砚秋',
    details: {
      preservation: 80,
      patina: 80,
      casting: 80,
      wear: 80,
    },
  });

  const authenticCollections = collections.filter(
    (c) => c.status === 'authentic' || c.status === 'graded'
  );

  const gradedCount = gradings.length;
  const avgScore = gradings.length > 0
    ? (gradings.reduce((sum, g) => sum + g.score, 0) / gradings.length).toFixed(1)
    : '0';

  const selectedCollection = collections.find((c) => c.id === selectedCollectionId);
  const existingGrading = gradings.find((g) => g.collectionId === selectedCollectionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollectionId) return;

    const grading = {
      id: generateId('GR'),
      collectionId: selectedCollectionId,
      ...gradingForm,
      date: new Date().toISOString().split('T')[0],
    };

    addGrading(grading);
    updateCollection(selectedCollectionId, {
      status: 'graded',
      estimatedValue: Math.round(
        (gradingForm.estimatedValueMin + gradingForm.estimatedValueMax) / 2
      ),
    });

    setSelectedCollectionId(null);
  };

  const handleScoreChange = (category: keyof typeof gradingForm.details, value: number) => {
    const newDetails = { ...gradingForm.details, [category]: value };
    const avgScore = Math.round(
      (newDetails.preservation + newDetails.patina + newDetails.casting + newDetails.wear) / 4
    );

    let grade = '下品';
    if (avgScore >= 95) grade = '完美品';
    else if (avgScore >= 85) grade = '极美品';
    else if (avgScore >= 75) grade = '美品';
    else if (avgScore >= 65) grade = '上品';
    else if (avgScore >= 50) grade = '中品';

    setGradingForm({
      ...gradingForm,
      details: newDetails,
      score: avgScore,
      grade: `${grade}${avgScore}分`,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-bronze-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-warm-gray-600';
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-emerald-600';
    if (score >= 80) return 'from-bronze-500 to-bronze-600';
    if (score >= 70) return 'from-amber-500 to-amber-600';
    return 'from-warm-gray-400 to-warm-gray-500';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="已评级藏品"
          value={gradedCount}
          icon={Award}
          subtitle="完成评级的藏品"
        />
        <StatCard
          title="平均评分"
          value={avgScore + '分'}
          icon={Star}
          subtitle="所有评级藏品均分"
        />
        <StatCard
          title="待评级藏品"
          value={authenticCollections.filter((c) => c.status === 'authentic').length}
          icon={Scale}
          subtitle="已鉴定待评级"
        />
        <StatCard
          title="估值总值"
          value={formatPrice(
            gradings.reduce((sum, g) => sum + g.estimatedValueMax, 0)
          )}
          icon={TrendingUp}
          subtitle="评级藏品估值上限"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('grade')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'grade'
              ? 'bg-vermilion-600 text-white'
              : 'bg-white text-warm-gray-600 hover:bg-paper-100 border border-warm-gray-200'
          }`}
        >
          品相评级
        </button>
        <button
          onClick={() => setActiveTab('standards')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'standards'
              ? 'bg-vermilion-600 text-white'
              : 'bg-white text-warm-gray-600 hover:bg-paper-100 border border-warm-gray-200'
          }`}
        >
          评级标准
        </button>
      </div>

      {activeTab === 'grade' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
            <div className="p-4 border-b border-paper-200 bg-paper-50">
              <h3 className="font-serif font-semibold text-ink-800">
                待评级藏品
              </h3>
              <p className="text-xs text-warm-gray-500 mt-1">
                共 {authenticCollections.filter((c) => c.status === 'authentic').length} 件待评级
              </p>
            </div>
            <div className="max-h-[500px] overflow-auto">
              <div className="divide-y divide-paper-100">
                {authenticCollections
                  .filter((c) => c.status === 'authentic')
                  .map((item) => (
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
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-paper-200 flex-shrink-0">
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
                            {item.dynasty} · {item.material}
                          </p>
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {authenticCollections.filter((c) => c.status === 'authentic').length === 0 && (
                <div className="p-8 text-center">
                  <Award className="w-10 h-10 text-warm-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-warm-gray-500">暂无待评级藏品</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
            {selectedCollection ? (
              <div className="p-6">
                <div className="flex gap-6 mb-6 pb-6 border-b border-paper-200">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-paper-200 flex-shrink-0">
                    <img
                      src={selectedCollection.imageUrl}
                      alt={selectedCollection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-semibold text-ink-800">
                      {selectedCollection.name}
                    </h3>
                    <p className="text-sm text-warm-gray-500 mt-1">
                      {selectedCollection.id} · {selectedCollection.dynasty}
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
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
                  </div>
                </div>

                {existingGrading ? (
                  <div>
                    <h4 className="font-serif font-semibold text-ink-800 mb-4">
                      评级结果
                    </h4>

                    <div className="bg-gradient-to-br from-paper-50 to-paper-100 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-sm text-warm-gray-500">综合评级</p>
                          <p className={`text-3xl font-bold font-serif mt-1 ${getScoreColor(existingGrading.score)}`}>
                            {existingGrading.grade}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-warm-gray-500">估值区间</p>
                          <p className="text-xl font-bold text-bronze-600 mt-1">
                            {formatPrice(existingGrading.estimatedValueMin)} - {formatPrice(existingGrading.estimatedValueMax)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: '保存状态', key: 'preservation', icon: Sparkles },
                          { label: '包浆状态', key: 'patina', icon: Star },
                          { label: '铸造工艺', key: 'casting', icon: Award },
                          { label: '磨损程度', key: 'wear', icon: TrendingUp },
                        ].map((item) => {
                          const Icon = item.icon;
                          const score = existingGrading.details[item.key as keyof typeof existingGrading.details];
                          return (
                            <div key={item.key} className="bg-white/80 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4 text-bronze-500" />
                                  <span className="text-sm text-warm-gray-600">{item.label}</span>
                                </div>
                                <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                                  {score}分
                                </span>
                              </div>
                              <div className="h-2 bg-paper-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${getGradeColor(score)} rounded-full transition-all duration-500`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-warm-gray-500">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>评级师：{existingGrading.grader}</span>
                      </div>
                      <span className="text-warm-gray-400">
                        评级日期：{existingGrading.date}
                      </span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h4 className="font-serif font-semibold text-ink-800 mb-4">
                      品相评定
                    </h4>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {[
                        { label: '保存状态', key: 'preservation', description: '钱币整体保存完整度' },
                        { label: '包浆状态', key: 'patina', description: '包浆自然度与美观度' },
                        { label: '铸造工艺', key: 'casting', description: '铸造精度与字口深度' },
                        { label: '磨损程度', key: 'wear', description: '流通磨损与使用痕迹' },
                      ].map((item) => (
                        <div key={item.key} className="bg-paper-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-ink-700">{item.label}</p>
                              <p className="text-xs text-warm-gray-500">{item.description}</p>
                            </div>
                            <span className={`text-2xl font-bold font-serif ${getScoreColor(gradingForm.details[item.key as keyof typeof gradingForm.details])}`}>
                              {gradingForm.details[item.key as keyof typeof gradingForm.details]}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={gradingForm.details[item.key as keyof typeof gradingForm.details]}
                            onChange={(e) =>
                              handleScoreChange(
                                item.key as keyof typeof gradingForm.details,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full h-2 bg-paper-200 rounded-lg appearance-none cursor-pointer accent-bronze-500"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-bronze-50 to-amber-50 rounded-xl p-5 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-warm-gray-500">综合评级</p>
                          <p className={`text-3xl font-bold font-serif mt-1 ${getScoreColor(gradingForm.score)}`}>
                            {gradingForm.grade}
                          </p>
                        </div>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-bronze-400 to-bronze-600 flex items-center justify-center">
                          <Award className="w-10 h-10 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-1">
                          估值下限（元）
                        </label>
                        <input
                          type="number"
                          value={gradingForm.estimatedValueMin}
                          onChange={(e) =>
                            setGradingForm({
                              ...gradingForm,
                              estimatedValueMin: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm"
                          placeholder="请输入估值下限"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-1">
                          估值上限（元）
                        </label>
                        <input
                          type="number"
                          value={gradingForm.estimatedValueMax}
                          onChange={(e) =>
                            setGradingForm({
                              ...gradingForm,
                              estimatedValueMax: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm"
                          placeholder="请输入估值上限"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-1">
                        评级师
                      </label>
                      <input
                        type="text"
                        value={gradingForm.grader}
                        onChange={(e) =>
                          setGradingForm({ ...gradingForm, grader: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg text-sm"
                      />
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
                        确认评级
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center">
                <Award className="w-16 h-16 text-warm-gray-200 mb-3" />
                <p className="text-warm-gray-500">请从左侧选择待评级藏品</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'standards' && (
        <div className="bg-white rounded-xl shadow-card border border-paper-200 overflow-hidden">
          <div className="p-6 border-b border-paper-200">
            <h3 className="font-serif text-lg font-semibold text-ink-800">
              古钱币品相评级标准
            </h3>
            <p className="text-sm text-warm-gray-500 mt-1">
              采用百分制评分体系，结合保存状态、包浆、铸造工艺、磨损程度综合评定
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {gradingStandards.map((standard, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-paper-50 rounded-xl"
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                      index === 0
                        ? 'from-emerald-400 to-emerald-600'
                        : index === 1
                        ? 'from-bronze-400 to-bronze-600'
                        : index === 2
                        ? 'from-amber-400 to-amber-600'
                        : index === 3
                        ? 'from-warm-gray-400 to-warm-gray-600'
                        : 'from-warm-gray-300 to-warm-gray-500'
                    } flex items-center justify-center text-white flex-shrink-0`}
                  >
                    <Award className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-serif font-bold text-lg text-ink-800">
                        {standard.grade}
                      </h4>
                      <span className="text-sm text-bronze-600 font-medium">
                        {standard.score}分
                      </span>
                    </div>
                    <p className="text-sm text-warm-gray-600 mt-2">
                      {standard.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
