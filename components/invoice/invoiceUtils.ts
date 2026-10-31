/**
 * Indian GST State Codes Map
 */
export const GST_STATE_CODES: Record<string, string> = {
  'jammu and kashmir': '01',
  'himachal pradesh': '02',
  'punjab': '03',
  'chandigarh': '04',
  'uttarakhand': '05',
  'haryana': '06',
  'delhi': '07',
  'rajasthan': '08',
  'uttar pradesh': '09',
  'bihar': '10',
  'sikkim': '11',
  'arunachal pradesh': '12',
  'nagaland': '13',
  'manipur': '14',
  'mizoram': '15',
  'tripura': '16',
  'meghalaya': '17',
  'assam': '18',
  'west bengal': '19',
  'jharkhand': '20',
  'odisha': '21',
  'chhattisgarh': '22',
  'madhya pradesh': '23',
  'gujarat': '24',
  'daman and diu': '26',
  'dadra and nagar haveli': '26',
  'maharashtra': '27',
  'andhra pradesh': '37',
  'karnataka': '29',
  'goa': '30',
  'lakshadweep': '31',
  'kerala': '32',
  'tamil nadu': '33',
  'puducherry': '34',
  'andaman and nicobar islands': '35',
  'telangana': '36',
  'ladakh': '38',
};

export function getGstStateCode(stateName?: string | null): string {
  if (!stateName) return '29'; // Default fallback
  const clean = stateName.toLowerCase().trim();
  return GST_STATE_CODES[clean] || '29';
}

/**
 * Converts numbers into Indian Currency words (e.g. 1000 -> One Thousand Rupees Only)
 */
export function numberToIndianWords(num: number): string {
  if (isNaN(num) || num === 0) return 'Zero Rupees Only';

  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    const digit = n % 10;
    if (n < 100) return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
    if (n < 1000)
      return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 === 0 ? '' : ' and ' + inWords(n % 100));
    if (n < 100000)
      return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000)
      return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }

  const integerPart = Math.floor(Math.abs(num));
  const decimalPart = Math.round((Math.abs(num) - integerPart) * 100);

  let result = inWords(integerPart) + ' Rupees';
  if (decimalPart > 0) {
    result += ' and ' + inWords(decimalPart) + ' Paise';
  }
  return result + ' Only';
}

export interface ParsedShippingAddress {
  name: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  stateCode: string;
  phone: string;
  email: string;
}

export function parseOrderShippingAddress(order: any): ParsedShippingAddress {
  let addr: any = order?.shippingAddress || {};
  if (typeof addr === 'string') {
    try {
      addr = JSON.parse(addr);
    } catch {
      addr = { line1: addr };
    }
  }

  const user = order?.user || {};

  // Resolve customer name without synthetic dummy fallbacks
  const name =
    addr.shipping_customer_name ||
    addr.billing_customer_name ||
    addr.fullName ||
    addr.name ||
    (addr.first_name ? `${addr.first_name} ${addr.last_name || ''}`.trim() : null) ||
    (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null) ||
    order.customerName ||
    'Customer';

  const company = addr.company || addr.companyName || '';

  const line1 =
    addr.shipping_address ||
    addr.billing_address ||
    addr.line1 ||
    addr.address1 ||
    addr.address ||
    '';

  const line2 =
    addr.shipping_address_2 ||
    addr.billing_address_2 ||
    addr.line2 ||
    addr.address2 ||
    addr.landmark ||
    '';

  const city =
    addr.shipping_city ||
    addr.billing_city ||
    addr.city ||
    '';

  const state =
    addr.shipping_state ||
    addr.billing_state ||
    addr.state ||
    addr.province ||
    '';

  const pincode =
    addr.shipping_pincode ||
    addr.billing_pincode ||
    addr.postalCode ||
    addr.pincode ||
    addr.zip ||
    '';

  const country =
    addr.shipping_country ||
    addr.billing_country ||
    addr.country ||
    'India';

  const stateCode = getGstStateCode(state);

  const phone =
    addr.shipping_phone ||
    addr.billing_phone ||
    addr.phone ||
    user.phone ||
    '';

  const email =
    addr.shipping_email ||
    addr.billing_email ||
    addr.email ||
    user.email ||
    '';

  return {
    name,
    company: company || undefined,
    line1,
    line2: line2 || undefined,
    city,
    state,
    pincode,
    country,
    stateCode,
    phone,
    email,
  };
}

