// ── ORDER CONFIRMATION ───────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Check, Phone, Package, FileText, CheckCircle, Truck, Home, Leaf, FlaskConical, Globe, Gem, Mail, MapPin, MessageCircle } from 'lucide-react';
import { api } from '../utils/api';
import './SimplePages.css';

export function OrderConfirmationPage() {
  const [params] = useSearchParams();
  const orderNum = params.get('order');

  useEffect(() => {
    // Luxury golden confetti bursts
    const end = Date.now() + 1.6 * 1000;
    const colors = ['#E8B86D', '#C5933A', '#FFF0C8', '#D4AF37'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="simple-page">
      <div className="container simple-page__content">
        <div className="confirm-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-amber)" strokeWidth="1.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="display-lg confirm-title">Commande confirmée !</h1>
        {orderNum && (
          <div className="confirm-order-num">
            <span className="label">Numéro de commande</span>
            <strong className="confirm-order-num__val">#{orderNum}</strong>
          </div>
        )}
        <p className="body-lg confirm-desc">
          Merci pour votre commande ! Nous vous contacterons sous peu pour confirmer 
          la livraison. Gardez votre numéro de commande pour le suivi.
        </p>
        <div className="confirm-actions">
          <Link to="/commande/suivi" className="btn btn--primary">
            Suivre ma commande
          </Link>
          <Link to="/produits" className="btn btn--outline">
            Continuer mes achats
          </Link>
        </div>
        <div className="confirm-info">
          <div className="confirm-info__item">
            <Phone size={18} strokeWidth={1.5} />
            <span>Besoin d'aide ? Appelez-nous au <strong>+221 77 123 45 67</strong></span>
          </div>
          <div className="confirm-info__item">
            <Package size={18} strokeWidth={1.5} />
            <span>Livraison estimée : <strong>1–3 jours ouvrables</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ORDER TRACKING ────────────────────────────────────────────
export function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleTrack(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await api.trackOrder(orderNumber, phone);
      setOrder(res.data);
    } catch (err) {
      setError(err.message || 'Commande introuvable. Vérifiez vos informations.');
    } finally {
      setLoading(false);
    }
  }

  const statuses = [
    { key: 'pending', label: 'Reçue', icon: <FileText size={20} strokeWidth={1.5} /> },
    { key: 'confirmed', label: 'Confirmée', icon: <CheckCircle size={20} strokeWidth={1.5} /> },
    { key: 'processing', label: 'En préparation', icon: <Package size={20} strokeWidth={1.5} /> },
    { key: 'shipped', label: 'En livraison', icon: <Truck size={20} strokeWidth={1.5} /> },
    { key: 'delivered', label: 'Livrée', icon: <Home size={20} strokeWidth={1.5} /> },
  ];

  const currentIdx = order ? statuses.findIndex(s => s.key === order.status) : -1;

  return (
    <div className="simple-page">
      <div className="container simple-page__content">
        <span className="label" style={{ color: 'var(--color-amber)' }}>Suivi commande</span>
        <h1 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: 'var(--space-xl)' }}>
          Où est ma commande ?
        </h1>

        <form onSubmit={handleTrack} className="track-form">
          <div className="form-field">
            <label>Numéro de commande</label>
            <input
              type="text"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              placeholder="Ex: BM-2024-001"
              required
            />
          </div>
          <div className="form-field">
            <label>Numéro de téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+221 77 ..."
              required
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Recherche…' : 'Suivre ma commande'}
          </button>
        </form>

        {error && (
          <div className="track-error">{error}</div>
        )}

        {order && (
          <div className="track-result">
            <div className="track-result__header">
              <div>
                <div className="label" style={{ color: 'var(--color-amber)' }}>Commande #{order.order_number}</div>
                <div style={{ color: 'var(--color-smoke)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  {order.items?.length} article{order.items?.length > 1 ? 's' : ''}
                </div>
              </div>
              <div className={`track-status-badge track-status-badge--${order.status}`}>
                {statuses.find(s => s.key === order.status)?.label || order.status}
              </div>
            </div>

            {/* Progress bar */}
            <div className="track-progress">
              {statuses.map((s, i) => (
                <div key={s.key} className={`track-step ${i <= currentIdx ? 'track-step--done' : ''} ${i === currentIdx ? 'track-step--current' : ''}`}>
                  <div className="track-step__icon">{s.icon}</div>
                  <div className="track-step__label">{s.label}</div>
                  {i < statuses.length - 1 && (
                    <div className={`track-step__line ${i < currentIdx ? 'track-step__line--done' : ''}`} />
                  )}
                </div>
              ))}
            </div>

            {order.admin_note && (
              <div className="track-note">
                <strong>Note :</strong> {order.admin_note}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ABOUT PAGE ────────────────────────────────────────────────
export function AboutPage() {
  return (
    <div className="simple-page">
      <div className="about-hero">
        <div className="about-hero__bg" style={{ backgroundImage: 'url(/bacground-image.png)' }} />
        <div className="about-hero__overlay" />
        <div className="container about-hero__content">
          <span className="label" style={{ color: 'var(--color-amber)' }}>Notre histoire</span>
          <h1 className="display-xl" style={{ marginTop: '0.75rem' }}>
            L'art des senteurs<br /><em>sénégalaises</em>
          </h1>
        </div>
      </div>

      <div className="container about-body">
        <div className="about-section">
          <div className="about-text">
            <h2 className="display-md">Qui sommes-nous ?</h2>
            <div className="divider divider--left" />
            <p className="body-lg" style={{ color: 'var(--color-ash)' }}>
              Bushra Machallah est une boutique en ligne spécialisée dans les produits de senteur 
              traditionnels du Sénégal. Fondée avec passion, nous proposons une sélection 
              authentique d'encens, de bakhours, d'huiles parfumées et d'encensoirs artisanaux.
            </p>
            <p className="body" style={{ color: 'var(--color-smoke)', marginTop: '1rem' }}>
              Notre mission est de valoriser le patrimoine olfactif sénégalais et de le rendre 
              accessible à tous. Chaque produit est soigneusement sélectionné pour sa qualité, 
              son authenticité et son respect des traditions ancestrales.
            </p>
          </div>

          <div className="about-values">
            {[
              { icon: <Leaf size={32} strokeWidth={1.5} />, title: '100% Naturel', desc: 'Tous nos produits sont naturels, sans additifs chimiques.', img: '/paniers-vetiver.png' },
              { icon: <FlaskConical size={32} strokeWidth={1.5} />, title: 'Artisanal', desc: 'Fabriqués à la main par des artisans sénégalais.', img: '/encensoir6.png' },
              { icon: <Globe size={32} strokeWidth={1.5} />, title: 'Local', desc: 'Nous soutenons les producteurs locaux du Sénégal.', img: '/gowe-thiouray.png' },
              { icon: <Gem size={32} strokeWidth={1.5} />, title: 'Premium', desc: 'Une sélection rigoureuse des meilleurs produits.', img: '/encensoir2.png' },
            ].map((v, i) => (
              <div key={i} className="about-value-card">
                <div className="about-value-card__img-wrap">
                  <img src={v.img} alt={v.title} className="about-value-card__img" />
                </div>
                <h3 className="heading" style={{ marginBottom: '0.4rem', marginTop: '0.75rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--color-smoke)', fontSize: '0.85rem' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product showcase */}
        <div className="about-products">
          <h2 className="display-md" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            Quelques-uns de nos produits
          </h2>
          <div className="about-products__grid">
            {[
              { img: '/encensoir1.png', name: 'Mabkhara Prestige' },
              { img: '/encensoir3.png', name: 'Mabkhara Noir' },
              { img: '/sprays.png', name: 'Collection Sprays' },
              { img: '/encensoir5.png', name: 'Mabkhara Bois' },
            ].map((p, i) => (
              <div key={i} className="about-product-thumb">
                <img src={p.img} alt={p.name} />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-cta">
          <h2 className="display-md">Prêt à découvrir nos senteurs ?</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link to="/produits" className="btn btn--primary">Explorer la boutique</Link>
            <Link to="/contact" className="btn btn--outline">Nous contacter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CONTACT PAGE ──────────────────────────────────────────────
export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="simple-page">
      <div className="container contact-layout">
        <div className="contact-info">
          <span className="label" style={{ color: 'var(--color-amber)' }}>Parlons ensemble</span>
          <h1 className="display-lg" style={{ marginTop: '0.5rem' }}>Contactez-nous</h1>
          <div className="divider divider--left" />
          <p className="body-lg" style={{ color: 'var(--color-ash)' }}>
            Une question sur un produit ? Un problème avec votre commande ? 
            Notre équipe est disponible 7j/7 pour vous aider.
          </p>

          <div className="contact-channels">
            {[
              { icon: <Phone size={20} strokeWidth={1.5} />, label: 'Téléphone', val: '+221 77 123 45 67', href: 'tel:+221771234567' },
              { icon: <MessageCircle size={20} strokeWidth={1.5} />, label: 'WhatsApp', val: 'Discuter maintenant', href: 'https://wa.me/221771234567' },
              { icon: <Mail size={20} strokeWidth={1.5} />, label: 'Email', val: 'contact@bushramachallah.sn', href: 'mailto:contact@bushramachallah.sn' },
              { icon: <MapPin size={20} strokeWidth={1.5} />, label: 'Adresse', val: 'Dakar, Sénégal', href: null },
            ].map((c, i) => (
              <div key={i} className="contact-channel">
                <span className="contact-channel__icon">{c.icon}</span>
                <div>
                  <div className="label" style={{ color: 'var(--color-smoke)' }}>{c.label}</div>
                  {c.href ? (
                    <a href={c.href} className="contact-channel__val">{c.val}</a>
                  ) : (
                    <span className="contact-channel__val">{c.val}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-form-wrap">
          {sent ? (
            <div className="contact-sent">
              <Check size={48} strokeWidth={2} color="var(--color-amber)" />
              <h3 className="heading">Message envoyé !</h3>
              <p style={{ color: 'var(--color-smoke)' }}>
                Nous vous répondrons dans les plus brefs délais.
              </p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2 className="heading" style={{ marginBottom: 'var(--space-md)' }}>Envoyer un message</h2>
              <div className="form-field">
                <label>Nom complet *</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required />
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Téléphone</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
              </div>
              <div className="form-field">
                <label>Message *</label>
                <textarea value={form.message} onChange={e => update('message', e.target.value)} rows={5} required />
              </div>
              <button type="submit" className="btn btn--primary btn--full">
                Envoyer le message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── COLLECTIONS PAGE ──────────────────────────────────────────
export function CollectionsPage() {
  return (
    <div className="simple-page">
      <div className="container">
        <div style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)', textAlign: 'center' }}>
          <span className="label" style={{ color: 'var(--color-amber)' }}>Univers de senteurs</span>
          <h1 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            Nos Collections
          </h1>
          <div className="divider" />
          <p className="body-lg" style={{ color: 'var(--color-ash)', maxWidth: 520, margin: '1rem auto 3rem' }}>
            Plongez dans nos univers olfactifs soigneusement composés pour chaque moment de votre vie.
          </p>

          <div className="collections-grid">
            {[
              { name: 'Encensoirs Artisanaux', desc: 'Mabkhara sculptés à la main, modernes et traditionnels', img: '/encensoir1.png', to: '/produits?category=encensoirs' },
              { name: 'Thiouraye & Bakhour', desc: 'Gowé Bushra, Bushra Velours — encens 100% naturels', img: '/gowe-thiouray.png', to: '/produits?category=thiouraye' },
              { name: 'Sprays & Parfums', desc: 'Nuage Secret, Fleur de Lune, Brume de Coton', img: '/sprays.png', to: '/produits?category=parfums' },
              { name: 'Vétiver Naturel', desc: 'Paniers vétiver artisanaux pour purifier vos espaces', img: '/paniers-vetiver.png', to: '/produits?category=naturel' },
              { name: 'Collection Prestige', desc: 'Nos encensoirs les plus exclusifs en laiton et bois', img: '/encensoir5.png', to: '/produits?featured=true' },
              { name: 'Mabkhara Noire & Or', desc: 'Pour les amateurs de modernité et d\'élégance', img: '/encensoir3.png', to: '/produits?category=encensoirs' },
            ].map((col, i) => (
              <Link key={i} to={col.to} className="collection-card">
                <div className="collection-card__img-wrap">
                  <img src={col.img} alt={col.name} className="collection-card__img" />
                </div>
                <div className="collection-card__body">
                  <h3 className="heading collection-card__name">{col.name}</h3>
                  <p className="collection-card__desc">{col.desc}</p>
                  <span className="collection-card__link">Découvrir →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
