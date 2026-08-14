import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export default function AnalyticsCharts({ categoryBreakdown, summary }) {
  // Pie chart için renk paleti
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];

  const barData = [
    {
      name: 'Finansal Özet',
      Gelir: Number(summary.totalIncome) || 0,
      Gider: Number(summary.totalExpense) || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Kategori Dağılımı - Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Gider Kategori Dağılımı</h3>
        {categoryBreakdown.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            Veri bulunmuyor.
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="total"
                  nameKey="categoryName"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${Number(value).toLocaleString('tr-TR')} ₺`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Gelir / Gider Karşılaştırması - Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Gelir / Gider Karşılaştırması</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis formatter={(value) => `${value} ₺`} />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString('tr-TR')} ₺`} />
              <Legend />
              <Bar dataKey="Gelir" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gider" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
