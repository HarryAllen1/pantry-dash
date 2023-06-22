export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export interface Database {
	public: {
		Tables: {
			items: {
				Row: {
					belongs_to: string | null;
					created_at: string | null;
					id: string;
					location: string | null;
					name: string | null;
					notes: string | null;
					quantity: number | null;
					unit: string | null;
				};
				Insert: {
					belongs_to?: string | null;
					created_at?: string | null;
					id?: string;
					location?: string | null;
					name?: string | null;
					notes?: string | null;
					quantity?: number | null;
					unit?: string | null;
				};
				Update: {
					belongs_to?: string | null;
					created_at?: string | null;
					id?: string;
					location?: string | null;
					name?: string | null;
					notes?: string | null;
					quantity?: number | null;
					unit?: string | null;
				};
			};
			profiles: {
				Row: {
					avatar_url: string | null;
					dietary_restrictions: string[];
					full_name: string | null;
					id: string;
					updated_at: string | null;
					username: string | null;
					website: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					dietary_restrictions?: string[];
					full_name?: string | null;
					id: string;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					dietary_restrictions?: string[];
					full_name?: string | null;
					id?: string;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
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
