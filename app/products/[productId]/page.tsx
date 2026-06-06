'use client'

import { useParams } from 'next/navigation'
import { useProductStore } from '@/lib/stores/productStore'
import { ShoppingCart, Star } from 'lucide-react'
import Header from '@/components/Header'

import toast from 'react-hot-toast'
import { useCartStore } from '@/lib/stores/cartStore'
import Image from 'next/image'

export default function ProductDetailsPage() {
    const { productId } = useParams()
    const { addToCart } = useCartStore()

    const { products } = useProductStore()

    const handleAddToCart = (product: any) => {
        addToCart({
            productId: product.id,
            quantity: 1,
        })

        toast.success(`${product.name} added to cart 🛒`)
    }

    const product = products.find(
        (p) => p.id === productId
    )

    if (!product) {
        return (
            <div className="p-10 text-center">
                Product not found
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">

            <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">

                {/* Image */}
                <div>
                    <Image
                        src={product.images[0]}
                        width={500}
                        height={500}
                        className="w-full h-auto rounded-xl"
                        alt={product.name}
                    />
                </div>

                {/* Info */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {product.name}
                    </h1>

                    <p className="text-muted-foreground mb-4">
                        {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-400'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Price */}
                    <div className="text-2xl font-bold mb-4">
                        ${product.discountPrice || product.price}
                    </div>

                    {/* Stock */}
                    <p className="mb-6">
                        {product.stock > 0 ? (
                            <span className="text-green-600">
                                In Stock
                            </span>
                        ) : (
                            <span className="text-red-500">
                                Out of Stock
                            </span>
                        )}
                    </p>

                    <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-2.5 text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add To Cart
                    </button>
                </div>
            </div>
        </div>
    )
}