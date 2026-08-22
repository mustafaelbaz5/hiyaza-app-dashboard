# CLAUDE.md — HiyazaFinder Dashboard
## Admin Dashboard for City Data Management

> **اقرأ الملف ده بالكامل قبل أي سطر كود.**
> ده المرجع الوحيد للـ Dashboard project.
> أي قرار مش موجود هنا → اسأل الأول.

---

## 1. Project Overview

**الهدف:** Dashboard بسيط لإدارة بيانات المدن الزراعية.
**المستخدم:** Admin واحد فقط (أنت).
**الوظيفة الأساسية:** رفع Excel → Supabase → الـ Flutter app يحمّله.

```
Admin يرفع Excel
      ↓
Dashboard يقرأ الشيتات
      ↓
Preview للبيانات
      ↓
Confirm → Supabase DB
      ↓
Publish → يظهر في الـ Flutter app
```

---

## 2. Tech Stack

```
Framework:    React 18 + TypeScript (strict mode)
Build Tool:   Vite
Styling:      TailwindCSS v3
Data:         Supabase JS Client v2 (service_role key)
Excel:        xlsx (SheetJS)
Routing:      React Router v6
State:        React Query v5 (TanStack Query)
Icons:        Lucide React
Hosting:      Vercel
```

**لا يوجد:**
- ❌ لا Redux / Zustand — React Query كافي
- ❌ لا UI component library — Tailwind بس
- ❌ لا Backend — كل حاجة client-side
- ❌ لا Auth معقدة — env variable للـ service role key

---

## 3. Project Structure

```
hiyaza-dashboard/
├── public/
│   └── favicon.ico
├── src/
│   ├── config/
│   │   └── supabase.ts          ← Supabase client (service role)
│   ├── types/
│   │   ├── city.ts              ← City, Basin, Parcel types
│   │   └── excel.ts             ← Excel parsing types
│   ├── services/
│   │   ├── city.service.ts      ← CRUD operations على Supabase
│   │   └── excel.service.ts     ← Excel parsing logic
│   ├── hooks/
│   │   ├── useCities.ts         ← React Query hooks
│   │   ├── useCity.ts
│   │   └── useUpload.ts         ← Upload state machine
│   ├── components/
│   │   ├── ui/                  ← Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Alert.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx    ← Sidebar + main content
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   └── features/
│   │       ├── cities/
│   │       │   ├── CityCard.tsx
│   │       │   ├── CityList.tsx
│   │       │   └── CityStatusBadge.tsx
│   │       └── upload/
│   │           ├── DropZone.tsx
│   │           ├── ExcelPreview.tsx
│   │           ├── BasinPreview.tsx
│   │           └── UploadProgress.tsx
│   ├── pages/
│   │   ├── CitiesPage.tsx       ← قائمة المدن
│   │   ├── AddCityPage.tsx      ← إضافة مدينة جديدة
│   │   └── CityDetailPage.tsx   ← تفاصيل مدينة
│   ├── utils/
│   │   ├── excel-columns.ts     ← Column mapping constants
│   │   └── formatters.ts        ← Number, date formatters
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.local                   ← Supabase keys (gitignored)
├── .env.example                 ← Template للـ keys
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 4. Types

### `src/types/city.ts`

```typescript
export type AssociationType = 'agricultural_credit' | 'agricultural_reform';

export interface City {
  id: string;
  name: string;
  association_type: AssociationType;
  association_subtype: string | null;
  directorate: string | null;
  administration: string | null;
  data_version: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CitySummary extends City {
  basin_count: number;
  parcel_count: number;
}

export interface Basin {
  id: string;
  city_id: string;
  basin_name: string;
  basin_code: string | null;
  total_feddan: number;
  total_qirat: number;
  total_sahm: number;
  total_sqm: number;
  parcel_count: number;
}

export interface Parcel {
  city_id: string;
  basin_id: string | null;
  directorate: string | null;
  administration: string | null;
  association_name: string | null;
  association_code: string | null;
  association_type: AssociationType | null;
  basin_name: string | null;
  basin_code: string | null;
  holding_id_number: string | null;
  unified_holding_id: string | null;
  registry_page: string | null;
  parcel_count_in_holding: number | null;
  national_id: string | null;
  holder_name: string | null;
  land_number: string | null;
  area_feddan: number;
  area_qirat: number;
  area_sahm: number;
  area_sqm: number;
  border_north: string | null;
  border_south: string | null;
  border_east: string | null;
  border_west: string | null;
}
```

### `src/types/excel.ts`

```typescript
export interface ExcelParseResult {
  cityMeta: CityMeta;
  basins: BasinRow[];
  parcels: ParcelRow[];
  errors: string[];
}

export interface CityMeta {
  name: string;
  association_type: 'agricultural_credit' | 'agricultural_reform';
  directorate: string;
  administration: string;
  association_code: string;
}

export interface BasinRow {
  basin_name: string;
  basin_code: string;
  total_feddan: number;
  total_qirat: number;
  total_sahm: number;
  total_sqm: number;
  parcel_count: number;
}

export interface ParcelRow {
  // كل أعمدة الـ Excel المدمج
  directorate: string;
  administration: string;
  association_name: string;
  association_code: string;
  association_type: string;
  basin_name: string;
  basin_code: string;
  holding_id_number: string;
  unified_holding_id: string;
  registry_page: string;
  national_id: string;
  holder_name: string;
  parcel_count_in_holding: number;
  land_number: string;
  area_feddan: number;
  area_qirat: number;
  area_sahm: number;
  area_sqm: number;
  border_north: string;
  border_south: string;
  border_east: string;
  border_west: string;
}
```

---

## 5. Excel Column Mapping

### `src/utils/excel-columns.ts`

```typescript
// أسماء الأعمدة في ملف Excel المدمج بالظبط
// شيت: "كل الحيازات"
export const PARCELS_SHEET_NAME = 'كل الحيازات';

export const PARCEL_COLUMNS = {
  directorate:              'المديرية',
  administration:           'الإدارة',
  association_name:         'الجمعية',
  association_type:         'نوع الجمعية',
  association_code:         'كود الجمعية',
  basin_name:               'اسم الحوض',
  basin_code:               'كود الحوض',
  holding_id_number:        'رقم الحيازة',
  unified_holding_id:       'الرقم الموحد للحيازة',
  registry_page:            'رقم الصفحة بالسجل',
  national_id:              'الرقم القومي',
  holder_name:              'اسم الحائز',
  parcel_count_in_holding:  'عدد القطع بالحيازة',
  land_number:              'رقم الأرض',
  area_feddan:              'فدان',
  area_qirat:               'قيراط',
  area_sahm:                'سهم',
  area_sqm:                 'مساحة القطعة - م²',
  border_north:             'حد بحري',
  border_south:             'حد قبلي',
  border_east:              'حد شرقي',
  border_west:              'حد غربي',
} as const;

// شيت: "ملخص الأحواض"
export const BASINS_SHEET_NAME = 'ملخص الأحواض';

export const BASIN_COLUMNS = {
  basin_name:    'اسم الحوض',
  basin_code:    'كود الحوض',
  parcel_count:  'عدد القطع',
  total_sqm:     'إجمالي المساحة - م²',
} as const;

// كيف نعرف نوع الجمعية من النص
export const ASSOCIATION_TYPE_MAP: Record<string, 'agricultural_credit' | 'agricultural_reform'> = {
  'الائتمان الزراعي': 'agricultural_credit',
  'ائتمان': 'agricultural_credit',
  'الإصلاح الزراعي': 'agricultural_reform',
  'إصلاح': 'agricultural_reform',
  'اصلاح': 'agricultural_reform',
};
```

---

## 6. Services

### `src/services/excel.service.ts`

```typescript
// المسؤولية: قراءة وتحليل ملف Excel
// Input: File object
// Output: ExcelParseResult

export async function parseExcelFile(file: File): Promise<ExcelParseResult>

// خطوات الـ parsing:
// 1. قرأ الـ file كـ ArrayBuffer
// 2. xlsx.read() لفتح الـ workbook
// 3. تأكد إن شيت "كل الحيازات" و"ملخص الأحواض" موجودين
// 4. اقرأ شيت "ملخص الأحواض" → basins[]
// 5. اقرأ شيت "كل الحيازات" → parcels[]
//    - تجاهل صفوف الـ separator (الداكنة اللي فيها اسم الحوض بس)
//    - كل صف بيانات حقيقي → ParcelRow
// 6. استخرج city meta من أول صف في parcels
// 7. Return ExcelParseResult
```

### `src/services/city.service.ts`

```typescript
// المسؤولية: كل العمليات على Supabase

// جيب كل المدن مع عدد القطع والأحواض
export async function getCities(): Promise<CitySummary[]>

// جيب تفاصيل مدينة واحدة
export async function getCity(id: string): Promise<City>

// جيب أحواض مدينة
export async function getCityBasins(cityId: string): Promise<Basin[]>

// جيب إحصائيات مدينة
export async function getCityStats(cityId: string): Promise<CityStats>

// ارفع مدينة كاملة (يستخدم insert_city_with_data function)
export async function uploadCity(
  meta: CityMeta,
  basins: BasinRow[],
  parcels: ParcelRow[]
): Promise<string> // returns city_id

// انشر مدينة
export async function publishCity(cityId: string): Promise<void>

// ألغي نشر مدينة
export async function unpublishCity(cityId: string): Promise<void>

// احذف مدينة
export async function deleteCity(cityId: string): Promise<void>
```

---

## 7. Pages & UI Flow

### Page 1: Cities List `/`

```
┌─────────────────────────────────────────────┐
│  🌾 HiyazaFinder Dashboard                  │
├─────────────────────────────────────────────┤
│                                             │
│  المدن الزراعية              [+ إضافة مدينة]│
│  ─────────────────────────────────────────  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ شنشا                    ● منشورة   │   │
│  │ الائتمان الزراعي | اجا | الدقهليه   │   │
│  │ 13 حوض | 1,350 قطعة               │   │
│  │ [تفاصيل]  [إلغاء النشر]  [حذف]    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ شنيسه                   ○ مسودة    │   │
│  │ الائتمان الزراعي | اجا | الدقهليه   │   │
│  │ 8 أحواض | 1,097 قطعة              │   │
│  │ [تفاصيل]  [نشر]  [حذف]            │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Page 2: Add City `/cities/new`

```
┌─────────────────────────────────────────────┐
│  ← إضافة مدينة جديدة                        │
├─────────────────────────────────────────────┤
│                                             │
│  Step 1: رفع الملف                          │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │   📂 اسحب ملف Excel هنا            │   │
│  │      أو اضغط للاختيار              │   │
│  │                                     │   │
│  │   يجب أن يحتوي على:                │   │
│  │   ✓ شيت "كل الحيازات"             │   │
│  │   ✓ شيت "ملخص الأحواض"            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Step 2: مراجعة البيانات (بعد الرفع)        │
│  ┌─────────────────────────────────────┐   │
│  │ المدينة:  شنشا                      │   │
│  │ النوع:    ائتمان زراعي             │   │
│  │ الإدارة:  اجا                      │   │
│  │ المديرية: الدقهليه                  │   │
│  │                                     │   │
│  │ الأحواض: 13 حوض                    │   │
│  │ القطع:   1,350 قطعة                │   │
│  │                                     │   │
│  │ [عرض الأحواض ▼]                    │   │
│  │ [عرض عينة من القطع ▼]              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [إلغاء]              [رفع إلى قاعدة البيانات]│
└─────────────────────────────────────────────┘
```

### Page 3: City Detail `/cities/:id`

```
┌─────────────────────────────────────────────┐
│  ← شنشا                        ● منشورة    │
├─────────────────────────────────────────────┤
│                                             │
│  الائتمان الزراعي | اجا | الدقهليه          │
│  1,350 قطعة | 13 حوض                       │
│                                             │
│  الأحواض:                                   │
│  ┌──────────────┬──────────┬──────────┐    │
│  │ اسم الحوض   │ الكود    │ القطع    │    │
│  ├──────────────┼──────────┼──────────┤    │
│  │ الباشا       │ 001      │ 69       │    │
│  │ البحيره      │ 002      │ 131      │    │
│  │ ...          │ ...      │ ...      │    │
│  └──────────────┴──────────┴──────────┘    │
│                                             │
│  [إلغاء النشر]  [حذف المدينة]              │
└─────────────────────────────────────────────┘
```

---

## 8. Upload State Machine

```typescript
// حالات الـ upload — واحدة في وقت
type UploadState =
  | { status: 'idle' }
  | { status: 'parsing'; fileName: string }
  | { status: 'preview'; result: ExcelParseResult }
  | { status: 'uploading'; progress: number; current: string }
  | { status: 'success'; cityId: string; cityName: string }
  | { status: 'error'; message: string };

// الانتقالات:
// idle → parsing (لما اليوزر يختار ملف)
// parsing → preview (بعد نجاح الـ parse)
// parsing → error (لو الملف غلط)
// preview → uploading (لما اليوزر يضغط رفع)
// uploading → success
// uploading → error
// error → idle (retry)
// success → idle (add another)
```

---

## 9. Upload Progress

الـ upload بيمشي على مراحل وبيبيّن progress للـ user:

```typescript
// المراحل:
// 1. "جاري قراءة ملف Excel..."          0%
// 2. "جاري التحقق من البيانات..."       10%
// 3. "جاري إنشاء المدينة..."            20%
// 4. "جاري رفع الأحواض..."             30%
// 5. "جاري رفع القطع... (x / total)"  30-95%
// 6. "تم الرفع بنجاح ✓"               100%
```

**ملاحظة مهمة:** لو عدد القطع كبير (+1000) — الرفع بيتم على batches:

```typescript
const BATCH_SIZE = 100; // 100 قطعة في كل batch

// insert_city_with_data() بتتعمل مرة واحدة للـ city + basins
// بعدين parcels بتتضاف في batches
```

---

## 10. Error Handling

```typescript
// أنواع الأخطاء اللي ممكن تحصل:

// Excel Errors:
// - "الملف مش Excel"
// - "مفيش شيت 'كل الحيازات'"
// - "مفيش شيت 'ملخص الأحواض'"
// - "الملف فاضي"

// Upload Errors:
// - "فشل الاتصال بقاعدة البيانات"
// - "المدينة دي موجودة بالفعل" (نفس الاسم)
// - "فشل رفع الـ batch رقم X"

// كل خطأ بيبيّن:
// 1. رسالة واضحة بالعربي
// 2. زرار "حاول تاني"
// 3. لو batch فشل → تقدر تكمل من اللي فات
```

---

## 11. Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# .env.example (في الـ repo)
VITE_SUPABASE_URL=
VITE_SUPABASE_SERVICE_ROLE_KEY=
```

**⚠️ تحذير مهم:**
- `SERVICE_ROLE_KEY` → full DB access
- الـ Dashboard ده مش public — أنت بس اللي بتستخدمه
- الـ Vercel deployment بيحط الـ env vars في الـ settings
- `.env.local` دايماً في `.gitignore`

---

## 12. SOLID & Clean Code Rules

### Single Responsibility
```
config/supabase.ts    → Supabase client فقط
services/excel.ts     → Excel parsing فقط
services/city.ts      → DB operations فقط
hooks/useCities.ts    → Data fetching فقط
components/ui/        → Presentational فقط
pages/                → Composition فقط
```

### Open/Closed
```typescript
// Column mapping في constants — مش hardcoded في الـ parser
// لو الأعمدة اتغيرت → بنعدّل excel-columns.ts بس
```

### Interface Segregation
```typescript
// مش بنعمل God object
// كل service بيعمل حاجة واحدة
// كل hook بيجيب data واحدة
```

### Dependency Inversion
```typescript
// الـ hooks بتعتمد على services (abstractions)
// الـ pages بتعتمد على hooks
// مش page بتكلم Supabase مباشرة
```

### Clean Code Rules
```
✅ كل component في ملف منفصل
✅ كل ملف أقل من 150 سطر
✅ Function واحدة = مسؤولية واحدة
✅ أسماء واضحة بالإنجليزي
✅ لا any في TypeScript — strict mode
✅ لا console.log في الـ production code
✅ Error boundaries في كل page
✅ Loading states في كل async operation
✅ TypeScript interfaces لكل data shape
✅ Constants لكل magic string/number
```

---

## 13. Implementation Phases

```
Phase 1: Project Setup
├── Vite + React + TypeScript
├── TailwindCSS
├── React Router
├── React Query
├── Supabase client
└── Folder structure

Phase 2: Types & Config
├── types/city.ts
├── types/excel.ts
├── utils/excel-columns.ts
└── config/supabase.ts

Phase 3: Services
├── excel.service.ts (parsing logic)
└── city.service.ts (Supabase operations)

Phase 4: UI Components
├── ui/ (Button, Badge, Card, Table, Modal, Spinner, Alert)
└── layout/ (AppLayout, Sidebar, TopBar)

Phase 5: Hooks
├── useCities.ts
├── useCity.ts
└── useUpload.ts

Phase 6: Feature Components
├── cities/ (CityCard, CityList, CityStatusBadge)
└── upload/ (DropZone, ExcelPreview, BasinPreview, UploadProgress)

Phase 7: Pages
├── CitiesPage.tsx
├── AddCityPage.tsx
└── CityDetailPage.tsx

Phase 8: App Assembly
├── App.tsx (routing)
├── main.tsx (providers)
└── Error boundaries

Phase 9: Testing & Deploy
├── Test مع ملف شنشا الحقيقي
├── Verify DB data
└── Deploy على Vercel
```

---

## 14. Definition of Done

```
كل phase لازم تكتمل قبل البدء في التالية.

Phase 1 ✓:
□ npm run dev بيشتغل
□ TailwindCSS بيشتغل
□ Supabase client بيتوصل

Phase 3 ✓:
□ parseExcelFile() بتقرأ شنشا_مدمج.xlsx صح
□ عدد القطع = 1,350
□ عدد الأحواض = 13

Phase 7 ✓:
□ CitiesPage بتعرض المدن من Supabase
□ AddCityPage بتقرأ Excel وبتعمل preview
□ Upload بيرفع البيانات كاملة
□ CityDetailPage بتعرض الأحواض

Phase 9 ✓:
□ شنشا اترفعت على Supabase
□ البيانات صح في الـ DB
□ Deploy على Vercel شغال
```

---

## 15. قواعد لا تُكسر

| القاعدة | التفصيل |
|---|---|
| ❌ لا any | TypeScript strict mode دايماً |
| ❌ لا direct Supabase في components | عبر services + hooks بس |
| ❌ لا business logic في UI | services بس |
| ❌ لا hardcoded strings | constants في excel-columns.ts |
| ❌ لا commit للـ .env.local | دايماً في .gitignore |
| ✅ Phase by phase | لا قفز |
| ✅ Preview قبل Upload | اليوزر لازم يشوف البيانات قبل الرفع |
| ✅ Batch upload | +100 قطعة تتقسم على batches |
| ✅ Error handling | كل async operation فيها try/catch |
| ✅ Loading states | كل operation فيها loading indicator |
| ✅ Arabic UI | كل النصوص بالعربي، RTL |

---

## 16. الـ Supabase Connection

```typescript
// src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
```

---

## 17. Agent Working Rules

- استخدم أي skill متاح (design, dataviz, artifact-design, clean-code-guard, ...) وقت التنفيذ من غير ما تستأذن الأول — لو الـ skill مناسب للمهمة.
- استخدم أي subagent أو tool متاح (Supabase MCP, Explore agent, ...) عادي وقت الحاجة.

---

*آخر تحديث: أغسطس 2026*
*الإصدار: 1.0*
