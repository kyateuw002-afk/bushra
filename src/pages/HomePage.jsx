import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { api, formatPrice, getImageUrl } from '../utils/api';
import { ArrowRight, Check, Search, ShoppingCart, Package, Sparkles, MessageCircle, Flame, FlaskConical, Gift, ShieldCheck, Truck, Clock, Heart, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import TransparentLogo from '../components/TransparentLogo';
import IncenseCanvas3D from '../components/IncenseCanvas3D';
import './HomePage.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Smoke particle SVG (ambient atmosphere) ─────────────── */
function SmokeParticle({ style }) {
  return (
    <div className="smoke-particle" style={style}>
      <svg viewBox="0 0 40 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 110 Q28 90 18 70 Q8 50 22 30 Q30 15 20 0"
          stroke="rgba(232,184,109,0.18)" strokeWidth="2" fill="none"
          strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/* ── Counter animation ────────────────────────────────────── */
function AnimatedCounter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.max(1, Math.ceil(to / 45));
      const t = setInterval(() => {
        start += step;
        if (start >= to) { setVal(to); clearInterval(t); }
        else setVal(start);
      }, 25);
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref} className="stats__val-text">
      <span className="stats__digits">{val.toLocaleString('fr-FR')}</span>
      {suffix && <span className="stats__suffix">{suffix}</span>}
    </span>
  );
}

const DEFAULT_FEATURED_PRODUCTS = [
  { id: 1, name: 'Thiouraye Gowé Royal Secret', category_name: 'Thiouraye & Encens', price: 6500, compare_price: 8500, is_featured: true, image_url: '/gowe-thiouray.png' },
  { id: 2, name: 'Encensoir Mabkhara Prestige Doré', category_name: 'Encensoirs', price: 28000, compare_price: 35000, is_featured: true, image_url: '/encensoir1.png' },
  { id: 3, name: 'Mabkhara Étoile Ciselée', category_name: 'Encensoirs', price: 22000, image_url: '/encensoir2.png' },
  { id: 4, name: 'Mabkhara Impériale Noir & Or', category_name: 'Encensoirs', price: 19500, image_url: '/encensoir3.png' },
  { id: 5, name: 'Mabkhara Coupe Ivoire & Or', category_name: 'Encensoirs', price: 24000, image_url: '/encensoir4.png' },
  { id: 6, name: 'Brume Royale Nuage de Coton', category_name: 'Senteurs & Sprays', price: 5000, is_featured: true, image_url: '/sprays.png' },
  { id: 7, name: 'Fagot de Khamaré Vétiver Pur', category_name: 'Vétiver & Khamaré', price: 3500, is_featured: true, image_url: '/paniers-vetiver.png' },
  { id: 8, name: 'Mabkhara Majesté Sculptée', category_name: 'Encensoirs', price: 32000, image_url: '/encensoir5.png' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState(DEFAULT_FEATURED_PRODUCTS);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [activeRitual, setActiveRitual] = useState(0);

  const heroSlides = [
    {
      tag: 'Maison de Haute Parfumerie Sénégalaise',
      title: "L'Art du Thiouraye\n& de l'Encens Royal",
      subtitle: "Des senteurs envoûtantes façonnées à la main avec passion et authenticité au cœur du Sénégal. Chaque volute de fumée, une invitation au raffinement absolu.",
      cta: 'Découvrir la collection',
      ctaTo: '/produits',
      cta2: 'Tous nos encensoirs',
      cta2To: '/produits?category=2',
      image: '/bacground-image.png',
      badge: 'Collection Signature Bushra',
    },
    {
      tag: 'Orfèvrerie & Pièces d’Exception',
      title: "Encensoirs Ciselés\n& Mabkharas d'Art",
      subtitle: "Sublimez votre intérieur avec des encensoirs raffinés en laiton précieux, céramique royale et terre cuite. Des pièces artisanales créées pour durer.",
      cta: 'Explorer les encensoirs',
      ctaTo: '/produits?category=2',
      cta2: 'Découvrir le Thiouraye',
      cta2To: '/produits?category=1',
      image: '/bacground-image.png',
      badge: 'Artisanat d’Art du Terroir',
    },
    {
      tag: 'Bien-Être Végétal & Senteurs',
      title: "Khamaré Pur\n& Brumes de Musc",
      subtitle: "Racines de vétiver sélectionnées avec rigueur, gowé parfumé et brumes d'ambiance longue durée pour enchanter votre foyer.",
      cta: 'Commander nos senteurs',
      ctaTo: '/produits',
      cta2: 'En savoir plus',
      cta2To: '/a-propos',
      image: '/bacground-image.png',
      badge: '100% Naturel & Authentique',
    },
  ];

  const rituals = [
    {
      title: "Le Rituel du Thiouraye",
      tag: "Tradition & Séduction",
      desc: "Allumez délicatement une pastille de charbon incandescent dans votre encensoir Mabkhara. Déposez une pincée de notre Thiouraye Gowé Royal sur la braise : laissez les volutes aromatiques imprégner vos rideaux, coussins et vêtements d'un sillage voluptueux et apaisant.",
      advice: "Idéal le soir après le coucher du soleil pour créer une ambiance chaleureuse et intime.",
      icon: <Flame size={24} className="text-amber-400" />
    },
    {
      title: "La Vertu du Khamaré (Vétiver)",
      tag: "Pureté & Énergie",
      desc: "Les racines de vétiver (Khamaré) sont récoltées et séchées selon des méthodes ancestrales. Utilisées en décoction tiède ou disposées en bouquets délicats, elles purifient l'eau, soulagent les tensions féminines et diffusent une senteur boisée inimitable.",
      advice: "Placez les fagots de vétiver dans une carafe d'eau ou sous l'oreiller pour un sommeil profond.",
      icon: <Sparkles size={24} className="text-amber-400" />
    },
    {
      title: "Les Brumes d'Ambiance & Huiles",
      tag: "Fraîcheur & Élégance",
      desc: "Vaporisez nos brumes aux extraits de musc blanc, vanille d'Orient et ambre précieux sur le linge de maison ou dans l'air ambiant. Deux pulvérisations suffisent pour transformer l'atmosphère de votre demeure pendant des heures.",
      advice: "À vaporiser le matin pour énergiser votre intérieur ou avant de recevoir des invités d'honneur.",
      icon: <FlaskConical size={24} className="text-amber-400" />
    }
  ];

  useEffect(() => {
    Promise.all([
      api.getProducts({ featured: true, limit: 8 }),
      api.getCategories(),
    ])
      .then(([prod, cats]) => {
        const list = prod.data?.products || prod.data;
        if (Array.isArray(list) && list.length > 0) {
          setFeaturedProducts(list);
        }
        if (Array.isArray(cats.data) && cats.data.length > 0) {
          setCategories(cats.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(s => (s + 1) % heroSlides.length), 7000);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  // GSAP ScrollTrigger orchestrations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax on hero background image
      gsap.to('.hero__bg-image', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Categories cards luxury stagger
      gsap.fromTo(
        '.cat-card',
        { opacity: 0, y: 35, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.categories__grid',
            start: 'top 85%',
          },
        }
      );

      // Story image parallax
      gsap.to('.story__photo', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.story',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Process steps stagger
      gsap.fromTo(
        '.process__step',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.process__steps',
            start: 'top 85%',
          },
        }
      );

      // Testimonials cards stagger
      gsap.fromTo(
        '.testimonial-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.testimonials__grid',
            start: 'top 85%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const slide = heroSlides[heroSlide];

  return (
    <main className="home">

      {/* ══════════════════════════════════════
          HERO — Plein écran luxueux
          ══════════════════════════════════════ */}
      <section className="hero">
        {/* Real background image with luxury vignette */}
        <div
          className="hero__bg-image"
          style={{ backgroundImage: `url(${slide.image})` }}
          aria-hidden
        />
        {/* Soft luxury dark gradient overlay */}
        <div className="hero__overlay" aria-hidden />

        {/* Three.js 3D Golden Embers & Incense Mist */}
        <IncenseCanvas3D count={90} color="#E8B86D" />

        {/* Ambient smoke animations */}
        <div className="hero__smoke" aria-hidden>
          {[0, 1, 2, 3].map(i => (
            <SmokeParticle key={i} style={{
              left: `${12 + i * 24}%`,
              bottom: '25%',
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${5 + i * 0.9}s`,
            }} />
          ))}
        </div>

        {/* Decorative subtle gold vertical lines */}
        <div className="hero__lines" aria-hidden>
          <div className="hero__line hero__line--left" />
          <div className="hero__line hero__line--right" />
        </div>

        {/* Content Box */}
        <div className="container hero__content">
          <div className="hero__inner" key={heroSlide}>
            {/* Tag pill */}
            <div className="hero__tag animate-fadeUp">
              <span className="hero__tag-dot" />
              <span className="hero__tag-text">{slide.tag}</span>
              <span className="hero__tag-badge">✦ {slide.badge}</span>
            </div>

            {/* Giant Title */}
            <h1 className="hero__title animate-fadeUp delay-100">
              {slide.title.split('\n').map((line, i) => (
                <span key={i} className="hero__title-line">
                  {i === 1 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="hero__subtitle body-lg animate-fadeUp delay-200">
              {slide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="hero__ctas animate-fadeUp delay-300">
              <Link to={slide.ctaTo} className="btn btn--primary hero__cta-primary" id="hero-cta-primary">
                <span>{slide.cta}</span>
                <ArrowRight size={17} strokeWidth={2.2} />
              </Link>
              <Link to={slide.cta2To} className="btn btn--outline hero__cta-secondary" id="hero-cta-secondary">
                {slide.cta2}
              </Link>
            </div>

            {/* Slide Navigation Controls */}
            <div className="hero__controls animate-fadeUp delay-400">
              <div className="hero__dots">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    className={`hero__dot ${i === heroSlide ? 'hero__dot--active' : ''}`}
                    onClick={() => setHeroSlide(i)}
                    aria-label={`Aller à la diapositive ${i + 1}`}
                  />
                ))}
              </div>
              <div className="hero__arrows">
                <button
                  className="hero__arrow"
                  onClick={() => setHeroSlide(s => (s - 1 + heroSlides.length) % heroSlides.length)}
                  aria-label="Diapositive précédente"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="hero__arrow"
                  onClick={() => setHeroSlide(s => (s + 1) % heroSlides.length)}
                  aria-label="Diapositive suivante"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Floating Trust Card */}
          <div className="hero__float-card animate-fadeUp delay-300">
            <div className="hero__float-icon">
              <TransparentLogo src="/logo.png" alt="Bushra Machallah" width={42} height={42} tolerance={60} />
            </div>
            <div className="hero__float-content">
              <div className="hero__float-label">Maison Bushra Machallah</div>
              <div className="hero__float-val">Livraison Express Dakar & Régions</div>
              <div className="hero__float-sub">Paiement à la livraison · Wave · OM</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS & TRUST HIGHLIGHTS — PRESTIGE SHOWCASE
          ══════════════════════════════════════ */}
      <section className="stats">
        <div className="stats__ambient-glow" aria-hidden />
        <div className="container">
          <div className="stats__grid">
            {[
              {
                icon: <Award size={24} strokeWidth={1.8} />,
                n: 100,
                s: '%',
                badge: 'Origine Pure',
                label: 'Artisanal & Naturel',
                sub: 'Compositions authentiques du terroir'
              },
              {
                icon: <Heart size={24} strokeWidth={1.8} />,
                n: 2500,
                s: '+',
                badge: 'Avis 5 Étoiles',
                label: 'Clients Comblés',
                sub: 'Au Sénégal & dans la Diaspora'
              },
              {
                icon: <Truck size={24} strokeWidth={1.8} />,
                n: 24,
                s: 'h',
                badge: 'Service Express',
                label: 'Livraison Rapide',
                sub: 'À Dakar & Envois en Régions'
              },
              {
                icon: <ShieldCheck size={24} strokeWidth={1.8} />,
                n: 10,
                s: ' ans',
                badge: 'Maison d’Art',
                label: 'Savoir-Faire',
                sub: 'Tradition de Haute Parfumerie'
              },
            ].map((stat, i) => (
              <div key={i} className="stats__card">
                <div className="stats__card-glow" aria-hidden />
                <div className="stats__badge">
                  <span>✦</span> {stat.badge}
                </div>
                <div className="stats__icon-wrap">
                  <div className="stats__icon-halo" />
                  <div className="stats__icon-inner">
                    {stat.icon}
                  </div>
                </div>
                <div className="stats__number">
                  <AnimatedCounter to={stat.n} suffix={stat.s} />
                </div>
                <div className="stats__label">{stat.label}</div>
                <div className="stats__sublabel">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES GRID / UNIVERS
          ══════════════════════════════════════ */}
      <section className="categories section" id="collections-section">
        <div className="container">
          <header className="section-header">
            <span className="label" style={{ color: 'var(--color-gold)' }}>Nos Univers Précieux</span>
            <h2 className="display-md section-header__title">Explorez nos Collections Royales</h2>
            <div className="divider" />
            <p className="section-header__subtitle">
              Du Thiouraye le plus suave aux Mabkharas les plus raffinés, plongez dans l'élégance olfactive sénégalaise.
            </p>
          </header>

          <div className="categories__grid">
            {[
              {
                id: 1,
                name: 'Thiouraye & Encens',
                desc: "Gowé macéré, bakhour de prestige et résines sacrées aux senteurs aphrodisiaques.",
                img: '/gowe-thiouray.png',
                tag: 'Incontournable',
                link: '/produits?category=1'
              },
              {
                id: 2,
                name: 'Encensoirs d\'Art',
                desc: "Mabkharas en laiton doré, pièces en céramique ciselée et terre cuite traditionnelle.",
                img: '/encensoir1.png',
                tag: 'Pièces d\'Artisan',
                link: '/produits?category=2'
              },
              {
                id: 3,
                name: 'Senteurs & Sprays',
                desc: "Brumes d'intérieur musquées, extraits purs et huiles concentrées longue durée.",
                img: '/sprays.png',
                tag: 'Longue Tenue',
                link: '/produits?category=3'
              },
              {
                id: 4,
                name: 'Vétiver & Khamaré',
                desc: "Racines de vétiver pures, gowé brut et trésors bienfaisants de la flore sénégalaise.",
                img: '/paniers-vetiver.png',
                tag: '100% Terroir',
                link: '/produits?category=4'
              },
            ].map((cat, i) => (
              <Link key={cat.id} to={cat.link} className={`cat-card cat-card--${i}`}>
                <div className="cat-card__inner">
                  <div className="cat-card__tag">{cat.tag}</div>
                  <div className="cat-card__image-wrap">
                    <img src={cat.img} alt={cat.name} className="cat-card__img" loading="lazy" />
                  </div>
                  <div className="cat-card__content">
                    <h3 className="cat-card__name heading">{cat.name}</h3>
                    <p className="cat-card__desc">{cat.desc}</p>
                    <span className="cat-card__cta">
                      Découvrir l'univers
                      <ArrowRight size={15} strokeWidth={2.2} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED PRODUCTS
          ══════════════════════════════════════ */}
      <section className="featured section">
        <div className="container">
          <header className="section-header section-header--row">
            <div>
              <span className="label" style={{ color: 'var(--color-gold)' }}>Sélection d'Exception</span>
              <h2 className="display-md section-header__title">Nos Créations les Plus Prisées</h2>
              <div className="divider divider--left" />
            </div>
            <Link to="/produits" className="btn btn--ghost">
              Voir tout le catalogue <ArrowRight size={15} />
            </Link>
          </header>

          {loading ? (
            <div className="products-grid products-grid--skeleton">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img" />
                  <div className="skeleton-text" />
                  <div className="skeleton-text skeleton-text--short" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          ) : (
            <div className="products-grid">
              {[
                { id: 1, name: 'Thiouraye Gowé Royal Secret', category_name: 'Thiouraye & Encens', price: 6500, compare_price: 8500, is_featured: true, image_url: '/gowe-thiouray.png' },
                { id: 2, name: 'Encensoir Mabkhara Prestige Doré', category_name: 'Encensoirs', price: 28000, compare_price: 35000, is_featured: true, image_url: '/encensoir1.png' },
                { id: 3, name: 'Mabkhara Étoile Ciselée', category_name: 'Encensoirs', price: 22000, image_url: '/encensoir2.png' },
                { id: 4, name: 'Mabkhara Impériale Noir & Or', category_name: 'Encensoirs', price: 19500, image_url: '/encensoir3.png' },
                { id: 5, name: 'Mabkhara Coupe Ivoire & Or', category_name: 'Encensoirs', price: 24000, image_url: '/encensoir4.png' },
                { id: 6, name: 'Brume Royale Nuage de Coton', category_name: 'Senteurs & Sprays', price: 5000, is_featured: true, image_url: '/sprays.png' },
                { id: 7, name: 'Fagot de Khamaré Vétiver Pur', category_name: 'Vétiver & Khamaré', price: 3500, is_featured: true, image_url: '/paniers-vetiver.png' },
                { id: 8, name: 'Mabkhara Majesté Sculptée', category_name: 'Encensoirs', price: 32000, image_url: '/encensoir5.png' },
              ].map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          RITUALS & SENSORY ART
          ══════════════════════════════════════ */}
      <section className="rituals section">
        <div className="container">
          <header className="section-header">
            <span className="label" style={{ color: 'var(--color-gold)' }}>Art de Vivre & Secrets de Senteur</span>
            <h2 className="display-md section-header__title">Les Rituels Bushra Machallah</h2>
            <div className="divider" />
            <p className="section-header__subtitle">
              Découvrez comment sublimer votre intérieur et perpétuer les gestes ancestraux de la parfumerie sénégalaise.
            </p>
          </header>

          <div className="rituals__wrapper">
            {/* Tabs */}
            <div className="rituals__tabs">
              {rituals.map((r, i) => (
                <button
                  key={i}
                  className={`rituals__tab ${activeRitual === i ? 'rituals__tab--active' : ''}`}
                  onClick={() => setActiveRitual(i)}
                >
                  <span className="rituals__tab-icon">{r.icon}</span>
                  <div className="rituals__tab-text">
                    <span className="rituals__tab-title">{r.title}</span>
                    <span className="rituals__tab-sub">{r.tag}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Ritual Display */}
            <div className="rituals__card">
              <div className="rituals__card-badge">✦ Rituel Sacré n°{activeRitual + 1}</div>
              <h3 className="display-sm rituals__card-title">{rituals[activeRitual].title}</h3>
              <p className="rituals__card-desc body-lg">{rituals[activeRitual].desc}</p>
              <div className="rituals__card-advice">
                <Sparkles size={18} className="rituals__advice-icon" />
                <div>
                  <strong>Conseil de la Maison :</strong> {rituals[activeRitual].advice}
                </div>
              </div>
              <div className="rituals__card-cta">
                <Link to="/produits" className="btn btn--primary">
                  Explorer les produits associés <ArrowRight size={15} />
                </Link>
                <a
                  href="https://wa.me/221771234567?text=Bonjour,%20j'aimerais%20des%20conseils%20sur%20les%20senteurs%20Bushra."
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--outline"
                >
                  <MessageCircle size={16} /> Demander conseil par WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BRAND STORY SECTION
          ══════════════════════════════════════ */}
      <section className="story section">
        <div className="container story__grid">
          <div className="story__visual">
            <div className="story__visual-inner">
              <img
                src="/bacground-image.png"
                alt="Bushra Machallah — L'art des senteurs sénégalaises"
                className="story__photo"
                loading="lazy"
              />
              <div className="story__photo-badge">
                <TransparentLogo src="/logo.png" alt="Bushra Machallah" className="story__photo-logo" tolerance={60} />
              </div>
            </div>
          </div>

          <div className="story__content">
            <span className="label" style={{ color: 'var(--color-gold)' }}>La Maison Bushra Machallah</span>
            <h2 className="display-lg" style={{ marginTop: '0.75rem' }}>
              La tradition sénégalaise<br /><em>au sommet du raffinement</em>
            </h2>
            <div className="divider divider--left" />
            <p className="body-lg" style={{ color: 'var(--color-ash)', marginBottom: '1.5rem' }}>
              Bushra Machallah est née d'une passion inébranlable pour les trésors olfactifs du Sénégal. 
              Nous sélectionnons avec la plus haute exigence des encens rares, des bakhours macérés à la perfection 
              et des essences précieuses pour offrir à votre foyer une signature aromatique inoubliable.
            </p>
            <p className="body" style={{ color: 'var(--color-smoke)', marginBottom: '2rem' }}>
              Chaque mélange est le fruit d'un héritage transmis avec amour, alliant bois précieux, épices secrètes 
              et parfums d'exception. Nos encensoirs Mabkharas, façonnés à la main, incarnent la noblesse de l'artisanat d'art.
            </p>
            <div className="story__values">
              {['100% Ingrédients Nobles', 'Artisanat Local Ciselé', 'Savoir-Faire Séculaire', 'Satisfaction Garantie'].map(v => (
                <span key={v} className="story__value-tag">
                  <Check size={13} strokeWidth={3} color="var(--color-amber)" />
                  {v}
                </span>
              ))}
            </div>
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/a-propos" className="btn btn--primary">Découvrir notre histoire</Link>
              <Link to="/contact" className="btn btn--outline">Prendre contact</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS / PROCESS
          ══════════════════════════════════════ */}
      <section className="process section">
        <div className="container">
          <header className="section-header">
            <span className="label" style={{ color: 'var(--color-gold)' }}>Expérience d'Achat Sereine</span>
            <h2 className="display-md section-header__title">Comment Commander chez Bushra ?</h2>
            <div className="divider" />
          </header>

          <div className="process__steps">
            {[
              { icon: <Search size={28} strokeWidth={1.5} />, title: '1. Choisissez', desc: 'Parcourez notre catalogue et sélectionnez vos senteurs et encensoirs favoris.' },
              { icon: <ShoppingCart size={28} strokeWidth={1.5} />, title: '2. Validez', desc: 'Remplissez vos coordonnées en 1 minute. Aucun prépaiement obligatoire requis.' },
              { icon: <Package size={28} strokeWidth={1.5} />, title: '3. Livraison', desc: 'Notre livreur vous remet votre colis emballé avec soin à votre porte.' },
              { icon: <Sparkles size={28} strokeWidth={1.5} />, title: '4. Savourez', desc: 'Payez en espèces, Wave ou OM et profitez d\'une atmosphère envoûtante.' },
            ].map((step, i) => (
              <div key={i} className="process__step">
                <div className="process__step-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="process__step-icon">{step.icon}</div>
                <h3 className="process__step-title heading">{step.title}</h3>
                <p className="process__step-desc">{step.desc}</p>
                {i < 3 && <div className="process__connector" aria-hidden />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════ */}
      <section className="testimonials section">
        <div className="container">
          <header className="section-header">
            <span className="label" style={{ color: 'var(--color-gold)' }}>Avis de nos Clients Privilégiés</span>
            <h2 className="display-md section-header__title">Ce que Disent nos Passionnés</h2>
            <div className="divider" />
          </header>

          <div className="testimonials__grid">
            {[
              {
                name: 'Fatou Bintou Diallo',
                city: 'Almadies, Dakar',
                product: 'Thiouraye Gowé Royal Secret',
                text: "Le Thiouraye Gowé Secret est une merveille absolue ! L'odeur persiste pendant plus de 24h dans toute la villa. La livraison a été effectuée en moins de 3 heures.",
                stars: 5
              },
              {
                name: 'Aminata Sow',
                city: 'Saint-Louis',
                product: 'Encensoir Mabkhara Prestige Doré',
                text: "L'encensoir en laiton est encore plus sublime en vrai que sur les photos. C'est une véritable œuvre d'art qui trône fièrement dans mon salon. Emballage très sécurisé.",
                stars: 5
              },
              {
                name: 'Moussa Ndiaye',
                city: 'Mermoz, Dakar',
                product: 'Brume & Khamaré Vétiver',
                text: "Service irréprochable et conseils très précieux via WhatsApp. Les brumes d'ambiance et le vétiver sont d'une pureté rare. Je commande chaque mois les yeux fermés !",
                stars: 5
              },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {[...Array(t.stars)].map((_, s) => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="var(--color-gold)" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__city label">{t.city} · <em>{t.product}</em></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ORDER TRACKING CALLOUT
          ══════════════════════════════════════ */}
      <section className="track-banner">
        <div className="container track-banner__inner">
          <div className="track-banner__content">
            <span className="track-banner__badge">✦ Service Client Dédié</span>
            <h2 className="display-md">Suivez votre Commande en Temps Réel</h2>
            <p style={{ color: 'var(--color-ash)', marginTop: '0.5rem' }}>
              Entrez simplement votre code de commande pour visualiser la préparation et l'itinéraire de votre livreur à Dakar et dans toutes les régions.
            </p>
          </div>
          <div className="track-banner__actions">
            <Link to="/commande/suivi" className="btn btn--primary" id="home-track-btn">
              Suivre ma commande →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NEWSLETTER & WHATSAPP BANNER
          ══════════════════════════════════════ */}
      <section className="newsletter section">
        <div className="container newsletter__inner">
          <div>
            <span className="label" style={{ color: 'var(--color-gold)' }}>Rejoignez le Cercle</span>
            <h2 className="display-md" style={{ marginTop: '0.5rem' }}>
              Sublimez votre Quotidien<br /><em>avec Bushra Machallah</em>
            </h2>
            <p style={{ color: 'var(--color-ash)', marginTop: '1rem', maxWidth: '520px', lineHeight: '1.7' }}>
              Recevez nos conseils de rituels parfumés, découvrez les arrivages d'encensoirs uniques et bénéficiez d'un service d'assistance personnalisé.
            </p>
          </div>
          <div className="newsletter__form-wrap">
            <Link to="/produits" className="btn btn--primary">
              Explorer la boutique
            </Link>
            <a
              href="https://wa.me/221771234567?text=Bonjour%20Bushra%20Machallah,%20je%20souhaite%20commander%20des%20senteurs."
              target="_blank"
              rel="noreferrer"
              className="btn btn--outline"
              id="whatsapp-contact-hero"
            >
              <MessageCircle size={18} />
              Commander sur WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
