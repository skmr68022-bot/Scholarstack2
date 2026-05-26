export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          role: "student" | "scholar" | "admin";
          expertise: string | null;
          avatar_url: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          role?: "student" | "scholar" | "admin";
          expertise?: string | null;
          avatar_url?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      notes: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          scholar_id: string | null;
          scholar_name: string;
          price: string;
          original_price: string | null;
          exam: string | null;
          category: "competitive" | "university" | "board" | null;
          board_type: string | null;
          subject: string | null;
          pages: number;
          color: string;
          tag: string;
          rating: number;
          reviews_count: number;
          sales_count: number;
          content_type: "PDF" | "Video" | "Bundle";
          status: "review" | "live" | "rejected";
          file_url: string | null;
          thumbnail_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          scholar_id?: string | null;
          scholar_name?: string;
          price?: string;
          original_price?: string | null;
          exam?: string | null;
          category?: "competitive" | "university" | "board" | null;
          board_type?: string | null;
          subject?: string | null;
          pages?: number;
          color?: string;
          tag?: string;
          rating?: number;
          reviews_count?: number;
          sales_count?: number;
          content_type?: "PDF" | "Video" | "Bundle";
          status?: "review" | "live" | "rejected";
          file_url?: string | null;
          thumbnail_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["notes"]["Insert"]>;
      };
      purchases: {
        Row: {
          id: number;
          student_id: string;
          note_id: number;
          amount: string;
          payment_method: string;
          created_at: string;
        };
        Insert: {
          student_id: string;
          note_id: number;
          amount?: string;
          payment_method?: string;
        };
        Update: Partial<Database["public"]["Tables"]["purchases"]["Insert"]>;
      };
      bookmarks: {
        Row: {
          id: number;
          student_id: string;
          note_id: number;
          created_at: string;
        };
        Insert: { student_id: string; note_id: number };
        Update: Partial<Database["public"]["Tables"]["bookmarks"]["Insert"]>;
      };
      scholar_approvals: {
        Row: {
          id: number;
          scholar_id: string;
          scholar_name: string | null;
          expertise: string | null;
          status: "pending" | "approved" | "rejected";
          submitted_at: string;
        };
        Insert: {
          scholar_id: string;
          scholar_name?: string | null;
          expertise?: string | null;
          status?: "pending" | "approved" | "rejected";
        };
        Update: Partial<Database["public"]["Tables"]["scholar_approvals"]["Insert"]>;
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type Purchase = Database["public"]["Tables"]["purchases"]["Row"];
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
export type ScholarApproval = Database["public"]["Tables"]["scholar_approvals"]["Row"];
