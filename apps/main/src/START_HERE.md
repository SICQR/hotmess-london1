# 🔥 START HERE - Deploy HOTMESS LONDON

## ⚡ You're 3 commands away from deploying!

---

## 📍 Step 1: Open Terminal

In Figma Make, open a terminal/command line interface.

---

## 📍 Step 2: Make Script Executable

```bash
chmod +x DEPLOY.sh
```

---

## 📍 Step 3: Run Deployment

```bash
./DEPLOY.sh
```

**That's it!** 🎉

---

## 🔑 When prompted for GitHub credentials:

**Username:** `SICQR`

**Password:** Your GitHub Personal Access Token

**Don't have a token?**
1. Go to: https://github.com/settings/tokens/new
2. Name: `HOTMESS Deploy`
3. Scope: ✅ **repo** (full control)
4. Generate and copy the token
5. Paste it as your password

---

## ✅ What the script does:

1. ✅ Initializes git repository
2. ✅ Commits all files
3. ✅ Pushes to GitHub: https://github.com/SICQR/HOTMESS-NEXT
4. ✅ Deploys Edge Function to Supabase
5. ✅ Tests QR generation endpoints
6. ✅ Shows success message with test URLs

---

## 🧪 After deployment, test QR generation:

```bash
# Generate a HOTMESS-style QR code
curl -o test.svg "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=hotmess&size=512"

# Open it
open test.svg  # macOS
xdg-open test.svg  # Linux
start test.svg  # Windows
```

---

## 📖 Need more help?

- **Quick Start:** Read `/QUICKSTART.md`
- **Full Guide:** Read `/DEPLOYMENT_GUIDE.md`
- **Checklist:** Read `/DEPLOYMENT_CHECKLIST.md`

---

## 🚨 Troubleshooting

### "Permission denied" error:
```bash
chmod +x DEPLOY.sh
```

### "Authentication failed":
Make sure you're using a Personal Access Token (not your password)
Get one from: https://github.com/settings/tokens/new

### "Supabase CLI not found":
The script will skip Supabase deployment and show manual instructions.
Or install: `brew install supabase/tap/supabase` (macOS)

---

## 🎯 Ready? Let's go!

```bash
chmod +x DEPLOY.sh
./DEPLOY.sh
```

**🔥 HOTMESS LONDON - Nightlife on Earth**
