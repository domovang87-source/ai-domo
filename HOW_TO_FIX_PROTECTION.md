# How to Disable Vercel Authentication and Make Site Public

## The Problem
Your site shows "Authentication Required" because Vercel Authentication (SSO) is enabled, either at:
1. Project level, OR
2. Team level (this is likely the issue)

## Solution: Check BOTH Levels

### Step 1: Check Project-Level Protection

1. Go to: https://vercel.com/domo-vangs-projects/ai-domo/settings/deployment-protection
2. Look for "Deployment Protection" section
3. Make sure it's set to **"Off"** or **"Standard Protection"** (not "Vercel Authentication")
4. If it shows "Vercel Authentication", change it to "Off"
5. Click "Save"

### Step 2: Check Team-Level Protection (CRITICAL)

Since your project is under a team (`domo-vangs-projects`), the team might have protection enabled:

1. Go to: https://vercel.com/teams/domo-vangs-projects/settings/security
   OR
   https://vercel.com/domo-vangs-projects/settings (look for security/protection)

2. Look for:
   - "Team-Wide Deployment Protection"
   - "Require Vercel Authentication"
   - Any setting that forces authentication on all deployments

3. **Disable** any team-wide authentication requirements

4. Alternatively, you might need to **override** team settings at project level

### Step 3: Override Team Protection (If Needed)

If the team has protection enabled, you may need to:

1. Go to project settings: https://vercel.com/domo-vangs-projects/ai-domo/settings/deployment-protection
2. Look for an option like "Override team settings" or "Custom protection"
3. Enable the override
4. Set protection to "Off" or "Standard Protection"
5. Save changes

### Step 4: Alternative - Make Production Public

If you can't disable team protection, try this:

1. Go to: https://vercel.com/domo-vangs-projects/ai-domo/settings/deployment-protection
2. Under "Production Deployments", set to **"Off"** or **"Standard Protection"**
3. Ensure "Preview Deployments" doesn't have "Vercel Authentication"
4. Save

## How to Verify It's Fixed

After making changes, wait 1-2 minutes, then:

```bash
curl -I https://ai-domo-domo-vangs-projects.vercel.app
```

You should see:
- `HTTP/2 200` (not 401)
- No `_vercel_sso_nonce` cookie
- No authentication redirect

OR just visit in browser (incognito mode): https://ai-domo-domo-vangs-projects.vercel.app
You should see your actual landing page, not "Authentication Required"

## If Still Blocked

If you still see authentication after trying all above:

### Option A: Contact Support
The team owner may need to adjust settings. Contact them or Vercel support.

### Option B: Create New Personal Project
If the team restrictions can't be changed:

1. Create a new Vercel project under your personal account (not team)
2. Connect the same GitHub repo
3. Set all environment variables
4. Deploy - this will have full control without team restrictions

## Quick Check Commands

Check if site is public:
```bash
curl -I https://ai-domo-domo-vangs-projects.vercel.app | grep -i "http\|401\|200"
```

- `HTTP/2 200` = Good, site is public
- `HTTP/2 401` = Bad, still protected

---

**Most Likely Issue**: Team-level protection is enabled on `domo-vangs-projects` team
**Solution**: Disable it in team settings or override at project level
