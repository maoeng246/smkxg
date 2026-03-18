import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService, ReservationData } from '../services/db';
import { ArrowLeft, Database, Calendar, Users, Phone, User, FileText } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查管理员权限
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // 获取预约数据
    dbService.getReservations().then((data) => {
      setReservations(data);
      setIsLoading(false);
    });
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30">
      {/* Admin Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl font-bold tracking-tight">预约管理系统</h1>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            退出登录
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">预约记录</h2>
          <p className="text-zinc-400">查看并管理所有来自展馆预约模块的提交信息。</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-12 text-center">
            <Database className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">暂无预约数据</h3>
            <p className="text-zinc-400">目前还没有人提交展馆预约。</p>
          </div>
        ) : (
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/50">
                    <th className="p-4 text-sm font-medium text-zinc-400 whitespace-nowrap">提交时间</th>
                    <th className="p-4 text-sm font-medium text-zinc-400 whitespace-nowrap">姓名</th>
                    <th className="p-4 text-sm font-medium text-zinc-400 whitespace-nowrap">联系电话</th>
                    <th className="p-4 text-sm font-medium text-zinc-400 whitespace-nowrap">预约日期</th>
                    <th className="p-4 text-sm font-medium text-zinc-400 whitespace-nowrap">参观人数</th>
                    <th className="p-4 text-sm font-medium text-zinc-400">备注信息</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm text-zinc-300 whitespace-nowrap">
                        {new Date(res.createdAt!).toLocaleString('zh-CN', {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="p-4 text-sm font-medium text-white whitespace-nowrap flex items-center gap-2">
                        <User className="w-4 h-4 text-zinc-500" /> {res.name}
                      </td>
                      <td className="p-4 text-sm text-zinc-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-zinc-500" /> {res.phone}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-zinc-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-400" /> {res.date}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-zinc-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-zinc-500" /> {res.visitors}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-zinc-400 max-w-xs truncate" title={res.notes}>
                        {res.notes || <span className="text-zinc-600 italic">无备注</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
