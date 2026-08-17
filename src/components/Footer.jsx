import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, MapPin, CreditCard, Smartphone } from 'lucide-react';
import './Footer.css';
import TransparentLogo from './TransparentLogo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <TransparentLogo src="/logo.png" alt="Bushra Machallah" className="footer__logo-img" width={120} height={120} tolerance={60} />
            </div>
            <p className="footer__desc">
              Des senteurs authentiques et des encensoirs artisanaux, façonnés avec passion 
              au cœur du Sénégal. Chaque produit est une invitation au voyage intérieur.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="WhatsApp" className="footer__social">
                <MessageCircle size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="footer__social">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Facebook" className="footer__social">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Nav links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Boutique</h4>
            <ul className="footer__links">
              <li><Link to="/produits">Tous les produits</Link></li>
              <li><Link to="/collections">Collections</Link></li>
              <li><Link to="/produits?category=encens">Encens</Link></li>
              <li><Link to="/produits?category=encensoirs">Encensoirs</Link></li>
              <li><Link to="/produits?category=huiles">Huiles & Parfums</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Aide</h4>
            <ul className="footer__links">
              <li><Link to="/commande/suivi">Suivre une commande</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/a-propos">À propos</Link></li>
              <li><Link to="/livraison">Livraison</Link></li>
              <li><Link to="/retours">Retours</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contactez-nous</h4>
            <ul className="footer__contact">
              <li>
                <Phone size={16} strokeWidth={1.5} />
                +221 77 123 45 67
              </li>
              <li>
                <Phone size={16} strokeWidth={1.5} />
                +221 78 987 65 43
              </li>
              <li>
                <MapPin size={16} strokeWidth={1.5} />
                Dakar, Sénégal
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© 2024 Bushra Machallah. Tous droits réservés.</p>
          <div className="footer__payment">
            <span className="label">Paiement à la livraison</span>
            <CreditCard size={18} className="footer__payment-icon" />
            <Smartphone size={18} className="footer__payment-icon" />
            <span>Wave · Orange Money</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
