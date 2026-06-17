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
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  addAppraisal: (appraisal: Appraisal) => void;
  addGrading: (grading: Grading) => void;
  addTradeRecord: (record: TradeRecord) => void;
  getCollectionById: (id: string) => Collection | undefined;
  getAppraisalByCollectionId: (id: string) => Appraisal | undefined;
  getGradingByCollectionId: (id: string) => Grading | undefined;
  getTraceRecordsByCollectionId: (id: string) => TraceRecord[];
}

export const useStore = create<AppState>((set, get) => ({
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
  selectedCollectionId: null,

  setSelectedCollectionId: (id) => set({ selectedCollectionId: id }),

  addCollection: (collection) =>
    set((state) => ({ collections: [collection, ...state.collections] })),

  updateCollection: (id, updates) =>
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  addAppraisal: (appraisal) =>
    set((state) => ({ appraisals: [appraisal, ...state.appraisals] })),

  addGrading: (grading) =>
    set((state) => ({ gradings: [grading, ...state.gradings] })),

  addTradeRecord: (record) =>
    set((state) => ({ tradeRecords: [record, ...state.tradeRecords] })),

  getCollectionById: (id) => get().collections.find((c) => c.id === id),

  getAppraisalByCollectionId: (id) =>
    get().appraisals.find((a) => a.collectionId === id),

  getGradingByCollectionId: (id) =>
    get().gradings.find((g) => g.collectionId === id),

  getTraceRecordsByCollectionId: (id) =>
    get().traceRecords.filter((t) => t.collectionId === id),
}));
