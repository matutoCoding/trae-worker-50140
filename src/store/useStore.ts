import { create } from 'zustand';
import type {
  Collection,
  Appraisal,
  Grading,
  Customer,
  TradeRecord,
  AuctionSession,
  AuctionLot,
  AuctionBid,
  TraceRecord,
  BuyIntent,
  SellIntent,
} from '@/types';
import {
  mockCollections,
  mockAppraisals,
  mockGradings,
  mockCustomers,
  mockTradeRecords,
  mockAuctionSessions,
  mockAuctionLots,
  mockAuctionBids,
  mockTraceRecords,
  mockBuyIntents,
  mockSellIntents,
} from '@/data/mockData';
import { generateId } from '@/utils/format';

const STORAGE_KEY = 'guquan_store_state';

interface PersistedState {
  collections: Collection[];
  appraisals: Appraisal[];
  gradings: Grading[];
  customers: Customer[];
  tradeRecords: TradeRecord[];
  auctionSessions: AuctionSession[];
  auctionLots: AuctionLot[];
  auctionBids: AuctionBid[];
  traceRecords: TraceRecord[];
  buyIntents: BuyIntent[];
  sellIntents: SellIntent[];
}

function loadPersistedState(): PersistedState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('加载本地存储失败', e);
  }
  return null;
}

function persistState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('保存本地存储失败', e);
  }
}

const persisted = loadPersistedState();

interface AppState {
  collections: Collection[];
  appraisals: Appraisal[];
  gradings: Grading[];
  customers: Customer[];
  tradeRecords: TradeRecord[];
  auctionSessions: AuctionSession[];
  auctionLots: AuctionLot[];
  auctionBids: AuctionBid[];
  traceRecords: TraceRecord[];
  buyIntents: BuyIntent[];
  sellIntents: SellIntent[];
  selectedCollectionId: string | null;
  setSelectedCollectionId: (id: string | null) => void;
  addCollection: (collection: Collection, operatorName?: string) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  addAppraisal: (appraisal: Appraisal, operatorName?: string) => void;
  addGrading: (grading: Grading, operatorName?: string) => void;
  addTradeRecord: (record: TradeRecord, operatorName?: string) => void;
  updateCustomerDeposit: (customerId: string, amount: number, type: 'recharge' | 'refund') => void;
  addTraceRecord: (record: TraceRecord) => void;
  getCollectionById: (id: string) => Collection | undefined;
  getAppraisalByCollectionId: (id: string) => Appraisal | undefined;
  getGradingByCollectionId: (id: string) => Grading | undefined;
  getTraceRecordsByCollectionId: (id: string) => TraceRecord[];
  resetData: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  collections: persisted?.collections || mockCollections,
  appraisals: persisted?.appraisals || mockAppraisals,
  gradings: persisted?.gradings || mockGradings,
  customers: persisted?.customers || mockCustomers,
  tradeRecords: persisted?.tradeRecords || mockTradeRecords,
  auctionSessions: persisted?.auctionSessions || mockAuctionSessions,
  auctionLots: persisted?.auctionLots || mockAuctionLots,
  auctionBids: persisted?.auctionBids || mockAuctionBids,
  traceRecords: persisted?.traceRecords || mockTraceRecords,
  buyIntents: persisted?.buyIntents || mockBuyIntents,
  sellIntents: persisted?.sellIntents || mockSellIntents,
  selectedCollectionId: null,

  setSelectedCollectionId: (id) => set({ selectedCollectionId: id }),

  addTraceRecord: (record) =>
    set((state) => {
      const newState = { traceRecords: [record, ...state.traceRecords] };
      persistState({
        collections: state.collections,
        appraisals: state.appraisals,
        gradings: state.gradings,
        customers: state.customers,
        tradeRecords: state.tradeRecords,
        auctionSessions: state.auctionSessions,
        auctionLots: state.auctionLots,
        auctionBids: state.auctionBids,
        traceRecords: newState.traceRecords,
        buyIntents: state.buyIntents,
        sellIntents: state.sellIntents,
      });
      return newState;
    }),

  addCollection: (collection, operatorName = '业务专员') =>
    set((state) => {
      const traceRecord: TraceRecord = {
        id: generateId('TC'),
        collectionId: collection.id,
        type: 'registration',
        title: '藏品入库登记',
        description: `${collection.name} 正式入库，完成初步信息登记`,
        date: new Date().toISOString().split('T')[0],
        operator: operatorName,
        details: {
          藏品编号: collection.id,
          来源: collection.origin || '-',
          朝代: collection.dynasty,
        },
      };
      const newState = {
        collections: [collection, ...state.collections],
        traceRecords: [traceRecord, ...state.traceRecords],
      };
      persistState({
        ...state,
        ...newState,
      });
      return newState;
    }),

  updateCollection: (id, updates) =>
    set((state) => {
      const newState = {
        collections: state.collections.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      };
      persistState({
        ...state,
        ...newState,
      });
      return newState;
    }),

  addAppraisal: (appraisal, operatorName) => {
    const state = get();
    const collection = state.getCollectionById(appraisal.collectionId);

    let newStatus: Collection['status'] = 'authentic';
    let newRiskLevel: Collection['riskLevel'] = 'low';

    if (appraisal.conclusion === 'replica') {
      newStatus = 'replica';
      newRiskLevel = 'high';
    } else if (appraisal.conclusion === 'suspicious') {
      newStatus = 'suspicious';
      newRiskLevel = 'warning';
    } else {
      newStatus = 'authentic';
      newRiskLevel = 'low';
    }

    const conclusionText =
      appraisal.conclusion === 'authentic'
        ? '真品'
        : appraisal.conclusion === 'replica'
        ? '仿品'
        : '存疑待复核';

    const traceRecord: TraceRecord = {
      id: generateId('TC'),
      collectionId: appraisal.collectionId,
      type: 'appraisal',
      title: '真伪鉴定完成',
      description: `经${appraisal.expertName}（${appraisal.expertTitle}）鉴定，结论为：${conclusionText}`,
      date: appraisal.date,
      operator: operatorName || appraisal.expertName,
      details: {
        鉴定结论: conclusionText,
        鉴定证书: appraisal.certificateNo,
      },
    };

    set((state) => {
      const newState = {
        appraisals: [appraisal, ...state.appraisals],
        collections: state.collections.map((c) =>
          c.id === appraisal.collectionId
            ? { ...c, status: newStatus, riskLevel: newRiskLevel }
            : c
        ),
        traceRecords: [traceRecord, ...state.traceRecords],
      };
      persistState({
        ...state,
        ...newState,
      });
      return newState;
    });
  },

  addGrading: (grading, operatorName) => {
    const state = get();
    const collection = state.getCollectionById(grading.collectionId);

    const traceRecord: TraceRecord = {
      id: generateId('TC'),
      collectionId: grading.collectionId,
      type: 'grading',
      title: '品相评级完成',
      description: `评级师${grading.grader}评定为${grading.grade}`,
      date: grading.date,
      operator: operatorName || grading.grader,
      details: {
        品相等级: grading.grade,
        综合评分: `${grading.score}分`,
        估值区间: `¥${grading.estimatedValueMin.toLocaleString()} - ¥${grading.estimatedValueMax.toLocaleString()}`,
      },
    };

    set((state) => {
      const newState = {
        gradings: [grading, ...state.gradings],
        collections: state.collections.map((c) =>
          c.id === grading.collectionId
            ? {
                ...c,
                status: 'graded' as const,
                estimatedValue: Math.round(
                  (grading.estimatedValueMin + grading.estimatedValueMax) / 2
                ),
              }
            : c
        ),
        traceRecords: [traceRecord, ...state.traceRecords],
      };
      persistState({
        ...state,
        ...newState,
      });
      return newState;
    });
  },

  addTradeRecord: (record, operatorName = '业务专员') => {
    const state = get();

    const traceRecord: TraceRecord = {
      id: generateId('TC'),
      collectionId: record.collectionId,
      type: 'trade',
      title: '交易完成',
      description: `${record.buyerName} 从 ${record.sellerName} 处购得此藏品`,
      date: record.date,
      operator: operatorName,
      details: {
        交易编号: record.id,
        成交价格: `¥${record.price.toLocaleString()}`,
        买方: record.buyerName,
        卖方: record.sellerName,
        交易类型: record.type === 'auction' ? '拍卖成交' : '直接交易',
      },
    };

    const ownershipTraceRecord: TraceRecord = {
      id: generateId('TC'),
      collectionId: record.collectionId,
      type: 'ownership',
      title: '持有人变更',
      description: `藏品所有权由 ${record.sellerName} 转移至 ${record.buyerName}`,
      date: record.date,
      operator: operatorName,
      details: {
        原持有人: record.sellerName,
        新持有人: record.buyerName,
      },
    };

    set((state) => {
      const newState = {
        tradeRecords: [record, ...state.tradeRecords],
        traceRecords: [
          ownershipTraceRecord,
          traceRecord,
          ...state.traceRecords,
        ],
        collections: state.collections.map((c) =>
          c.id === record.collectionId ? { ...c, status: 'sold' as const } : c
        ),
      };
      persistState({
        ...state,
        ...newState,
      });
      return newState;
    });
  },

  updateCustomerDeposit: (customerId, amount, type) =>
    set((state) => {
      const newState = {
        customers: state.customers.map((c) =>
          c.id === customerId
            ? {
                ...c,
                deposit:
                  type === 'recharge' ? c.deposit + amount : Math.max(0, c.deposit - amount),
              }
            : c
        ),
      };
      persistState({
        ...state,
        ...newState,
      });
      return newState;
    }),

  getCollectionById: (id) => get().collections.find((c) => c.id === id),

  getAppraisalByCollectionId: (id) =>
    get().appraisals.find((a) => a.collectionId === id),

  getGradingByCollectionId: (id) =>
    get().gradings.find((g) => g.collectionId === id),

  getTraceRecordsByCollectionId: (id) =>
    get()
      .traceRecords.filter((t) => t.collectionId === id)
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),

  resetData: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      collections: mockCollections,
      appraisals: mockAppraisals,
      gradings: mockGradings,
      customers: mockCustomers,
      tradeRecords: mockTradeRecords,
      auctionSessions: mockAuctionSessions,
      auctionLots: mockAuctionLots,
      auctionBids: mockAuctionBids,
      traceRecords: mockTraceRecords,
      buyIntents: mockBuyIntents,
      sellIntents: mockSellIntents,
    });
  },
}));
