import { supabase as supabaseClient } from '../lib/supabase';

const supabase: any = supabaseClient;

export type ComplianceStatus = {
  consent: boolean;
  age: boolean;
};

export const useCompliance = () => {
  const checkStatus = async (): Promise<ComplianceStatus> => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user ?? null;
    // If not signed in, allow read-only browsing.
    if (!user) return { consent: true, age: true };

    const { data, error } = await supabase
      .from('profiles')
      .select('consent_accepted, is_18_plus')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      const message = String((error as any)?.message ?? '');
      const code = String((error as any)?.code ?? '');
      const missingColumns =
        code === 'PGRST204' ||
        message.toLowerCase().includes('schema cache') ||
        message.toLowerCase().includes('column') ||
        message.toLowerCase().includes('could not find');

      // If columns don't exist yet (migration not applied), fail open to unblock the app.
      if (missingColumns) {
        console.warn('Compliance columns missing. Bypassing lock.', { code, message });
        return { consent: true, age: true };
      }

      return { consent: false, age: false };
    }

    return {
      consent: Boolean((data as any)?.consent_accepted),
      age: Boolean((data as any)?.is_18_plus),
    };
  };

  const grantConsent = async (): Promise<void> => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user ?? null;
    if (!user) return;

    // Ensure profile row exists, then set compliance flags.
    await supabase.from('profiles').upsert({ id: user.id }, { onConflict: 'id' });

    const { error } = await supabase
      .from('profiles')
      .update({ consent_accepted: true, is_18_plus: true })
      .eq('id', user.id);

    if (error) {
      const message = String((error as any)?.message ?? '');
      const code = String((error as any)?.code ?? '');
      const missingColumns =
        code === 'PGRST204' ||
        message.toLowerCase().includes('schema cache') ||
        message.toLowerCase().includes('column') ||
        message.toLowerCase().includes('could not find');

      if (missingColumns) {
        console.warn('Compliance columns missing. Skipping DB consent update.', { code, message });
        return;
      }
    }
  };

  return { checkStatus, grantConsent };
};
