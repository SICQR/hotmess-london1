// HOTMESS LONDON - Shopify Connection Test
// Run this to verify your Shopify integration is working

import { getProductsByCollection } from './shopify-api';

import { SHOPIFY_DOMAIN, SHOPIFY_STOREFRONT_TOKEN } from './env';

export async function testShopifyConnection() {
  console.log('🛍️  TESTING SHOPIFY CONNECTION...\n');
  console.log('Store:', SHOPIFY_DOMAIN);
  console.log('Token:', SHOPIFY_STOREFRONT_TOKEN ? `${SHOPIFY_STOREFRONT_TOKEN.substring(0, 10)}...${SHOPIFY_STOREFRONT_TOKEN.slice(-5)}` : 'NOT SET');
  console.log('');

  const collections = ['raw', 'hung', 'high', 'super'];
  
  interface TestResult {
    success: boolean;
    count?: number;
    error?: string;
  }
  
  const results: Record<string, TestResult> = {};

  for (const collection of collections) {
    console.log(`\n📦 Testing "${collection.toUpperCase()}" collection...`);
    
    try {
      const products = await getProductsByCollection(collection, 10);
      
      if (products.length > 0) {
        console.log(`✅ SUCCESS! Found ${products.length} products:`);
        products.forEach(p => {
          console.log(`   - ${p.name}`);
          console.log(`     Price: £${p.price} | Stock: ${p.stock} | XP: ${p.xp}`);
          if (p.sizes.length > 0) {
            console.log(`     Sizes: ${p.sizes.join(', ')}`);
          }
          if (p.colors && p.colors.length > 0) {
            console.log(`     Colors: ${p.colors.join(', ')}`);
          }
          console.log('');
        });
        results[collection] = { success: true, count: products.length };
      } else {
        console.log(`⚠️  No products found in "${collection}" collection`);
        console.log(`   Add products to this collection in Shopify admin:`);
        console.log(`   https://admin.shopify.com/store/1e0297-a4/collections\n`);
        results[collection] = { success: true, count: 0 };
      }
    } catch (error) {
      const err = error as Error;
      console.log(`❌ ERROR: ${err.message}`);
      results[collection] = { success: false, error: err.message };
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));

  const successful = Object.values(results).filter((r) => r.success).length;
  const totalProducts = Object.values(results).reduce((sum: number, r) => sum + (r.count || 0), 0);

  console.log(`Collections tested: ${collections.length}`);
  console.log(`Successful connections: ${successful}/${collections.length}`);
  console.log(`Total products found: ${totalProducts}`);

  if (successful === collections.length) {
    console.log('\n✅ SHOPIFY INTEGRATION WORKING!');
    
    if (totalProducts === 0) {
      console.log('\n⚠️  NEXT STEP: Add products to your collections');
      console.log('Go to: https://admin.shopify.com/store/1e0297-a4/products');
      console.log('Create products and assign them to collections: raw, hung, high, super');
    } else {
      console.log('\n🚀 READY TO USE! Your shop pages will now pull from Shopify.');
    }
  } else {
    console.log('\n❌ SOME ISSUES FOUND');
    console.log('\nTroubleshooting:');
    console.log('1. Verify collections exist: raw, hung, high, super');
    console.log('2. Check Storefront API scopes in Shopify app settings');
    console.log('3. Confirm app is installed and active');
    console.log('4. See /SHOPIFY_SETUP_YOUR_STORE.md for detailed setup');
  }

  return results;
}

// Run test if executed directly
if (typeof window === 'undefined' && require.main === module) {
  testShopifyConnection()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
