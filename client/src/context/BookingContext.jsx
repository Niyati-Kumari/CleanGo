import { createContext, useContext, useMemo, useState } from 'react';

const BookingContext = createContext(null);

const defaultState = {
  city: 'Delhi',
  categoryId: null,
  cart: {},
  selectedCleaner: null,
  pickupSlot: null,
  deliveryAddress: {
    line1: '',
    city: 'Delhi',
    pincode: '',
  },
  paymentMethod: 'cod',
};

export function BookingProvider({ children }) {
  const [state, setState] = useState(defaultState);

  const value = useMemo(
    () => ({
      ...state,
      setCity(city) {
        setState((s) => ({ ...s, city }));
      },
      setCategory(categoryId) {
        setState((s) => ({ ...s, categoryId }));
      },
      setCartItem(itemId, quantity) {
        setState((s) => {
          const cart = { ...s.cart };
          if (quantity <= 0) delete cart[itemId];
          else cart[itemId] = quantity;
          return { ...s, cart };
        });
      },
      clearCart() {
        setState((s) => ({ ...s, cart: {} }));
      },
      selectCleaner(cleaner) {
        setState((s) => ({ ...s, selectedCleaner: cleaner }));
      },
      setPickupSlot(pickupSlot) {
        setState((s) => ({ ...s, pickupSlot }));
      },
      setDeliveryAddress(deliveryAddress) {
        setState((s) => ({ ...s, deliveryAddress: { ...s.deliveryAddress, ...deliveryAddress } }));
      },
      setPaymentMethod(paymentMethod) {
        setState((s) => ({ ...s, paymentMethod }));
      },
      reset() {
        setState(defaultState);
      },
      cartItems: Object.entries(state.cart).map(([itemId, quantity]) => ({ itemId, quantity })),
      cartCount: Object.values(state.cart).reduce((sum, q) => sum + q, 0),
    }),
    [state]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
