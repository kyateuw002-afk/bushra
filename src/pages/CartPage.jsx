import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl, formatPrice } from '../utils/api';
import { ShoppingCart, Image, Trash2, MessageCircle } from 'lucide-react';
import './CartPage.css';

export default function CartPage() {
  const { items, total, dispatch } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="cart-empty">
      <div className="cart-empty__icon">
        <ShoppingCart size={64} strokeWidth={1.5} />
      </div>
      <h2 className="display-md">Votre panier est vide</h2>
      <p style={{ color: 'var(--color-smoke)', marginTop: '0.75rem' }}>
        Découvrez nos encens, encensoirs et senteurs d'exception.
      </p>
      <Link to="/produits" className="btn btn--primary" style={{ marginTop: '2rem' }}>
        Explorer la boutique →
      </Link>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="display-md cart-page__title">Mon Panier</h1>
        <p style={{ color: 'var(--color-smoke)', marginBottom: 'var(--space-xl)' }}>
          {items.length} article{items.length > 1 ? 's' : ''}
        </p>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map((item, i) => (
              <div key={i} className="cart-item">
                <div className="cart-item__image">
                  {item.image ? (
                    <img src={getImageUrl(item.image)} alt={item.name} />
                  ) : (
                    <div className="cart-item__image-placeholder">
                      <Image size={24} strokeWidth={1.5} color="var(--color-amber)" />
                    </div>
                  )}
                </div>

                <div className="cart-item__info">
                  <h3 className="cart-item__name">{item.name}</h3>
                  {item.variantName && (
                    <span className="cart-item__variant label">{item.variantName}</span>
                  )}
                  <span className="cart-item__price">{formatPrice(item.price)}</span>
                </div>

                <div className="cart-item__qty">
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', productId: item.productId, variantId: item.variantId, quantity: item.quantity - 1 })}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', productId: item.productId, variantId: item.variantId, quantity: item.quantity + 1 })}>
                    +
                  </button>
                </div>

                <div className="cart-item__subtotal">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <button
                  className="cart-item__remove"
                  onClick={() => dispatch({ type: 'REMOVE_ITEM', productId: item.productId, variantId: item.variantId })}
                  aria-label="Supprimer"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            ))}

            <button
              className="cart-clear"
              onClick={() => dispatch({ type: 'CLEAR' })}
            >
              Vider le panier
            </button>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2 className="heading cart-summary__title">Récapitulatif</h2>

            <div className="cart-summary__lines">
              <div className="cart-summary__line">
                <span>Sous-total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="cart-summary__line">
                <span>Livraison</span>
                <span style={{ color: total >= 25000 ? '#4caf50' : 'inherit' }}>
                  {total >= 25000 ? 'Gratuite' : 'À calculer'}
                </span>
              </div>
              {total < 25000 && (
                <p className="cart-summary__shipping-note">
                  Ajoutez {formatPrice(25000 - total)} pour la livraison gratuite.
                </p>
              )}
              <div className="cart-summary__divider" />
              <div className="cart-summary__line cart-summary__line--total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              className="btn btn--primary btn--full"
              onClick={() => navigate('/commande')}
              style={{ marginTop: 'var(--space-md)' }}
            >
              Passer la commande →
            </button>

            <a
              href={`https://wa.me/221771234567?text=Bonjour%2C%20je%20souhaite%20commander%20via%20WhatsApp.%20Total%20: ${formatPrice(total)}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn--outline btn--full"
              style={{ marginTop: '0.75rem', borderColor: '#25d366', color: '#25d366' }}
            >
              <MessageCircle size={18} />
              Commander via WhatsApp
            </a>

            <Link
              to="/produits"
              className="cart-summary__continue"
            >
              ← Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
