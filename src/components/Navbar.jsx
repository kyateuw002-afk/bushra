import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Search,
  ShoppingCart,
  X,
  Home,
  LayoutGrid,
  User,
  Sparkles,
  Package,
  ShieldCheck,
  ChevronRight,
  Phone,
  Flame,
  Layers,
  Compass,
  MessageCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import './Navbar.css';
import TransparentLogo from './TransparentLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled && !menuOpen;

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produits?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMenuOpen(false);
      setSearchQuery('');
    }
  }

  const navLinks = [
    { to: '/', label: 'Accueil', icon: Home, badge: null, desc: 'Haute Parfumerie Sénégalaise' },
    { to: '/produits', label: 'Catalogue', icon: LayoutGrid, badge: 'Nouveau', desc: 'Nos créations & trésors' },
    { to: '/collections', label: 'Collections', icon: Layers, badge: null, desc: 'Rituels & Ensembles' },
    { to: '/a-propos', label: 'La Maison', icon: Compass, badge: null, desc: 'Héritage & Savoir-faire' },
    { to: '/contact', label: 'Contact', icon: Phone, badge: null, desc: 'Boutique & Conseil VIP' },
  ];

  const quickCategories = [
    { to: '/produits?category=1', name: 'Thiouraye & Encens', icon: Flame },
    { to: '/produits?category=2', name: 'Encensoirs Or', icon: Sparkles },
    { to: '/produits?category=4', name: 'Khamaré & Vétiver', icon: Package },
  ];

  const bottomNavLinks = [
    { to: '/', label: 'Accueil', icon: 'home' },
    { to: '/produits', label: 'Boutique', icon: 'grid' },
    { to: '/panier', label: 'Panier', icon: 'cart' },
    { to: '/commande/suivi', label: 'Suivi', icon: 'package' },
    { to: '/compte', label: 'Compte', icon: 'user' },
  ];

  return (
    <>
      <header className={`navbar ${isTransparent ? 'navbar--transparent' : 'navbar--solid'} ${menuOpen ? 'navbar--open' : ''}`}>
        {/* Top announcement bar */}
        <div className="navbar__topbar">
          <div className="navbar__topbar-content">
            <span className="navbar__topbar-item">
              <Sparkles size={13} className="navbar__topbar-icon" /> Livraison offerte à Dakar dès 25 000 FCFA
            </span>
            <span className="navbar__topbar-divider">✦</span>
            <span className="navbar__topbar-item">
              Expédition rapide · Senteurs artisanales 100% authentiques
            </span>
          </div>
        </div>

        <div className="navbar__inner">
          {/* Logo Brand */}
          <Link
            to="/"
            className="navbar__logo"
            id="nav-brand-logo"
            aria-label="Bushra Machallah — Accueil"
            onClick={() => {
              setMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="navbar__logo-wrap">
              <TransparentLogo
                src="/logo.png"
                alt="Bushra Machallah Logo"
                className="navbar__logo-img"
                tolerance={50}
                width={52}
                height={52}
              />
            </div>
            <div className="navbar__brand-text">
              <span className="navbar__brand-name">BUSHRA</span>
              <span className="navbar__brand-sub">MACHALLAH · DAKAR</span>
            </div>
          </Link>

          {/* Desktop Navigation links */}
          <nav className="navbar__links" aria-label="Navigation principale">
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                >
                  <span className="navbar__link-text">{link.label}</span>
                  <span className="navbar__link-indicator" aria-hidden="true" />
                </Link>
              );
            })}
          </nav>

          {/* Actions on the right */}
          <div className="navbar__actions">
            <button
              className="navbar__action-btn navbar__search-btn"
              onClick={() => setSearchOpen(s => !s)}
              aria-label="Rechercher"
              title="Rechercher un produit"
            >
              <Search size={19} strokeWidth={1.8} />
            </button>

            <Link
              to="/panier"
              className="navbar__action-btn navbar__cart-btn"
              aria-label={`Panier (${count} articles)`}
              title="Voir mon panier"
              id="navbar-cart-button"
            >
              <ShoppingCart size={19} strokeWidth={1.8} />
              {count > 0 && <span className="navbar__cart-count">{count}</span>}
            </Link>

            <Link
              to="/commande/suivi"
              className="navbar__cta"
              title="Suivre une commande existante"
              id="navbar-track-button"
            >
              Suivre ma commande
            </Link>

            <Link
              to="/admin/login"
              className="navbar__action-btn navbar__admin-link"
              title="Espace Administrateur"
              aria-label="Admin"
            >
              <ShieldCheck size={18} strokeWidth={1.8} />
            </Link>

            {/* Mobile hamburger button */}
            <button
              className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
              onClick={() => setMenuOpen(s => !s)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
              id="navbar-mobile-toggle"
            >
              <div className="navbar__hamburger-box">
                <span className="navbar__hamburger-line line-1" />
                <span className="navbar__hamburger-line line-2" />
                <span className="navbar__hamburger-line line-3" />
              </div>
            </button>
          </div>
        </div>

        {/* Dropdown Search bar */}
        <div className={`navbar__search ${searchOpen ? 'navbar__search--open' : ''}`}>
          <form onSubmit={handleSearch} className="navbar__search-form">
            <Search size={18} className="navbar__search-input-icon" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Rechercher un thiouraye, encensoir doré, spray musc ou khamaré…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="navbar__search-input"
            />
            <button type="submit" className="navbar__search-submit">
              Rechercher
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="navbar__search-close"
              aria-label="Fermer la recherche"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </form>
        </div>
      </header>

      {/* ── Haute Parfumerie Fullscreen Page-Turn Mobile Menu ── */}
      <div className={`lux-menu ${menuOpen ? 'lux-menu--open' : ''}`} id="mobile-lux-menu">
        {/* Velvety Ambient Backdrop */}
        <div
          className="lux-menu__backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        {/* The Page Sheet that turns open like a book folio */}
        <div className="lux-menu__sheet" role="dialog" aria-modal="true" aria-label="Menu Bushra Machallah">
          {/* Subtle silk & gold light reflection across the page */}
          <div className="lux-menu__sheen" aria-hidden="true" />
          <div className="lux-menu__corner-glow" aria-hidden="true" />

          {/* Top Bar / Header */}
          <div className="lux-menu__header">
            <div className="lux-menu__brand">
              <div className="lux-menu__crest">
                <TransparentLogo
                  src="/logo.png"
                  alt="Bushra Logo"
                  className="lux-menu__crest-img"
                  tolerance={50}
                  width={38}
                  height={38}
                />
              </div>
              <div className="lux-menu__brand-text">
                <span className="lux-menu__brand-name">BUSHRA MACHALLAH</span>
                <span className="lux-menu__brand-sub">Haute Parfumerie · Dakar</span>
              </div>
            </div>

            <button
              onClick={() => setMenuOpen(false)}
              className="lux-menu__close"
              aria-label="Fermer le menu"
              id="lux-menu-close-btn"
            >
              <X size={22} strokeWidth={1.75} />
            </button>
          </div>

          {/* Search bar inside menu */}
          <div className="lux-menu__search-box">
            <form onSubmit={handleSearch} className="lux-menu__search-form">
              <Search size={16} className="lux-menu__search-icon" />
              <input
                type="text"
                placeholder="Rechercher un parfum, thiouraye, encensoir…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="lux-menu__search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="lux-menu__search-clear"
                  aria-label="Effacer"
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          {/* Main Navigation - Pure Editorial Elegance */}
          <div className="lux-menu__body">
            <nav className="lux-menu__nav" aria-label="Navigation mobile">
              <ul className="lux-menu__list">
                {navLinks.map((link, idx) => {
                  const isActive = location.pathname === link.to;
                  const num = `0${idx + 1}`;
                  return (
                    <li
                      key={link.to}
                      className="lux-menu__item"
                      style={{ '--item-index': idx }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => {
                          setMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`lux-menu__link ${isActive ? 'lux-menu__link--active' : ''}`}
                      >
                        <div className="lux-menu__link-left">
                          <span className="lux-menu__num">{num}</span>
                          <div className="lux-menu__text-wrap">
                            <span className="lux-menu__label">{link.label}</span>
                            <span className="lux-menu__sublabel">{link.desc}</span>
                          </div>
                        </div>

                        <div className="lux-menu__link-right">
                          {link.badge && <span className="lux-menu__badge">{link.badge}</span>}
                          <ChevronRight size={18} className="lux-menu__chevron" />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Quick Collections Tags */}
            <div className="lux-menu__collections">
              <span className="lux-menu__collections-title">Rituels & Senteurs Clés</span>
              <div className="lux-menu__tags">
                <Link
                  to="/produits?category=1"
                  onClick={() => setMenuOpen(false)}
                  className="lux-menu__tag"
                >
                  <Flame size={13} className="lux-menu__tag-icon" /> Thiouraye & Encens
                </Link>
                <Link
                  to="/produits?category=2"
                  onClick={() => setMenuOpen(false)}
                  className="lux-menu__tag"
                >
                  <Sparkles size={13} className="lux-menu__tag-icon" /> Encensoirs Dorés
                </Link>
                <Link
                  to="/produits?category=4"
                  onClick={() => setMenuOpen(false)}
                  className="lux-menu__tag"
                >
                  <Package size={13} className="lux-menu__tag-icon" /> Khamaré & Vétiver
                </Link>
              </div>
            </div>

            {/* Client Access Links */}
            <div className="lux-menu__quick-grid">
              <Link
                to="/panier"
                onClick={() => setMenuOpen(false)}
                className="lux-menu__quick-card"
              >
                <div className="lux-menu__quick-icon-wrap">
                  <ShoppingCart size={17} />
                  {count > 0 && <span className="lux-menu__quick-badge">{count}</span>}
                </div>
                <div className="lux-menu__quick-texts">
                  <span className="lux-menu__quick-label">Mon Panier</span>
                  <span className="lux-menu__quick-desc">{count} article{count > 1 ? 's' : ''}</span>
                </div>
              </Link>

              <Link
                to="/commande/suivi"
                onClick={() => setMenuOpen(false)}
                className="lux-menu__quick-card"
              >
                <div className="lux-menu__quick-icon-wrap">
                  <Package size={17} />
                </div>
                <div className="lux-menu__quick-texts">
                  <span className="lux-menu__quick-label">Suivi de Commande</span>
                  <span className="lux-menu__quick-desc">Consulter l'état</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Bottom VIP Actions Footer */}
          <div className="lux-menu__footer">
            <a
              href="https://wa.me/221771234567?text=Bonjour%20Maison%20Bushra%20Machallah,%20je%20souhaite%20un%20conseil"
              target="_blank"
              rel="noopener noreferrer"
              className="lux-menu__whatsapp-btn"
            >
              <MessageCircle size={19} className="lux-menu__wa-icon" />
              <span>Commander sur WhatsApp VIP</span>
              <ArrowRight size={16} />
            </a>

            <div className="lux-menu__footer-sub">
              <Link
                to="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="lux-menu__admin-link"
              >
                <ShieldCheck size={13} /> Administration
              </Link>
              <span className="lux-menu__contact-time">
                <Clock size={12} /> Service Client 7j/7 · Dakar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile ONLY (strictly hidden on desktop) */}
      <nav className="bottom-nav" aria-label="Menu mobile">
        {bottomNavLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`bottom-nav__link ${location.pathname === link.to ? 'bottom-nav__link--active' : ''}`}
          >
            <span className="bottom-nav__icon">
              {link.icon === 'home' && <Home size={20} strokeWidth={1.75} />}
              {link.icon === 'grid' && <LayoutGrid size={20} strokeWidth={1.75} />}
              {link.icon === 'cart' && <ShoppingCart size={20} strokeWidth={1.75} />}
              {link.icon === 'package' && <Package size={20} strokeWidth={1.75} />}
              {link.icon === 'user' && <User size={20} strokeWidth={1.75} />}
            </span>
            <span className="bottom-nav__label">{link.label}</span>
            {link.icon === 'cart' && count > 0 && (
              <span className="bottom-nav__badge">{count}</span>
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}


