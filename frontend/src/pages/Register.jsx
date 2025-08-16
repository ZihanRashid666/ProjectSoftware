import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      };
      await axiosInstance.post('/api/auth/register', payload);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded"
        autoComplete="off"                // <- stops form-level autofill
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        {errorMessage && (
          <p className="mb-4 text-red-600 text-center">{errorMessage}</p>
        )}
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          autoComplete="name"             // valid hint, but not aggressive autofill
          autoCapitalize="words"
          autoCorrect="off"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          autoComplete="off"              // <- disables email autofill
          inputMode="email"
          autoCorrect="off"
          spellCheck={false}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          autoComplete="new-password"     // <- prevents saved password autofill
          minLength={6}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
