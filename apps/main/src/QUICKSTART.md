# ⚡ HOTMESS LONDON - Quick Start

## 🚀 Deploy in 60 seconds

```bash
# Make executable
chmod +x DEPLOY.sh

# Run deployment
./DEPLOY.sh
```

**That's it!** The script will:
1. Push code to GitHub (https://github.com/SICQR/HOTMESS-NEXT)
2. Deploy Edge Function to Supabase
3. Test QR generation endpoints

---

## 🔑 You'll need:

**GitHub Personal Access Token:**
- Get from: https://github.com/settings/tokens/new
- Scope: ✅ **repo** (full control)
- Use as password when prompted

---

## 🧪 Test after deploy:

```bash
# Health check
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/health

# Generate QR code
curl -o test.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=hotmess&size=512"

# Open QR code
open test.svg
```

---

## 📖 Full docs:
- **Deployment Guide:** `/DEPLOYMENT_GUIDE.md`
- **README:** `/README.md`
- **Supabase Dashboard:** https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl

---

**🔥 HOTMESS LONDON**
