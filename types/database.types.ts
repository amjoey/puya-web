// Hand-authored to match DATABASE_SCHEMA.sql exactly (no live Supabase
// project yet to run `supabase gen types typescript` against). Regenerate
// via the CLI once a project is linked; keep this file in sync until then.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      villas: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          capacity: number;
          weekday_price: number;
          weekend_price: number;
          cover_image: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          capacity?: number;
          weekday_price: number;
          weekend_price: number;
          cover_image?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          capacity?: number;
          weekday_price?: number;
          weekend_price?: number;
          cover_image?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          villa_id: string;
          customer_name: string;
          phone: string;
          line_id: string | null;
          email: string | null;
          guest_count: number;
          check_in: string;
          check_out: string;
          total_nights: number;
          total_price: number;
          payment_status: string;
          booking_status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          villa_id: string;
          customer_name: string;
          phone: string;
          line_id?: string | null;
          email?: string | null;
          guest_count?: number;
          check_in: string;
          check_out: string;
          total_nights: number;
          total_price: number;
          payment_status?: string;
          booking_status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          villa_id?: string;
          customer_name?: string;
          phone?: string;
          line_id?: string | null;
          email?: string | null;
          guest_count?: number;
          check_in?: string;
          check_out?: string;
          total_nights?: number;
          total_price?: number;
          payment_status?: string;
          booking_status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_villa_id_fkey";
            columns: ["villa_id"];
            referencedRelation: "villas";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          amount: number;
          slip_image: string | null;
          verified: boolean;
          verified_at: string | null;
          verified_by: string | null;
          remarks: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          amount: number;
          slip_image?: string | null;
          verified?: boolean;
          verified_at?: string | null;
          verified_by?: string | null;
          remarks?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          amount?: number;
          slip_image?: string | null;
          verified?: boolean;
          verified_at?: string | null;
          verified_by?: string | null;
          remarks?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey";
            columns: ["booking_id"];
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          villa_id: string;
          customer_name: string;
          rating: number;
          comment: string | null;
          image_url: string | null;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          villa_id: string;
          customer_name: string;
          rating: number;
          comment?: string | null;
          image_url?: string | null;
          approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          villa_id?: string;
          customer_name?: string;
          rating?: number;
          comment?: string | null;
          image_url?: string | null;
          approved?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_villa_id_fkey";
            columns: ["villa_id"];
            referencedRelation: "villas";
            referencedColumns: ["id"];
          },
        ];
      };
      promotions: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          discount_type: string;
          discount_value: number;
          start_date: string | null;
          end_date: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          discount_type: string;
          discount_value: number;
          start_date?: string | null;
          end_date?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          discount_type?: string;
          discount_value?: number;
          start_date?: string | null;
          end_date?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      admins: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      villa_images: {
        Row: {
          id: string;
          villa_id: string;
          storage_path: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          villa_id: string;
          storage_path: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          villa_id?: string;
          storage_path?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "villa_images_villa_id_fkey";
            columns: ["villa_id"];
            referencedRelation: "villas";
            referencedColumns: ["id"];
          },
        ];
      };
      blocked_dates: {
        Row: {
          id: string;
          villa_id: string | null;
          blocked_date: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          villa_id?: string | null;
          blocked_date: string;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          villa_id?: string | null;
          blocked_date?: string;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blocked_dates_villa_id_fkey";
            columns: ["villa_id"];
            referencedRelation: "villas";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
