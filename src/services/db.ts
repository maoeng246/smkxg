export interface ReservationData {
  id?: string;
  name: string;
  phone: string;
  date: string;
  visitors: string;
  notes: string;
  createdAt?: string;
}

// 预留的数据库接口 - 目前使用 localStorage 模拟，未来可替换为真实后端 API
export const dbService = {
  async saveReservation(data: Omit<ReservationData, 'id' | 'createdAt'>): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existing = JSON.parse(localStorage.getItem('lsm_reservations') || '[]');
        const newRecord: ReservationData = {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('lsm_reservations', JSON.stringify([newRecord, ...existing]));
        resolve(true);
      }, 600); // 模拟网络延迟
    });
  },

  async getReservations(): Promise<ReservationData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = JSON.parse(localStorage.getItem('lsm_reservations') || '[]');
        resolve(data);
      }, 400);
    });
  }
};
