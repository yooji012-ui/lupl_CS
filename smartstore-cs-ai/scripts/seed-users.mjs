import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const users = [
  { login_id: '0000', name: '관리자', role: 'owner', phone_last4: null, password: '1234' },
  { login_id: '0001', name: '직원 1', role: 'staff', phone_last4: null, password: '1234' }
];

for (const user of users) {
  const password_hash = await bcrypt.hash(user.password, 10);
  const { error } = await supabase.from('app_users').upsert({
    login_id: user.login_id,
    name: user.name,
    role: user.role,
    phone_last4: user.phone_last4,
    password_hash,
    is_active: true
  }, { onConflict: 'login_id' });
  if (error) throw error;
  console.log(`seeded ${user.login_id}`);
}
