import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'prod-' + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// Initial Data
let categories = [
  {
    id: 1,
    name: 'Thiouraye & Encens',
    slug: 'thiouraye-encens',
    description: "Mélanges d'encens traditionnels sénégalais aux parfums envoûtants et aphrodisiaques",
    image: '/gowe-thiouray.png',
    product_count: 3,
  },
  {
    id: 2,
    name: 'Encensoirs Artisanaux',
    slug: 'encensoirs',
    description: 'Encensoirs décoratifs en laiton ciselé, terre cuite et céramique royale',
    image: '/encensoir1.png',
    product_count: 6,
  },
  {
    id: 3,
    name: 'Senteurs & Sprays',
    slug: 'sprays-parfums',
    description: "Brumes d'intérieur, huiles et extraits concentrés longue durée",
    image: '/sprays.png',
    product_count: 2,
  },
  {
    id: 4,
    name: 'Vétiver & Racines (Khamaré)',
    slug: 'vetiver-khamare',
    description: 'Racines de vétiver pures, gowé et trésors végétaux de notre terroir',
    image: '/paniers-vetiver.png',
    product_count: 1,
  },
];

let products = [
  {
    id: 1,
    name: 'Thiouraye Gowé Royal Secret',
    category_id: 1,
    category_name: 'Thiouraye & Encens',
    price: 6500,
    base_price: 6500,
    compare_price: 8500,
    is_featured: true,
    stock: 25,
    rating: 4.9,
    reviews_count: 18,
    description: "Un thiouraye d'exception à base de graines de gowé noblement macérées dans un assemblage d'huiles précieuses, de musc et d'essences orientales. Idéal pour embaumer durablement vos salons et chambres d'une fragrance boisée, douce et irrésistible.",
    images: [{ url: '/gowe-thiouray.png' }],
    variants: [
      { id: 101, name: 'Format 100g', price_delta: 0 },
      { id: 102, name: 'Format 250g prestige', price_delta: 5500 },
    ],
  },
  {
    id: 2,
    name: 'Encensoir Traditionnel Doré Ciselé',
    category_id: 2,
    category_name: 'Encensoirs Artisanaux',
    price: 12000,
    base_price: 12000,
    compare_price: 15000,
    is_featured: true,
    stock: 14,
    rating: 5.0,
    reviews_count: 12,
    description: "Encensoir en métal doré finement gravé par nos artisans dakarois. Conçu pour une diffusion lente et homogène de vos encens en grains ou en pâte tout en assurant une parfaite sécurité thermique.",
    images: [{ url: '/encensoir1.png' }],
    variants: [],
  },
  {
    id: 3,
    name: 'Encensoir Impérial Émeraude & Or',
    category_id: 2,
    category_name: 'Encensoirs Artisanaux',
    price: 14500,
    base_price: 14500,
    compare_price: 18000,
    is_featured: true,
    stock: 8,
    rating: 4.8,
    reviews_count: 9,
    description: "Une pièce majestueuse aux nuances d'émeraude et dorures raffinées. Son dôme perforé offre un spectacle visuel de volutes de fumée dansant gracieusement.",
    images: [{ url: '/encensoir2.png' }],
    variants: [],
  },
  {
    id: 4,
    name: "Spray d'Intérieur Musc & Oud Précieux",
    category_id: 3,
    category_name: 'Senteurs & Sprays',
    price: 4500,
    base_price: 4500,
    compare_price: 6000,
    is_featured: true,
    stock: 35,
    rating: 4.9,
    reviews_count: 24,
    description: "Brume parfumée instantanée aux notes intenses de bois de oud, fleur d'oranger et musc blanc. Neutralise les odeurs et laisse un sillage chaleureux sur vos tissus d'ameublement.",
    images: [{ url: '/sprays.png' }],
    variants: [
      { id: 401, name: 'Flacon 250ml', price_delta: 0 },
      { id: 402, name: 'Flacon 500ml recharge', price_delta: 3500 },
    ],
  },
  {
    id: 5,
    name: 'Panier Khamaré Vétiver Pur & Gowé Naturel',
    category_id: 4,
    category_name: 'Vétiver & Racines (Khamaré)',
    price: 5000,
    base_price: 5000,
    compare_price: 7000,
    is_featured: true,
    stock: 28,
    rating: 5.0,
    reviews_count: 31,
    description: "Tiges de vétiver 100% bio récoltées et tressées à la main au Sénégal. Reconnu pour ses vertus apaisantes, détoxifiantes et son parfum frais et terrien unique.",
    images: [{ url: '/paniers-vetiver.png' }],
    variants: [],
  },
  {
    id: 6,
    name: 'Encensoir Vintage Nacre & Métal Massif',
    category_id: 2,
    category_name: 'Encensoirs Artisanaux',
    price: 16000,
    base_price: 16000,
    compare_price: 20000,
    is_featured: true,
    stock: 6,
    rating: 4.7,
    reviews_count: 7,
    description: 'Diffuseur luxueux incrusté de reflets nacrés. Une création prestigieuse qui sublime n’importe quelle pièce de réception.',
    images: [{ url: '/encensoir3.png' }],
    variants: [],
  },
  {
    id: 7,
    name: 'Encensoir Majestueux Cuivre Antique',
    category_id: 2,
    category_name: 'Encensoirs Artisanaux',
    price: 13500,
    base_price: 13500,
    compare_price: null,
    is_featured: false,
    stock: 11,
    rating: 4.6,
    reviews_count: 5,
    description: "En alliage noble finition cuivre patiné. Idéal pour un brûlage traditionnel sur charbon ardent.",
    images: [{ url: '/encensoir4.png' }],
    variants: [],
  },
  {
    id: 8,
    name: "Encensoir Prestige Tour d'Orient",
    category_id: 2,
    category_name: 'Encensoirs Artisanaux',
    price: 17500,
    base_price: 17500,
    compare_price: 22000,
    is_featured: true,
    stock: 4,
    rating: 4.9,
    reviews_count: 14,
    description: "Design élancé à double coupelle permettant une aération maximale et un embrasement parfait de vos thiourayes.",
    images: [{ url: '/encensoir5.png' }],
    variants: [],
  },
  {
    id: 9,
    name: 'Encensoir Cristal & Laiton Royal',
    category_id: 2,
    category_name: 'Encensoirs Artisanaux',
    price: 18000,
    base_price: 18000,
    compare_price: 24000,
    is_featured: false,
    stock: 7,
    rating: 5.0,
    reviews_count: 8,
    description: 'Une pièce de collection qui allie la brillance du verre facetté à la robustesse du laiton doré pur.',
    images: [{ url: '/encensoir6.png' }],
    variants: [],
  },
];

let orders = [
  {
    id: 1,
    order_number: 'BM-78291',
    customer_first_name: 'Fatou',
    customer_last_name: 'Diop',
    customer_name: 'Fatou Diop',
    customer_phone: '+221 77 554 32 10',
    customer_email: 'fatou.diop@example.sn',
    shipping_address: 'Mermoz Pyrotechnie, Villa 45, Dakar',
    customer_city: 'Dakar',
    customer_note: 'Livrer de préférence en fin d’après-midi',
    payment_method: 'wave',
    total_amount: 18500,
    status: 'delivered',
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    items: [
      { product_name: 'Thiouraye Gowé Royal Secret', quantity: 2, unit_price: 6500 },
      { product_name: 'Panier Khamaré Vétiver Pur', quantity: 1, unit_price: 5000 },
    ],
  },
  {
    id: 2,
    order_number: 'BM-84912',
    customer_first_name: 'Amadou',
    customer_last_name: 'Sow',
    customer_name: 'Amadou Sow',
    customer_phone: '+221 78 123 99 88',
    customer_email: 'amadou.sow@example.sn',
    shipping_address: 'Almadies Zone 4, Dakar',
    customer_city: 'Dakar',
    customer_note: '',
    payment_method: 'orange_money',
    total_amount: 14500,
    status: 'shipped',
    created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    items: [
      { product_name: 'Encensoir Impérial Émeraude & Or', quantity: 1, unit_price: 14500 },
    ],
  },
  {
    id: 3,
    order_number: 'BM-92840',
    customer_first_name: 'Aïssatou',
    customer_last_name: 'Ndiaye',
    customer_name: 'Aïssatou Ndiaye',
    customer_phone: '+221 76 678 11 22',
    customer_email: 'aissatou.n@example.sn',
    shipping_address: 'Sacré-Cœur 3, Immeuble B, Dakar',
    customer_city: 'Dakar',
    customer_note: 'Appeler 15 min avant',
    payment_method: 'cash_on_delivery',
    total_amount: 22000,
    status: 'pending',
    created_at: new Date().toISOString(),
    items: [
      { product_name: 'Encensoir Traditionnel Doré Ciselé', quantity: 1, unit_price: 12000 },
      { product_name: 'Panier Khamaré Vétiver Pur', quantity: 2, unit_price: 5000 },
    ],
  },
];

let reviews = [
  {
    id: 1,
    productId: 1,
    product_name: 'Thiouraye Gowé Royal Secret',
    authorName: 'Mariama K.',
    rating: 5,
    comment: "L'odeur est simplement magique et tient plusieurs jours dans la maison. Emballage très soigné !",
    status: 'approved',
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 2,
    productId: 2,
    product_name: 'Encensoir Traditionnel Doré Ciselé',
    authorName: 'Cheikh S.',
    rating: 5,
    comment: 'Superbe encensoir robuste et élégant. Très satisfait de mon achat et de la livraison rapide.',
    status: 'approved',
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 3,
    productId: 4,
    product_name: "Spray d'Intérieur Musc & Oud Précieux",
    authorName: 'Khady B.',
    rating: 5,
    comment: 'Très belle senteur, pas du tout entêtante, très chic pour recevoir les invités.',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
];

let notifications = [
  { id: 1, title: 'Nouvelle commande #BM-92840', message: 'Reçue de Aïssatou Ndiaye pour 22 000 FCFA', is_read: false, created_at: new Date().toISOString() },
  { id: 2, title: 'Stock bas', message: 'Encensoir Prestige Tour d’Orient n’a plus que 4 unités', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
];

const shopInfo = {
  name: 'Bushra Machallah',
  tagline: 'Senteurs & Encens d’exception du Sénégal',
  description: 'Boutique spécialisée dans la création de Thiouraye artisanal, encensoirs d’art et parfums traditionnels sénégalais.',
  phone: '+221 77 123 45 67',
  whatsapp: '+221771234567',
  email: 'contact@bushra.sn',
  address: 'Almadies & Sacré-Cœur, Dakar, Sénégal',
  currency: 'FCFA',
  free_shipping_threshold: 25000,
  shipping_fee: 1500,
  socials: {
    instagram: 'https://instagram.com/bushra_machallah',
    facebook: 'https://facebook.com/bushramachallah',
    tiktok: 'https://tiktok.com/@bushramachallah',
  },
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static uploads
  app.use('/uploads', express.static(uploadsDir));
  app.use('/public/uploads', express.static(uploadsDir));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Shop info
  app.get('/api/shop-info', (req, res) => {
    res.json({ success: true, data: shopInfo });
  });

  // Categories
  app.get('/api/categories', (req, res) => {
    const enriched = categories.map(cat => ({
      ...cat,
      product_count: products.filter(p => p.category_id === cat.id).length,
    }));
    res.json({ success: true, data: enriched });
  });

  app.get('/api/categories/:id', (req, res) => {
    const cat = categories.find(c => c.id === Number(req.params.id) || c.slug === req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Catégorie introuvable' });
    res.json({ success: true, data: cat });
  });

  // Public Products
  app.get('/api/products', (req, res) => {
    let result = [...products];
    const { search, category, minPrice, maxPrice, featured, limit, page = 1, sort } = req.query;

    if (String(featured) === 'true') {
      result = result.filter(p => p.is_featured);
    }
    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }
    if (category) {
      result = result.filter(p => p.category_id === Number(category) || (p.category_name && p.category_name.toLowerCase() === String(category).toLowerCase()));
    }
    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === 'newest') result.sort((a, b) => b.id - a.id);
    else if (sort === 'name_asc') result.sort((a, b) => a.name.localeCompare(b.name));

    const total = result.length;
    const l = limit ? Number(limit) : total;
    const p = Number(page);
    const paginated = result.slice((p - 1) * l, p * l);

    res.json({
      success: true,
      data: {
        products: paginated,
        total,
        page: p,
        limit: l,
        pages: Math.ceil(total / (l || 1)) || 1,
      },
    });
  });

  app.get('/api/products/:id', (req, res) => {
    const prod = products.find(p => p.id === Number(req.params.id));
    if (!prod) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    const prodReviews = reviews.filter(r => r.productId === prod.id && r.status === 'approved');
    res.json({ success: true, data: { ...prod, reviews: prodReviews } });
  });

  app.get('/api/products/:id/similar', (req, res) => {
    const prod = products.find(p => p.id === Number(req.params.id));
    const similar = products.filter(p => p.id !== Number(req.params.id) && (prod ? p.category_id === prod.category_id : true)).slice(0, 4);
    res.json({ success: true, data: similar.length ? similar : products.slice(0, 4) });
  });

  // Orders
  app.post('/api/orders', (req, res) => {
    const body = req.body;
    const orderNumber = 'BM-' + Math.floor(10000 + Math.random() * 90000);
    const parsedItems = Array.isArray(body.items) ? body.items.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      return {
        productId: item.productId,
        variantId: item.variantId,
        product_name: p ? p.name : 'Produit Bushra',
        quantity: item.quantity || 1,
        unit_price: p ? p.price : 0,
      };
    }) : [];

    const totalAmount = parsedItems.reduce((s, i) => s + (i.unit_price * i.quantity), 0) + (parsedItems.reduce((s, i) => s + (i.unit_price * i.quantity), 0) >= shopInfo.free_shipping_threshold ? 0 : shopInfo.shipping_fee);

    const newOrder = {
      id: orders.length + 1,
      order_number: orderNumber,
      orderNumber: orderNumber,
      customer_name: body.customerName || (body.firstName ? `${body.firstName} ${body.lastName}`.trim() : 'Client'),
      customer_first_name: body.firstName || body.customerName?.split(' ')[0] || 'Client',
      customer_last_name: body.lastName || body.customerName?.split(' ').slice(1).join(' ') || '',
      customer_phone: body.customerPhone || body.phone || '',
      customer_email: body.email || '',
      shipping_address: body.customerAddress || body.address || '',
      customer_city: body.customerCity || body.city || 'Dakar',
      customer_note: body.customerNote || body.notes || '',
      payment_method: body.paymentMethod || 'cash_on_delivery',
      total_amount: totalAmount,
      status: 'pending',
      created_at: new Date().toISOString(),
      items: parsedItems,
    };

    orders.unshift(newOrder);

    notifications.unshift({
      id: Date.now(),
      title: `Nouvelle commande #${orderNumber}`,
      message: `${newOrder.customer_name} — ${new Intl.NumberFormat('fr-FR').format(totalAmount)} FCFA`,
      is_read: false,
      created_at: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: newOrder, order: newOrder });
  });

  app.get('/api/orders/track', (req, res) => {
    const { orderNumber, phone } = req.query;
    const cleanNum = String(orderNumber || '').replace(/^#/, '').trim().toUpperCase();
    const cleanPhone = String(phone || '').replace(/[\s\-\+\(\)]/g, '');

    const found = orders.find(o => {
      const matchNum = o.order_number.toUpperCase() === cleanNum || String(o.id) === cleanNum;
      if (!matchNum) return false;
      if (!phone) return true;
      const oPhone = String(o.customer_phone || '').replace(/[\s\-\+\(\)]/g, '');
      return oPhone.includes(cleanPhone) || cleanPhone.includes(oPhone);
    });

    if (!found) {
      return res.status(404).json({ success: false, message: 'Aucune commande correspondante trouvée' });
    }
    res.json({ success: true, data: found });
  });

  // Reviews
  app.post('/api/reviews', (req, res) => {
    const { productId, authorName, rating, comment } = req.body;
    const prod = products.find(p => p.id === Number(productId));
    const newRev = {
      id: reviews.length + 1,
      productId: Number(productId),
      product_name: prod ? prod.name : 'Produit Bushra',
      authorName: authorName || 'Client',
      rating: Number(rating) || 5,
      comment: comment || '',
      status: 'approved',
      created_at: new Date().toISOString(),
    };
    reviews.unshift(newRev);
    res.status(201).json({ success: true, data: newRev });
  });

  // Auth routes
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      const adminUser = {
        id: 1,
        name: 'Administrateur Bushra',
        email: email,
        role: 'admin',
      };
      return res.json({
        success: true,
        token: 'bushra_secret_token_' + Date.now(),
        user: adminUser,
        data: adminUser,
      });
    }
    res.status(400).json({ success: false, message: 'Veuillez saisir email et mot de passe' });
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }
    res.json({
      success: true,
      data: {
        id: 1,
        name: 'Administrateur Bushra',
        email: 'admin@bushra.sn',
        role: 'admin',
      },
    });
  });

  // Admin Endpoints
  app.get('/api/admin/dashboard', (req, res) => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const totalProducts = products.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalProducts,
        pendingOrders,
        stats: {
          orders: totalOrders,
          revenue: totalRevenue,
          products: totalProducts,
          pending: pendingOrders,
        },
        recentOrders: orders.slice(0, 5),
        lowStock: products.filter(p => p.stock <= 5),
      },
    });
  });

  app.get('/api/admin/dashboard/chart', (req, res) => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const data = days.map((d, idx) => ({
      name: d,
      ventes: Math.floor(45000 + (idx * 15000) + Math.random() * 20000),
      commandes: Math.floor(2 + (idx * 1.5) + Math.random() * 3),
    }));
    res.json({ success: true, data });
  });

  app.get('/api/admin/products', (req, res) => {
    res.json({
      success: true,
      data: {
        products: products,
        total: products.length,
      },
    });
  });

  app.post('/api/admin/products', (req, res) => {
    const body = req.body;
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const cat = categories.find(c => c.id === Number(body.category_id));
    const newProd = {
      id: newId,
      name: body.name || 'Nouveau Produit',
      description: body.description || '',
      price: Number(body.price) || 0,
      base_price: Number(body.price) || 0,
      compare_price: body.compare_price ? Number(body.compare_price) : null,
      stock: Number(body.stock) || 10,
      category_id: body.category_id ? Number(body.category_id) : 1,
      category_name: cat ? cat.name : 'Thiouraye & Encens',
      is_featured: !!body.is_featured,
      images: body.images || [{ url: '/gowe-thiouray.png' }],
      variants: body.variants || [],
      rating: 5.0,
      reviews_count: 0,
    };
    products.unshift(newProd);
    res.status(201).json({ success: true, data: newProd });
  });

  app.put('/api/admin/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    const body = req.body;
    const cat = categories.find(c => c.id === Number(body.category_id));

    products[idx] = {
      ...products[idx],
      ...body,
      price: body.price !== undefined ? Number(body.price) : products[idx].price,
      base_price: body.price !== undefined ? Number(body.price) : products[idx].base_price,
      stock: body.stock !== undefined ? Number(body.stock) : products[idx].stock,
      category_name: cat ? cat.name : products[idx].category_name,
    };
    res.json({ success: true, data: products[idx] });
  });

  app.delete('/api/admin/products/:id', (req, res) => {
    const id = Number(req.params.id);
    products = products.filter(p => p.id !== id);
    res.json({ success: true, message: 'Produit supprimé' });
  });

  app.post('/api/admin/products/:id/images', upload.single('image'), (req, res) => {
    const id = Number(req.params.id);
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Aucun fichier reçu' });

    const imageUrl = `/uploads/${req.file.filename}`;
    if (!products[idx].images) products[idx].images = [];
    products[idx].images.unshift({ url: imageUrl });
    res.json({ success: true, data: products[idx] });
  });

  app.get('/api/admin/orders', (req, res) => {
    res.json({
      success: true,
      data: {
        orders: orders,
        total: orders.length,
      },
    });
  });

  app.get('/api/admin/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === Number(req.params.id) || o.order_number === req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable' });
    res.json({ success: true, data: order });
  });

  app.patch('/api/admin/orders/:id/status', (req, res) => {
    const id = Number(req.params.id);
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Commande introuvable' });
    const { status, adminNote } = req.body;
    orders[idx].status = status || orders[idx].status;
    if (adminNote !== undefined) (orders[idx] as Record<string, unknown>).admin_note = adminNote;
    res.json({ success: true, data: orders[idx] });
  });

  app.get('/api/admin/reviews', (req, res) => {
    res.json({ success: true, data: reviews });
  });

  app.patch('/api/admin/reviews/:id/approve', (req, res) => {
    const id = Number(req.params.id);
    const rev = reviews.find(r => r.id === id);
    if (rev) rev.status = 'approved';
    res.json({ success: true, data: rev });
  });

  app.delete('/api/admin/reviews/:id', (req, res) => {
    const id = Number(req.params.id);
    reviews = reviews.filter(r => r.id !== id);
    res.json({ success: true, message: 'Avis supprimé' });
  });

  app.post('/api/admin/categories', (req, res) => {
    const body = req.body;
    const newCat = {
      id: categories.length + 1,
      name: body.name,
      slug: body.name.toLowerCase().replace(/[\s\W-]+/g, '-'),
      description: body.description || '',
      image: body.image || '/gowe-thiouray.png',
      product_count: 0,
    };
    categories.push(newCat);
    res.status(201).json({ success: true, data: newCat });
  });

  app.put('/api/admin/categories/:id', (req, res) => {
    const id = Number(req.params.id);
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Catégorie non trouvée' });
    categories[idx] = { ...categories[idx], ...req.body };
    res.json({ success: true, data: categories[idx] });
  });

  app.get('/api/admin/notifications', (req, res) => {
    res.json({ success: true, data: notifications });
  });

  app.patch('/api/admin/notifications/:id/read', (req, res) => {
    const id = Number(req.params.id);
    const notif = notifications.find(n => n.id === id);
    if (notif) notif.is_read = true;
    res.json({ success: true });
  });

  app.patch('/api/admin/notifications/read-all', (req, res) => {
    notifications.forEach(n => (n.is_read = true));
    res.json({ success: true });
  });

  app.get('/api/admin/stock/low', (req, res) => {
    res.json({ success: true, data: products.filter(p => p.stock <= 5) });
  });

  app.get('/api/admin/customers', (req, res) => {
    const uniqueCustomers = Array.from(
      new Map(
        orders.map(o => [
          o.customer_phone || o.customer_email || o.customer_name,
          {
            name: o.customer_name,
            phone: o.customer_phone,
            email: o.customer_email,
            address: o.shipping_address,
            city: o.customer_city,
            orders_count: orders.filter(x => x.customer_name === o.customer_name).length,
            total_spent: orders.filter(x => x.customer_name === o.customer_name).reduce((sum, x) => sum + x.total_amount, 0),
            last_order: o.created_at,
          },
        ])
      ).values()
    );
    res.json({ success: true, data: uniqueCustomers });
  });

  // Vite middleware for development / Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bushra Boutique server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
