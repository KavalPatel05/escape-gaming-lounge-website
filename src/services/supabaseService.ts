import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CustomerProfile, Station, Booking, RewardPoint, NotificationDispatch } from '../types';

export const supabaseService = {
  // --- REAL SUPABASE AUTHENTICATION ---
  
  // 1. Mobile Phone SMS OTP: Send 6-digit OTP code to phone number
  async sendPhoneOtp(phone: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured) {
      return { success: true, message: 'Demo Mode: SMS OTP code 123456 generated.' };
    }

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, message: `OTP sent via SMS to ${formattedPhone}` };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to send OTP';
      return { success: false, message: errMsg };
    }
  },

  // 2. Mobile Phone SMS OTP: Verify OTP code
  async verifyPhoneOtp(phone: string, token: string): Promise<{ success: boolean; message: string; user?: any }> {
    if (!isSupabaseConfigured) {
      return { success: true, message: 'Verified (Demo)' };
    }

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms',
      });

      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, message: 'Mobile OTP verified successfully!', user: data.user };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'OTP Verification failed';
      return { success: false, message: errMsg };
    }
  },

  // 3. Email Authentication: Sign Up with Password
  async signUpWithEmail(email: string, password: string, name: string, phone: string): Promise<{ success: boolean; message: string; user?: any }> {
    if (!isSupabaseConfigured) {
      return { success: true, message: 'Account created (Demo)' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
          },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      // Upsert into profiles table
      if (data.user) {
        await supabase.from('profiles').upsert([{
          id: data.user.id,
          name: name,
          email: email,
          phone: phone,
          qr_code_value: `EGL-${data.user.id.slice(-4)}`,
        }]);
      }

      return { success: true, message: 'Registration successful!', user: data.user };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Sign up failed';
      return { success: false, message: errMsg };
    }
  },

  // 4. Email Authentication: Sign In with Password
  async signInWithEmail(email: string, password: string): Promise<{ success: boolean; message: string; user?: any }> {
    if (!isSupabaseConfigured) {
      return { success: true, message: 'Logged in (Demo)' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Sign in successful!', user: data.user };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Authentication failed';
      return { success: false, message: errMsg };
    }
  },

  // 5. Sign Out
  async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  // --- DATABASE SYNC METHODS ---

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
