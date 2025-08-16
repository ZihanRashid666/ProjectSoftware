import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const payload = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      };
      const response = await axiosInstance.post('/api/auth/login', payload);
      login(response.data);
      navigate('/tasks');
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded"
        autoComplete="off"                // disable aggressive autofill
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {errorMessage && (
          <p className="mb-4 text-red-600 text-center">{errorMessage}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          autoComplete="off"              // stop Chrome/Edge autofill
          inputMode="email"
          autoCorrect="off"
          spellCheck={false}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          autoComplete="new-password"     // prevent saved password fill
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
