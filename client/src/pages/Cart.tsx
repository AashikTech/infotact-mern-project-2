import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
  price?: number;
  name?: string;
}

export default function Cart() {
  const { user, logout } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      console.log('Cart data:', res.data);
      setCart(res.data.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await api.put('/cart/update', { productId, quantity });
      fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      fetchCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const clearCart = async () => {
    if (confirm('Clear your cart?')) {
      try {
        await api.delete('/cart/clear');
        fetchCart();
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    }
  };

  const getItemPrice = (item: any) => {
    return item.price || item.productId?.price || 0;
  };

  const getItemName = (item: any) => {
    return item.name || item.productId?.name || 'Unknown Product';
  };

  const getItemImage = (item: any) => {
    return item.productId?.imageUrl || `https://placehold.co/100x100/f1f5f9/64748b?text=Product`;
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* NAVBAR */}
      <nav className="navbar" style={{ width: '100%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
              <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>ShopHub</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a href="/shop" style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Continue Shopping</a>
            <button onClick={() => { if (confirm('Logout?')) logout(); }} className="btn btn-secondary btn-sm">Logout</button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Shopping Cart</h1>
          <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--text-secondary)' }}>{cart?.items?.length || 0} items in your cart</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading cart...</p>
          </div>
        ) : !cart || !cart.items || cart.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <p style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-secondary)' }}>Your cart is empty</p>
            <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--text-muted)', marginBottom: '24px' }}>Add some products to get started</p>
            <a href="/shop" className="btn btn-primary">Browse Products</a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Cart Items */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Cart Items</h2>
                <button onClick={clearCart} className="btn btn-danger btn-sm">Clear Cart</button>
              </div>
              
              <div className="card" style={{ overflow: 'hidden' }}>
                {cart.items.map((item: CartItem, index: number) => {
                  const price = getItemPrice(item);
                  const name = getItemName(item);
                  const image = getItemImage(item);
                  const subtotal = price * item.quantity;
                  
                  return (
                    <div key={item._id || index} style={{ display: 'flex', gap: '16px', padding: '16px', borderBottom: index < cart.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <img 
                        src={image}
                        alt={name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', background: '#f1f5f9' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{name}</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '4px 0' }}>${price.toFixed(2)}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                          <button 
                            onClick={() => updateQuantity(item.productId?._id || item.productId as any, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: item.quantity <= 1 ? 0.5 : 1 }}
                          >-</button>
                          <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '500' }}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId?._id || item.productId as any, item.quantity + 1)}
                            style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >+</button>
                          <button 
                            onClick={() => removeItem(item.productId?._id || item.productId as any)}
                            style={{ marginLeft: 'auto', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                          >Remove</button>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                          ${subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="card" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>Order Summary</h2>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal ({cart.items.length} items)</span>
                  <span style={{ fontWeight: '500' }}>${cart.total?.toFixed(2) || cart.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span style={{ fontWeight: '500', color: '#10b981' }}>Free</span>
                </div>
                
                <div style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>Total</span>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>${cart.total?.toFixed(2) || cart.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
                  Proceed to Checkout
                </button>
                
                <a href="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
