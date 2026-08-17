import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, getImageUrl, formatPrice } from '../utils/api';
import { useCart } from '../context/CartContext';
import { Check, ShoppingCart, MessageCircle, Star, Truck, Shield, Package, Image } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [reviewForm, setReviewForm] = useState({ authorName: '', rating: 5, comment: '' });
  const [reviewSent, setReviewSent] = useState(false);
  const { dispatch } = useCart();

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getProduct(id), api.getSimilar(id)])
      .then(([prod, sim]) => {
        const p = prod.data;
        setProduct(p);
        setSelectedVariant(p.variants?.[0] || null);
        setSimilar(sim.data || []);
        setActiveImage(0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    const price = selectedVariant
      ? product.base_price + (selectedVariant.price_delta || 0)
      : product.base_price;
    dispatch({
      type: 'ADD_ITEM',
      item: {
        productId: product.id,
        variantId: selectedVariant?.id || null,
        name: product.name,
        price: price,
        image: product.images?.[0]?.url,
        variantName: selectedVariant?.name,
        quantity: qty,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  async function handleReview(e) {
    e.preventDefault();
    await api.createReview({ productId: product.id, ...reviewForm });
    setReviewSent(true);
  }

  if (loading) return (
    <div className="detail-loading">
      <div className="detail-skeleton" />
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '4rem', paddingTop: '120px' }}>
      <p>Produit introuvable.</p>
      <Link to="/produits" className="btn btn--primary" style={{ marginTop: '1rem' }}>
        Retour aux produits
      </Link>
    </div>
  );

  const price = selectedVariant
    ? product.base_price + (selectedVariant.price_delta || 0)
    : product.base_price;

  const stock = selectedVariant?.stock_quantity ?? product.default_stock ?? 0;
  const inStock = stock > 0;

  return (
    <div className="detail-page">
      {/* Breadcrumb */}
      <div className="container detail-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/produits">Produits</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* Main product section */}
      <div className="container detail-main">
        {/* Images */}
        <div className="detail-images">
          <div className="detail-images__main">
            {product.images?.length > 0 ? (
              <img
                src={getImageUrl(product.images[activeImage]?.url)}
                alt={product.name}
                className="detail-images__hero"
              />
            ) : (
              <div className="detail-images__placeholder">
                <Image size={60} strokeWidth={1} color="var(--color-amber)" />
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="detail-images__thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`detail-images__thumb ${i === activeImage ? 'detail-images__thumb--active' : ''}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={getImageUrl(img.url)} alt={`Vue ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detail-info">
          {product.category_name && (
            <span className="label detail-info__cat">{product.category_name}</span>
          )}
          <h1 className="display-md detail-info__title">{product.name}</h1>

          {/* Rating */}
          {product.avg_rating > 0 && (
            <div className="detail-info__rating">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={16} fill={s <= Math.round(product.avg_rating) ? 'var(--color-amber)' : 'none'} stroke="var(--color-amber)" strokeWidth={1.5} />
              ))}
              <span style={{ fontSize: '0.85rem', color: 'var(--color-smoke)', marginLeft: '0.5rem' }}>
                {product.avg_rating.toFixed(1)} ({product.review_count} avis)
              </span>
            </div>
          )}

          <div className="detail-info__price-wrap">
            <span className="detail-info__price">{formatPrice(price)}</span>
            {product.compare_price > product.base_price && (
              <span className="detail-info__compare">{formatPrice(product.compare_price)}</span>
            )}
          </div>

          <div className="divider divider--left" />

          {product.description && (
            <p className="body-lg detail-info__desc">{product.description}</p>
          )}

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="detail-info__variants">
              <span className="label" style={{ color: 'var(--color-smoke)', marginBottom: '0.75rem', display: 'block' }}>
                Variante : <strong style={{ color: 'var(--color-cream)' }}>{selectedVariant?.name}</strong>
              </span>
              <div className="detail-info__variant-btns">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    className={`detail-info__variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    {v.name}
                    {v.price_delta !== 0 && (
                      <span> (+{formatPrice(Math.abs(v.price_delta))})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className={`detail-info__stock ${inStock ? 'in-stock' : 'out-stock'}`}>
            <div className="detail-info__stock-dot" />
            {inStock ? `En stock (${stock} disponible${stock > 1 ? 's' : ''})` : 'Rupture de stock'}
          </div>

          {/* Qty + Add */}
          <div className="detail-info__actions">
            <div className="detail-info__qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(stock, q + 1))} disabled={qty >= stock || !inStock}>+</button>
            </div>
            <button
              className={`btn btn--primary detail-info__add-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              {added ? (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  Ajouté au panier !
                </>
              ) : (
                <>
                  <ShoppingCart size={16} strokeWidth={1.5} />
                  {inStock ? 'Ajouter au panier' : 'Indisponible'}
                </>
              )}
            </button>
          </div>

          {/* WhatsApp order */}
          <a
            href={`https://wa.me/221771234567?text=Bonjour%2C%20je%20souhaite%20commander%20%22${encodeURIComponent(product.name)}%22%20(${formatPrice(price)})%20x${qty}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn--outline detail-info__whatsapp-btn"
          >
            <MessageCircle size={18} />
            Commander via WhatsApp
          </a>

          {/* Features */}
          <div className="detail-info__features">
            {[
              { icon: <Truck size={18} strokeWidth={1.5} />, text: 'Livraison gratuite dès 25 000 FCFA' },
              { icon: <Shield size={18} strokeWidth={1.5} />, text: '100% naturel et authentique' },
              { icon: <Package size={18} strokeWidth={1.5} />, text: 'Emballage soigné' },
            ].map((f, i) => (
              <div key={i} className="detail-info__feature">
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="container" style={{ paddingBottom: 'var(--space-xl)' }}>
          <h2 className="display-md" style={{ marginBottom: 'var(--space-lg)' }}>Avis clients</h2>
          <div className="reviews-grid">
            {product.reviews.map(r => (
              <div key={r.id} className="review-card">
                <div className="review-card__header">
                  <div className="review-card__avatar">{r.author_name?.charAt(0)}</div>
                  <div>
                    <div className="review-card__name">{r.author_name}</div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="11" height="11" viewBox="0 0 24 24"
                          fill={s <= r.rating ? 'var(--color-amber)' : 'none'}
                          stroke="var(--color-amber)" strokeWidth="1.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p style={{ color: 'var(--color-ash)', fontSize: '0.92rem', lineHeight: 1.6 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review form */}
      <div className="container review-form-section">
        <h3 className="heading" style={{ marginBottom: '1rem' }}>Laisser un avis</h3>
        {reviewSent ? (
          <div className="review-sent">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-amber)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p>Merci pour votre avis ! Il sera publié après validation.</p>
          </div>
        ) : (
          <form className="review-form" onSubmit={handleReview}>
            <input
              type="text"
              placeholder="Votre nom"
              value={reviewForm.authorName}
              onChange={e => setReviewForm(f => ({ ...f, authorName: e.target.value }))}
              required
              className="review-form__input"
            />
            <div className="review-form__rating">
              <span className="label" style={{ color: 'var(--color-smoke)' }}>Note :</span>
              {[1,2,3,4,5].map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24"
                    fill={s <= reviewForm.rating ? 'var(--color-amber)' : 'none'}
                    stroke="var(--color-amber)" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </button>
              ))}
            </div>
            <textarea
              placeholder="Votre commentaire…"
              value={reviewForm.comment}
              onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
              rows={4}
              className="review-form__input review-form__textarea"
            />
            <button type="submit" className="btn btn--primary">
              Publier l'avis
            </button>
          </form>
        )}
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
          <h2 className="display-md" style={{ marginBottom: 'var(--space-xl)' }}>Vous aimerez aussi</h2>
          <div className="products-grid">
            {similar.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}