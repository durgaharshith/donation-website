import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import {
  FaUsers,
  FaDonate,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaDownload,
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [tab, setTab] = useState('users');
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        if (tab === 'donations') {
          const res = await axiosClient.get('/admin/donations');
          setDonations(res.data);
        } else {
          const res = await axiosClient.get('/admin/users');
          setUsers(res.data);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const getStatusBadge = (status) => {
    const normalized = status?.toLowerCase();
    if (normalized === 'completed' || normalized === 'success') {
      return (
        <span className="flex items-center text-green-700 bg-green-100 px-2 py-1 text-xs font-medium rounded-full w-fit">
          <FaCheckCircle className="mr-1" /> Completed
        </span>
      );
    }
    if (normalized === 'pending') {
      return (
        <span className="flex items-center text-yellow-700 bg-yellow-100 px-2 py-1 text-xs font-medium rounded-full w-fit">
          <FaClock className="mr-1" /> Pending
        </span>
      );
    }
    return (
      <span className="flex items-center text-red-700 bg-red-100 px-2 py-1 text-xs font-medium rounded-full w-fit">
        <FaTimesCircle className="mr-1" /> Failed
      </span>
    );
  };

  const downloadReceipt = (donation) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Donation Receipt", 14, 20);

    doc.setFontSize(11);
    doc.text(`Receipt ID: ${donation._id}`, 14, 30);
    doc.text(`Donor: ${donation.donorName} (${donation.donorEmail})`, 14, 36);
    doc.text(`Amount: ₹${donation.amount}`, 14, 42);
    doc.text(`Status: ${donation.paymentStatus}`, 14, 48);
    doc.text(`Date: ${new Date(donation.createdAt).toLocaleString()}`, 14, 54);

    if (donation.message) {
      doc.text(`Message: "${donation.message}"`, 14, 60);
    }

    autoTable(doc, {
      startY: 70,
      head: [['Field', 'Value']],
      body: [
        ['Donor Name', donation.donorName],
        ['Donor Email', donation.donorEmail],
        ['Amount', `₹${donation.amount}`],
        ['Status', donation.paymentStatus],
        ['Date', new Date(donation.createdAt).toLocaleString()],
        ['Message', donation.message || '—'],
      ],
    });

    doc.save(`receipt_${donation._id}.pdf`);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        Unauthorized: Admins only
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-6xl mx-auto bg-white/40 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/30">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6">Admin Dashboard</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTab('donations')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold shadow-md transition duration-300 ${
              tab === 'donations'
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white scale-105 shadow-lg'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <FaDonate /> All Donations
          </button>
          <button
            onClick={() => setTab('users')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold shadow-md transition duration-300 ${
              tab === 'users'
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white scale-105 shadow-lg'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <FaUsers /> All Users
          </button>
        </div>

        {loading && (
          <p className="text-sm text-gray-500 animate-pulse">
            Loading {tab}...
          </p>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {tab === 'donations' && !loading && (
          <>
            {donations.length === 0 ? (
              <p className="text-sm text-gray-600">No donations found.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="w-full text-sm text-left text-gray-700 bg-white/70">
                  <thead className="text-xs text-gray-600 uppercase bg-gray-100">
                    <tr>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Donor</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d) => (
                      <tr key={d._id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-4 py-2 font-semibold text-green-700">₹{d.amount}</td>
                        <td className="px-4 py-2">
                          {d.donorName} <br />
                          <span className="text-xs text-gray-500">{d.donorEmail}</span>
                        </td>
                        <td className="px-4 py-2">{getStatusBadge(d.paymentStatus)}</td>
                        <td className="px-4 py-2 text-xs">
                          {new Date(d.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => downloadReceipt(d)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <FaDownload /> Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'users' && !loading && (
          <>
            {users.length === 0 ? (
              <p className="text-sm text-gray-600">No users found.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="w-full text-sm text-left text-gray-700 bg-white/70">
                  <thead className="text-xs text-gray-600 uppercase bg-gray-100">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-4 py-2 font-medium text-blue-700">{u.name}</td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2 uppercase text-xs text-gray-500">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
