/**
 * Stripe.js Loader
 * Dynamically loads Stripe.js and Stripe Connect scripts
 */

let stripePromise: Promise<any> | null = null;
let connectPromise: Promise<any> | null = null;

export async function loadStripe(publishableKey: string): Promise<any> {
  if (stripePromise) return stripePromise;

  stripePromise = new Promise((resolve, reject) => {
    if ((window as any).Stripe) {
      resolve((window as any).Stripe(publishableKey));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      if ((window as any).Stripe) {
        resolve((window as any).Stripe(publishableKey));
      } else {
        reject(new Error('Stripe.js failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Stripe.js'));
    document.head.appendChild(script);
  });

  return stripePromise;
}

export async function loadStripeConnect(): Promise<any> {
  if (connectPromise) return connectPromise;

  connectPromise = new Promise((resolve, reject) => {
    if ((window as any).StripeConnect) {
      resolve((window as any).StripeConnect);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/connect/v1.0/connect.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).StripeConnect) {
        resolve((window as any).StripeConnect);
      } else {
        reject(new Error('Stripe Connect failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Stripe Connect'));
    document.head.appendChild(script);
  });

  return connectPromise;
}
