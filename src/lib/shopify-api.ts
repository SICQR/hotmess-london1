// HOTMESS LONDON - Shopify Storefront API Integration
// Fetches products from Shopify for RAW, HUNG, HIGH, SUPER collections

import { SHOPIFY_DOMAIN, SHOPIFY_STOREFRONT_TOKEN } from './env';

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  vendor: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        quantityAvailable: number;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  metafields: Array<{
    key: string;
    value: string;
  } | null>;
}

interface ShopifyResponse {
  data: {
    products?: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
    product?: ShopifyProduct;
  };
  errors?: Array<{ message: string }>;
}

// GraphQL query for fetching products by collection
const PRODUCTS_BY_COLLECTION_QUERY = `
  query getProductsByCollection($collectionHandle: String!, $first: Int!) {
    collection(handle: $collectionHandle) {
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            descriptionHtml
            productType
            tags
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            metafields(identifiers: [
              { namespace: "custom", key: "xp_reward" }
              { namespace: "custom", key: "aftercare_note" }
              { namespace: "custom", key: "care_instructions" }
              { namespace: "custom", key: "materials" }
              { namespace: "custom", key: "features" }
            ]) {
              key
              value
            }
          }
        }
      }
    }
  }
`;

// GraphQL query for fetching a single product
const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      productType
      tags
      vendor
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            quantityAvailable
            selectedOptions {
              name
              value
            }
          }
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "xp_reward" }
        { namespace: "custom", key: "aftercare_note" }
        { namespace: "custom", key: "care_instructions" }
        { namespace: "custom", key: "materials" }
        { namespace: "custom", key: "features" }
      ]) {
        key
        value
      }
    }
  }
`;

async function shopifyFetch<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error(
      'Shopify is not configured. Set VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN in your environment (Vercel Project Settings → Environment Variables, or local .env.local).'
    );
  }
  const endpoint = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const json: ShopifyResponse = await response.json();

  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }

  return json.data as T;
}

/**
 * Fetch products from a Shopify collection
 * Collections: 'raw', 'hung', 'high', 'super'
 */
export async function getProductsByCollection(collectionHandle: string, limit = 20) {
  try {
    const data = await shopifyFetch<{
      collection: {
        products: {
          edges: Array<{ node: ShopifyProduct }>;
        };
      };
    }>(PRODUCTS_BY_COLLECTION_QUERY, {
      collectionHandle: collectionHandle.toLowerCase(),
      first: limit,
    });

    if (!data.collection) {
      return [];
    }

    return data.collection.products.edges.map(({ node }) => transformShopifyProduct(node, collectionHandle));
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
}

/**
 * Fetch a single product by handle (slug)
 */
export async function getProductByHandle(handle: string) {
  try {
    const data = await shopifyFetch<{ product: ShopifyProduct }>(PRODUCT_BY_HANDLE_QUERY, { handle });

    if (!data.product) {
      return null;
    }

    return transformShopifyProduct(data.product);
  } catch (error) {
    console.error('Error fetching Shopify product:', error);
    return null;
  }
}

/**
 * Transform Shopify product to HOTMESS product format
 */
function transformShopifyProduct(shopifyProduct: ShopifyProduct, collection?: string) {
  const metafields = shopifyProduct.metafields.reduce((acc, metafield) => {
    if (metafield) {
      acc[metafield.key] = metafield.value;
    }
    return acc;
  }, {} as Record<string, string>);

  // Extract sizes and colors from variants
  const sizes = new Set<string>();
  const colors = new Set<string>();
  
  shopifyProduct.variants.edges.forEach(({ node }) => {
    node.selectedOptions.forEach(option => {
      if (option.name.toLowerCase() === 'size') sizes.add(option.value);
      if (option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour') colors.add(option.value);
    });
  });

  // Determine stock status
  const availableVariants = shopifyProduct.variants.edges.filter(({ node }) => node.availableForSale);
  const totalStock = availableVariants.reduce((sum, { node }) => sum + (node.quantityAvailable || 0), 0);
  
  let stock: 'in' | 'low' | 'out' = 'out';
  if (totalStock > 10) stock = 'in';
  else if (totalStock > 0) stock = 'low';

  // Determine collection from tags if not provided
  const productCollection = collection || 
    (shopifyProduct.tags.find(tag => ['raw', 'hung', 'high', 'super'].includes(tag.toLowerCase()))?.toLowerCase() as 'raw' | 'hung' | 'high' | 'super' || 'raw');

  return {
    id: shopifyProduct.id,
    slug: shopifyProduct.handle,
    name: shopifyProduct.title,
    collection: productCollection,
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    images: shopifyProduct.images.edges.map(({ node }) => node.url),
    description: shopifyProduct.description.substring(0, 200),
    longDescription: shopifyProduct.descriptionHtml || shopifyProduct.description,
    sizes: Array.from(sizes),
    colors: Array.from(colors).length > 0 ? Array.from(colors) : undefined,
    materials: metafields.materials ? JSON.parse(metafields.materials) : [],
    careInstructions: metafields.care_instructions || 'Machine wash cold. Tumble dry low.',
    features: metafields.features ? JSON.parse(metafields.features) : [],
    bestseller: shopifyProduct.tags.includes('bestseller'),
    newArrival: shopifyProduct.tags.includes('new-arrival'),
    limitedEdition: shopifyProduct.tags.includes('limited-edition'),
    stock,
    xp: metafields.xp_reward ? parseInt(metafields.xp_reward) : 10,
    aftercareNote: metafields.aftercare_note,
    tags: shopifyProduct.tags,
    variants: shopifyProduct.variants.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      price: parseFloat(node.price.amount),
      availableForSale: node.availableForSale,
      quantityAvailable: node.quantityAvailable,
      selectedOptions: node.selectedOptions,
    })),
  };
}

/**
 * Create Shopify checkout with cart items
 */
export async function createCheckout(lineItems: Array<{ variantId: string; quantity: number }>) {
  const CHECKOUT_CREATE_MUTATION = `
    mutation checkoutCreate($lineItems: [CheckoutLineItemInput!]!) {
      checkoutCreate(input: { lineItems: $lineItems }) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      checkoutCreate: {
        checkout: { id: string; webUrl: string };
        checkoutUserErrors: Array<{ message: string }>;
      };
    }>(CHECKOUT_CREATE_MUTATION, { lineItems });

    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
    }

    return data.checkoutCreate.checkout;
  } catch (error) {
    console.error('Error creating Shopify checkout:', error);
    throw error;
  }
}
