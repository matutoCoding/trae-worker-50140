import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Collection from '@/pages/Collection';
import Authentication from '@/pages/Authentication';
import Grading from '@/pages/Grading';
import Trading from '@/pages/Trading';
import Customers from '@/pages/Customers';
import Auction from '@/pages/Auction';
import Traceability from '@/pages/Traceability';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/collection" replace />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/grading" element={<Grading />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/auction" element={<Auction />} />
          <Route path="/traceability" element={<Traceability />} />
        </Routes>
      </Layout>
    </Router>
  );
}
