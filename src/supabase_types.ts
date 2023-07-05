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
			custom: {
				Row: {
					created_at: string;
					created_by: string;
					description: string | null;
					id: string;
					image: string;
					ingredients: string;
					method: string;
					title: string;
				};
				Insert: {
					created_at?: string;
					created_by: string;
					description?: string | null;
					id?: string;
					image?: string;
					ingredients?: string;
					method: string;
					title: string;
				};
				Update: {
					created_at?: string;
					created_by?: string;
					description?: string | null;
					id?: string;
					image?: string;
					ingredients?: string;
					method?: string;
					title?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'custom_created_by_fkey';
						columns: ['created_by'];
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
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
				Relationships: [
					{
						foreignKeyName: 'items_belongs_to_fkey';
						columns: ['belongs_to'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			profiles: {
				Row: {
					avatar_url: string | null;
					dietary_restrictions: string[];
					full_name: string | null;
					id: string;
					saved_recipes: number[] | null;
					updated_at: string | null;
					username: string | null;
					website: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					dietary_restrictions?: string[];
					full_name?: string | null;
					id: string;
					saved_recipes?: number[] | null;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					dietary_restrictions?: string[];
					full_name?: string | null;
					id?: string;
					saved_recipes?: number[] | null;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'profiles_id_fkey';
						columns: ['id'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			restrictions: {
				Row: {
					belongs_to: string;
					created_at: string | null;
					id: number;
					name: string;
				};
				Insert: {
					belongs_to: string;
					created_at?: string | null;
					id?: number;
					name: string;
				};
				Update: {
					belongs_to?: string;
					created_at?: string | null;
					id?: number;
					name?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'restrictions_belongs_to_fkey';
						columns: ['belongs_to'];
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
			saved: {
				Row: {
					created_at: string;
					created_by: string;
					id: string;
					recipe_id: string;
				};
				Insert: {
					created_at?: string;
					created_by: string;
					id?: string;
					recipe_id: string;
				};
				Update: {
					created_at?: string;
					created_by?: string;
					id?: string;
					recipe_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'saved_created_by_fkey';
						columns: ['created_by'];
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
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
