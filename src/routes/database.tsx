import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useSupabaseQuery, useSupabaseInsert, useSupabaseDelete } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/database')({
  component: DatabasePage,
})

interface Product {
  id: number
  name: string
  price: number
  created_at: string
}

function DatabasePage() {
  const [newProductName, setNewProductName] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')

  // Fetch semua produk
  const { data: products, isLoading } = useSupabaseQuery<Product>(
    'products',
    ['products']
  )

  // Untuk insert produk baru
  const { mutate: addProduct, isPending: isAdding } = useSupabaseInsert('products')

  // Untuk delete produk
  const { mutate: deleteProduct } = useSupabaseDelete('products')

  const handleAddProduct = () => {
    if (!newProductName || !newProductPrice) return

    addProduct(
      {
        name: newProductName,
        price: parseFloat(newProductPrice),
      },
      {
        onSuccess: () => {
          setNewProductName('')
          setNewProductPrice('')
        },
      }
    )
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Database Management</h1>

      {/* Form tambah produk */}
      <Card>
        <CardHeader>
          <CardTitle>Tambah Produk Baru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Nama produk"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <Input
            placeholder="Harga"
            type="number"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
          />
          <Button onClick={handleAddProduct} disabled={isAdding}>
            {isAdding ? 'Menambahkan...' : 'Tambah Produk'}
          </Button>
        </CardContent>
      </Card>

      {/* Daftar produk */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk ({products?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {products?.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center p-3 bg-gray-100 rounded"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => deleteProduct(product.id)}
                >
                  Hapus
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
