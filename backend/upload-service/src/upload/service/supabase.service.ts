// src/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly supabaseUrl: string;
  private readonly supabaseKey: string;
  public supabase: SupabaseClient<any, any, 'public', any, any>;

  constructor(private configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_URL')!;
    this.supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY')!; // Hoặc SUPABASE_SERVICE_ROLE_KEY

    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Supabase URL and Key must be configured in .env file');
    }

    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }
}
