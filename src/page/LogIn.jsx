import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/ContextData';

<<<<<<< Updated upstream
function LogIn() {
  const { accountLogIn, setIsAuth } = useContext(AppContext);
=======
function Login() {
  const { setIsAuth } = useContext(AppContext);
>>>>>>> Stashed changes
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost/bookingBackend/api/user/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          fullName: response.data.fullName,
          email: response.data.email,
          role: response.data.role,
        }));
        // Optionally store the token if you need it later
        localStorage.setItem('token', response.data.token);
        setIsAuth(true);
        navigate('/');
      } else {
        setError(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Có lỗi xảy ra. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="p-8 bg-white rounded-lg shadow-2xl w-96">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Booking</h1>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
<<<<<<< Updated upstream
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign In
=======
            disabled={isLoading}
            className="w-full bg-[#febb02] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e0a800] transition disabled:bg-gray-400"
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
>>>>>>> Stashed changes
          </button>
        </form>
        <div className="mt-6 flex justify-between text-sm">
          <Link 
          to={"/register"} 
          className="text-blue-600 hover:underline">Đăng ký</Link>
          <Link to={"/forgot-password"} className="text-blue-600 hover:underline">Quên mật khẩu?</Link>
        </div>
      </div>
    </div>
  );
}

<<<<<<< Updated upstream
export default LogIn;
=======
export default Login;
>>>>>>> Stashed changes
