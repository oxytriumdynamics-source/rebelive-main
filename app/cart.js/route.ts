import { NextResponse } from 'next/server';

export async function GET() {
  const cartData = {
    token: 'rebelive_fastrr_cart',
    note: null,
    attributes: {},
    original_total_price: 79900,
    total_price: 79900,
    total_discount: 0,
    total_weight: 500,
    item_count: 1,
    items: [
      {
        id: 101,
        properties: {},
        quantity: 1,
        variant_id: 101,
        key: '101:1',
        title: 'APEX Clean Bio-Energy',
        price: 79900,
        original_price: 79900,
        discounted_price: 79900,
        line_price: 79900,
        original_line_price: 79900,
        total_discount: 0,
        discounts: [],
        sku: 'RBL-APEX-6PK',
        grams: 500,
        vendor: 'Rebelive',
        taxable: true,
        product_id: 1,
        product_has_only_default_variant: false,
        gift_card: false,
        final_price: 79900,
        final_line_price: 79900,
        url: '/shop/apex',
        featured_image: {
          url: 'https://rebelive.com/brand/APEX.webp',
        },
        image: 'https://rebelive.com/brand/APEX.webp',
        handle: 'apex',
        requires_shipping: true,
        product_type: 'Energy Drink',
        product_title: 'APEX Clean Bio-Energy',
        product_description: 'Clean Bio-Energy Drink',
        variant_title: '6-Pack Case',
        variant_options: ['6-Pack Case'],
      },
    ],
    requires_shipping: true,
    currency: 'INR',
    items_subtotal_price: 79900,
  };

  return NextResponse.json(cartData, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
