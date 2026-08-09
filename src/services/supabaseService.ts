import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CustomerProfile, Station, Booking, RewardPoint, NotificationDispatch } from '../types';

export const supabaseService = {
  // 1. Fetch or create customer profile by Phone or Email
  async syncCustomerProfile(profile: Partial<CustomerProfile>): Promise<CustomerProfile | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .or(`phone.eq.${profile.phone},email.eq.${profile.email}`)
        .maybeSingle();

      if (existing) {
        return {
          id: existing.id,
          name: existing.name,
          phone: existing.phone,
          email: existing.email,
          totalPointsBalance: existing.total_points_balance || 0,
          qrCodeValue: existing.qr_code_value || `EGL-${existing.id.slice(-4)}`,
          isLoggedIn: true,
        };
      }

      const id = profile.id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: inserted } = await supabase
        .from('profiles')
        .insert([{
          id,
          name: profile.name,
          phone: profile.phone,
          email: profile.email,
          total_points_balance: profile.totalPointsBalance || 0,
          qr_code_value: profile.qrCodeValue || `EGL-${id.slice(-4)}`,
        }])
        .select()
        .single();

      if (inserted) {
        return {
          id: inserted.id,
          name: inserted.name,
          phone: inserted.phone,
          email: inserted.email,
          totalPointsBalance: inserted.total_points_balance || 0,
          qrCodeValue: inserted.qr_code_value,
          isLoggedIn: true,
        };
      }
    } catch (err) {
      console.warn('Supabase sync warning:', err);
    }
    return null;
  },

  // 2. Fetch stations from Supabase
  async getStations(): Promise<Station[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.from('stations').select('*');
      if (data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          name: row.name,
          type: row.type,
          description: row.description,
          image: row.image,
          specs: row.specs || [],
          status: row.status,
          currentSession: row.current_session || undefined,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch stations failed:', err);
    }
    return null;
  },

  // 3. Save booking to Supabase
  async saveBooking(booking: Booking): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('bookings').insert([{
        id: booking.id,
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        customer_email: booking.customerEmail,
        customer_id: booking.customerId,
        station_id: booking.stationId,
        station_type: booking.stationType,
        sim_mode: booking.simMode,
        date: booking.date,
        time_slot: booking.timeSlot,
        duration_minutes: booking.durationMinutes,
        controllers_count: booking.controllersCount,
        extra_persons_count: booking.extraPersonsCount,
        total_cost: booking.totalCost,
        redeemed_points: booking.redeemedPoints,
        is_reward_booking: booking.isRewardBooking,
        status: booking.status,
      }]);

      return !error;
    } catch (err) {
      console.warn('Supabase booking save warning:', err);
      return false;
    }
  },

  // 4. Save notification dispatch to Supabase
  async saveNotification(notif: NotificationDispatch): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('notifications').insert([{
        id: notif.id,
        booking_id: notif.bookingId,
        recipient_phone: notif.recipientPhone,
        recipient_email: notif.recipientEmail,
        sms_content: notif.smsContent,
        email_subject: notif.emailSubject,
        email_body: notif.emailBody,
        sent_at: notif.sentAt,
      }]);
      return !error;
    } catch (err) {
      console.warn('Supabase notification save warning:', err);
      return false;
    }
  },

  // 5. Sync Reward Points
  async saveRewardPoint(pt: RewardPoint): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('reward_points').insert([{
        id: pt.id,
        customer_id: pt.customerId,
        points: pt.points,
        earned_date: pt.earnedDate,
        expiry_date: pt.expiryDate,
        is_expired: pt.isExpired,
        is_redeemed: pt.isRedeemed,
        description: pt.description,
      }]);
      return !error;
    } catch (err) {
      console.warn('Supabase reward point save warning:', err);
      return false;
    }
  },
};
