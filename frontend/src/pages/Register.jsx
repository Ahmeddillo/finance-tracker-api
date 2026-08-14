import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosInstance';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      setErrorMessage('');
      await API.post('/auth/register', data);
      alert('Kayıt başarılı! Giriş yapabilirsiniz.');
      navigate('/login');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Kayıt olunurken bir hata oluştu.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Yeni Hesap Oluştur</h2>
        {errorMessage && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{errorMessage}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
            <input
              type="text"
              {...register("name", { required: "Ad soyad alanı zorunludur." })}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">E-Posta</label>
            <input
              type="email"
              {...register("email", { required: "E-posta alanı zorunludur." })}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre</label>
            <input
              type="password"
              {...register("password", { required: "Şifre alanı zorunludur.", minLength: { value: 6, message: "En az 6 karakter olmalıdır." } })}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Kayıt Ol
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Zaten hesabın var mı? <Link to="/login" className="text-blue-600 hover:underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}
