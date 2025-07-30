import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/authSlice';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const GoogleRedirectHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get('/auth/current-user');
        if (res.data) {
          dispatch(setUser(res.data));
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } catch {
        navigate('/login');
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <FaSpinner className="text-blue-600 text-5xl animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Logging you in with Google...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
};

export default GoogleRedirectHandler;
