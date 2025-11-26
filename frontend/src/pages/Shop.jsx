import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiService from '../utils/apiService';

const Shop = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('-createdAt');
    const [searchQuery, setSearchQuery] = useState('');

    // Handle canceled checkout - mark order as failed
    useEffect(() => {
        const canceled = searchParams.get('canceled');
        const orderId = searchParams.get('order_id');

        if (canceled === 'true' && orderId) {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            
            fetch(`${apiUrl}/api/products/cancel/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(async (response) => {
                const data = await response.json();
                
                if (response.ok) {
                    console.log('Order marked as canceled');
                } else {
                    console.error('Failed to cancel order:', data);
                }
                
                // Clean up URL parameters
                navigate('/shop', { replace: true });
            })
            .catch(err => {
                console.error('Error canceling order:', err);
            });
        }
    }, [searchParams, navigate]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/api/products');
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await apiService.get('/api/products/categories');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const filterProducts = useCallback(() => {
        let filtered = [...products];

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }

        // Sort
        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case '-createdAt':
            default:
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        setFilteredProducts(filtered);
    }, [products, selectedCategory, sortBy, searchQuery]);

    useEffect(() => {
        filterProducts();
    }, [filterProducts]);

    const handleBuyNow = (productId) => {
        navigate(`/shop/checkout/${productId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zonta-burgundy mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-zonta-burgundy mb-4">
                        Shop
                    </h1>
                    <div className="w-24 h-1 bg-zonta-gold mx-auto mb-6"></div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Support our mission by purchasing Zonta merchandise. All proceeds benefit our programs.
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zonta-burgundy focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zonta-burgundy focus:border-transparent"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat._id} ({cat.count})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zonta-burgundy focus:border-transparent"
                            >
                                <option value="-createdAt">Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Product Image */}
                                <div className="relative h-64 bg-gray-200">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0].url}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-gray-400 text-4xl">📦</span>
                                        </div>
                                    )}
                                    
                                    {/* Out of Stock Badge */}
                                    {product.trackInventory && product.inventory === 0 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {product.shortDescription || product.description}
                                    </p>

                                    {/* Price */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-2xl font-bold text-zonta-burgundy">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ${product.compareAtPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Stock Info */}
                                    {product.trackInventory && product.inventory > 0 && product.inventory < 10 && (
                                        <p className="text-xs text-orange-600 mb-3">
                                            Only {product.inventory} left in stock
                                        </p>
                                    )}

                                    {/* Buy Button */}
                                    <button
                                        onClick={() => handleBuyNow(product._id)}
                                        disabled={product.trackInventory && product.inventory === 0 && !product.allowBackorder}
                                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                                            product.trackInventory && product.inventory === 0 && !product.allowBackorder
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-zonta-burgundy text-white hover:bg-zonta-burgundy-dark'
                                        }`}
                                    >
                                        {product.trackInventory && product.inventory === 0 && !product.allowBackorder ? (
                                            'Out of Stock'
                                        ) : (
                                            'Buy Now'
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
