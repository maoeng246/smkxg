import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { name: '展馆介绍', href: '#about' },
  { name: '学生风采', href: '#students' },
  { name: '线上展馆', href: '#exhibition' },
  { name: '展馆预约', href: '#reservation' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Admin Login State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '101211') {
      sessionStorage.setItem('isAdmin', 'true');
      setShowAdminModal(false);
      setPassword('');
      setError('');
      navigate('/admin');
    } else {
      setError('密码错误，请重试');
    }
  };

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold tracking-tighter text-white">
          LSM<span className="text-emerald-400">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#reservation"
            className="px-5 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-emerald-400 hover:text-black transition-colors"
          >
            立即预约
          </a>
          <button
            onClick={() => setShowAdminModal(true)}
            className="px-5 py-2 text-sm font-medium border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Lock className="w-4 h-4" /> 管理员
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 py-6 px-6 flex flex-col gap-6"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-white/80 hover:text-white"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setShowAdminModal(true);
            }}
            className="text-lg font-medium text-emerald-400 hover:text-emerald-300 text-left flex items-center gap-2 mt-4"
          >
            <Lock className="w-5 h-5" /> 管理员入口
          </button>
        </motion.div>
      )}

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-8 w-full max-w-md relative shadow-2xl"
          >
            <button 
              onClick={() => {
                setShowAdminModal(false);
                setPassword('');
                setError('');
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-center text-white mb-2">管理员登录</h3>
            <p className="text-zinc-400 text-center text-sm mb-8">请输入管理员密码以访问预约数据</p>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-center tracking-widest"
                  autoFocus
                />
                {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
              >
                进入系统 <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.nav>
  );
}
