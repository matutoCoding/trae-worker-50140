export interface Collection {
  id: string;
  name: string;
  dynasty: string;
  material: string;
  dimensions: string;
  weight: string;
  origin: string;
  description: string;
  imageUrl: string;
  status: 'pending' | 'authentic' | 'replica' | 'graded' | 'listed' | 'sold';
  estimatedValue: number;
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: string;
  collectorId?: string;
}

export interface Appraisal {
  id: string;
  collectionId: string;
  expertName: string;
  expertTitle: string;
  conclusion: 'authentic' | 'replica' | 'suspicious';
  opinion: string;
  basis: string;
  date: string;
  certificateNo: string;
  images: string[];
}

export interface Grading {
  id: string;
  collectionId: string;
  grade: string;
  score: number;
  estimatedValueMin: number;
  estimatedValueMax: number;
  grader: string;
  date: string;
  details: {
    preservation: number;
    patina: number;
    casting: number;
    wear: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  totalPurchases: number;
  totalSales: number;
  registerDate: string;
  avatar: string;
  address: string;
  preferences: string[];
  deposit: number;
}

export interface TradeRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  price: number;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  type: 'direct' | 'auction';
  notes: string;
}

export interface AuctionSession {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'ongoing' | 'ended';
  lotCount: number;
  imageUrl: string;
  depositAmount: number;
}

export interface AuctionLot {
  id: string;
  sessionId: string;
  collectionId: string;
  collectionName: string;
  collectionImage: string;
  startPrice: number;
  reservePrice: number;
  currentPrice: number;
  bidCount: number;
  increment: number;
  status: 'upcoming' | 'ongoing' | 'sold' | 'passed';
  endTime: string;
}

export interface AuctionBid {
  id: string;
  lotId: string;
  customerId: string;
  customerName: string;
  price: number;
  time: string;
}

export interface TraceRecord {
  id: string;
  collectionId: string;
  type: 'registration' | 'appraisal' | 'grading' | 'ownership' | 'trade' | 'auction';
  title: string;
  description: string;
  date: string;
  operator: string;
  details?: Record<string, string | number>;
}

export interface BuyIntent {
  id: string;
  customerId: string;
  customerName: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  description: string;
  createdAt: string;
  status: 'active' | 'matched' | 'completed';
}

export interface SellIntent {
  id: string;
  customerId: string;
  customerName: string;
  collectionId: string;
  collectionName: string;
  expectedPrice: number;
  description: string;
  createdAt: string;
  status: 'active' | 'matched' | 'completed';
}
