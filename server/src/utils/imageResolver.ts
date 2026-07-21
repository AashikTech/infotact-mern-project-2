/**
 * Product Image Resolver
 * Maps product names to category-specific placeholder images
 */

type ProductCategory = 'Electronics' | 'Clothing' | 'Home & Kitchen' | 'Sports & Outdoors' | 'Books' | 'Toys & Games';

// Category-specific colors for professional look
const CATEGORY_COLORS: Record<ProductCategory, { bg: string; text: string }> = {
  'Electronics': { bg: '1a1a2e', text: 'e0e0e0' },
  'Clothing': { bg: '2d1b69', text: 'e0e0e0' },
  'Home & Kitchen': { bg: '1b4332', text: 'e0e0e0' },
  'Sports & Outdoors': { bg: '7f1d1d', text: 'e0e0e0' },
  'Books': { bg: '1e3a5f', text: 'e0e0e0' },
  'Toys & Games': { bg: '4a1942', text: 'e0e0e0' },
};

/**
 * Extracts the main product type from the full name
 * "Samsung Wireless Earbuds" → "Earbuds"
 * "Nike Running Shoes" → "Running Shoes"
 */
const extractProductType = (productName: string): string => {
  const words = productName.split(' ');
  // Return last 1-2 words as product type
  return words.slice(-2).join(' ');
};

/**
 * Resolves product image URL
 * Uses placeholder.com with category color and product name
 */
export const resolveProductImage = (
  productName: string,
  category: ProductCategory,
  _productId: number
): string => {
  const colors = CATEGORY_COLORS[category] || { bg: '333333', text: 'ffffff' };
  const productType = extractProductType(productName);
  
  // URL-encode the product name for the placeholder
  const encodedName = encodeURIComponent(productType);
  
  return `https://placehold.co/400x300/${colors.bg}/${colors.text}?text=${encodedName}`;
};

export default resolveProductImage;
