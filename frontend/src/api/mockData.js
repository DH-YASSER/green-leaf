// Mock Data for Green Leaf (formerly Markeat)
// Realistic Moroccan B2B Suppliers, Products, Orders, Reviews, and Messages.

export const MOCK_CITIES = [
  { value: 'casablanca', label: 'Casablanca' },
  { value: 'rabat', label: 'Rabat' },
  { value: 'marrakech', label: 'Marrakech' },
  { value: 'fes', label: 'Fes' },
  { value: 'tanger', label: 'Tangier' },
  { value: 'agadir', label: 'Agadir' }
];

export const MOCK_CATEGORIES = [
  { value: 'legumes', label: 'Vegetables / Légumes' },
  { value: 'viandes', label: 'Meats / Viandes' },
  { value: 'boissons', label: 'Beverages / Boissons' },
  { value: 'epices', label: 'Spices / Épices' },
  { value: 'secs', label: 'Dry Goods / Produits Secs' }
];

export const MOCK_FOURNISSEURS = [
  {
    id: 'f1',
    company_name: 'Atlas Prime Maraîcher',
    name: 'Mohamed El Alami',
    city: 'casablanca',
    email: 'atlas.prime@gmail.com',
    phone: '+212 661-123456',
    address: 'Marché de Gros, Secteur A, Casablanca',
    description: 'Premier producteur de fruits et légumes frais dans la région du Souss et du Gharb. Livraison quotidienne garantie pour les restaurants.',
    is_verified: true,
    avg_rating: 4.8,
    reviews_count: 24,
    created_at: '2025-01-15'
  },
  {
    id: 'f2',
    company_name: 'Boucherie Halal Gourmet',
    name: 'Karim Bennani',
    city: 'rabat',
    email: 'boucherie.gourmet@gmail.com',
    phone: '+212 662-789012',
    address: 'Zone Industrielle Témara, Rabat',
    description: 'Fournisseur de viandes rouges de haute qualité certifiée (Bœuf, Agneau, Volaille) pour professionnels de la restauration.',
    is_verified: true,
    avg_rating: 4.6,
    reviews_count: 18,
    created_at: '2025-02-10'
  },
  {
    id: 'f3',
    company_name: 'Sidi Ali & Boissons du Sud',
    name: 'Youssef Taghi',
    city: 'marrakech',
    email: 'sidi-ali.distrib@gmail.com',
    phone: '+212 663-456789',
    address: 'Quartier Industriel Sidi Ghanem, Marrakech',
    description: 'Distributeur officiel d\'eaux minérales, jus de fruits, sodas et boissons gazeuses pour cafés et hôtels.',
    is_verified: false,
    avg_rating: 4.2,
    reviews_count: 9,
    created_at: '2025-03-01'
  },
  {
    id: 'f4',
    company_name: 'Épices Fassi & Co.',
    name: 'Fatima Zahra',
    city: 'fes',
    email: 'epices.fassi@gmail.com',
    phone: '+212 664-987654',
    address: 'Derb Omar, Fes',
    description: 'Maison centenaire d\'épices marocaines pures sélectionnées (Safran de Taliouine, Ras el Hanout, Paprika fumé) pour une cuisine authentique.',
    is_verified: true,
    avg_rating: 4.9,
    reviews_count: 32,
    created_at: '2024-11-20'
  },
  {
    id: 'f5',
    company_name: 'Le Comptoir Céréalier Nord',
    name: 'Adnane Mansouri',
    city: 'tanger',
    email: 'comptoir.cerealier@gmail.com',
    phone: '+212 665-223344',
    address: 'Zone Franche de Tanger, Tanger',
    description: 'Importation et distribution en gros de riz, pâtes, semoules de couscous et farines de qualité boulangère supérieure.',
    is_verified: true,
    avg_rating: 4.5,
    reviews_count: 15,
    created_at: '2025-04-05'
  }
];

export const MOCK_PRODUCTS = [
  // Vegetables
  {
    id: 'p1',
    fournisseur_id: 'f1',
    name: 'Tomates Côtelées Extra',
    description: 'Tomates fraîches juteuses idéales pour salades et sauces de cuisson, cueillies le matin même.',
    category: 'legumes',
    price: 8.50,
    unit: 'Kg',
    has_active_promo: true,
    promo_discount: 10,
    stock: 500
  },
  {
    id: 'p2',
    fournisseur_id: 'f1',
    name: 'Pommes de terre Agria',
    description: 'Idéale pour frites croustillantes et purées de qualité restaurant. Faible teneur en eau.',
    category: 'legumes',
    price: 6.00,
    unit: 'Kg',
    has_active_promo: false,
    promo_discount: 0,
    stock: 1200
  },
  {
    id: 'p3',
    fournisseur_id: 'f1',
    name: 'Poivrons Verts & Rouges Mixtes',
    description: 'Sélection triée sur le volet de poivrons croquants pour grillades et tajines.',
    category: 'legumes',
    price: 11.00,
    unit: 'Kg',
    has_active_promo: true,
    promo_discount: 15,
    stock: 350
  },

  // Meats
  {
    id: 'p4',
    fournisseur_id: 'f2',
    name: 'Bœuf Haché Premium 15% MG',
    description: 'Viande bovine d\'origine locale, hachée sur commande pour les burgers et plats de pâtes.',
    category: 'viandes',
    price: 85.00,
    unit: 'Kg',
    has_active_promo: false,
    promo_discount: 0,
    stock: 120
  },
  {
    id: 'p5',
    fournisseur_id: 'f2',
    name: 'Filet de Poulet Tendre',
    description: 'Blancs de poulet désossés et parés de qualité export, parfaits pour la grillade.',
    category: 'viandes',
    price: 64.00,
    unit: 'Kg',
    has_active_promo: true,
    promo_discount: 8,
    stock: 200
  },
  {
    id: 'p6',
    fournisseur_id: 'f2',
    name: 'Épaule d\'Agneau Marocain',
    description: 'Épaule entière d\'agneau tendre, excellente pour tajines mijotés de longue durée.',
    category: 'viandes',
    price: 110.00,
    unit: 'Kg',
    has_active_promo: false,
    promo_discount: 0,
    stock: 80
  },

  // Beverages
  {
    id: 'p7',
    fournisseur_id: 'f3',
    name: 'Pack Sidi Ali Eau Minérale 1.5L x6',
    description: 'L\'eau minérale préférée des Marocains en pack pour service de table.',
    category: 'boissons',
    price: 26.50,
    unit: 'Caisse',
    has_active_promo: false,
    promo_discount: 0,
    stock: 400
  },
  {
    id: 'p8',
    fournisseur_id: 'f3',
    name: 'Coca-Cola Canettes 33cl x24',
    description: 'Boisson rafraîchissante originale, emballage pro pratique pour le stockage froid.',
    category: 'boissons',
    price: 118.00,
    unit: 'Caisse',
    has_active_promo: true,
    promo_discount: 5,
    stock: 150
  },

  // Spices
  {
    id: 'p9',
    fournisseur_id: 'f4',
    name: 'Safran Pur de Taliouine',
    description: 'Safran rouge de qualité supérieure AOP récolté à la main. Arôme puissant.',
    category: 'epices',
    price: 32.00,
    unit: 'Gramme',
    has_active_promo: true,
    promo_discount: 12,
    stock: 50
  },
  {
    id: 'p10',
    fournisseur_id: 'f4',
    name: 'Mélange Tajine Royal',
    description: 'Assemblage maison d\'épices pour Tajine, incluant gingembre, curcuma, poivre noir et macis.',
    category: 'epices',
    price: 45.00,
    unit: 'Kg',
    has_active_promo: false,
    promo_discount: 0,
    stock: 100
  },

  // Dry Goods
  {
    id: 'p11',
    fournisseur_id: 'f5',
    name: 'Semoule Fine pour Couscous Dar Gueddari',
    description: 'Semoule de blé dur de qualité supérieure, roulee et pre-cuite a la vapeur.',
    category: 'secs',
    price: 13.50,
    unit: 'Kg',
    has_active_promo: false,
    promo_discount: 0,
    stock: 800
  },
  {
    id: 'p12',
    fournisseur_id: 'f5',
    name: 'Riz Basmati Pro Sakina',
    description: 'Riz à grains extra-longs idéal pour accompagnements parfumés asiatiques ou méditerranéens.',
    category: 'secs',
    price: 21.00,
    unit: 'Kg',
    has_active_promo: true,
    promo_discount: 10,
    stock: 600
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'r1',
    fournisseur_id: 'f1',
    user_name: 'Café & Restaurant France',
    rating: 5,
    comment: 'Légumes d\'une fraîcheur exceptionnelle. Livraison toujours ponctuelle avant le service de midi.',
    date: '2026-05-18'
  },
  {
    id: 'r2',
    fournisseur_id: 'f1',
    user_name: 'Pizzeria Bella Italia',
    rating: 4.5,
    comment: 'Les tomates côtelées sont fantastiques pour notre sauce pizza maison. Service client réactif.',
    date: '2026-05-29'
  },
  {
    id: 'r3',
    fournisseur_id: 'f2',
    user_name: 'Steakhouse Marrakech',
    rating: 5,
    comment: 'La qualité du bœuf est constante. Le parage est soigné ce qui nous évite des pertes en cuisine.',
    date: '2026-06-01'
  },
  {
    id: 'r4',
    fournisseur_id: 'f4',
    user_name: 'Dar Riad Medina',
    rating: 5,
    comment: 'Des arômes incroyables. Notre clientèle étrangère adore la saveur de nos tajines parfumés avec leur Safran.',
    date: '2026-05-10'
  }
];

// Seed initial orders
export const MOCK_ORDERS = [
  {
    id: 'ord-1001',
    restaurant_id: 'rest-1',
    restaurant_name: 'Le Bistro Vert',
    fournisseur_id: 'f1',
    fournisseur_name: 'Atlas Prime Maraîcher',
    products: [
      { id: 'p1', name: 'Tomates Côtelées Extra', price: 8.50, unit: 'Kg', quantity: 20 },
      { id: 'p2', name: 'Pommes de terre Agria', price: 6.00, unit: 'Kg', quantity: 50 }
    ],
    total: 470.00,
    status: 'completed', // pending, accepted, shipped, completed, cancelled
    created_at: '2026-06-05T10:30:00Z',
    delivery_date: '2026-06-06'
  },
  {
    id: 'ord-1002',
    restaurant_id: 'rest-1',
    restaurant_name: 'Le Bistro Vert',
    fournisseur_id: 'f2',
    fournisseur_name: 'Boucherie Halal Gourmet',
    products: [
      { id: 'p4', name: 'Bœuf Haché Premium 15% MG', price: 85.00, unit: 'Kg', quantity: 10 },
      { id: 'p5', name: 'Filet de Poulet Tendre', price: 58.88, unit: 'Kg', quantity: 15 } // discounted
    ],
    total: 1733.20,
    status: 'shipped',
    created_at: '2026-06-09T08:15:00Z',
    delivery_date: '2026-06-11'
  },
  {
    id: 'ord-1003',
    restaurant_id: 'rest-1',
    restaurant_name: 'Le Bistro Vert',
    fournisseur_id: 'f4',
    fournisseur_name: 'Épices Fassi & Co.',
    products: [
      { id: 'p10', name: 'Mélange Tajine Royal', price: 45.00, unit: 'Kg', quantity: 2 }
    ],
    total: 90.00,
    status: 'pending',
    created_at: '2026-06-10T14:20:00Z',
    delivery_date: '2026-06-12'
  }
];

export const MOCK_MESSAGES = [
  {
    id: 'm1',
    sender_id: 'rest-1',
    sender_name: 'Le Bistro Vert',
    recipient_id: 'f1',
    recipient_name: 'Atlas Prime Maraîcher',
    content: 'Bonjour, est-il possible d\'obtenir une livraison express pour demain matin avant 8h ?',
    timestamp: '2026-06-10T15:30:00Z',
    read: true
  },
  {
    id: 'm2',
    sender_id: 'f1',
    sender_name: 'Atlas Prime Maraîcher',
    recipient_id: 'rest-1',
    recipient_name: 'Le Bistro Vert',
    content: 'Bonjour ! Oui, aucun problème. Notre chauffeur passera à 7h30 pour votre livraison.',
    timestamp: '2026-06-10T15:45:00Z',
    read: true
  },
  {
    id: 'm3',
    sender_id: 'rest-1',
    sender_name: 'Le Bistro Vert',
    recipient_id: 'f2',
    recipient_name: 'Boucherie Halal Gourmet',
    content: 'Avez-vous des rôtis de bœuf disponibles pour ce weekend ?',
    timestamp: '2026-06-10T18:00:00Z',
    read: false
  }
];

export const MOCK_PROMOTIONS = [
  {
    id: 'promo-1',
    fournisseur_id: 'f1',
    title: 'Solde de Légumes de Saison',
    description: 'Bénéficiez de 15% de réduction sur tous les poivrons verts et rouges.',
    discount_pct: 15,
    start_date: '2026-06-01',
    end_date: '2026-06-15',
    active: true
  },
  {
    id: 'promo-2',
    fournisseur_id: 'f2',
    title: 'Remise Grossiste Volaille',
    description: 'Achetez plus de 20 Kg de filet de poulet et obtenez 8% de réduction immédiate.',
    discount_pct: 8,
    start_date: '2026-06-05',
    end_date: '2026-06-20',
    active: true
  }
];
