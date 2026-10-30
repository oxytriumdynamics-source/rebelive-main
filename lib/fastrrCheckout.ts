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
 * Validates that a string is a genuine customer name and not a browser extension,
 * DevTools call, or synthetic placeholder.
 */
export function isValidCustomerName(name: any): boolean {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 70) return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('chrome:') ||
    lower.includes('call method') ||
    lower.includes('webpack') ||
    lower.includes('devtools') ||
    lower.includes('[object') ||
    lower === 'customer' ||
    lower === 'undefined' ||
    lower === 'null' ||
    lower === 'customer rebelive'
  ) {
    return false;
  }
  return /[a-zA-Z]/.test(trimmed);
}

/**
 * Extracts address, customer, and orderId from genuine Fastrr events, callbacks, or messages
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

  // Guard against arbitrary extension postMessages that lack Fastrr markers
  const hasFastrrMarkers =
    payload.order_id ||
    payload.orderId ||
    payload.fastrr_order_id ||
    payload.shipping_address ||
    payload.delivery_address ||
    payload.selected_address ||
    payload.billing_address ||
    payload.trigger ||
    payload.event ||
    payload.headless ||
    payload.cart_data ||
    payload.actions ||
    payload.data?.order_id ||
    payload.data?.shipping_address ||
    payload.order?.order_id ||
    payload.result?.data?.order_id ||
    payload.result?.shipping_address ||
    payload.pincode ||
    payload.postal_code;

  if (!hasFastrrMarkers && !payload.customer?.email && !payload.customer?.phone) {
    return { address: null, billingAddress: null, customer: null, orderId: null };
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

  const sourceAddr =
    address ||
    payload.shipping_address ||
    payload.delivery_address ||
    payload.selected_address ||
    payload.billing_address ||
    payload.data?.shipping_address;

  const rawCust =
    payload.customer ||
    payload.buyer ||
    payload.user ||
    payload.data?.customer ||
    payload.order?.customer ||
    payload.result?.customer ||
    null;

  const candidateName =
    (rawCust?.name && isValidCustomerName(rawCust.name) ? rawCust.name : '') ||
    (rawCust?.first_name || rawCust?.firstName
      ? `${rawCust.first_name || rawCust.firstName} ${rawCust.last_name || rawCust.lastName || ''}`.trim()
      : '') ||
    (sourceAddr?.first_name || sourceAddr?.firstName
      ? `${sourceAddr.first_name || sourceAddr.firstName} ${sourceAddr.last_name || sourceAddr.lastName || ''}`.trim()
      : '') ||
    (sourceAddr?.name && isValidCustomerName(sourceAddr.name) ? sourceAddr.name : '') ||
    (sourceAddr?.billing_customer_name && isValidCustomerName(sourceAddr.billing_customer_name) ? `${sourceAddr.billing_customer_name} ${sourceAddr.billing_last_name || ''}`.trim() : '') ||
    (payload.name && isValidCustomerName(payload.name) ? payload.name : '');

  const validName = isValidCustomerName(candidateName) ? candidateName.trim() : undefined;

  const candidatePhone =
    rawCust?.phone ||
    rawCust?.mobile ||
    rawCust?.contact ||
    sourceAddr?.phone ||
    sourceAddr?.mobile ||
    sourceAddr?.contact ||
    sourceAddr?.billing_phone ||
    payload.phone ||
    payload.mobile ||
    payload.contact ||
    payload.result?.phone;

  const candidateEmail =
    rawCust?.email ||
    rawCust?.customer_email ||
    sourceAddr?.email ||
    sourceAddr?.billing_email ||
    payload.email ||
    payload.result?.email;

  let customer: { name?: string; email?: string; phone?: string } | null = null;
  if (validName || candidatePhone || candidateEmail) {
    customer = {
      name: validName,
      phone: candidatePhone ? String(candidatePhone).replace(/\D/g, '').slice(-10) || String(candidatePhone).trim() : undefined,
      email: candidateEmail ? String(candidateEmail).trim().toLowerCase() : undefined,
    };
  }

  if (typeof window !== 'undefined') {
    try {
      // Purge any stale contaminated customer cache
      const staleCust = localStorage.getItem('rebelive_fastrr_customer');
      if (staleCust && (staleCust.includes('chrome:') || staleCust.includes('call method'))) {
        localStorage.removeItem('rebelive_fastrr_customer');
        sessionStorage.removeItem('rebelive_fastrr_customer');
      }

      if (address) {
        sessionStorage.setItem('rebelive_fastrr_address', JSON.stringify(address));
        localStorage.setItem('rebelive_fastrr_address', JSON.stringify(address));
      }
      if (billingAddress) {
        sessionStorage.setItem('rebelive_fastrr_billing_address', JSON.stringify(billingAddress));
        localStorage.setItem('rebelive_fastrr_billing_address', JSON.stringify(billingAddress));
      }
      if (customer && (customer.name || customer.phone || customer.email)) {
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
  // Proactively clean up any stale contaminated storage on script load
  try {
    const cachedCust = localStorage.getItem('rebelive_fastrr_customer');
    if (cachedCust && (cachedCust.includes('chrome:') || cachedCust.includes('call method'))) {
      localStorage.removeItem('rebelive_fastrr_customer');
      sessionStorage.removeItem('rebelive_fastrr_customer');
    }
  } catch {}

  window.srCustomCheckoutCallBackFn = function (res: any) {
    extractAndStoreFastrrData(res);
  };

  window.addEventListener('message', (e: MessageEvent) => {
    if (!e.data) return;
    const origin = (e.origin || '').toLowerCase();
    const isFastrrOrigin =
      origin.includes('shiprocket.com') ||
      origin.includes('pickrr.com') ||
      origin.includes('fastrr.com') ||
      (typeof window !== 'undefined' && origin.includes(window.location.host));

    const isFastrrEvent =
      typeof e.data === 'object' &&
      (e.data.trigger ||
        e.data.event ||
        e.data.fastrr_order_id ||
        e.data.order_id ||
        e.data.orderId ||
        e.data.shipping_address ||
        e.data.delivery_address ||
        e.data.headless ||
        e.data.actions);

    // Only process messages that are either from Fastrr origins OR explicitly identify as Fastrr events
    if (isFastrrOrigin || isFastrrEvent) {
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

export interface CheckoutPublicStatus {
  enabled: boolean;
  pauseMessage: string;
}

let cachedStatus: { data: CheckoutPublicStatus; expiresAt: number } | null = null;

/**
 * Fetches the real-time store checkout status managed via Admin Settings.
 */
export async function fetchCheckoutPublicStatus(force = false): Promise<CheckoutPublicStatus> {
  const now = Date.now();
  if (!force && cachedStatus && now < cachedStatus.expiresAt) {
    return cachedStatus.data;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiBase}/shipping/checkout-status`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.status === 'success' && json.data) {
        const result: CheckoutPublicStatus = {
          enabled: Boolean(json.data.enabled),
          pauseMessage: json.data.pauseMessage || 'Instant checkout is temporarily paused for maintenance. Please check back shortly.',
        };
        cachedStatus = { data: result, expiresAt: now + 15_000 };
        return result;
      }
    }
  } catch (err) {
    console.warn('[Fastrr] Unable to fetch checkout status from server:', err);
  }

  const fallback: CheckoutPublicStatus = {
    enabled: true,
    pauseMessage: 'Instant checkout is temporarily paused for maintenance. Please check back shortly.',
  };
  return fallback;
}

/**
 * Backward compatibility flag. Real-time state is determined dynamically via fetchCheckoutPublicStatus.
 */
export const IS_INSTANT_CHECKOUT_PAUSED = false;

/**
 * Generates token from backend and triggers the native Shiprocket Fastrr Instant Checkout UI directly.
 */
export async function launchFastrrCheckout(
  event?: any,
  items: FastrrCheckoutItem[] = [],
  couponCode?: string
): Promise<void> {
  if (typeof window === 'undefined') return;

  // Real-time store checkout status check
  const liveStatus = await fetchCheckoutPublicStatus();
  if (!liveStatus.enabled) {
    throw new Error(liveStatus.pauseMessage || 'Instant checkout is temporarily paused for maintenance. Please check back shortly.');
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
  if (existingPreloader) existingPreloader.remove();
  document.querySelectorAll('.fastrr-pre-loader, .fastrr-pre-loader-container, .fastrr-pre-loader-custom').forEach((el) => el.remove());
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
  const dismissPreloader = () => {
    const preloader = document.getElementById('fastrr-pre-loader');
    if (preloader) {
      preloader.style.pointerEvents = 'none';
      preloader.style.display = 'none';
      preloader.remove();
    }
    document.querySelectorAll('.fastrr-pre-loader, .fastrr-pre-loader-container, .fastrr-pre-loader-custom').forEach((el) => {
      (el as HTMLElement).style.pointerEvents = 'none';
      (el as HTMLElement).style.display = 'none';
      el.remove();
    });
  };

  const handleFastrrMessage = (e: MessageEvent) => {
    if (e.data) {
      extractAndStoreFastrrData(e.data);
      // As soon as Fastrr transmits any postMessage, we know it's active - dismiss any lingering preloader
      dismissPreloader();
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
      dismissPreloader();
      document.body.style.overflow = '';
      window.removeEventListener('message', handleFastrrMessage);
    }
  };
  window.addEventListener('message', handleFastrrMessage);

  // 4. Trigger Official Fastrr Instant Checkout
  if (window.HeadlessCheckout && typeof window.HeadlessCheckout.addToCart === 'function') {
    const nativeEvent = event?.nativeEvent || event || new MouseEvent('click');

    // Neutralize preloader clicks immediately so it never traps clicks over the iframe
    let attempts = 0;
    const checkIframe = setInterval(() => {
      attempts++;

      // Force pointer-events: none on any preloader elements
      const preloader = document.getElementById('fastrr-pre-loader');
      if (preloader) {
        preloader.style.pointerEvents = 'none';
      }
      document.querySelectorAll('.fastrr-pre-loader, .fastrr-pre-loader-container, .fastrr-pre-loader-custom').forEach((el) => {
        (el as HTMLElement).style.pointerEvents = 'none';
      });

      const iframe = document.getElementById('headless-iframe') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.style.pointerEvents = 'auto';
        const modal = document.querySelector('.headless-modal') as HTMLElement | null;
        if (modal) {
          modal.style.pointerEvents = 'auto';
          modal.style.zIndex = '2147483647';
        }

        iframe.addEventListener('load', () => {
          dismissPreloader();
        });

        // Fast fallback: dismiss preloader after 400ms once iframe element exists
        setTimeout(dismissPreloader, 400);
        clearInterval(checkIframe);
      } else if (attempts > 30) {
        clearInterval(checkIframe);
        dismissPreloader();
      }
    }, 50);

    // Hard fallback timeout: ensure preloader is completely gone
    setTimeout(() => {
      clearInterval(checkIframe);
      dismissPreloader();
    }, 1200);

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
          dismissPreloader();
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
