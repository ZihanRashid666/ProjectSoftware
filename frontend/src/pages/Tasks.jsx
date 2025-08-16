import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CalendarMini from '../components/CalendarMini';

const Tasks = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([
    '✅ Sent $200 to Alice',
    '✅ Received $500 from Bob',
    '⚡ Paid $50 for Electricity Bill',
  ]);

  const [transferError, setTransferError] = useState('');
  const [depositError, setDepositError] = useState('');

  const initials = useMemo(() => {
    const n = (user?.name || 'Zihan Rashid').trim();
    return n
      .split(/\s+/)
      .slice(0, 3)
      .map((x) => x[0]?.toUpperCase() || '')
      .join('');
  }, [user]);

  const handleLogout = () => {
    try {
      logout();
    } finally {
      navigate('/login');
    }
  };

  // Auto-clear errors
  useEffect(() => {
    if (transferError) {
      const timer = setTimeout(() => setTransferError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [transferError]);

  useEffect(() => {
    if (depositError) {
      const timer = setTimeout(() => setDepositError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [depositError]);

  const handleTransfer = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);

    if (!recipient) return setTransferError("Please enter the name.");
    if (isNaN(amt) || amt <= 0) return setTransferError('Please enter a valid amount greater than 0.');
    if (amt > balance) return setTransferError('Insufficient balance! Please deposit more funds.');

    setBalance((prev) => prev - amt);
    setTransactions((prev) => [`✅ Sent $${amt.toFixed(2)} to ${recipient}`, ...prev]);
    setRecipient('');
    setAmount('');
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return setDepositError('Please enter a valid deposit amount greater than 0.');
    setBalance((prev) => prev + amt);
    setTransactions((prev) => [`💵 Deposited $${amt.toFixed(2)}`, ...prev]);
    setDepositAmount('');
  };

  // --- Example calendar events (you can generate these from backend later) ---
  const calendarEvents = [
    { date: '2025-08-20', label: '🏠 Rent due: $300' },
    { date: '2025-08-22', label: '📶 Internet bill: $60' },
    { date: '2025-08-25', label: '🎯 Savings auto-transfer: $100' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-600 text-white grid place-items-center font-bold">
              {initials || 'U'}
            </div>
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <p className="font-semibold text-slate-800">{user?.name || 'Zihan Rashid'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-rose-600 text-white px-4 py-2 font-medium shadow hover:bg-rose-700 active:scale-[.98] transition"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MAIN */}
        <main className="md:col-span-2 space-y-6">
          {/* Balance */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white p-6 shadow-lg">
            <div className="absolute -right-16 -top-16 size-40 rounded-full bg-white/10 blur-2xl" />
            <h2 className="text-sm/6 uppercase tracking-wider text-white/80">Account Balance</h2>
            <p className="mt-2 text-4xl font-bold">${balance.toFixed(2)}</p>
            <p className="mt-1 text-white/70 text-sm">Live update • Secure</p>
          </section>

          {/* Profile card */}
          <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-slate-200 text-slate-700 grid place-items-center font-semibold">
                  {initials || 'U'}
                </div>
                <div>
                  <p className="text-slate-800 font-medium">{user?.name || 'Zihan Rashid'}</p>
                  <p className="text-slate-500 text-sm">{user?.email || 'zihan.rashid@connect.qut.edu.au'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Transfer & Deposit */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transfer */}
            <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-3">💸 Fund Transfer</h3>
              {transferError && (
                <p className="mb-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 text-sm">
                  {transferError}
                </p>
              )}
              <form onSubmit={handleTransfer} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Recipient</label>
                  <input
                    type="text"
                    placeholder="e.g. Sam/Alice"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 text-white px-4 py-2 font-medium shadow hover:bg-blue-700 active:scale-[.99] transition"
                >
                  Send Money
                </button>
              </form>
            </section>

            {/* Deposit */}
            <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-3">💵 Deposit Money</h3>
              {depositError && (
                <p className="mb-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 text-sm">
                  {depositError}
                </p>
              )}
              <form onSubmit={handleDeposit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 text-white px-4 py-2 font-medium shadow hover:bg-emerald-700 active:scale-[.99] transition"
                >
                  Deposit
                </button>
              </form>
            </section>
          </div>

          {/* Transactions */}
          <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-3">📜 Transaction History</h3>
            {transactions.length === 0 ? (
              <p className="text-slate-500 text-sm">No transactions yet.</p>
            ) : (
              <ul className="space-y-2">
                {transactions.map((txn, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-slate-800 hover:bg-slate-50 transition"
                  >
                    {txn}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          {/* Welcome */}
          <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Welcome to MyBank Online</h3>
            <p className="text-slate-600 text-sm">
              Manage your finances, track transactions, and transfer funds securely.
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>💰 Real-time Account Balance</li>
              <li>💸 Secure Fund Transfers</li>
              <li>💳 Easy Deposits</li>
              <li>📜 Transaction History</li>
              <li>👤 Profile Management</li>
              <li>🔒 Secure Authentication</li>
            </ul>
          </section>

          {/* Mini Calendar */}
          <CalendarMini
            title=""
            events={calendarEvents}
            initialDate={new Date()}
            onSelectDate={(d) => {
              // example: if user clicks a date in the future, you could prefill deposit/transfer or show a toast
              // console.log("Selected date:", d);
            }}
          />
        </aside>
      </div>
    </div>
  );
};

export default Tasks;
