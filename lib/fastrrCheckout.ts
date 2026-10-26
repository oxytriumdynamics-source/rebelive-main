/**
 * Shiprocket Checkout (SRC / Fastrr) 1-Click Headless Checkout Trigger
 * Directly calls window.HeadlessCheckout.addToCart(event, token, { fallbackUrl, isInitiatedFromApp })
 * Documentation: SRC Custom Integration Docs (Pages 17-18).
 */

declare global {
  interface Window {
    HeadlessCheckout?: {
      addToCart: (
        event: any,
        token: string,
        options?: { fallbackUrl?: string; isInitiatedFromApp?: boolean },
        callback?: (res: any) => void
      ) => void;
      buyNow?: (event: any) => void;
      checkout?: (event: any) => void;
    };
    srCustomCheckoutCallBackFn?: (res: any) => void;
    checkoutBuyer?: string;
  }
}

/**
 * Extracts address, customer, and orderId from any Fastrr event, callback, or message
 * and persists to sessionStorage and localStorage so order confirmation can send authentic data.
 */
export function extractAndStoreFastrrData(data: any): { address: any; billingAddress: any; customer: any; orderId: any } {
  if (!data) return { address: null, billingAddress: null, customer: null, orderId: null };
  let payload = data;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      if (payload.includes(',') && /\b\d{6}\b/.test(payload)) {
        payload = { address: payload };
      } else {
        return { address: null, billingAddress: null, customer: null, orderId: null };
      }
    }
  }

  const orderId =
    payload.order_id ||
    payload.orderId ||
    payload.id ||
    payload.fastrr_order_id ||
    payload.data?.order_id ||
    payload.order?.order_id ||
    payload.result?.data?.order_id ||
    null;

  let address =
    payload.shipping_address ||
    payload.delivery_address ||
    payload.selected_address ||
    payload.address ||
    payload.data?.shipping_address ||
    payload.data?.address ||
    payload.order?.shipping_address ||
    payload.result?.shipping_address ||
    payload.billing_address ||
    null;

  let billingAddress =
    payload.billing_address ||
    payload.data?.billing_address ||
    payload.order?.billing_address ||
    payload.result?.billing_address ||
    null;

  if (
    !address &&
    (payload.pincode ||
      payload.postal_code ||
      payload.city ||
      payload.address1 ||
      payload.line1 ||
      payload.street ||
      payload.complete_address)
  ) {
    address = {
      line1: payload.address1 || payload.line1 || payload.street || payload.address || payload.complete_address || '',
      line2: payload.address2 || payload.line2 || payload.landmark || '',
      city: payload.city || payload.district || '',
      state: payload.state || payload.province || '',
      postalCode: payload.pincode || payload.postal_code || payload.zip || payload.pin || '',
      country: payload.country || 'India',
    };
  }

  const customer =
    payload.customer ||
    payload.buyer ||
    payload.user ||
    payload.data?.customer ||
    payload.order?.customer ||
    payload.result?.customer ||
    (payload.phone || payload.email || payload.name || payload.result?.phone || payload.result?.email
      ? {
          name:
            payload.name ||
            payload.result?.name ||
            (payload.first_name || payload.result?.shipping_address?.first_name
              ? `${payload.first_name || payload.result?.shipping_address?.first_name || ''} ${
                  payload.last_name || payload.result?.shipping_address?.last_name || ''
                }`.trim()
              : undefined),
          email: payload.email || payload.result?.email || undefined,
          phone: payload.phone || payload.result?.phone || payload.mobile || payload.contact || undefined,
        }
      : null);

  if (typeof window !== 'undefined') {
    try {
      if (address) {
        sessionStorage.setItem('rebelive_fastrr_address', JSON.stringify(address));
        localStorage.setItem('rebelive_fastrr_address', JSON.stringify(address));
      }
      if (billingAddress) {
        sessionStorage.setItem('rebelive_fastrr_billing_address', JSON.stringify(billingAddress));
        localStorage.setItem('rebelive_fastrr_billing_address', JSON.stringify(billingAddress));
      }
      if (customer) {
        sessionStorage.setItem('rebelive_fastrr_customer', JSON.stringify(customer));
        localStorage.setItem('rebelive_fastrr_customer', JSON.stringify(customer));
      }
      if (orderId) {
        sessionStorage.setItem('rebelive_last_order_id', String(orderId));
        localStorage.setItem('rebelive_last_order_id', String(orderId));
      }
    } catch {}
  }

  return { address, billingAddress, customer, orderId };
}

if (typeof window !== 'undefined') {
  window.srCustomCheckoutCallBackFn = function (res: any) {
    extractAndStoreFastrrData(res);
  };

  window.addEventListener('message', (e: MessageEvent) => {
    if (e.data) {
      extractAndStoreFastrrData(e.data);
    }
  });
}

/**
 * Loads the Shiprocket Fastrr script and stylesheet dynamically if not already in document.
 */
export async function ensureFastrrAssetsLoaded(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. Check if HeadlessCheckout already available
  if (window.HeadlessCheckout && typeof window.HeadlessCheckout.addToCart === 'function') {
    return true;
  }

  // 2. Ensure CSS is loaded (PRODUCTION)
  const existingCss = document.querySelector('link[href*="shopify.css"]');
  if (!existingCss) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://checkout-ui.shiprocket.com/assets/styles/shopify.css';
    document.head.appendChild(link);
  }

  // 3. Ensure JS is loaded (PRODUCTION)
  const existingScript = document.querySelector('script[src*="shopify.js"]');
  if (existingScript && window.HeadlessCheckout?.addToCart) {
    return true;
  }

  return new Promise((resolve) => {
    let script = existingScript as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://checkout-ui.shiprocket.com/assets/js/channels/shopify.js';
      script.async = true;
      document.body.appendChild(script);
    }

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.HeadlessCheckout?.addToCart) {
        clearInterval(interval);
        resolve(true);
      } else if (attempts > 30) {
        clearInterval(interval);
        resolve(Boolean(window.HeadlessCheckout?.addToCart));
      }
    }, 50);

    script.onerror = () => {
      console.warn('⚠️ Shiprocket Fastrr CDN failed to load from primary CDN');
      clearInterval(interval);
      resolve(false);
    };
  });
}

export interface FastrrCheckoutItem {
  productId?: string | number;
  variantId?: string | number;
  slug?: string;
  packSize?: number;
  quantity: number;
  unitPrice?: number;
  name?: string;
  flavor?: string;
  image?: string;
}

export const PRODUCT_VARIANT_MAP: Record<string, Record<number, number>> = {
  apex: { 3: 101, 6: 102, 9: 103, 12: 104 },
  aviva: { 3: 105, 6: 106, 9: 107, 12: 108 },
  capella: { 3: 109, 6: 110, 9: 111, 12: 112 },
  variety: { 3: 113, 6: 114, 9: 115, 12: 116 },
};

export const PACK_PRICES: Record<number, number> = {
  3: 449,
  6: 799,
  9: 1149,
  12: 1499,
};

export function getVariantId(productIdOrSlug?: string, packSize: number = 6): number {
  if (!productIdOrSlug) return 102;
  const key = productIdOrSlug.toLowerCase().trim();
  if (key.includes('trio') || key.includes('variety')) {
    return PRODUCT_VARIANT_MAP.variety[packSize] || 114;
  }
  return PRODUCT_VARIANT_MAP[key]?.[packSize] || PRODUCT_VARIANT_MAP.apex[packSize] || 102;
}

/**
 * Global Instant Checkout Pause Flag
 * Set to true to temporarily pause and disable 1-Click Fastrr Instant Checkout across the store.
 */
export const IS_INSTANT_CHECKOUT_PAUSED = true;

/**
 * Generates token from backend and triggers the native Shiprocket Fastrr Instant Checkout UI directly.
 */
export async function launchFastrrCheckout(
  event?: any,
  items: FastrrCheckoutItem[] = [],
  couponCode?: string
): Promise<void> {
  if (typeof window === 'undefined') return;

  if (IS_INSTANT_CHECKOUT_PAUSED) {
    throw new Error('Instant checkout is temporarily paused for maintenance. Please check back shortly.');
  }

  if (!items || items.length === 0) {
    throw new Error('Your crate is empty. Please select an item to checkout.');
  }

  // Clear any existing stale container before initializing to avoid CHECKOUT_ALREADY_INIT
  const existingMain = document.getElementById('fastrr-main-container');
  if (existingMain) existingMain.remove();
  const existingHeadless = document.getElementById('headless-container');
  if (existingHeadless) existingHeadless.remove();
  const existingPreloader = document.getElementById('fastrr-pre-loader');
  if (existingPreloader) existingPreloader.style.display = 'none';
  document.body.style.overflow = '';

  const fallbackUrl = `${window.location.origin}/order-confirmation`;

  // Sync active checkout items into storage and cookies so order confirmation and headless cart stay 100% synchronized
  try {
    const itemsJson = JSON.stringify(items);
    sessionStorage.setItem('rebelive_fastrr_items', itemsJson);
    localStorage.setItem('rebelive_fastrr_items', itemsJson);
    document.cookie = `rebelive_fastrr_items=${encodeURIComponent(
      itemsJson
    )}; path=/; max-age=3600; SameSite=Lax`;
  } catch {}

  // 1. Ensure assets are loaded
  await ensureFastrrAssetsLoaded();

  // 2. Call Backend to generate Fastrr Access Token
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  let token = '';

  let customerPrefill: { name?: string; email?: string; phone?: string } | undefined = undefined;
  let authBearerToken: string | null = null;
  if (typeof window !== 'undefined') {
    authBearerToken = localStorage.getItem('accessToken');
    try {
      const rawUser = localStorage.getItem('authUser');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        customerPrefill = {
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || undefined,
          email: u.email || undefined,
          phone: u.phone || undefined,
        };
      }
    } catch {}
  }

  try {
    const res = await fetch(`${apiBase}/shipping/fastrr/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authBearerToken ? { Authorization: `Bearer ${authBearerToken}` } : {}),
      },
      body: JSON.stringify({
        items: items.map((i) => {
          const resolvedSlug = i.slug || (typeof i.productId === 'string' ? i.productId : undefined);
          const resolvedPack = i.packSize || 6;
          const resolvedPrice = i.unitPrice && i.unitPrice > 0 ? i.unitPrice : (PACK_PRICES[resolvedPack] || 799);
          const resolvedVariantId = i.variantId && /^\d+$/.test(String(i.variantId))
            ? String(i.variantId)
            : String(getVariantId(resolvedSlug, resolvedPack));

          return {
            productId: i.productId,
            slug: resolvedSlug,
            name: i.name,
            flavor: i.flavor,
            quantity: i.quantity || 1,
            unitPrice: resolvedPrice,
            variantId: resolvedVariantId,
            packSize: resolvedPack,
            image: i.image,
          };
        }),
        couponCode,
        customer: customerPrefill,
        redirectUrl: fallbackUrl,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      token = data.token;
      const oid = data.order_id || data.orderId || data.fastrrOrderId || data.fastrr_order_id;
      if (oid) {
        sessionStorage.setItem('rebelive_last_order_id', String(oid));
        localStorage.setItem('rebelive_last_order_id', String(oid));
      }
    } else {
      const err = await res.text();
      console.warn('⚠️ Fastrr token call returned error:', err);
    }
  } catch (err) {
    console.warn('⚠️ Network error requesting Fastrr token:', err);
  }

  if (!token) {
    throw new Error('Could not initiate Fastrr checkout. Please check your network and try again.');
  }

  // 3. Setup window postMessage listener for exit/close and redirect events from Fastrr
  const handleFastrrMessage = (e: MessageEvent) => {
    if (e.data) {
      extractAndStoreFastrrData(e.data);
    }

    // Handle payment redirects (e.g. UPI, NetBanking, 3DS authentication)
    if (e.data?.trigger === 'headless-redirect' && e.data?.actions?.[0]?.data?.url) {
      window.location.href = e.data.actions[0].data.url;
      return;
    }
    if (e.data?.trigger === 'headless-redirect-post' && e.data?.data) {
      try {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = e.data.data;
        form.target = '_parent';
        document.body.appendChild(form);
        form.submit();
      } catch (err) {
        console.warn('Fastrr form redirect error:', err);
      }
      return;
    }

    // Handle order completion
    if (
      e.data?.trigger === 'order-success' ||
      e.data?.trigger === 'payment-success' ||
      e.data?.event === 'order_placed'
    ) {
      const orderId = e.data?.order_id || e.data?.data?.order_id || e.data?.orderId;
      if (orderId) {
        sessionStorage.setItem('rebelive_last_order_id', String(orderId));
        localStorage.setItem('rebelive_last_order_id', String(orderId));
      }
      window.location.href = fallbackUrl;
      return;
    }

    if (
      e.data?.trigger === 'close-checkout' ||
      e.data?.trigger === 'exit-checkout' ||
      e.data?.action === 'close'
    ) {
      const main = document.getElementById('fastrr-main-container');
      if (main) main.remove();
      const headless = document.getElementById('headless-container');
      if (headless) headless.remove();
      const preloader = document.getElementById('fastrr-pre-loader');
      if (preloader) preloader.style.display = 'none';
      document.body.style.overflow = '';
      window.removeEventListener('message', handleFastrrMessage);
    }
  };
  window.addEventListener('message', handleFastrrMessage);

  // 4. Trigger Official Fastrr Instant Checkout
  if (window.HeadlessCheckout && typeof window.HeadlessCheckout.addToCart === 'function') {
    const nativeEvent = event?.nativeEvent || event || new MouseEvent('click');

    // Upgrade iframe permissions (payment, camera for UPI QR, clipboard, web-share)
    const checkIframe = setInterval(() => {
      const iframe = document.getElementById('headless-iframe') as HTMLIFrameElement | null;
      if (iframe) {
        try {
          const currentAllow = iframe.getAttribute('allow') || '';
          const needed = ['payment', 'camera', 'clipboard-read', 'clipboard-write', 'web-share', 'geolocation'];
          const missing = needed.filter((p) => !currentAllow.includes(p));
          if (missing.length > 0) {
            iframe.setAttribute('allow', `${currentAllow}; ${missing.join('; ')}`.trim().replace(/^;\s*/, ''));
          }
        } catch {}

        iframe.addEventListener('load', () => {
          const preloader = document.getElementById('fastrr-pre-loader');
          if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
              if (preloader) preloader.style.display = 'none';
            }, 200);
          }
        });
        clearInterval(checkIframe);
      }
    }, 100);

    // Timeout safety for preloader
    setTimeout(() => {
      clearInterval(checkIframe);
      const preloader = document.getElementById('fastrr-pre-loader');
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
          if (preloader) preloader.style.display = 'none';
        }, 200);
      }
    }, 2500);

    window.HeadlessCheckout.addToCart(
      nativeEvent,
      token,
      {
        fallbackUrl,
        isInitiatedFromApp: false, // Production web checkout: false ensures web UPI, QR code & gateway flows
      },
      (callbackData: any) => {
        if (callbackData) {
          extractAndStoreFastrrData(callbackData);
        }
        if (callbackData?.exitCheckout) {
          const main = document.getElementById('fastrr-main-container');
          if (main) main.remove();
          const headless = document.getElementById('headless-container');
          if (headless) headless.remove();
          document.body.style.overflow = '';
        }
      }
    );
  } else {
    // Direct URL Fallback: open genuine Fastrr checkout directly
    const directUrl = `https://fastrr-boost-ui.pickrr.com/?customCheckoutToken=${encodeURIComponent(
      token
    )}&type=cart&platform=CUSTOM&cart=JTVCJTVE&fallbackUrl=${encodeURIComponent(fallbackUrl)}`;
    window.location.href = directUrl;
  }
}
