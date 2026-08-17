import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { getImageUrl, formatPrice } from '../utils/api';
import { Check, Plus, Star, Image, Sparkles, Eye, Heart } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product, index = 0 }) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const mainImage = product.images?.[0]?.url || product.primary_image || product.image_url;
  const isLocalImage = mainImage && mainImage.startsWith('/');
  const imgSrc = isLocalImage ? mainImage : (mainImage ? getImageUrl(mainImage) : null);

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: 'ADD_ITEM',
      item: {
        productId: product.id,
        variantId: product.variants?.[0]?.id || null,
        name: product.name,
        price: product.base_price || product.price,
        image: mainImage,
        quantity: 1,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleLike(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  }

  const discount = product.compare_price && product.compare_price > (product.base_price || product.price)
    ? Math.round((1 - (product.base_price || product.price) / product.compare_price) * 100)
    : null;

  // Eager load first 4 cards to prevent any initial scroll hitching
  const isPriority = index < 4;

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.3), ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="product-card__glow" aria-hidden="true" />
      
      <Link to={`/produits/${product.id}`} className="product-card__image-wrap" tabIndex={-1}>
        <div className="product-card__image-canvas">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              className={`product-card__image ${imgLoaded ? 'product-card__image--loaded' : 'product-card__image--loading'}`}
              loading={isPriority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={isPriority ? 'high' : 'auto'}
              onLoad={() => setImgLoaded(true)}
              width={320}
              height={320}
            />
          ) : (
            <div className="product-card__placeholder">
              <Image size={36} strokeWidth={1.2} />
            </div>
          )}
          <div className="product-card__podium-shadow" aria-hidden="true" />
        </div>

        {/* Badges */}
        <div className="product-card__badges">
          {discount ? (
            <span className="product-card__badge product-card__badge--discount">
              -{discount}%
            </span>
          ) : null}
          {product.is_featured && (
            <span className="product-card__badge product-card__badge--featured">
              <Sparkles size={11} className="inline-icon" /> Coup de Cœur
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          type="button"
          className={`product-card__wishlist ${isLiked ? 'product-card__wishlist--active' : ''}`}
          onClick={handleLike}
          aria-label={isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={15} fill={isLiked ? '#E8B86D' : 'none'} stroke={isLiked ? '#E8B86D' : 'currentColor'} />
        </button>

        {/* Quick View hint on hover */}
        <span className="product-card__view-hint" aria-hidden="true">
          <Eye size={13} />
          <span>Découvrir</span>
        </span>

        {/* Quick Add Button */}
        <button
          type="button"
          className={`product-card__quick-add ${added ? 'product-card__quick-add--done' : ''}`}
          onClick={handleAdd}
          aria-label={added ? 'Produit ajouté au panier' : `Ajouter ${product.name} au panier`}
        >
          {added ? (
            <>
              <Check size={14} strokeWidth={2.6} />
              <span>Ajouté !</span>
            </>
          ) : (
            <>
              <Plus size={14} strokeWidth={2.4} />
              <span>Ajouter</span>
            </>
          )}
        </button>
      </Link>

      <div className="product-card__body">
        {product.category_name && (
          <div className="product-card__category-wrap">
            <span className="product-card__category-dot" />
            <span className="product-card__category">{product.category_name}</span>
          </div>
        )}
        
        <h3 className="product-card__name">
          <Link to={`/produits/${product.id}`} title={product.name}>
            {product.name}
          </Link>
        </h3>

        <div className="product-card__footer">
          <div className="product-card__price-row">
            <span className="product-card__price">
              {formatPrice(product.base_price || product.price)}
            </span>
            {product.compare_price && product.compare_price > (product.base_price || product.price) && (
              <span className="product-card__compare">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          {product.avg_rating > 0 && (
            <div className="product-card__rating" title={`Note : ${product.avg_rating} / 5`}>
              <div className="product-card__stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    size={11}
                    fill={s <= Math.round(product.avg_rating) ? '#E8B86D' : 'none'}
                    stroke="#E8B86D"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="product-card__rating-count">({product.review_count || 0})</span>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}


