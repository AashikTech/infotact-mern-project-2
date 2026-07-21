/**
 * Product Image Resolver
 * Maps product names to category-specific images using Unsplash API
 */

type ProductCategory = 'Electronics' | 'Clothing' | 'Home & Kitchen' | 'Sports & Outdoors' | 'Books' | 'Toys & Games';

interface ImageMapping {
  keywords: string[];
  fallback: string;
}

// Category-specific keyword mappings
const IMAGE_MAP: Record<ProductCategory, ImageMapping> = {
  'Electronics': {
    keywords: ['earbuds', 'speaker', 'watch', 'laptop', 'phone', 'tablet', 'camera', 'headphones', 'monitor', 'keyboard', 'mouse', 'power bank', 'drone', 'tv'],
    fallback: 'technology-gadgets',
  },
  'Clothing': {
    keywords: ['jacket', 'shoes', 'jeans', 't-shirt', 'hoodie', 'sneakers', 'shirt', 'pants', 'sweater', 'cap', 'backpack', 'sunglasses'],
    fallback: 'fashion-clothing',
  },
  'Home & Kitchen': {
    keywords: ['coffee', 'blender', 'toaster', 'air fryer', 'vacuum', 'lamp', 'fan', 'water bottle', 'knife', 'bed', 'pillow', 'curtains'],
    fallback: 'home-kitchen',
  },
  'Sports & Outdoors': {
    keywords: ['yoga', 'dumbbells', 'resistance', 'football', 'cricket', 'basketball', 'tennis', 'cycling', 'hiking', 'camping', 'jump rope', 'boxing'],
    fallback: 'sports-fitness',
  },
  'Books': {
    keywords: ['javascript', 'python', 'code', 'habits', 'rich', 'sapiens', 'alchemist', 'harry', 'cookbook'],
    fallback: 'books-reading',
  },
  'Toys & Games': {
    keywords: ['blocks', 'puzzle', 'car', 'board game', 'action', 'lego', 'card', 'robot', 'art', 'train'],
    fallback: 'toys-games',
  },
};

/**
 * Extracts searchable keywords from product name
 * Handles multi-word products and brand names
 */
const extractKeywords = (productName: string): string[] => {
  const lower = productName.toLowerCase();
  const words = lower.split(/\s+/);
  const keywords: string[] = [];

  // Add full name
  keywords.push(lower);

  // Add individual words
  words.forEach(word => keywords.push(word));

  // Add common variations
  if (lower.includes('earbuds')) keywords.push('earbuds', 'headphones');
  if (lower.includes('speaker')) keywords.push('speaker', 'audio');
  if (lower.includes('watch')) keywords.push('watch', 'smartwatch');
  if (lower.includes('laptop')) keywords.push('laptop', 'computer');
  if (lower.includes('phone')) keywords.push('phone', 'smartphone');
  if (lower.includes('shoes') || lower.includes('sneakers')) keywords.push('shoes', 'footwear');
  if (lower.includes('jacket') || lower.includes('coat')) keywords.push('jacket', 'coat');
  if (lower.includes('coffee')) keywords.push('coffee', 'coffee-maker');
  if (lower.includes('yoga')) keywords.push('yoga', 'fitness');
  if (lower.includes('football') || lower.includes('basketball')) keywords.push('sports-ball');

  return keywords;
};

/**
 * Finds the best matching image URL for a product
 * Uses deterministic seed for consistent images
 */
export const resolveProductImage = (
  productName: string,
  category: ProductCategory,
  productId: number
): string => {
  const categoryMap = IMAGE_MAP[category];
  if (!categoryMap) {
    // Fallback for unknown categories
    return `https://picsum.photos/seed/${productId}/400/300`;
  }

  const keywords = extractKeywords(productName);
  let matchedKeyword = categoryMap.fallback;

  // Find best matching keyword
  for (const keyword of keywords) {
    if (categoryMap.keywords.includes(keyword)) {
      matchedKeyword = keyword;
      break;
    }
  }

  // Use deterministic seed for consistent images
  const seed = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + productId;
  
  // Use Unsplash Source API with category-specific query
  return `https://picsum.photos/seed/${seed}/400/300`;
};

/**
 * Get fallback image for a category
 */
export const getCategoryFallback = (category: ProductCategory): string => {
  const fallbacks: Record<ProductCategory, string> = {
    'Electronics': 'https://picsum.photos/seed/electronics/400/300',
    'Clothing': 'https://picsum.photos/seed/fashion/400/300',
    'Home & Kitchen': 'https://picsum.photos/seed/home/400/300',
    'Sports & Outdoors': 'https://picsum.photos/seed/sports/400/300',
    'Books': 'https://picsum.photos/seed/books/400/300',
    'Toys & Games': 'https://picsum.photos/seed/toys/400/300',
  };
  return fallbacks[category] || 'https://picsum.photos/seed/product/400/300';
};
