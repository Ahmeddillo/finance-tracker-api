import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import API from '../api/axiosInstance';

export default function TransactionFormModal({ isOpen, onClose, onSuccess, categories }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      await API.post('/transactions', {
        ...data,
        amount: parseFloat(data.amount)
      });
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'İşlem eklenirken hata oluştu.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Yeni İşlem Ekle</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">İşlem Tipi & Kategori</label>
            <select
              {...register("categoryId", { required: "Kategori seçimi zorunludur." })}
              className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Kategori Seçin</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  [{cat.type === 'income' ? 'Gelir' : 'Gider'}] {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="text-xs text-red-500">{errors.categoryId.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tutar (TL)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("amount", { required: "Tutar girmelisiniz.", min: { value: 0.01, message: "Tutar 0'dan büyük olmalıdır." } })}
              className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.amount && <span className="text-xs text-red-500">{errors.amount.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tarih</label>
            <input
              type="date"
              {...register("date", { required: "Tarih zorunludur." })}
              className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.date && <span className="text-xs text-red-500">{errors.date.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Açıklama</label>
            <input
              type="text"
              placeholder="Örn: Market alışverişi"
              {...register("description")}
              className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
