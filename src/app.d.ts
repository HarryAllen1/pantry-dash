import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from './supabase_types';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		type DatabaseDefinitions = Database;
		// interface Error {}
		// interface Platform {}
	}
}
