import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, Mail, Phone, User, CheckCircle2, Download, X, QrCode } from 'lucide-react';
import { dbService, ReservationData } from '../services/db';
import * as htmlToImage from 'html-to-image';

export default function Reservation() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    visitors: '1',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [voucher, setVoucher] = useState<ReservationData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      alert('请填写必填项（姓名、电话、日期）');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const savedData = await dbService.saveReservation(formData);
      setIsSuccess(true);
      setVoucher(savedData);
      setFormData({ name: '', phone: '', date: '', visitors: '1', notes: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to save reservation:', error);
      alert('预约提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadVoucher = async () => {
    const element = document.getElementById('voucher-ticket');
    if (!element) return;
    
    setIsDownloading(true);
    try {
      // 确保元素完全渲染后再截图
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        style: {
          transform: 'none',
          margin: '0',
          boxShadow: 'none'
        }
      });
      
      const link = document.createElement('a');
      link.download = `LSM展馆预约凭证_${voucher?.id}.png`;
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error('Image generation failed', error);
      alert(`图片生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsDownloading(false);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="reservation" className="py-32 bg-black text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left: Info */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="text-sm uppercase tracking-[0.3em] text-emerald-400 mb-6 font-semibold">
              04 / 展馆预约
            </motion.h2>
            <motion.h3 variants={itemVariants} className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
              开启您的<br />探索之旅
            </motion.h3>
            <motion.p variants={itemVariants} className="text-lg text-zinc-400 leading-relaxed mb-12 max-w-xl">
              生命科学馆面向公众免费开放。为保证参观体验，请提前至少1个工作日进行预约。团队参观请提供相关证明材料。
            </motion.p>

            <motion.div variants={containerVariants} className="space-y-6">
              <motion.div variants={itemVariants} className="flex items-center gap-4 text-zinc-300">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-white">开放时间</p>
                  <p className="text-sm">周二至周日 09:00 - 17:00 (周一闭馆)</p>
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-center gap-4 text-zinc-300">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-white">咨询电话</p>
                  <p className="text-sm">010-12345678</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12"
        >
          <motion.form 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-6" 
            onSubmit={handleSubmit}
          >
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>预约提交成功！我们将尽快与您联系确认。</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" /> 姓名 <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="请输入您的姓名"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> 联系电话 <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="请输入手机号码"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> 预约日期 <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all [color-scheme:dark]"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <Users className="w-4 h-4" /> 参观人数
                </label>
                <select 
                  value={formData.visitors}
                  onChange={(e) => setFormData({...formData, visitors: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
                >
                  <option value="1">1 人</option>
                  <option value="2">2 人</option>
                  <option value="3-5">3-5 人</option>
                  <option value="group">团队 (5人以上)</option>
                </select>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">备注信息 (选填)</label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
                placeholder="如有特殊需求请在此说明..."
              />
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-colors duration-300 flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                '提交预约申请'
              )}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>

      {/* Voucher Modal */}
      {voucher && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md relative shadow-2xl flex flex-col max-h-[90vh]"
          >
            <button 
              onClick={() => setVoucher(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-4 text-center">预约成功</h3>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4">
              {/* Ticket Element to be converted to PDF */}
              <div id="voucher-ticket" className="bg-white text-black rounded-xl p-8 relative overflow-hidden mx-auto w-full max-w-[350px] shadow-lg">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-3 bg-emerald-500"></div>
                
                <div className="text-center mb-8 mt-2">
                  <h4 className="text-3xl font-black tracking-tighter mb-1">LSM<span className="text-emerald-500">.</span></h4>
                  <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">Exhibition Voucher</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex flex-col border-b border-gray-100 pb-3">
                    <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">预约编号 / ID</span>
                    <span className="font-mono font-bold text-xl text-emerald-600 tracking-wider">{voucher.id}</span>
                  </div>
                  <div className="flex flex-col border-b border-gray-100 pb-3">
                    <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">姓名 / Name</span>
                    <span className="font-bold text-lg">{voucher.name}</span>
                  </div>
                  <div className="flex flex-col border-b border-gray-100 pb-3">
                    <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">联系电话 / Phone</span>
                    <span className="font-medium text-lg">{voucher.phone}</span>
                  </div>
                  <div className="flex flex-col border-b border-gray-100 pb-3">
                    <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">预约日期 / Date</span>
                    <span className="font-medium text-lg">{voucher.date}</span>
                  </div>
                  <div className="flex flex-col pb-2">
                    <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">参观人数 / Visitors</span>
                    <span className="font-medium text-lg">{voucher.visitors} 人</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative">
                  {/* Cutout circles for ticket effect */}
                  <div className="absolute -left-11 -top-3 w-6 h-6 bg-zinc-900 rounded-full"></div>
                  <div className="absolute -right-11 -top-3 w-6 h-6 bg-zinc-900 rounded-full"></div>
                  
                  <QrCode className="w-24 h-24 text-black mb-3" />
                  <p className="text-xs text-gray-400 text-center">入馆时请出示此凭证或二维码</p>
                </div>
              </div>
            </div>

            <button
              onClick={downloadVoucher}
              disabled={isDownloading}
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 shrink-0"
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Download className="w-4 h-4" /> 保存凭证为图片
                </>
              )}
            </button>
          </motion.div>
        </div>,
        document.body
      )}
    </section>
  );
}
