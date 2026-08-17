import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Package, ShoppingCart, Info, MessageCircle, LogOut } from 'lucide-react';
import './SimplePages.css';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <div className="simple-page">
      <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
        <span className="label" style={{ color: 'var(--color-amber)' }}>Mon espace</span>
        <h1 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: 'var(--space-xl)' }}>
          Bonjour, {user?.name || 'Client'}
        </h1>

        <div style={{ display: 'grid', gap: '1rem', maxWidth: 600, margin: '0 auto' }}>
          <Link to="/commande/suivi" className="account-card">
            <div className="account-card__icon"><Package size={28} strokeWidth={1.5} /></div>
            <div>
              <h3 className="heading">Mes commandes</h3>
              <p style={{ color: 'var(--color-smoke)', fontSize: '0.85rem' }}>Suivre mes commandes en cours</p>
            </div>
          </Link>

          <Link to="/panier" className="account-card">
            <div className="account-card__icon"><ShoppingCart size={28} strokeWidth={1.5} /></div>
            <div>
              <h3 className="heading">Mon panier</h3>
              <p style={{ color: 'var(--color-smoke)', fontSize: '0.85rem' }}>
                {count > 0 ? `${count} article${count > 1 ? 's' : ''} dans le panier` : 'Votre panier est vide'}
              </p>
            </div>
          </Link>

          <Link to="/a-propos" className="account-card">
            <div className="account-card__icon"><Info size={28} strokeWidth={1.5} /></div>
            <div>
              <h3 className="heading">À propos</h3>
              <p style={{ color: 'var(--color-smoke)', fontSize: '0.85rem' }}>Découvrir notre histoire</p>
            </div>
          </Link>

          <Link to="/contact" className="account-card">
            <div className="account-card__icon"><MessageCircle size={28} strokeWidth={1.5} /></div>
            <div>
              <h3 className="heading">Contact</h3>
              <p style={{ color: 'var(--color-smoke)', fontSize: '0.85rem' }}>Nous contacter</p>
            </div>
          </Link>

          {user && (
            <button onClick={logout} className="btn btn--outline" style={{ marginTop: '1rem' }}>
              <LogOut size={18} strokeWidth={1.5} style={{ marginRight: '0.5rem' }} />
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </div>
  );
}