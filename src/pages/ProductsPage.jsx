import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Search, X, SlidersHorizontal, Sparkles, Flame, Grid3X3, Grid2X2, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [gridCols, setGridCols] = useState(3);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '';
  
  const LIMIT = 12;
  const [showAll, setShowAll] = useState(false);

  // Sync local search input with URL param
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    api.getCategories()
      .then(r => setCategories(r.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Only set loading true if we have no products yet
    if (products.length === 0) {
      setLoading(true);
    }
    setPage(1);
    const params = {};
    if (!showAll) {
      params.limit = LIMIT;
      params.page = 1;
    } else {
      params.limit = 10000;
      params.page = 1;
    }
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sort) params.sort = sort;

    api.getProducts(params)
      .then(r => {
        const list = r.data?.products || r.data || [];
        setProducts(list);
        setTotal(r.data?.total ?? (Array.isArray(r.data) ? r.data.length : (list.length || 0)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category, minPrice, maxPrice, sort, showAll]);

  function updateParam(key, value) {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value);
    else p.delete(key);
    setSearchParams(p);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  }

  function clearFilter(key) {
    updateParam(key, '');
  }

  function resetAllFilters() {
    setSearchInput('');
    setSearchParams({});
  }

  function loadMore() {
    if (showAll) return;
    const nextPage = page + 1;
    const params = { limit: LIMIT, page: nextPage };
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sort) params.sort = sort;

    api.getProducts(params).then(r => {
      setProducts(prev => [...prev, ...(r.data?.products || r.data || [])]);
      setPage(nextPage);
    });
  }

  const activeCategoryObj = categories.find(c => String(c.id) === category || c.slug === category);
  const hasActiveFilters = Boolean(search || category || minPrice || maxPrice || sort);
  const hasMore = !showAll && LIMIT > 0 && products.length < total;

  return (
    <div className="products-page">
      {/* ── Page Header Banner ────────────────────────── */}
      <header className="products-hero">
        <div className="products-hero__ambient" aria-hidden="true" />
        <div className="container products-hero__content">
          <div className="products-hero__eyebrow">
            <Sparkles size={14} className="products-hero__sparkle" />
            <span>Maison Bushra Machallah • Haute Parfumerie</span>
          </div>

          <h1 className="products-hero__title">
            {activeCategoryObj ? activeCategoryObj.name : search ? `Résultats pour « ${search} »` : 'Collection & Rituels'}
          </h1>

          <p className="products-hero__sub">
            {activeCategoryObj?.description ||
              'Explorez nos Thiourayes ancestraux, nos encensoirs d’orfèvre, nos racines de Khamaré et nos fragrances d’exception.'}
          </p>

          {/* Integrated Search Input */}
          <form className="products-hero__search" onSubmit={handleSearchSubmit}>
            <Search size={18} className="products-hero__search-icon" />
            <input
              type="text"
              placeholder="Rechercher un Thiouraye, encensoir, Khamaré, parfum..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="products-hero__search-input"
            />
            {searchInput && (
              <button
                type="button"
                className="products-hero__search-clear"
                onClick={() => {
                  setSearchInput('');
                  clearFilter('search');
                }}
                aria-label="Effacer la recherche"
              >
                <X size={15} />
              </button>
            )}
            <button type="submit" className="products-hero__search-btn">
              Rechercher
            </button>
          </form>

          {/* Quick Category Pills Horizontal Bar */}
          <div className="products-hero__pills">
            <button
              className={`products-pill ${!category ? 'products-pill--active' : ''}`}
              onClick={() => updateParam('category', '')}
            >
              <span>Tous les trésors</span>
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`products-pill ${category === String(cat.id) ? 'products-pill--active' : ''}`}
                onClick={() => updateParam('category', cat.id)}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Catalog Body ──────────────────────────── */}
      <div className="container products-page__body">
        {/* Sidebar Filters */}
        <aside className="filters">
          <div className="filters__card">
            <div className="filters__header">
              <div className="filters__title-wrap">
                <SlidersHorizontal size={16} className="filters__icon" />
                <h3 className="filters__title">Catégories</h3>
              </div>
            </div>

            <ul className="filters__list">
              <li>
                <button
                  className={`filters__item ${!category ? 'filters__item--active' : ''}`}
                  onClick={() => updateParam('category', '')}
                >
                  <span className="filters__dot" />
                  <span className="filters__item-name">Tous les produits</span>
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    className={`filters__item ${category === String(cat.id) ? 'filters__item--active' : ''}`}
                    onClick={() => updateParam('category', cat.id)}
                  >
                    <span className="filters__dot" />
                    <span className="filters__item-name">{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Filters */}
          <div className="filters__card">
            <h3 className="filters__title">Budget (FCFA)</h3>
            <div className="filters__quick-prices">
              {[
                { label: '< 5 000 F', min: '', max: '5000' },
                { label: '5k - 15k F', min: '5000', max: '15000' },
                { label: '> 15 000 F', min: '15000', max: '' },
              ].map((range, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`filters__price-tag ${minPrice === range.min && maxPrice === range.max ? 'filters__price-tag--active' : ''}`}
                  onClick={() => {
                    const p = new URLSearchParams(searchParams);
                    if (range.min) p.set('minPrice', range.min); else p.delete('minPrice');
                    if (range.max) p.set('maxPrice', range.max); else p.delete('maxPrice');
                    setSearchParams(p);
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="filters__price-row">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={e => updateParam('minPrice', e.target.value)}
                className="filters__price-input"
              />
              <span className="filters__price-sep">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={e => updateParam('maxPrice', e.target.value)}
                className="filters__price-input"
              />
            </div>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button className="filters__reset-btn" onClick={resetAllFilters}>
              <X size={14} /> Réinitialiser tous les filtres
            </button>
          )}

          {/* Banner Promo / Conseil */}
          <div className="filters__banner">
            <Flame size={20} className="filters__banner-icon" />
            <div className="filters__banner-title">Conseil Parfumerie</div>
            <p className="filters__banner-text">
              Associez un encensoir en laiton à notre Thiouraye Gowe pour une diffusion lente et envoûtante.
            </p>
          </div>
        </aside>

        {/* ── Products Showcase Content ─────────────────── */}
        <main className="products-page__content">
          {/* Top Bar: Count, Active Pills, Sort & Layout Switch */}
          <div className="products-toolbar">
            <div className="products-toolbar__left">
              <span className="products-toolbar__count">
                <strong>{total}</strong> {total <= 1 ? 'produit d’exception' : 'produits d’exception'}
              </span>

              {/* Active Filter Badges */}
              {hasActiveFilters && (
                <div className="products-toolbar__active-tags">
                  {category && (
                    <span className="products-tag">
                      {activeCategoryObj?.name || 'Catégorie'}
                      <button onClick={() => clearFilter('category')} aria-label="Supprimer le filtre">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="products-tag">
                      « {search} »
                      <button onClick={() => clearFilter('search')} aria-label="Supprimer le filtre">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {(minPrice || maxPrice) && (
                    <span className="products-tag">
                      {minPrice ? `${Number(minPrice).toLocaleString('fr-FR')} F` : '0 F'} - {maxPrice ? `${Number(maxPrice).toLocaleString('fr-FR')} F` : '∞'}
                      <button onClick={() => { clearFilter('minPrice'); clearFilter('maxPrice'); }} aria-label="Supprimer le filtre">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="products-toolbar__right">
              {/* Sort Dropdown */}
              <div className="products-sort">
                <ArrowUpDown size={14} className="products-sort__icon" />
                <select
                  value={sort}
                  onChange={e => updateParam('sort', e.target.value)}
                  className="products-sort__select"
                >
                  <option value="">Trier : Recommandés</option>
                  <option value="newest">Nouveautés</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                  <option value="name_asc">Nom (A - Z)</option>
                </select>
              </div>

              {/* Grid Column Selector (Desktop) */}
              <div className="products-layout-switch">
                <button
                  type="button"
                  className={`products-layout-btn ${gridCols === 3 ? 'products-layout-btn--active' : ''}`}
                  onClick={() => setGridCols(3)}
                  aria-label="Grille 3 colonnes"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  type="button"
                  className={`products-layout-btn ${gridCols === 2 ? 'products-layout-btn--active' : ''}`}
                  onClick={() => setGridCols(2)}
                  aria-label="Grille 2 colonnes"
                >
                  <Grid2X2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Grid or Skeletons or Empty State */}
          {loading ? (
            <div className={`products-grid products-grid--${gridCols}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="product-skeleton">
                  <div className="product-skeleton__img" />
                  <div className="product-skeleton__body">
                    <div className="product-skeleton__line product-skeleton__line--short" />
                    <div className="product-skeleton__line" />
                    <div className="product-skeleton__line product-skeleton__line--half" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className={`products-grid products-grid--${gridCols}`}>
                {products.map((p, idx) => (
                  <ProductCard key={p.id} product={p} index={idx} />
                ))}
              </div>

              {hasMore && (
                <div className="products-loadmore">
                  <button className="btn-luxury" onClick={loadMore}>
                    <span>Découvrir plus de créations</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="products-empty">
              <div className="products-empty__icon-wrap">
                <Search size={36} />
              </div>
              <h3 className="products-empty__title">Aucune création ne correspond</h3>
              <p className="products-empty__text">
                Aucun produit ne correspond à vos critères de recherche actuels. Essayez d’ajuster vos filtres ou explorez nos catégories phares.
              </p>
              <button className="btn-luxury" onClick={resetAllFilters}>
                <span>Réinitialiser la sélection</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

