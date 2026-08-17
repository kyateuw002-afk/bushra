import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api, formatPrice, getImageUrl } from '../utils/api';
import { Banknote, Smartphone, Circle, Flame, AlertCircle } from 'lucide-react';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { items, total, dispatch } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', city: 'Dakar', region: '', notes: '',
    paymentMethod: 'cash_on_delivery',
  });

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const orderData = {
        customerName: `${form.firstName} ${form.lastName}`.trim(),
        customerPhone: form.phone,
        customerAddress: form.address,
        customerCity: form.city,
        customerNote: form.notes,
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const res = await api.createOrder(orderData);
      dispatch({ type: 'CLEAR' });
      navigate(`/commande/confirmation?order=${res.order?.orderNumber || res.data?.orderNumber || res.data?.id}`);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <p>Votre panier est vide.</p>
        <Link to="/produits" className="btn btn--primary" style={{ marginTop: '1rem' }}>
          Explorer la boutique
        </Link>
      </div>
    );
  }

  const shipping = total >= 25000 ? 0 : 1500;
  const orderTotal = total + shipping;

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-breadcrumb">
          <Link to="/panier">← Retour au panier</Link>
        </div>
        <h1 className="display-md checkout-title">Finaliser la commande</h1>

        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Form */}
          <div className="checkout-form">
            {/* Contact */}
            <div className="checkout-section">
              <h2 className="checkout-section__title heading">Informations personnelles</h2>
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Prénom *</label>
                  <input type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>Nom *</label>
                  <input type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)} required />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Téléphone *</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} required placeholder="+221 77 ..." />
                </div>
                <div className="form-field">
                  <label>Email (optionnel)</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="votre@email.com" />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="checkout-section">
              <h2 className="checkout-section__title heading">Adresse de livraison</h2>
              <div className="form-field">
                <label>Adresse complète *</label>
                <input type="text" value={form.address} onChange={e => update('address', e.target.value)} required placeholder="Rue, quartier..." />
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Ville *</label>
                  <select value={form.city} onChange={e => update('city', e.target.value)}>
                    {['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack', 'Mbour', 'Diourbel', 'Touba'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Région</label>
                  <input type="text" value={form.region} onChange={e => update('region', e.target.value)} placeholder="Région..." />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-section">
              <h2 className="checkout-section__title heading">Mode de paiement</h2>
              <div className="payment-options">
                {[
                  { value: 'cash_on_delivery', label: 'Paiement à la livraison', icon: <Banknote size={20} strokeWidth={1.5} />, desc: 'Payez en espèces à la réception' },
                  { value: 'wave', label: 'Wave', icon: <Smartphone size={20} strokeWidth={1.5} />, desc: 'Paiement mobile Wave' },
                  { value: 'orange_money', label: 'Orange Money', icon: <Circle size={20} strokeWidth={1.5} />, desc: 'Paiement mobile Orange Money' },
                ].map(opt => (
                  <label key={opt.value} className={`payment-option ${form.paymentMethod === opt.value ? 'payment-option--active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={() => update('paymentMethod', opt.value)}
                    />
                    <span className="payment-option__icon">{opt.icon}</span>
                    <div>
                      <div className="payment-option__label">{opt.label}</div>
                      <div className="payment-option__desc">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="checkout-section">
              <div className="form-field">
                <label>Notes / Instructions (optionnel)</label>
                <textarea
                  value={form.notes}
                  onChange={e => update('notes', e.target.value)}
                  rows={3}
                  placeholder="Informations supplémentaires pour la livraison..."
                />
              </div>
            </div>

              {error && (
                <div className="checkout-error">
                  <AlertCircle size={16} strokeWidth={2} />
                  {error}
                </div>
              )}

            <button type="submit" className="btn btn--primary btn--full checkout-submit" disabled={loading}>
              {loading ? 'Traitement en cours…' : `Confirmer la commande — ${formatPrice(orderTotal)}`}
            </button>
          </div>

          {/* Order summary */}
          <div className="checkout-summary">
            <h2 className="heading checkout-summary__title">Votre commande</h2>
            <div className="checkout-items">
              {items.map((item, i) => (
                <div key={i} className="checkout-item">
                  <div className="checkout-item__img">
                    {item.image ? <img src={getImageUrl(item.image)} alt={item.name} /> : <Flame size={20} strokeWidth={1.5} />}
                    <span className="checkout-item__qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-item__info">
                    <div className="checkout-item__name">{item.name}</div>
                    {item.variantName && <div className="checkout-item__variant">{item.variantName}</div>}
                  </div>
                  <div className="checkout-item__price">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="checkout-totals">
              <div className="checkout-total-line">
                <span>Sous-total</span><span>{formatPrice(total)}</span>
              </div>
              <div className="checkout-total-line">
                <span>Livraison</span>
                <span style={{ color: shipping === 0 ? '#4caf50' : 'inherit' }}>
                  {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                </span>
              </div>
              <div className="checkout-total-line checkout-total-line--final">
                <span>Total</span><span>{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
