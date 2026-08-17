import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import {
  OrderConfirmationPage,
  OrderTrackingPage,
  AboutPage,
  ContactPage,
  CollectionsPage,
} from './pages/SimplePages';
import AccountPage from './pages/AccountPage';
import { AdminLayout, AdminLoginPage } from './pages/AdminPage';
import { Flame } from 'lucide-react';

/* ── Warm up key images in browser memory ──────────────────── */
const ESSENTIAL_IMAGES = [
  '/logo.png',
  '/bacground-image.png',
  '/gowe-thiouray.png',
  '/encensoir1.png',
  '/encensoir2.png',
  '/encensoir3.png',
  '/encensoir4.png',
  '/encensoir5.png',
  '/encensoir6.png',
  '/paniers-vetiver.png',
  '/sprays.png',
];

function preloadAsset(src) {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
}

/* ── Public layout (with navbar + footer) ───────────────────── */
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  useEffect(() => {
    // Pre-warm assets during idle time
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        ESSENTIAL_IMAGES.forEach(preloadAsset);
      });
    } else {
      setTimeout(() => {
        ESSENTIAL_IMAGES.forEach(preloadAsset);
      }, 500);
    }
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <SmoothScroll>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Admin routes — no public navbar */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/*"
                element={<AdminLayout />}
              />

              {/* Public routes */}
              <Route
                path="/*"
                element={
                  <PublicLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/produits" element={<ProductsPage />} />
                      <Route path="/produits/:id" element={<ProductDetailPage />} />
                      <Route path="/collections" element={<CollectionsPage />} />
                      <Route path="/panier" element={<CartPage />} />
                      <Route path="/commande" element={<CheckoutPage />} />
                      <Route path="/commande/confirmation" element={<OrderConfirmationPage />} />
                      <Route path="/commande/suivi" element={<OrderTrackingPage />} />
                      <Route path="/a-propos" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/compte" element={<AccountPage />} />
                      {/* Fallback */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </PublicLayout>
                }
              />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </SmoothScroll>
    </BrowserRouter>
  );
}


function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__icon"><Flame size={64} strokeWidth={1.5} color="var(--color-amber)" /></div>
      <h1 className="not-found__title">404</h1>
      <p className="not-found__desc">Cette page n'existe pas ou a été déplacée.</p>
      <a href="/" className="btn btn--primary">Retour à l'accueil</a>
    </div>
  );
}
