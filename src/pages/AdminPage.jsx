import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Routes, Route, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { api, formatPrice, getImageUrl } from '../utils/api';
import { 
  LayoutDashboard, Package, ShoppingCart, Star, Tag, Globe, LogOut, Plus, 
  ArrowLeft, Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, Flame, ArrowRight, 
  Check, TrendingUp, Activity, Clock, Users, ArrowUpRight, ChevronRight, 
  Edit, Trash2, Layers, AlertCircle, RefreshCw
} from 'lucide-react';
import './AdminPage.css';
import TransparentLogo from '../components/TransparentLogo';
import IncenseCanvas3D from '../components/IncenseCanvas3D';
import { useAuth } from '../context/AuthContext';

// ── Admin Layout ──────────────────────────────────────────────
export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  function handleBack() {
    navigate(-1);
  }

  const navItems = [
    { to: '/admin', label: 'Tableau de bord', icon: <LayoutDashboard size={19} strokeWidth={1.7} />, end: true },
    { to: '/admin/produits', label: 'Produits', icon: <Package size={19} strokeWidth={1.7} /> },
    { to: '/admin/commandes', label: 'Commandes', icon: <ShoppingCart size={19} strokeWidth={1.7} /> },
    { to: '/admin/avis', label: 'Avis', icon: <Star size={19} strokeWidth={1.7} /> },
    { to: '/admin/categories', label: 'Catégories', icon: <Tag size={19} strokeWidth={1.7} /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-halo" aria-hidden="true" />
          <TransparentLogo src="/logo.png" alt="Bushra Machallah" width={52} height={52} className="admin-sidebar__logo-img" tolerance={60} />
          <div className="admin-sidebar__brand-block">
            <div className="admin-sidebar__brand">Bushra Machallah</div>
            <div className="admin-sidebar__role">
              <Sparkles size={11} className="text-amber" />
              <span>Administration</span>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav__section-title">Navigation Principale</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav__link ${isActive ? 'admin-nav__link--active' : ''}`}
            >
              <span className="admin-nav__icon">{item.icon}</span>
              <span className="admin-nav__text">{item.label}</span>
              <ChevronRight size={14} className="admin-nav__arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button onClick={handleLogout} className="admin-sidebar__logout">
            <LogOut size={17} strokeWidth={1.8} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="admin-right">
        <header className="admin-header">
          <div className="admin-header__left">
            {location.pathname === '/admin' ? (
              <div className="admin-header__brand-mini">
                <Link to="/admin" className="admin-header__logo" aria-label="Bushra Machallah">
                  <TransparentLogo src="/logo.png" alt="Bushra Machallah" width={32} height={32} tolerance={60} />
                </Link>
                <div className="admin-header__title-tag">
                  <span className="admin-header__live-dot" />
                  <span>Système Opérationnel</span>
                </div>
              </div>
            ) : (
              <button onClick={handleBack} className="admin-back-btn" aria-label="Retour">
                <ArrowLeft size={20} strokeWidth={1.8} />
                <span className="admin-back-btn__text">Retour</span>
              </button>
            )}
            <div className="admin-header__spacer" />
          </div>
          <div className="admin-header__profile">
            <Link to="/" className="admin-sidebar__btn" title="Voir la boutique en ligne" target="_blank" rel="noopener noreferrer">
              <Globe size={16} strokeWidth={1.8} />
              <span className="admin-sidebar__btn-label">Boutique</span>
            </Link>
            
            <div className="admin-sidebar__user">
              <div className="admin-sidebar__avatar-ring">
                <div className="admin-sidebar__avatar">A</div>
              </div>
              <div className="admin-sidebar__user-details">
                <div className="admin-sidebar__uname">Admin</div>
                <div className="admin-sidebar__uemail">admin@bushra.local</div>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-main">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="produits" element={<AdminProducts />} />
            <Route path="commandes" element={<AdminOrders />} />
            <Route path="avis" element={<AdminReviews />} />
            <Route path="categories" element={<AdminCategories />} />
          </Routes>
        </main>
      </div>

      <nav className="admin-mobile-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `admin-mobile-nav__link ${isActive ? 'admin-mobile-nav__link--active' : ''}`}
          >
            <span className="admin-mobile-nav__icon">{item.icon}</span>
            <span className="admin-mobile-nav__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadData() {
    setLoading(true);
    Promise.all([
      api.admin.getDashboard().then(r => setStats(r.data)).catch(console.error),
      api.admin.getOrders({ limit: 6 }).then(r => setOrders(r.data?.orders || [])).catch(console.error)
    ]).finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  const cards = stats ? [
    { 
      label: 'Commandes totales', 
      val: stats.totalOrders || 0, 
      icon: <ShoppingCart size={22} strokeWidth={1.8} />, 
      color: '#E8B86D',
      bgGlow: 'rgba(232, 184, 109, 0.15)',
      trend: '+3 nouvelles',
      sub: 'Toutes plateformes'
    },
    { 
      label: 'Revenus (FCFA)', 
      val: formatPrice(stats.totalRevenue || 0), 
      icon: <TrendingUp size={22} strokeWidth={1.8} />, 
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      trend: '+15.4% ce mois',
      sub: 'Chiffre d\'affaires net'
    },
    { 
      label: 'Produits actifs', 
      val: stats.totalProducts || 0, 
      icon: <Package size={22} strokeWidth={1.8} />, 
      color: '#38BDF8',
      bgGlow: 'rgba(56, 189, 248, 0.15)',
      trend: 'En stock',
      sub: 'Catalogue actif'
    },
    { 
      label: 'Commandes en attente', 
      val: stats.pendingOrders || 0, 
      icon: <Clock size={22} strokeWidth={1.8} />, 
      color: '#F59E0B',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      trend: 'À traiter',
      sub: 'Priorité expédition'
    },
  ] : [];

  return (
    <div className="admin-page">
      <div className="admin-page__top-banner">
        <div>
          <span className="admin-page__tag">
            <Sparkles size={13} className="text-amber" />
            <span>Aperçu en temps réel</span>
          </span>
          <h1 className="admin-page__title">Tableau de bord</h1>
        </div>
        
        <div className="admin-page__actions">
          <button onClick={loadData} className="btn btn--outline btn--sm admin-refresh-btn" title="Actualiser les données">
            <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
            <span>Actualiser</span>
          </button>
          <Link to="/admin/commandes" className="btn btn--primary btn--sm">
            <Plus size={15} strokeWidth={2} />
            <span>Créer commande</span>
          </Link>
        </div>
      </div>

      {stats ? (
        <div className="admin-stats">
          {cards.map((c, i) => (
            <motion.div 
              key={i} 
              className="admin-stat-card" 
              style={{ '--accent': c.color, '--glow': c.bgGlow }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="admin-stat-card__top">
                <div className="admin-stat-card__icon" style={{ color: c.color, background: c.bgGlow }}>
                  {c.icon}
                </div>
                <span className="admin-stat-card__trend" style={{ color: c.color }}>
                  {c.trend}
                </span>
              </div>
              <div className="admin-stat-card__val">{c.val}</div>
              <div className="admin-stat-card__label">{c.label}</div>
              <div className="admin-stat-card__sub">{c.sub}</div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="admin-loading">
          <RefreshCw size={24} className="spin-anim text-amber" />
          <span>Chargement des métriques…</span>
        </div>
      )}

      <div className="admin-section">
        <div className="admin-section__header">
          <div>
            <h2 className="heading admin-section__title">Dernières commandes</h2>
            <p className="admin-section__subtitle">Flux récent des commandes passées sur la boutique</p>
          </div>
          <Link to="/admin/commandes" className="admin-view-all-btn">
            <span>Voir tout</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Commande</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Détails</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const customerInitials = (o.customer_first_name?.[0] || '') + (o.customer_last_name?.[0] || '');
                return (
                  <tr key={o.id} className="admin-table__row">
                    <td>
                      <span className="admin-order-badge">
                        #{o.order_number}
                      </span>
                    </td>
                    <td>
                      <div className="admin-customer-cell">
                        <div className="admin-customer-avatar">
                          {customerInitials || 'C'}
                        </div>
                        <div className="admin-customer-info">
                          <span className="admin-customer-name">
                            {o.customer_first_name} {o.customer_last_name}
                          </span>
                          {o.customer_phone && (
                            <span className="admin-customer-phone">{o.customer_phone}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-price-cell">
                        {formatPrice(o.total_amount)}
                      </span>
                    </td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>
                      <span className="admin-date-cell">
                        {new Date(o.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to="/admin/commandes" className="admin-table-link">
                        <span>Gérer</span>
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-table__empty">
                    <AlertCircle size={20} className="text-amber" />
                    <span>Aucune commande enregistrée pour le moment</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Products ──────────────────────────────────────────────────
function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);

  const emptyForm = { name: '', description: '', price: '', compare_price: '', stock: '', category_id: '', is_featured: false };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchProducts();
    api.admin.getCategories().then(r => setCategories(r.data || [])).catch(console.error);
  }, []);

  function fetchProducts() {
    setLoading(true);
    api.admin.getProducts().then(r => setProducts(r.data?.products || r.data || [])).catch(console.error).finally(() => setLoading(false));
  }

  function openForm(product = null) {
    setEditing(product);
    setForm(product ? {
      name: product.name, description: product.description || '',
      price: product.price, compare_price: product.compare_price || '',
      stock: product.stock || '', category_id: product.category_id || '',
      is_featured: product.is_featured || false,
    } : emptyForm);
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    const data = { ...form, price: Number(form.price), compare_price: form.compare_price ? Number(form.compare_price) : null, stock: Number(form.stock) };
    if (editing) await api.admin.updateProduct(editing.id, data);
    else await api.admin.createProduct(data);
    setShowForm(false);
    fetchProducts();
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce produit ?')) return;
    await api.admin.deleteProduct(id);
    fetchProducts();
  }

  return (
    <div className="admin-page">
      <div className="admin-page__top-banner">
        <div>
          <div className="admin-page__tag">
            <Package size={13} className="text-amber" />
            <span>Inventaire & Références</span>
          </div>
          <h1 className="admin-page__title">Produits & Créations</h1>
          <p className="admin-section__subtitle" style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>
            Gestion des stocks, tarifs et mises en avant des créations olfactives
          </p>
        </div>
        <div className="admin-page__actions">
          <button className="admin-btn-luxury-gold" onClick={() => openForm()}>
            <Plus size={18} strokeWidth={2.2} />
            <span>Nouveau produit</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="heading">{editing ? 'Modifier' : 'Nouveau'} produit</h3>
              <button onClick={() => setShowForm(false)} className="admin-modal__close">×</button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="form-field"><label>Nom *</label><input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required /></div>
              <div className="form-field"><label>Description</label><textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} /></div>
              <div className="form-grid-2">
                <div className="form-field"><label>Prix (FCFA) *</label><input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} required /></div>
                <div className="form-field"><label>Prix barré</label><input type="number" value={form.compare_price} onChange={e => setForm(f => ({...f, compare_price: e.target.value}))} /></div>
              </div>
              <div className="form-grid-2">
                <div className="form-field"><label>Stock</label><input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} /></div>
                <div className="form-field"><label>Catégorie</label>
                  <select value={form.category_id} onChange={e => setForm(f => ({...f, category_id: e.target.value}))}>
                    <option value="">— Choisir —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <label className="admin-checkbox"><input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({...f, is_featured: e.target.checked}))} /> Produit mis en avant</label>
              <div className="admin-form__actions">
                <button type="button" className="btn btn--outline" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="btn btn--primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Produit</th><th>Prix</th><th>Stock</th><th>Catégorie</th><th>Mis en avant</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="admin-product-thumb">
                      {p.images?.[0]?.url ? <img src={getImageUrl(p.images[0].url)} alt={p.name} /> : <Package size={24} strokeWidth={1.5} />}
                    </div>
                    <strong>{p.name}</strong>
                  </div>
                </td>
                <td>{formatPrice(p.price)}</td>
                <td><span className={`admin-stock ${p.stock > 0 ? 'in' : 'out'}`}>{p.stock || 0}</span></td>
                <td style={{ color: 'var(--color-smoke)' }}>{p.category_name || '—'}</td>
                <td>{p.is_featured ? <Check size={16} strokeWidth={2} color="#4caf50" /> : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="admin-action-btn" onClick={() => openForm(p)}><Edit size={16} strokeWidth={1.5} /></button>
                    <button className="admin-action-btn admin-action-btn--danger" onClick={() => handleDelete(p.id)}><Trash2 size={16} strokeWidth={1.5} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Orders ────────────────────────────────────────────────────
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualForm, setManualForm] = useState({
    customerName: '',
    customerPhone: '',
    customerPhone2: '',
    customerAddress: '',
    customerCity: '',
    customerNote: '',
    items: [{ productId: '', quantity: 1 }],
  });

  useEffect(() => {
    api.admin.getOrders().then(r => setOrders(r.data?.orders || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (showManual) {
      setLoadingProducts(true);
      api.admin.getProducts({ limit: 100 }).then(r => {
        setProducts(r.data?.products || r.data || []);
      }).catch(console.error).finally(() => setLoadingProducts(false));
    }
  }, [showManual]);

  async function handleStatusUpdate() {
    if (!selected || !newStatus) return;
    await api.admin.updateOrderStatus(selected.id, newStatus, note);
    setSelected(null);
    api.admin.getOrders().then(r => setOrders(r.data?.orders || []));
  }

  function handleManualSubmit(e) {
    e.preventDefault();
    const validItems = manualForm.items.filter(i => i.productId && i.quantity > 0);
    if (!manualForm.customerName || !manualForm.customerPhone || !manualForm.customerAddress || validItems.length === 0) {
      alert('Veuillez remplir le nom, le téléphone, l\'adresse et au moins un produit.');
      return;
    }
    setManualSubmitting(true);
    const payload = {
      customerName: manualForm.customerName,
      customerPhone: manualForm.customerPhone,
      customerPhone2: manualForm.customerPhone2,
      customerAddress: manualForm.customerAddress,
      customerCity: manualForm.customerCity,
      customerNote: manualForm.customerNote,
      items: validItems.map(i => ({ productId: Number(i.productId), quantity: Number(i.quantity) })),
    };
    api.admin.createOrder(payload)
      .then(() => {
        setShowManual(false);
        setManualForm({ customerName: '', customerPhone: '', customerPhone2: '', customerAddress: '', customerCity: '', customerNote: '', items: [{ productId: '', quantity: 1 }] });
        api.admin.getOrders().then(r => setOrders(r.data?.orders || []));
      })
      .catch(err => alert(err.message || 'Erreur lors de la création de la commande'))
      .finally(() => setManualSubmitting(false));
  }

  function addItem() {
    setManualForm(f => ({ ...f, items: [...f.items, { productId: '', quantity: 1 }] }));
  }

  function removeItem(idx) {
    setManualForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }

  function updateItem(idx, field, value) {
    setManualForm(f => ({
      ...f,
      items: f.items.map((item, i) => i === idx ? { ...item, [field]: value } : item),
    }));
  }

  return (
    <div className="admin-page">
      <div className="admin-page__top-banner">
        <div>
          <div className="admin-page__tag">
            <ShoppingCart size={13} className="text-amber" />
            <span>Flux de Ventes</span>
          </div>
          <h1 className="admin-page__title">Commandes & Expéditions</h1>
          <p className="admin-section__subtitle" style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>
            Suivi en temps réel des livraisons, paiements et états de préparation
          </p>
        </div>
        <div className="admin-page__actions">
          <button className="admin-btn-luxury-gold" onClick={() => setShowManual(true)}>
            <Plus size={18} strokeWidth={2.2} />
            <span>Nouvelle commande</span>
          </button>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>N°</th><th>Client</th><th>Téléphone</th><th>Montant</th><th>Statut</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td><strong>#{o.order_number}</strong></td>
                <td>{o.customer_first_name} {o.customer_last_name}</td>
                <td style={{ color: 'var(--color-smoke)' }}>{o.customer_phone}</td>
                <td>{formatPrice(o.total_amount)}</td>
                <td><StatusBadge status={o.status} /></td>
                <td style={{ color: 'var(--color-smoke)', fontSize: '0.82rem' }}>{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <button className="admin-action-btn" onClick={() => { setSelected(o); setNewStatus(o.status); setNote(''); }}>
                    Gérer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="heading">Commande #{selected.order_number}</h3>
              <button onClick={() => setSelected(null)} className="admin-modal__close">×</button>
            </div>
            <div className="admin-form">
              <div className="form-field">
                <label>Nouveau statut</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Note admin (optionnel)</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Message pour le client…" />
              </div>
              <div className="admin-form__actions">
                <button className="btn btn--outline" onClick={() => setSelected(null)}>Annuler</button>
                <button className="btn btn--primary" onClick={handleStatusUpdate}>Mettre à jour</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showManual && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal--wide">
            <div className="admin-modal__header">
              <h3 className="heading">Nouvelle commande manuelle</h3>
              <button onClick={() => setShowManual(false)} className="admin-modal__close">×</button>
            </div>
            <form onSubmit={handleManualSubmit} className="admin-form">
              <div className="admin-form__section">
                <div className="admin-form__section-title">Informations client</div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Nom complet *</label>
                    <input value={manualForm.customerName} onChange={e => setManualForm(f => ({...f, customerName: e.target.value}))} required />
                  </div>
                  <div className="form-field">
                    <label>Téléphone *</label>
                    <input value={manualForm.customerPhone} onChange={e => setManualForm(f => ({...f, customerPhone: e.target.value}))} required />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Téléphone 2 (optionnel)</label>
                    <input value={manualForm.customerPhone2} onChange={e => setManualForm(f => ({...f, customerPhone2: e.target.value}))} />
                  </div>
                  <div className="form-field">
                    <label>Ville (optionnel)</label>
                    <input value={manualForm.customerCity} onChange={e => setManualForm(f => ({...f, customerCity: e.target.value}))} />
                  </div>
                </div>
                <div className="form-field">
                  <label>Adresse *</label>
                  <input value={manualForm.customerAddress} onChange={e => setManualForm(f => ({...f, customerAddress: e.target.value}))} required />
                </div>
                <div className="form-field">
                  <label>Note (optionnel)</label>
                  <textarea value={manualForm.customerNote} onChange={e => setManualForm(f => ({...f, customerNote: e.target.value}))} rows={2} />
                </div>
              </div>

              <div className="admin-form__section">
                <div className="admin-form__section-title">Produits</div>
                {manualForm.items.map((item, idx) => (
                  <div key={idx} className="admin-form__item-row">
                    <div className="form-field" style={{ flex: 2 }}>
                      <label>Produit</label>
                      <select value={item.productId} onChange={e => updateItem(idx, 'productId', e.target.value)} required>
                        <option value="">— Choisir —</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({formatPrice(p.base_price || p.price)})</option>)}
                      </select>
                    </div>
                    <div className="form-field" style={{ flex: 1 }}>
                      <label>Quantité</label>
                      <input type="number" min={1} value={item.quantity} onChange={e => updateItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))} required />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button type="button" className="admin-action-btn admin-action-btn--danger" onClick={() => removeItem(idx)} disabled={manualForm.items.length <= 1}>×</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn--outline btn--sm" onClick={addItem}>+ Ajouter un produit</button>
              </div>

              <div className="admin-form__actions">
                <button type="button" className="btn btn--outline" onClick={() => setShowManual(false)} disabled={manualSubmitting}>Annuler</button>
                <button type="submit" className="btn btn--primary" disabled={manualSubmitting}>
                  {manualSubmitting ? 'Création…' : 'Créer la commande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Reviews ───────────────────────────────────────────────────
function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    api.admin.getReviews().then(r => setReviews(r.data || [])).catch(console.error);
  }, []);

  async function approve(id) {
    await api.admin.approveReview(id);
    setReviews(r => r.map(rev => rev.id === id ? { ...rev, is_approved: true } : rev));
  }

  async function del(id) {
    if (!confirm('Supprimer cet avis ?')) return;
    await api.admin.deleteReview(id);
    setReviews(r => r.filter(rev => rev.id !== id));
  }

  return (
    <div className="admin-page">
      <div className="admin-page__top-banner">
        <div>
          <div className="admin-page__tag">
            <Star size={13} className="text-amber" />
            <span>Témoignages & Notations</span>
          </div>
          <h1 className="admin-page__title">Avis Clients</h1>
          <p className="admin-section__subtitle" style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>
            Modération et validation des retours d'expérience sur vos créations
          </p>
        </div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Auteur</th><th>Produit</th><th>Note</th><th>Commentaire</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id}>
                <td><strong>{r.author_name}</strong></td>
                <td style={{ color: 'var(--color-smoke)' }}>{r.product_name || '—'}</td>
                <td>{'★'.repeat(r.rating)}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment}</td>
                <td>{r.is_approved ? <span style={{ color: '#4caf50' }}>Approuvé</span> : <span style={{ color: '#ff9800' }}>En attente</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!r.is_approved && <button className="admin-action-btn" onClick={() => approve(r.id)}><Check size={16} strokeWidth={2} color="#4caf50" /></button>}
                    <button className="admin-action-btn admin-action-btn--danger" onClick={() => del(r.id)}><Trash2 size={16} strokeWidth={1.5} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Categories ────────────────────────────────────────────────
function getCategoryIcon(name = '') {
  const n = name.toLowerCase();
  if (n.includes('thiouraye') || n.includes('encens') || n.includes('flamme') || n.includes('braise')) {
    return <Flame size={24} className="text-amber" strokeWidth={1.8} />;
  }
  if (n.includes('encensoir') || n.includes('artisan') || n.includes('laiton') || n.includes('royal')) {
    return <Sparkles size={24} className="text-amber" strokeWidth={1.8} />;
  }
  if (n.includes('spray') || n.includes('senteur') || n.includes('brume') || n.includes('huile') || n.includes('parfum')) {
    return <Droplets size={24} className="text-amber" strokeWidth={1.8} />;
  }
  if (n.includes('vétiver') || n.includes('racine') || n.includes('khamar') || n.includes('gowé') || n.includes('bois')) {
    return <Layers size={24} className="text-amber" strokeWidth={1.8} />;
  }
  return <Tag size={24} className="text-amber" strokeWidth={1.8} />;
}

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    setLoading(true);
    api.admin.getCategories()
      .then(r => setCategories(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  function openCreate() {
    setEditingCategory(null);
    setForm({ name: '', description: '' });
    setShowForm(true);
  }

  function openEdit(cat) {
    setEditingCategory(cat);
    setForm({ name: cat.name || '', description: cat.description || '' });
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      if (editingCategory) {
        await api.admin.updateCategory(editingCategory.id, form);
      } else {
        await api.admin.createCategory(form);
      }
      setShowForm(false);
      setForm({ name: '', description: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      alert(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  }

  const totalProductsCount = categories.reduce((acc, c) => acc + (Number(c.product_count) || 0), 0);

  return (
    <div className="admin-page">
      {/* Top Banner */}
      <div className="admin-page__top-banner">
        <div>
          <div className="admin-page__tag">
            <Sparkles size={13} className="text-amber" />
            <span>Architecture du Catalogue</span>
          </div>
          <h1 className="admin-page__title">Catégories & Collections</h1>
          <p className="admin-section__subtitle" style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>
            Hiérarchisation des essences, encensoirs royaux et trésors olfactifs du terroir
          </p>
        </div>

        <div className="admin-page__actions">
          <button className="admin-btn-luxury-gold" onClick={openCreate}>
            <Plus size={18} strokeWidth={2.2} />
            <span>Nouvelle catégorie</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="admin-cat-summary-bar">
        <div className="admin-cat-summary-item">
          <span className="admin-cat-summary-label">Collections Actives</span>
          <span className="admin-cat-summary-val">{categories.length} Familles</span>
        </div>
        <div className="admin-cat-summary-divider" />
        <div className="admin-cat-summary-item">
          <span className="admin-cat-summary-label">Total Références</span>
          <span className="admin-cat-summary-val">{totalProductsCount} Produits rattachés</span>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {showForm && (
        <div className="admin-modal-overlay">
          <motion.div 
            className="admin-modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="admin-modal__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div className="admin-modal__icon-badge">
                  {editingCategory ? <Edit size={18} className="text-amber" /> : <Tag size={18} className="text-amber" />}
                </div>
                <div>
                  <h3 className="heading" style={{ fontSize: '1.2rem', margin: 0, color: '#FFF' }}>
                    {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie d\'exception'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#8C7868' }}>
                    Configurez le titre et les descriptions olfactives
                  </div>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="admin-modal__close" aria-label="Fermer">×</button>
            </div>

            <form onSubmit={handleSave} className="admin-form">
              <div className="form-field">
                <label>Nom de la catégorie *</label>
                <input 
                  value={form.name} 
                  onChange={e => setForm(f => ({...f, name: e.target.value}))} 
                  placeholder="Ex: Thiouraye & Encens Précieux"
                  required 
                  autoFocus
                />
              </div>

              <div className="form-field">
                <label>Description olfactive & artisanale</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm(f => ({...f, description: e.target.value}))} 
                  placeholder="Explication sensorielle, composants clés et notes de coeur..."
                  rows={3} 
                />
              </div>

              <div className="admin-form__actions">
                <button type="button" className="btn btn--outline" onClick={() => setShowForm(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary admin-btn-gold" disabled={submitting}>
                  {submitting ? 'Enregistrement...' : editingCategory ? 'Mettre à jour' : 'Créer la collection'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Categories Cards Grid */}
      {loading ? (
        <div className="admin-loading">
          <RefreshCw size={22} className="spin-anim text-amber" />
          <span>Chargement des collections olfactives...</span>
        </div>
      ) : (
        <div className="admin-categories-grid">
          {categories.map((c, idx) => (
            <motion.div 
              key={c.id || idx} 
              className="admin-category-lux-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
            >
              {/* Top Row: Icon + Count Pill */}
              <div className="admin-cat-card__header">
                <div className="admin-cat-card__icon-wrap">
                  <div className="admin-cat-card__icon-halo" />
                  {getCategoryIcon(c.name)}
                </div>

                <div className="admin-cat-card__meta">
                  <span className="admin-cat-card__count-badge">
                    <Package size={12} strokeWidth={2} />
                    <span>{c.product_count || 0} {c.product_count === 1 ? 'PRODUIT' : 'PRODUITS'}</span>
                  </span>
                  
                  <button 
                    className="admin-cat-card__edit-btn" 
                    onClick={() => openEdit(c)}
                    title="Modifier la catégorie"
                    aria-label={`Modifier ${c.name}`}
                  >
                    <Edit size={14} />
                    <span>Modifier</span>
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="admin-cat-card__body">
                <h3 className="admin-cat-card__title">{c.name}</h3>
                <p className="admin-cat-card__desc">
                  {c.description || "Aucune note descriptive n'a encore été ajoutée pour cette collection."}
                </p>
              </div>

              {/* Card Footer: Explore Products Link */}
              <div className="admin-cat-card__footer">
                <Link to="/admin/produits" className="admin-cat-card__action-link">
                  <span>Gérer les produits de cette collection</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}

          {categories.length === 0 && (
            <div className="admin-categories-empty">
              <Tag size={36} className="text-amber" strokeWidth={1.5} />
              <div className="admin-categories-empty__title">Aucune catégorie répertoriée</div>
              <p className="admin-categories-empty__text">
                Commencez par créer votre première famille de parfums et accessoires.
              </p>
              <button className="admin-btn-luxury-gold" onClick={openCreate} style={{ marginTop: '1rem' }}>
                <Plus size={18} strokeWidth={2.2} />
                <span>Créer la première catégorie</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Admin Login ───────────────────────────────────────────────
export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  }

  function handleFillDemo() {
    setEmail('admin@bushra.local');
    setPassword('admin123');
  }

  return (
    <div className="admin-login">
      {/* 3D Incense embers and golden floating particles */}
      <IncenseCanvas3D count={80} color="#E8B86D" className="admin-login__3d" />

      {/* Atmospheric radial glowing auroras */}
      <div className="admin-login__aurora admin-login__aurora--1" aria-hidden="true" />
      <div className="admin-login__aurora admin-login__aurora--2" aria-hidden="true" />

      {/* Scent mist rings */}
      <div className="admin-login__smoke-ring" aria-hidden="true" />

      <motion.div
        className="admin-login__card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Shimmering border glow effect */}
        <div className="admin-login__card-glow" aria-hidden="true" />

        {/* Top brand header */}
        <div className="admin-login__header">
          <div className="admin-login__logo-wrapper">
            <div className="admin-login__logo-halo" aria-hidden="true" />
            <TransparentLogo
              src="/logo.png"
              alt="Bushra Machallah"
              width={76}
              height={76}
              className="admin-login__logo-img"
              tolerance={60}
            />
          </div>

          <div className="admin-login__brand-info">
            <span className="admin-login__badge">
              <Sparkles size={13} className="text-amber" />
              <span>Maison d'Artisanat & Senteurs Nobles</span>
            </span>
            <h1 className="admin-login__title">Bushra Machallah</h1>
            <p className="admin-login__subtitle">Espace Privé & Administration Générale</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="admin-login__form">
          <div className="admin-login__field-group">
            <label className="admin-login__label" htmlFor="admin-email">
              <Mail size={15} className="admin-login__label-icon" />
              <span>Adresse Email</span>
            </label>
            <div className="admin-login__input-wrapper">
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ex: admin@bushra.local"
                required
                autoFocus
                className="admin-login__input"
              />
            </div>
          </div>

          <div className="admin-login__field-group">
            <label className="admin-login__label" htmlFor="admin-password">
              <Lock size={15} className="admin-login__label-icon" />
              <span>Mot de passe</span>
            </label>
            <div className="admin-login__input-wrapper">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="admin-login__input admin-login__input--password"
              />
              <button
                type="button"
                className="admin-login__toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              className="admin-login__error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            className="admin-login__btn"
            disabled={loading}
          >
            <span className="admin-login__btn-shine" aria-hidden="true" />
            {loading ? (
              <span className="admin-login__btn-content">
                <span className="admin-login__spinner" />
                <span>Authentification en cours…</span>
              </span>
            ) : (
              <span className="admin-login__btn-content">
                <ShieldCheck size={18} />
                <span>Accéder au Panneau d'Administration</span>
                <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        {/* Demo Shortcut & Security footer */}
        <div className="admin-login__footer">
          <button
            type="button"
            onClick={handleFillDemo}
            className="admin-login__demo-btn"
          >
            <Flame size={13} />
            <span>Remplir les identifiants de démonstration</span>
          </button>

          <Link to="/" className="admin-login__back">
            <ArrowLeft size={15} />
            <span>Retour à la Boutique Principale</span>
          </Link>

          <div className="admin-login__security">
            <ShieldCheck size={13} />
            <span>Connexion Chiffrée & Sécurisée SSL · Dakar, Sénégal</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Shared: Status Badge ──────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending: { label: 'En attente', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', dot: '#F59E0B' },
    confirmed: { label: 'Confirmée', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', dot: '#10B981' },
    processing: { label: 'Préparation', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.3)', dot: '#38BDF8' },
    shipped: { label: 'Expédiée', color: '#C084FC', bg: 'rgba(192, 132, 252, 0.12)', border: 'rgba(192, 132, 252, 0.3)', dot: '#C084FC' },
    delivered: { label: 'Livrée', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', dot: '#10B981' },
    cancelled: { label: 'Annulée', color: '#F87171', bg: 'rgba(248, 113, 113, 0.12)', border: 'rgba(248, 113, 113, 0.3)', dot: '#F87171' },
  };
  const s = map[status] || { label: status, color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.1)', border: 'rgba(156, 163, 175, 0.2)', dot: '#9CA3AF' };
  return (
    <span className="admin-status-badge" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      fontSize: '0.74rem',
      fontWeight: 600,
      padding: '0.28rem 0.75rem',
      borderRadius: '50px',
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap'
    }}>
      <span style={{ 
        width: '6px', 
        height: '6px', 
        borderRadius: '50%', 
        background: s.dot, 
        boxShadow: `0 0 6px ${s.dot}`,
        flexShrink: 0 
      }} />
      {s.label}
    </span>
  );
}
