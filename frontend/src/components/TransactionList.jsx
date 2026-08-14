import { Trash2 } from 'lucide-react';

export default function TransactionList({ transactions, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Son İşlemler</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-3">Tarih</th>
              <th className="px-6 py-3">Kategori</th>
              <th className="px-6 py-3">Açıklama</th>
              <th className="px-6 py-3">Tutar</th>
              <th className="px-6 py-3 text-right">Eylem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                  Henüz bir işlem kaydı bulunmuyor.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(t.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${t.Category?.color || '#e5e7eb'}20`, color: t.Category?.color || '#374151' }}
                    >
                      {t.Category?.name || 'Genel'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{t.description || '-'}</td>
                  <td className={`px-6 py-4 font-semibold ${t.Category?.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.Category?.type === 'income' ? '+' : '-'}{Number(t.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(t.id)}
                      className="text-gray-400 hover:text-red-600 transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
