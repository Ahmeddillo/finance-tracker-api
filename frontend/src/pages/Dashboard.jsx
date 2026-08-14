import { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import TransactionList from '../components/TransactionList';
import TransactionFormModal from '../components/TransactionFormModal';
import AnalyticsCharts from '../components/AnalyticsCharts';
import BudgetProgress from '../components/BudgetProgress';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import { PlusCircle, LogOut, TrendingUp, TrendingDown, Wallet, FileText, Download } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [transRes, catRes, sumRes, breakdownRes, budgetRes] = await Promise.all([
        API.get('/transactions'),
        API.get('/categories'),
        API.get('/transactions/summary'),
        API.get('/transactions/category-breakdown'),
        API.get('/budgets/status')
      ]);
      setTransactions(transRes.data);
      setCategories(catRes.data);
      setSummary(sumRes.data);
      setCategoryBreakdown(breakdownRes.data);
      setBudgets(budgetRes.data);
    } catch (err) {
      console.error('Veri çekme hatası:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
      try {
        await API.delete(`/transactions/${id}`);
        fetchData();
      } catch (err) {
        alert('Silme işlemi başarısız.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-blue-600" /> Finance Tracker
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">Hoş geldin, {user?.name}</span>
          <button onClick={logout} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium">
            <LogOut className="w-4 h-4" /> Çıkış
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Toplam Gelir</p>
              <h3 className="text-2xl font-bold text-gray-800">+{Number(summary.totalIncome).toLocaleString('tr-TR')} ₺</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg"><TrendingDown className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Toplam Gider</p>
              <h3 className="text-2xl font-bold text-gray-800">-{Number(summary.totalExpense).toLocaleString('tr-TR')} ₺</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Wallet className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Net Bakiye</p>
              <h3 className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
                {Number(summary.balance).toLocaleString('tr-TR')} ₺
              </h3>
            </div>
          </div>
        </div>

        {/* Analytics & Bütçe İlerlemesi */}
        <AnalyticsCharts categoryBreakdown={categoryBreakdown} summary={summary} />
        <BudgetProgress budgets={budgets} />

        {/* Tablo Üstü Aksiyonlar & Export Butonları */}
        <div className="flex flex-wrap justify-between items-center gap-4 pt-4">
          <h2 className="text-lg font-bold text-gray-800">Finansal Hareketler</h2>
          <div className="flex gap-2">
            <button
              onClick={() => exportToPDF(transactions)}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition"
            >
              <FileText className="w-4 h-4" /> PDF İndir
            </button>
            <button
              onClick={() => exportToExcel(transactions)}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition"
            >
              <Download className="w-4 h-4" /> Excel İndir
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
            >
              <PlusCircle className="w-5 h-5" /> Yeni İşlem Ekle
            </button>
          </div>
        </div>

        <TransactionList transactions={transactions} onDelete={handleDelete} />

        <TransactionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchData}
          categories={categories}
        />
      </main>
    </div>
  );
}
