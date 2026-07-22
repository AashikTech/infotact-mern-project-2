/**
 * Product Image Resolver
 * Maps product names to relevant images based on keywords and category
 */

interface ImageMapping {
  keywords: string[];
  category: string;
  query: string;
}

// Category-specific keyword mappings
const IMAGE_MAPPINGS: ImageMapping[] = [
  // ELECTRONICS
  { keywords: ['laptop', 'notebook', 'macbook'], category: 'Electronics', query: 'laptop' },
  { keywords: ['smartphone', 'phone', 'iphone', 'galaxy'], category: 'Electronics', query: 'smartphone' },
  { keywords: ['tablet', 'ipad'], category: 'Electronics', query: 'tablet' },
  { keywords: ['headphones', 'headset', 'earphones'], category: 'Electronics', query: 'headphones' },
  { keywords: ['earbuds', 'airpods'], category: 'Electronics', query: 'earbuds' },
  { keywords: ['speaker', 'bluetooth speaker'], category: 'Electronics', query: 'speaker' },
  { keywords: ['camera', 'dslr', 'mirrorless'], category: 'Electronics', query: 'camera' },
  { keywords: ['smartwatch', 'watch'], category: 'Electronics', query: 'smartwatch' },
  { keywords: ['monitor', 'display', 'screen'], category: 'Electronics', query: 'monitor' },
  { keywords: ['keyboard'], category: 'Electronics', query: 'keyboard' },
  { keywords: ['mouse'], category: 'Electronics', query: 'mouse' },
  { keywords: ['power bank', 'charger'], category: 'Electronics', query: 'power-bank' },

  // CLOTHING
  { keywords: ['shoes', 'sneakers', 'running shoes'], category: 'Clothing', query: 'sneakers' },
  { keywords: ['boots', 'hiking boots'], category: 'Clothing', query: 'boots' },
  { keywords: ['jacket', 'coat', 'blazer'], category: 'Clothing', query: 'jacket' },
  { keywords: ['jeans', 'denim', 'pants'], category: 'Clothing', query: 'jeans' },
  { keywords: ['t-shirt', 'tee', 'shirt'], category: 'Clothing', query: 'tshirt' },
  { keywords: ['hoodie', 'sweatshirt'], category: 'Clothing', query: 'hoodie' },
  { keywords: ['dress'], category: 'Clothing', query: 'dress' },
  { keywords: ['sunglasses', 'shades'], category: 'Clothing', query: 'sunglasses' },
  { keywords: ['backpack', 'bag'], category: 'Clothing', query: 'backpack' },
  { keywords: ['cap', 'hat', 'beanie'], category: 'Clothing', query: 'cap' },
  { keywords: ['belt'], category: 'Clothing', query: 'belt' },
  { keywords: ['socks'], category: 'Clothing', query: 'socks' },
  { keywords: ['sweater', 'sweatshirt'], category: 'Clothing', query: 'sweater' },
  { keywords: ['shorts'], category: 'Clothing', query: 'shorts' },

  // HOME & KITCHEN
  { keywords: ['coffee maker', 'coffee machine', 'espresso'], category: 'Home & Kitchen', query: 'coffee-maker' },
  { keywords: ['blender', 'mixer'], category: 'Home & Kitchen', query: 'blender' },
  { keywords: ['toaster'], category: 'Home & Kitchen', query: 'toaster' },
  { keywords: ['air fryer'], category: 'Home & Kitchen', query: 'air-fryer' },
  { keywords: ['vacuum', 'vacuum cleaner'], category: 'Home & Kitchen', query: 'vacuum' },
  { keywords: ['lamp', 'table lamp', 'desk lamp'], category: 'Home & Kitchen', query: 'lamp' },
  { keywords: ['fan', 'desk fan'], category: 'Home & Kitchen', query: 'fan' },
  { keywords: ['water bottle'], category: 'Home & Kitchen', query: 'water-bottle' },
  { keywords: ['knife', 'knife set'], category: 'Home & Kitchen', query: 'knife' },
  { keywords: ['bed sheet', 'sheets'], category: 'Home & Kitchen', query: 'bedsheet' },
  { keywords: ['pillow'], category: 'Home & Kitchen', query: 'pillow' },
  { keywords: ['curtains', 'curtain'], category: 'Home & Kitchen', query: 'curtains' },
  { keywords: ['chair', 'desk chair'], category: 'Home & Kitchen', query: 'chair' },
  { keywords: ['desk', 'table'], category: 'Home & Kitchen', query: 'desk' },

  // SPORTS & OUTDOORS
  { keywords: ['yoga mat'], category: 'Sports & Outdoors', query: 'yoga-mat' },
  { keywords: ['dumbbells', 'weights'], category: 'Sports & Outdoors', query: 'dumbbells' },
  { keywords: ['resistance bands'], category: 'Sports & Outdoors', query: 'resistance-bands' },
  { keywords: ['football', 'soccer'], category: 'Sports & Outdoors', query: 'football' },
  { keywords: ['cricket bat'], category: 'Sports & Outdoors', query: 'cricket' },
  { keywords: ['basketball'], category: 'Sports & Outdoors', query: 'basketball' },
  { keywords: ['tennis racket'], category: 'Sports & Outdoors', query: 'tennis-racket' },
  { keywords: ['cycling helmet'], category: 'Sports & Outdoors', query: 'helmet' },
  { keywords: ['hiking boots'], category: 'Sports & Outdoors', query: 'hiking-boots' },
  { keywords: ['camping tent'], category: 'Sports & Outdoors', query: 'tent' },
  { keywords: ['jump rope'], category: 'Sports & Outdoors', query: 'jump-rope' },
  { keywords: ['boxing gloves'], category: 'Sports & Outdoors', query: 'boxing-gloves' },

  // BOOKS
  { keywords: ['javascript', 'programming', 'coding'], category: 'Books', query: 'programming-book' },
  { keywords: ['python'], category: 'Books', query: 'python-book' },
  { keywords: ['clean code', 'design patterns'], category: 'Books', query: 'tech-book' },
  { keywords: ['habits', 'atomic'], category: 'Books', query: 'self-help-book' },
  { keywords: ['think', 'rich'], category: 'Books', query: 'business-book' },
  { keywords: ['sapiens', 'alchemist'], category: 'Books', query: 'novel-book' },
  { keywords: ['harry', 'potter', 'lord', 'rings'], category: 'Books', query: 'fantasy-book' },
  { keywords: ['cookbook', 'cooking'], category: 'Books', query: 'cookbook' },

  // TOYS & GAMES
  { keywords: ['building blocks', 'lego'], category: 'Toys & Games', query: 'lego-blocks' },
  { keywords: ['puzzle'], category: 'Toys & Games', query: 'puzzle' },
  { keywords: ['remote control car'], category: 'Toys & Games', query: 'rc-car' },
  { keywords: ['board game'], category: 'Toys & Games', query: 'board-game' },
  { keywords: ['action figure'], category: 'Toys & Games', query: 'action-figure' },
  { keywords: ['card game'], category: 'Toys & Games', query: 'card-game' },
  { keywords: ['robot kit', 'robot'], category: 'Toys & Games', query: 'robot-toy' },
  { keywords: ['art set', 'art'], category: 'Toys & Games', query: 'art-supplies' },
  { keywords: ['train set', 'train'], category: 'Toys & Games', query: 'toy-train' },
];

/**
 * Extract keywords from product name
 * Removes brand names and common filler words
 */
const extractKeywords = (productName: string): string[] => {
  const stopWords = ['the', 'a', 'an', 'pro', 'plus', 'ultra', 'premium', 'new', 'classic', 'essential', 'elite', 'advanced', 'basic'];
  const brands = ['apple', 'samsung', 'nike', 'adidas', 'sony', 'lg', 'dyson', 'dell', 'jbl', 'canon', 'nikon', 'keurig', 'ninja', 'philips', 'ikea', 'hamilton beach', 'cuisinart', 'vitamix', 'wilson', 'coleman', 'manduka', 'spalding', 'everlast', 'under armour', 'lego', 'hasbro', 'hot wheels', 'ravensburger', 'crayola', 'oreilly', 'penguin', 'harper', 'bloomsbury'];

  return productName
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .filter(word => !stopWords.includes(word))
    .filter(word => !brands.some(b => word.includes(b)));
};

/**
 * Find best matching image for product
 */
export const resolveProductImage = (productName: string, category: string, id: number): string => {
  const keywords = extractKeywords(productName);

  // Try exact keyword match
  for (const keyword of keywords) {
    for (const mapping of IMAGE_MAPPINGS) {
      if (mapping.category === category && mapping.keywords.some(k => keyword.includes(k) || k.includes(keyword))) {
        const seed = productName.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0) + id;
        return `https://placehold.co/400x300/1e293b/ffffff?text=${encodeURIComponent(mapping.query)}`;
      }
    }
  }

  // Fallback to category default
  const categoryDefaults: Record<string, string> = {
    'Electronics': 'electronics',
    'Clothing': 'fashion',
    'Home & Kitchen': 'home',
    'Sports & Outdoors': 'sports',
    'Books': 'books',
    'Toys & Games': 'toys',
  };

  const defaultQuery = categoryDefaults[category] || 'product';
  return `https://placehold.co/400x300/1e293b/ffffff?text=${encodeURIComponent(defaultQuery)}`;
};

export default resolveProductImage;
