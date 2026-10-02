'use strict';

/// Server-owned BagFree checkout catalog.
///
/// Never trust product names or prices supplied by a browser/mobile client.
/// Checkout accepts a product ID and quantity; Stripe line items are resolved
/// from this allowlist.
const BAGFREE_CATALOG = Object.freeze({
  'mens-7day': {
    title: "Men's 7-Day Travel Essentials",
    unitAmount: 14900,
    image: 'https://valetbynuor.com/cdn/shop/files/ChatGPTImageJan11_2026_02_58_17PM.png?v=1768161528&width=800',
  },
  'mens-basic': {
    title: "Men's Basic Emergency Travel Kit",
    unitAmount: 4500,
    image: 'https://valetbynuor.com/cdn/shop/files/ChatGPT_Image_Aug_22_2025_07_23_24_PM.png?v=1755905084&width=800',
  },
  'mens-business': {
    title: "Men's Business Emergency Travel Kit",
    unitAmount: 6999,
    image: 'https://valetbynuor.com/cdn/shop/files/ChatGPTImageAug23_2025_02_11_28PM.png?v=1755972741&width=800',
  },
  'womens-7day': {
    title: "Women's 7-Day Essentials Bundle",
    unitAmount: 14900,
    image: 'https://valetbynuor.com/cdn/shop/files/ChatGPTImageJan11_2026_02_55_15PM.png?v=1768161350&width=800',
  },
  'womens-beach': {
    title: "Women's Beach Lounge Set",
    unitAmount: 7500,
    image: 'https://valetbynuor.com/cdn/shop/files/ChatGPTImageAug20_2025_12_03_35AM.png?v=1755662764&width=800',
  },
  'womens-business': {
    title: "Women's Business Emergency Travel Kit",
    unitAmount: 6999,
    image: 'https://valetbynuor.com/cdn/shop/files/ChatGPTImageAug23_2025_02_24_27PM.png?v=1755973510&width=800',
  },
  'womens-sleepwear': {
    title: "Women's Sleepwear",
    unitAmount: 7900,
    image: 'https://valetbynuor.com/cdn/shop/files/ChatGPT_Image_Mar_14_2026_10_50_46_AM.png?v=1773503243&width=800',
  },
  'womens-toiletry': {
    title: "Women's Toiletry Stay Fresh Kit",
    unitAmount: 3900,
    image: 'https://valetbynuor.com/cdn/shop/files/ChatGPT_Image_Mar_14_2026_10_53_50_AM.png?v=1773500050&width=800',
  },
  'mens-toiletry': {
    title: "Men's Toiletry Stay Fresh Kit",
    unitAmount: 3900,
    image: null,
  },
  'energy-focus': {
    title: 'Energy & Focus Travel Kit',
    unitAmount: 3900,
    image: 'https://valetbynuor.com/cdn/shop/files/ChatGPTImageMar16_2026_09_02_10PM.png?v=1773709352&width=800',
  },
  'sleep-recovery': {
    title: 'Sleep & Recovery Travel Kit',
    unitAmount: 4900,
    image: 'https://valetbynuor.com/cdn/shop/files/ChatGPTImageMar16_2026_08_56_10PM.png?v=1773708994&width=800',
  },
  'sj-2day': {
    title: '2-Day Explorer Bundle',
    unitAmount: 500,
    image: null,
  },
  'sj-3day': {
    title: '3-Day Second Journey Bundle',
    unitAmount: 999,
    image: null,
  },
  'sj-5day': {
    title: '5-Day Emerald Bundle',
    unitAmount: 3900,
    image: null,
  },
  'sj-7day': {
    title: '7-Day Gold Bundle',
    unitAmount: 6900,
    image: 'https://valetbynuor.com/cdn/shop/files/ChatGPTImageAug23_2025_02_11_28PM.png?v=1755972741&width=800',
  },
});

module.exports = { BAGFREE_CATALOG };
