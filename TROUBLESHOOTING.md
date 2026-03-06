# 🔧 Installation & Troubleshooting Guide

## Understanding npm Warnings

When you run `npm install`, you may see deprecation warnings. Here's what they mean:

### ⚠️ Deprecation Warnings (Safe to Ignore)

These warnings indicate that some dependencies use older packages, but they **won't prevent your app from running**:

```
npm warn deprecated inflight@1.0.6
npm warn deprecated glob@7.2.3
npm warn deprecated rimraf@3.0.2
npm warn deprecated @humanwhocodes/config-array@0.13.0
```

**What to do**: Nothing! These are transitive dependencies (dependencies of your dependencies). The app will work fine.

### 🔴 Critical Updates (Action Required)

The security scan found a **critical vulnerability** in Next.js 14.1.0. I've already updated `package.json` to fix this.

**What was fixed**:
- ✅ Next.js updated from `14.1.0` → `15.5.10` (fixes DoS vulnerability)
- ✅ React updated from `18.2.0` → `19.0.0` (compatibility)
- ✅ ESLint updated to latest version

## Installation Steps

### 1. Clean Install (Recommended)

If you already ran `npm install`, do a clean reinstall:

```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Or on Windows:
rmdir /s /q node_modules
del package-lock.json

# Fresh install
npm install
```

### 2. Verify Installation

Check that everything installed correctly:

```bash
# Should show Next.js 15.5.10
npm list next

# Should show React 19.0.0
npm list react
```

### 3. Run the App

```bash
npm run dev
```

Expected output:
```
▲ Next.js 15.5.10
- Local:        http://localhost:3000
- Ready in 2.5s
```

## Common Installation Issues

### ❌ Issue: "ERESOLVE unable to resolve dependency tree"

**Cause**: Conflicting package versions

**Solution**:
```bash
npm install --legacy-peer-deps
```

### ❌ Issue: "Cannot find module 'next'"

**Cause**: Installation didn't complete

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### ❌ Issue: "Port 3000 already in use"

**Cause**: Another app is using port 3000

**Solution**:
```bash
# Use a different port
npm run dev -- -p 3001
```

### ❌ Issue: "Module not found: Can't resolve '@/components/...'"

**Cause**: TypeScript path aliases not configured

**Solution**: Check that `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### ❌ Issue: React 19 Breaking Changes

**Cause**: React 19 has some breaking changes from React 18

**Potential issues**:
- Some Radix UI components may need updates
- `ReactDOM.render` is removed (use `createRoot`)

**Solution**: If you encounter React 19 issues, you can temporarily downgrade:
```bash
npm install react@18.2.0 react-dom@18.2.0
```

But note: This keeps the Next.js 15.5.10 security fix while using React 18.

## Dependency Overview

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 15.5.10 | React framework |
| react | 19.0.0 | UI library |
| typescript | 5.3.3 | Type safety |
| tailwindcss | 3.4.1 | Styling |

### Supabase

| Package | Version | Purpose |
|---------|---------|---------|
| @supabase/supabase-js | 2.39.3 | Supabase client |
| @supabase/ssr | 0.1.0 | Server-side auth |

### UI Components

| Package | Version | Purpose |
|---------|---------|---------|
| @radix-ui/* | Various | Accessible components |
| lucide-react | 0.309.0 | Icons |
| tailwindcss-animate | 1.0.7 | Animations |

## Updating Dependencies

### Check for Updates

```bash
# Check outdated packages
npm outdated

# Update all to latest (careful!)
npm update

# Update specific package
npm install package-name@latest
```

### Recommended Update Schedule

- **Security updates**: Immediately
- **Major versions**: Test thoroughly first
- **Minor/patch versions**: Monthly

## Build & Production

### Build for Production

```bash
npm run build
```

This will:
1. Type-check your code
2. Compile TypeScript
3. Optimize for production
4. Generate static pages

### Test Production Build Locally

```bash
npm run build
npm start
```

### Build Errors

If build fails:

1. **Check TypeScript errors**:
```bash
npx tsc --noEmit
```

2. **Check ESLint errors**:
```bash
npm run lint
```

3. **Clear Next.js cache**:
```bash
rm -rf .next
npm run build
```

## Environment Variables

Make sure `.env.local` exists and has all required variables:

```bash
# Check if file exists
ls -la .env.local

# Or on Windows:
dir .env.local
```

Required variables:
- ✅ `TMDB_API_KEY`
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

## Performance Tips

### Faster Installs

Use `npm ci` for faster, reproducible installs:
```bash
npm ci
```

This uses `package-lock.json` exactly as-is.

### Reduce Bundle Size

Check what's making your bundle large:
```bash
npm run build
# Look for "First Load JS" sizes
```

### Cache Node Modules

If you're reinstalling often, consider using a package manager cache:
```bash
# Use pnpm (faster alternative to npm)
npm install -g pnpm
pnpm install
```

## Getting Help

If you're still stuck:

1. **Check the logs**: Read the full error message
2. **Search the error**: Google the exact error message
3. **Check GitHub Issues**: Look for similar issues in Next.js/Supabase repos
4. **Clear everything**: `rm -rf node_modules .next && npm install`

## Verification Checklist

Before running the app, verify:

- ✅ Node.js 18.17+ installed (`node --version`)
- ✅ npm 9+ installed (`npm --version`)
- ✅ `node_modules` folder exists
- ✅ `.env.local` file exists with all keys
- ✅ No error messages during `npm install`
- ✅ `npm run build` completes successfully

---

**Still having issues?** Check the [QUICKSTART.md](./QUICKSTART.md) guide or open an issue on GitHub.
