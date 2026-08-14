import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function BudgetProgress({ budgets }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <h3 className="font-semibold text-gray-800">Aylık Bütçe Takibi</h3>
      
      {budgets.length === 0 ? (
        <p className="text-gray-400 text-sm">Tanımlanmış bütçe limiti bulunmuyor.</p>
      ) : (
        <div className="space-y-4">
          {budgets.map((item) => {
            const percentage = Math.min(Math.round((item.spent / item.monthlyLimit) * 100), 100);
            const isOver = item.spent > item.monthlyLimit;
            const isWarning = percentage >= 80 && !isOver;

            let progressColor = 'bg-blue-600';
            if (isWarning) progressColor = 'bg-amber-500';
            if (isOver) progressColor = 'bg-red-600';

            return (
              <div key={item.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">{item.Category?.name}</span>
                  <span className="text-gray-500">
                    {Number(item.spent).toLocaleString('tr-TR')} ₺ / {Number(item.monthlyLimit).toLocaleString('tr-TR')} ₺ 
                    <span className="font-semibold ml-1">({percentage}%)</span>
                  </span>
                </div>

                {/* İlerleme Çubuğu */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${progressColor}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Uyarı Mesajları */}
                {isOver && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Bütçe limiti aşıldı!
                  </p>
                )}
                {isWarning && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Bütçe limitine yaklaşıyorsunuz (%80+).
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
