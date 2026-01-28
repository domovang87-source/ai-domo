-- Manually activate the user who just paid
UPDATE public.users
SET
  subscription_status = 'active',
  stripe_subscription_id = 'sub_1Su7SeIh4L1XwSoRgSMumgmE',
  stripe_customer_id = 'cus_TrrACdZJWPS5iA',
  subscription_current_period_end = '2026-02-03 08:17:18+00',
  updated_at = NOW()
WHERE id = 'f7657196-e3ec-4d1c-9cd2-614e71ec86cc';

-- Verify the update
SELECT id, email, subscription_status, stripe_subscription_id
FROM public.users
WHERE id = 'f7657196-e3ec-4d1c-9cd2-614e71ec86cc';
