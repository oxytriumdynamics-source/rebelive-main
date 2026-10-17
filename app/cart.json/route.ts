import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  let itemsList: any[] = [];
  try {
    const rawCookie = req.cookies.get('rebelive_fastrr_items')?.value;
    if (rawCookie) {
      const parsed = JSON.parse(decodeURIComponent(rawCookie));
      if (Array.isArray(parsed) && parsed.length > 0) {
        itemsList = parsed;
      }
    }
  } catch {}

  if (itemsList.length === 0) {
    try {
      const cartCookie = req.cookies.get('rebelive_cart_v1')?.value;
      if (cartCookie) {
        const parsed = JSON.parse(decodeURIComponent(cartCookie));
        if (Array.isArray(parsed) && parsed.length > 0) {
          itemsList = parsed.map((item: any) => ({
            name: item.name,
            flavor: item.flavor,
            packSize: item.packSize,
            quantity: item.quantity,
            unitPrice: item.pricePerUnit,
            variantId: item.packSize === 12 ? 104 : item.packSize === 9 ? 103 : item.packSize === 6 ? 102 : 101,
            image: item.image,
            productId: item.id,
            slug: item.id,
          }));
        }
      }
    } catch {}
  }

  // Fallback if no items in cookie
  if (itemsList.length === 0) {
    itemsList = [
      {
        name: 'APEX Clean Bio-Energy',
        flavor: 'Apex',
        packSize: 6,
        quantity: 1,
        unitPrice: 799,
        variantId: 102,
        image: 'https://rebelive.com/brand/APEX.webp',
        slug: 'apex',
      },
    ];
  }

  let totalPriceInPaise = 0;
  const mappedItems = itemsList.map((item: any, idx: number) => {
    const unitPrice = Number(item.unitPrice) || 799;
    const pricePaise = unitPrice * 100;
    const qty = Math.max(1, Number(item.quantity) || 1);
    const linePrice = pricePaise * qty;
    totalPriceInPaise += linePrice;

    const varId = Number(item.variantId) || 102;
    const title = item.name || 'APEX Clean Bio-Energy';
    const packSize = item.packSize || 6;
    const variantTitle = `${packSize}-Pack Case`;

    return {
      id: varId,
      properties: {},
      quantity: qty,
      variant_id: varId,
      key: `${varId}:${idx + 1}`,
      title: `${title} · ${variantTitle}`,
      price: pricePaise,
      original_price: pricePaise,
      discounted_price: pricePaise,
      line_price: linePrice,
      original_line_price: linePrice,
      total_discount: 0,
      discounts: [],
      sku: `RBL-${(item.slug || 'APEX').toUpperCase()}-${packSize}PK`,
      grams: packSize * 250,
      vendor: 'Rebelive',
      taxable: true,
      product_id: 1,
      product_has_only_default_variant: false,
      gift_card: false,
      final_price: pricePaise,
      final_line_price: linePrice,
      url: `/shop/${item.slug || 'apex'}`,
      featured_image: {
        url: item.image || 'https://rebelive.com/brand/APEX.webp',
      },
      image: item.image || 'https://rebelive.com/brand/APEX.webp',
      handle: item.slug || 'apex',
      requires_shipping: true,
      product_type: 'Energy Drink',
      product_title: title,
      product_description: 'Clean Bio-Energy Functional Drink',
      variant_title: variantTitle,
      variant_options: [variantTitle],
    };
  });

  const cartData = {
    token: 'rebelive_fastrr_cart',
    note: null,
    attributes: {},
    original_total_price: totalPriceInPaise,
    total_price: totalPriceInPaise,
    total_discount: 0,
    total_weight: 500,
    item_count: mappedItems.reduce((acc, itm) => acc + itm.quantity, 0),
    items: mappedItems,
    requires_shipping: true,
    currency: 'INR',
    items_subtotal_price: totalPriceInPaise,
  };

  return NextResponse.json(cartData, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
