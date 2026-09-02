'use client';

import { useEffect, useMemo, useState } from 'react';
import { getVaultBillingClient } from '../../lib/vault-billing-client';

export default function VaultPlanCta() {
  const [active, setActive] = useState(false);

  const supabase = useMemo(() => {
    try {
      return getVaultBillingClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;

    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted || !data.session) return;
      const { data: entitlement } = await supabase.rpc('vault_entitlement');
      if (mounted) setActive(entitlement?.entitled === true);
    });

    return () => { mounted = false; };
  }, [supabase]);

  return (
    <a className="button vault-plan-cta" href={active ? '/account' : '#get-vault'}>
      {active ? 'Manage Vault' : 'Get Vault'} <span aria-hidden="true">→</span>
    </a>
  );
}
