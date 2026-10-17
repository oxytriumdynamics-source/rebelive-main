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

/**
 * Generates token from backend and triggers the native Shiprocket Fastrr Instant Checkout UI directly.
 */
export async function launchFastrrCheckout(
  event?: any,
  items: FastrrCheckoutItem[] = [],
  couponCode?: string
): Promise<void> {
  if (typeof window === 'undefined') return;

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
  document.body.style.overflow = '';

  const fallbackUrl = `${window.location.origin}/order-confirmation`;

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
        items: items.map((i) => ({
          name: i.name,
          flavor: i.flavor,
          quantity: i.quantity || 1,
          unitPrice: i.unitPrice || 499,
          variantId: String(i.variantId || i.productId || '101'),
          packSize: i.packSize || 6,
          image: i.image,
        })),
        couponCode,
        customer: customerPrefill,
        redirectUrl: fallbackUrl,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      token = data.token;
      if (data.order_id || data.orderId) {
        sessionStorage.setItem('rebelive_last_order_id', String(data.order_id || data.orderId));
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

  // 3. Setup window postMessage listener for exit/close events from Fastrr
  const handleFastrrMessage = (e: MessageEvent) => {
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
      if (preloader) preloader.remove();
      document.body.style.overflow = '';
      window.removeEventListener('message', handleFastrrMessage);
    }
  };
  window.addEventListener('message', handleFastrrMessage);

  // 4. Trigger Official Fastrr Instant Checkout
  if (window.HeadlessCheckout && typeof window.HeadlessCheckout.addToCart === 'function') {
    const nativeEvent = event?.nativeEvent || event || new MouseEvent('click');

    // Dismiss preloader once iframe loads
    const checkIframe = setInterval(() => {
      const iframe = document.getElementById('headless-iframe') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.addEventListener('load', () => {
          const preloader = document.getElementById('fastrr-pre-loader');
          if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 200);
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
        setTimeout(() => preloader.remove(), 200);
      }
    }, 2500);

    window.HeadlessCheckout.addToCart(
      nativeEvent,
      token,
      {
        fallbackUrl,
        isInitiatedFromApp: true,
      },
      (callbackData: any) => {
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
