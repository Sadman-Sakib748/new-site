import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  CartItem,
  WishlistItem,
  Coupon,
} from '@/types'

interface CartStore {
  items: CartItem[]
  wishlist: WishlistItem[]
  appliedCoupon?: Coupon

  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (
    productId: string,
    quantity: number
  ) => void

  clearCart: () => void

  addToWishlist: (
    productId: string
  ) => void

  removeFromWishlist: (
    productId: string
  ) => void

  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      wishlist: [],
      appliedCoupon: undefined,

      addToCart: (item) =>
        set((state) => {
          const existingItem =
            state.items.find(
              (i) =>
                i.productId === item.productId
            )

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? {
                      ...i,
                      quantity:
                        i.quantity +
                        item.quantity,
                    }
                  : i
              ),
            }
          }

          return {
            items: [
              ...state.items,
              item,
            ],
          }
        }),

      removeFromCart: (
        productId
      ) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              i.productId !== productId
          ),
        })),

      updateQuantity: (
        productId,
        quantity
      ) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) =>
                    i.productId !==
                    productId
                )
              : state.items.map((i) =>
                  i.productId ===
                  productId
                    ? {
                        ...i,
                        quantity,
                      }
                    : i
                ),
        })),

      clearCart: () =>
        set({
          items: [],
          appliedCoupon:
            undefined,
        }),

      addToWishlist: (
        productId
      ) =>
        set((state) => {
          const exists =
            state.wishlist.some(
              (w) =>
                w.productId ===
                productId
            )

          if (exists) {
            return state
          }

          return {
            wishlist: [
              ...state.wishlist,
              {
                productId,
                addedAt:
                  new Date().toISOString(),
              },
            ],
          }
        }),

      removeFromWishlist: (
        productId
      ) =>
        set((state) => ({
          wishlist:
            state.wishlist.filter(
              (w) =>
                w.productId !==
                productId
            ),
        })),

      applyCoupon: (
        coupon
      ) =>
        set({
          appliedCoupon:
            coupon,
        }),

      removeCoupon: () =>
        set({
          appliedCoupon:
            undefined,
        }),
    }),
    {
      name: 'cart-storage',
    }
  )
)