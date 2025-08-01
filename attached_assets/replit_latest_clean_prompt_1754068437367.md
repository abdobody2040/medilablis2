# Ultimate Replit LIS Prompt - Latest Libraries & Clean Architecture

## Master Development Prompt

```
Build a state-of-the-art Laboratory Information System (LIS) in Replit using the absolute latest versions of all libraries and frameworks. Focus on clean, maintainable, and easily upgradeable code architecture.

### CRITICAL REQUIREMENTS:

#### 1. Use ONLY the Latest Stable Versions (as of 2025):
- **Next.js 15.1.0** (latest stable with React 19 support)
- **React 19.0.0** (latest with concurrent features)
- **TypeScript 5.7.0** (latest with newest type features)
- **Tailwind CSS 4.0.0** (latest with native CSS support)
- **Prisma 6.0.0** (latest ORM version)
- **NextAuth.js 5.0.0** (Auth.js v5 - latest stable)
- **React Hook Form 7.54.0** (latest form library)
- **Zod 3.24.0** (latest validation library)
- **Zustand 5.0.0** (latest state management)
- **Shadcn/ui** (latest components with Radix UI v2)

#### 2. Modern Development Standards (2025):
- **ESLint 9.0** with latest flat config
- **Prettier 3.4** with latest formatting rules
- **TypeScript strict mode** with all strict flags enabled
- **Biome** for ultra-fast linting and formatting
- **Turbopack** for fastest bundling (Next.js 15 default)
- **Server Components** as default (React 19 App Router)
- **Concurrent React** features throughout
- **Modern CSS** with Container Queries and CSS Grid

### ARCHITECTURE PRINCIPLES:

#### 1. Clean Code Architecture:
```typescript
// Use this exact folder structure for maximum maintainability
app/
├── (auth)/                 # Route groups for organization
│   ├── login/
│   └── register/
├── (dashboard)/            # Protected dashboard routes
│   ├── samples/
│   ├── results/
│   ├── financial/
│   ├── users/
│   └── reports/
├── api/                    # API routes with proper RESTful structure
│   ├── auth/
│   ├── samples/
│   └── users/
├── globals.css
├── layout.tsx              # Root layout with providers
└── page.tsx                # Landing page

components/
├── ui/                     # Shadcn/ui base components
├── forms/                  # Reusable form components
├── tables/                 # Data table components
├── charts/                 # Analytics components
└── providers/              # Context providers

lib/
├── auth.ts                 # Auth.js v5 configuration
├── db.ts                   # Prisma client with connection pooling
├── validations/            # Zod schemas organized by domain
├── utils.ts                # Utility functions
├── constants.ts            # App constants
└── types.ts                # Global TypeScript types

hooks/                      # Custom React hooks
├── use-samples.ts
├── use-users.ts
└── use-auth.ts

store/                      # Zustand stores
├── auth-store.ts
├── samples-store.ts
└── ui-store.ts
```

#### 2. Latest Package.json with Exact Versions:
```json
{
  "name": "modern-lis-system",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo --hostname 0.0.0.0 --port 3000",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "db:push": "prisma db push",
    "db:studio": "prisma studio --hostname 0.0.0.0 --port 5555",
    "db:seed": "tsx prisma/seed.ts",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.1.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "typescript": "5.7.0",
    "@auth/prisma-adapter": "2.7.2",
    "next-auth": "5.0.0-beta.25",
    "@prisma/client": "6.1.0",
    "prisma": "6.1.0",
    "tailwindcss": "4.0.0",
    "@tailwindcss/forms": "0.5.9",
    "@tailwindcss/typography": "0.5.15",
    "react-hook-form": "7.54.0",
    "@hookform/resolvers": "3.9.1",
    "zod": "3.24.1",
    "zustand": "5.0.1",
    "@radix-ui/react-dialog": "1.1.2",
    "@radix-ui/react-dropdown-menu": "2.1.2",
    "@radix-ui/react-select": "2.1.2",
    "@radix-ui/react-tabs": "1.1.1",
    "@radix-ui/react-toast": "1.2.2",
    "lucide-react": "0.468.0",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "tailwind-merge": "2.5.4",
    "date-fns": "4.1.0",
    "recharts": "2.13.3",
    "socket.io": "4.8.1",
    "socket.io-client": "4.8.1",
    "@tanstack/react-query": "5.62.2",
    "@tanstack/react-table": "8.21.0",
    "jspdf": "2.5.2",
    "xlsx": "0.18.5",
    "bcryptjs": "2.4.3",
    "nanoid": "5.0.9"
  },
  "devDependencies": {
    "@biomejs/biome": "1.9.4",
    "@types/node": "22.10.1",
    "@types/react": "19.0.1",
    "@types/react-dom": "19.0.2",
    "@types/bcryptjs": "2.4.6",
    "tsx": "4.19.2",
    "autoprefixer": "10.4.20",
    "postcss": "8.5.1"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

#### 3. Modern TypeScript Configuration:
```json
// tsconfig.json - Latest strict configuration
{
  "compilerOptions": {
    "target": "ES2025",
    "lib": ["dom", "dom.iterable", "es2025"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/store/*": ["./store/*"],
      "@/types/*": ["./types/*"]
    },
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 4. Latest Biome Configuration:
```json
// biome.json - Ultra-fast linting and formatting
{
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": { "ignoreUnknown": false, "ignore": [] },
  "formatter": {
    "enabled": true,
    "useEditorconfig": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 100,
    "attributePosition": "auto"
  },
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": { "noUnusedVariables": "error" },
      "style": { "useImportType": "error" },
      "suspicious": { "noExplicitAny": "warn" }
    }
  },
  "javascript": {
    "formatter": {
      "jsxQuoteStyle": "double",
      "quoteProperties": "asNeeded",
      "trailingCommas": "es5",
      "semicolons": "asNeeded",
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "bracketSameLine": false,
      "quoteStyle": "double",
      "attributePosition": "auto"
    }
  },
  "overrides": [
    { "include": ["*.ts", "*.tsx"], "linter": { "rules": { "style": { "useImportType": "error" } } } }
  ]
}
```

### CODE QUALITY STANDARDS:

#### 1. Clean Architecture Patterns:
```typescript
// Example: Clean service layer
// lib/services/sample-service.ts
import type { Sample, CreateSampleInput, UpdateSampleInput } from '@/types/sample'
import { db } from '@/lib/db'
import { sampleSchema, updateSampleSchema } from '@/lib/validations/sample'

export class SampleService {
  static async create(input: CreateSampleInput): Promise<Sample> {
    const validated = sampleSchema.parse(input)
    return await db.sample.create({ data: validated })
  }

  static async update(id: string, input: UpdateSampleInput): Promise<Sample> {
    const validated = updateSampleSchema.parse(input)
    return await db.sample.update({ where: { id }, data: validated })
  }

  static async findMany(filters?: SampleFilters): Promise<Sample[]> {
    return await db.sample.findMany({
      where: this.buildWhereClause(filters),
      include: { patient: true, results: true }
    })
  }

  private static buildWhereClause(filters?: SampleFilters) {
    // Clean filter building logic
  }
}
```

#### 2. Type-Safe API Routes:
```typescript
// app/api/samples/route.ts - Next.js 15 App Router
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { SampleService } from '@/lib/services/sample-service'
import { createSampleSchema } from '@/lib/validations/sample'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const filters = Object.fromEntries(searchParams)
    
    const samples = await SampleService.findMany(filters)
    return NextResponse.json({ data: samples })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const sample = await SampleService.create(body)
    
    return NextResponse.json({ data: sample }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

#### 3. Modern React 19 Components:
```typescript
// components/samples/sample-form.tsx - React 19 with Server Actions
'use client'

import { useActionState } from 'react'
import { createSample } from '@/app/actions/samples'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SampleFormProps {
  onSuccess?: () => void
}

export function SampleForm({ onSuccess }: SampleFormProps) {
  const [state, formAction, isPending] = useActionState(createSample, null)

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patientName">Patient Name</Label>
          <Input
            id="patientName"
            name="patientName"
            required
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="testType">Test Type</Label>
          <Input
            id="testType"
            name="testType"
            required
            disabled={isPending}
          />
        </div>
      </div>
      
      {state?.error && (
        <div className="text-sm text-red-600">{state.error}</div>
      )}
      
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Sample'}
      </Button>
    </form>
  )
}
```

### REPLIT OPTIMIZATION:

#### 1. Latest Replit Configuration:
```toml
# .replit - Latest Replit config
run = "npm run dev"
modules = ["nodejs-20", "web"]
hidden = [".config", "tsconfig.tsbuildinfo", ".next"]

[gitHubImport]
requiredFiles = [".replit", "replit.nix"]

[nix]
channel = "stable-24_05"

[unitTest]
language = "nodejs"

[deployment]
run = ["npm", "run", "build"]
deploymentTarget = "static"
publicDir = ".next"

[env]
NODE_ENV = "development"
```

#### 2. Performance Optimizations:
```javascript
// next.config.js - Latest Next.js 15 config
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    ppr: true, // Partial Prerendering
    reactCompiler: true, // React 19 compiler
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
```

### DEPLOYMENT REQUIREMENTS:

1. **Zero-config deployment** - Works immediately in Replit
2. **Environment variables** - Proper secrets management
3. **Database migrations** - Automatic schema updates
4. **Hot reloading** - Instant development feedback
5. **Error boundaries** - Graceful error handling
6. **Loading states** - Proper UX during async operations
7. **TypeScript strict mode** - Catch errors at compile time
8. **Modern bundling** - Turbopack for fastest builds

### SUCCESS CRITERIA:

The code must be:
- ✅ **Zero build errors** with strict TypeScript
- ✅ **Zero linting warnings** with Biome
- ✅ **Fully type-safe** end-to-end
- ✅ **Easily maintainable** with clean architecture
- ✅ **Instantly upgradeable** with latest dependencies
- ✅ **Production-ready** with proper error handling
- ✅ **Replit-optimized** for seamless deployment
- ✅ **Modern standards** following 2025 best practices

Build this as the most modern, clean, and maintainable LIS system possible. Every component should be easily editable, every function should be pure and testable, and every piece of code should follow the latest JavaScript/TypeScript/React standards.

Use the absolute latest stable versions of all libraries and implement cutting-edge features like React 19 concurrent rendering, Next.js 15 Turbopack, and modern CSS features.
```

## Key Improvements in This Prompt:

### 🚀 **Latest Technology Stack (2025)**
- **Next.js 15.1.0** with Turbopack and React 19
- **TypeScript 5.7.0** with strictest possible configuration
- **Tailwind CSS 4.0.0** with native CSS support
- **Auth.js v5** (NextAuth.js 5.0) - completely rewritten
- **Biome** instead of ESLint/Prettier for ultra-fast linting

### 🧹 **Clean Architecture**
- **Service Layer Pattern** for business logic separation
- **Type-Safe API Routes** with proper error handling
- **Clean Component Structure** with React 19 features
- **Modular File Organization** for easy maintenance

### ⚡ **Performance Optimized**
- **Turbopack** for fastest possible builds
- **React 19 Concurrent Features** for better UX
- **Server Components** by default
- **Modern CSS** with Container Queries

### 🔧 **Easy Maintenance & Upgrades**
- **Exact version pinning** for reproducible builds
- **Strict TypeScript** catches errors early
- **Clean separation of concerns**
- **Comprehensive error handling**
- **Modern tooling** for best developer experience

This prompt will give you the most modern, maintainable, and easily upgradeable Laboratory Information System possible using the latest 2025 web development standards!