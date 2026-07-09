# Setup Supabase Database

## ✅ Sudah Dikonfigurasi

Berikut file yang sudah saya setup untuk Anda:

### 1. **Environment Variables** (`.env.local`)
```env
VITE_SUPABASE_URL=https://tfzpegrgngcreolmhobt.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### 2. **Supabase Client** (`src/lib/supabase.ts`)
- Menginisialisasi Supabase client
- Bisa digunakan di mana saja

### 3. **Custom Hooks** (`src/lib/hooks.ts`)
```typescript
useSupabaseQuery()   // Fetch data
useSupabaseInsert()  // Tambah data
useSupabaseUpdate()  // Edit data
useSupabaseDelete()  // Hapus data
```

### 4. **Contoh Page** (`src/routes/database.tsx`)
- Halaman dengan CRUD operasi
- Buka: http://localhost:5173/database

---

## 📋 Langkah Selanjutnya: Buat Tabel di Supabase

1. **Buka Dashboard Supabase**: https://app.supabase.com
2. Pilih project Anda (`tfzpegrgngcreolmhobt`)
3. Klik **SQL Editor**
4. Copy & paste query berikut:

```sql
-- Buat tabel products
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Siapa saja bisa baca
CREATE POLICY "Allow public read" ON products
  FOR SELECT USING (TRUE);

-- Policy: Siapa saja bisa insert
CREATE POLICY "Allow public insert" ON products
  FOR INSERT WITH CHECK (TRUE);

-- Policy: Siapa saja bisa delete
CREATE POLICY "Allow public delete" ON products
  FOR DELETE USING (TRUE);
```

5. Klik **Run**

---

## 🚀 Jalankan Aplikasi

```bash
npm install
npm run dev
```

Buka: http://localhost:5173/database

---

## 📝 Cara Pakai di Komponen Lain

### Fetch Data:
```typescript
import { useSupabaseQuery } from '@/lib/hooks'

function MyComponent() {
  const { data: products } = useSupabaseQuery('products', ['products'])
  
  return <div>{products?.map(p => <p key={p.id}>{p.name}</p>)}</div>
}
```

### Insert Data:
```typescript
import { useSupabaseInsert } from '@/lib/hooks'

function AddProduct() {
  const { mutate: addProduct } = useSupabaseInsert('products')
  
  const handleClick = () => {
    addProduct({ name: 'Laptop', price: 5000000 })
  }
  
  return <button onClick={handleClick}>Add</button>
}
```

### Delete Data:
```typescript
import { useSupabaseDelete } from '@/lib/hooks'

function DeleteProduct() {
  const { mutate: deleteProduct } = useSupabaseDelete('products')
  
  const handleClick = () => {
    deleteProduct(1) // Hapus product dengan ID 1
  }
  
  return <button onClick={handleClick}>Delete</button>
}
```

---

## ⚙️ Konfigurasi Lebih Lanjut

### Buat Tabel Lain:
Ganti `products` dengan nama tabel Anda di `useSupabaseQuery('YOUR_TABLE', ['YOUR_TABLE'])`

### Filter Data:
```typescript
const { data } = useSupabaseQuery(
  'products',
  ['products', 'filtered'],
  { filter: { category: 'electronics' } }
)
```

### Select Kolom Tertentu:
```typescript
const { data } = useSupabaseQuery(
  'products',
  ['products'],
  { select: 'id, name' }
)
```

---

## 📚 Dokumentasi Resmi
- Supabase JS Client: https://supabase.com/docs/reference/javascript
- TanStack Query: https://tanstack.com/query/latest
