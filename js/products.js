// ============================================
// Products Data and Management
// ============================================

const ProductsData = {
    categories: [
        {
            id: 'electronics',
            name: 'Electronics',
            image: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-186x116--B08RDL6H79._SY116_CB667322346_.jpg',
            link: 'Shop now'
        },
        {
            id: 'clothing',
            name: 'Fashion',
            image: 'https://m.media-amazon.com/images/I/71JhH6JBZgL._AC_UL480_FMwebp_QL65_.jpg',
            link: 'See more'
        },
        {
            id: 'home',
            name: 'Home & Kitchen',
            image: 'https://m.media-amazon.com/images/I/61gxJKK1cDL._AC_UL480_FMwebp_QL65_.jpg',
            link: 'Explore'
        },
        {
            id: 'books',
            name: 'Books',
            image: 'https://m.media-amazon.com/images/I/61OByUf1TfL._AC_SX416_CB1169409_QL70_.jpg',
            link: 'Browse'
        }
    ],

    products: [
        {
            id: '1',
            title: 'Apple AirPods Pro (2nd Generation) Wireless Earbuds',
            description: 'Active Noise Cancelling, Personalized Spatial Audio, MagSafe Charging Case, Bluetooth Headphones for iPhone',
            price: 199.99,
            originalPrice: 249.99,
            category: 'electronics',
            image: 'https://m.media-amazon.com/images/I/31LnSgENLeL._AC_SR250,250_QL65_.jpg',
            images:['https://m.media-amazon.com/images/I/61oCISLE+PL._AC_UY327_FMwebp_QL65_.jpg',
            ]
                
                
            ,
            rating: 4.7,
            reviewCount: 89234,
            stock: 50,
            features: [
                'Active Noise Cancellation',
                'Personalized Spatial Audio',
                'Up to 6 hours of listening time',
                'MagSafe Charging Case',
                'Sweat and water resistant'
            ],
            isBestSeller: true,
            isOnSale: true
        },
        {
            id: '2',
            title: 'Samsung 65-Inch Class OLED 4K S95C Series Smart TV',
            description: 'Neural Quantum Processor with 4K Upscaling, Object Tracking Sound, Motion Xcelerator 144Hz',
            price: 1797.99,
            originalPrice: 2499.99,
            category: 'electronics',
            image: 'https://m.media-amazon.com/images/I/81V52c-dxuL._AC_UY327_FMwebp_QL65_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/71y-fmLuGkL._AC_SX416_CB1169409_QL70_.jpg'
            ],
            rating: 4.5,
            reviewCount: 3421,
            stock: 15,
            features: [
                '65-Inch OLED Display',
                '4K Resolution',
                'Neural Quantum Processor',
                '144Hz Refresh Rate',
                'Smart TV Features'
            ],
            isBestSeller: false,
            isOnSale: true
        },
        {
            id: '3',
            title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
            description: 'Industry Leading Noise Cancellation, 30 Hour Battery, Superior Call Quality',
            price: 328.00,
            originalPrice: 399.99,
            category: 'electronics',
            image: 'https://m.media-amazon.com/images/I/61ttOStDEqL._AC_SX416_CB1169409_QL70_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/51lPcFkwYmL._SY450_.jpg'
            ],
            rating: 4.6,
            reviewCount: 15678,
            stock: 100,
            features: [
                'Industry-leading noise cancellation',
                '30-hour battery life',
                'Crystal clear hands-free calling',
                'Multipoint connection',
                'Ultra-comfortable design'
            ],
            isBestSeller: true,
            isOnSale: true
        },
        {
            id: '4',
            title: 'Levi\'s Men\'s 501 Original Fit Jeans',
            description: 'The original blue jean since 1873. The iconic straight fit with signature styling.',
            price: 59.50,
            originalPrice: 79.50,
            category: 'clothing',
            image: 'https://m.media-amazon.com/images/I/71vSy-vxjvL._AC_UL480_FMwebp_QL65_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/51ZsLj2BwcL._AC_UL480_FMwebp_QL65_.jpg'
            ],
            rating: 4.4,
            reviewCount: 45678,
            stock: 200,
            features: [
                'Original straight fit',
                'Button fly',
                '100% Cotton',
                'Sits at waist',
                'Regular through thigh'
            ],
            isBestSeller: true,
            isOnSale: true
        },
        {
            id: '5',
            title: 'Nike Air Force 1 \'07 Men\'s Shoes',
            description: 'The radiance lives on in the Nike Air Force 1 \'07. Crisp leather, bold colors and timeless style.',
            price: 115.00,
            originalPrice: 115.00,
            category: 'clothing',
            image: 'https://m.media-amazon.com/images/I/71uP7CJ4T7L._AC_SX416_CB1169409_QL70_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/710Bckg1VvL._AC_SX679_.jpg'
            ],
            rating: 4.8,
            reviewCount: 28934,
            stock: 75,
            features: [
                'Full-grain leather upper',
                'Nike Air cushioning',
                'Rubber outsole',
                'Perforations on toe',
                'Padded collar'
            ],
            isBestSeller: true,
            isOnSale: false
        },
        {
            id: '6',
            title: 'The Psychology of Money: Timeless lessons on wealth',
            description: 'Doing well with money isn\'t necessarily about what you know. It\'s about how you behave.',
            price: 14.99,
            originalPrice: 24.99,
            category: 'books',
            image: 'https://m.media-amazon.com/images/I/71oAJY1LbcL._AC_UY327_FMwebp_QL65_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/81fSqBXZnOL._AC_UY327_FMwebp_QL65_.jpg'
            ],
            rating: 4.7,
            reviewCount: 67890,
            stock: 500,
            features: [
                '256 pages',
                'Paperback',
                'Personal Finance',
                'Best Seller',
                'Award Winning'
            ],
            isBestSeller: true,
            isOnSale: true
        },
        {
            id: '7',
            title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
            description: 'No matter your goals, Atomic Habits offers a proven framework for improving every day.',
            price: 13.79,
            originalPrice: 27.00,
            category: 'books',
            image: 'https://m.media-amazon.com/images/I/61-GcWqlA3L._AC_UY327_FMwebp_QL65_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/51CtZSFgaWL._AC_UY327_FMwebp_QL65_.jpg'
            ],
            rating: 4.8,
            reviewCount: 98765,
            stock: 300,
            features: [
                '320 pages',
                'Hardcover',
                'Self-Help',
                '#1 New York Times Bestseller',
                'Over 10 million copies sold'
            ],
            isBestSeller: true,
            isOnSale: true
        },
    {
            id: '8',
            title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
            description: '6 Quart, 7-in-1 Multi-Use Programmable for Slow Cooker, Rice Cooker, Steamer, Sauté',
            price: 89.95,
            originalPrice: 119.95,
            category: 'home',
            image: 'https://m.media-amazon.com/images/I/61zS7M198JL._AC_SX416_CB1169409_QL70_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/61YwpwVzRSL._AC_UY327_FMwebp_QL65_.jpg'
            ],
            rating: 4.7,
            reviewCount: 156789,
            stock: 80,
            features: [
                '7-in-1 functionality',
                '6 Quart capacity',
                '14 one-touch programs',
                'Stainless steel inner pot',
                'Easy to clean'
            ],
            isBestSeller: true,
            isOnSale: true
        },
        {
            id: '9',
            title: 'Dyson V15 Detect Cordless Vacuum Cleaner',
            description: 'Reveals hidden dust with laser illumination. Most powerful intelligent cordless vacuum.',
            price: 649.99,
            originalPrice: 749.99,
            category: 'home',
            image: 'https://m.media-amazon.com/images/I/41iYbEzgS7L._AC_SX416_CB1169409_QL70_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/51C+j+71XdL._AC_UY327_FMwebp_QL65_.jpg'
            ],
            rating: 4.6,
            reviewCount: 8934,
            stock: 25,
            features: [
                'Laser dust detection',
                '60 minutes run time',
                'LCD screen',
                'HEPA filtration',
                'Click-in battery'
            ],
            isBestSeller: false,
            isOnSale: true
        },
        {
            id: '10',
            title: 'Apple MacBook Air 15" Laptop - M2 chip',
            description: '15.3-inch Liquid Retina display, 8GB RAM, 256GB SSD, Space Gray',
            price: 1099.00,
            originalPrice: 1299.00,
            category: 'electronics',
            image: 'https://m.media-amazon.com/images/I/81kH5pEDLdL._AC_SX416_CB1169409_QL70_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/71upqrupfYL._AC_UY327_FMwebp_QL65_.jpg'
            ],
            rating: 4.8,
            reviewCount: 12456,
            stock: 40,
            features: [
                'Apple M2 chip',
                '15.3-inch Liquid Retina display',
                '8GB unified memory',
                '256GB SSD storage',
                'Up to 18 hours battery life'
            ],
            isBestSeller: true,
            isOnSale: true
        },
        {
            id: '11',
            title: 'COSRX Snail Mucin 96% Power Repairing Essence',
            description: 'Hydrating Serum for Face with Snail Secretion Filtrate for Dull Skin & Fine Lines',
            price: 16.89,
            originalPrice: 25.00,
            category: 'beauty',
            image: 'https://m.media-amazon.com/images/I/71v7rV3EFIL._AC_UL480_FMwebp_QL65_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/5157rPuPIML._AC_UL480_FMwebp_QL65_.jpg'
            ],
            rating: 4.6,
            reviewCount: 89012,
            stock: 150,
            features: [
                '96% Snail Secretion Filtrate',
                'Repairs and hydrates',
                'Suitable for all skin types',
                'Lightweight formula',
                'Korean skincare favorite'
            ],
            isBestSeller: true,
            isOnSale: true
        },
        {
            id: '12',
            title: 'YETI Rambler 20 oz Tumbler Stainless Steel',
            description: 'Vacuum Insulated with MagSlider Lid, Navy',
            price: 35.00,
            originalPrice: 35.00,
            category: 'home',
            image: 'https://m.media-amazon.com/images/I/61zYxA+UHqL._AC_UL480_FMwebp_QL65_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/61lMbNYgEbL._AC_UL480_FMwebp_QL65_.jpg'
            ],
            rating: 4.9,
            reviewCount: 45678,
            stock: 200,
            features: [
                'Double-wall vacuum insulation',
                '18/8 stainless steel',
                'MagSlider Lid',
                'Dishwasher safe',
                'No sweat design'
            ],
            isBestSeller: true,
            isOnSale: false
        }
    ],

    // Get all products
    getAll() {
        return this.products;
    },

    // Get product by ID
    getById(id) {
        return this.products.find(p => p.id === id);
    },

    // Get products by category
    getByCategory(category) {
        if (category === 'all') return this.products;
        return this.products.filter(p => p.category === category);
    },

    // Get best sellers
    getBestSellers() {
        return this.products.filter(p => p.isBestSeller);
    },

    // Get deals (products on sale)
    getDeals() {
        return this.products.filter(p => p.isOnSale);
    },

    // Search products
    search(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(p =>
            p.title.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    },

    // Sort products
    sort(products, sortBy) {
        const sorted = [...products];
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
            default:
                return sorted;
        }
    },

    // Get all categories
    getCategories() {
        return this.categories;
    }
};

// Make ProductsData globally available
window.ProductsData = ProductsData;
