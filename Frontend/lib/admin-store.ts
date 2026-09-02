import { Villa, allVillas } from './villas';

export interface DestinationItem {
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  meta: string;
  image: string;
  villasCount: number;
}

export const initialDestinations: DestinationItem[] = [
  {
    name: 'Goa',
    region: 'North & South Goa',
    country: 'India',
    latitude: 15.2993,
    longitude: 74.124,
    meta: 'Coastal · 42 luxury villas',
    image: 'https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=900',
    villasCount: 42,
  },
  {
    name: 'Udaipur',
    region: 'Lake Pichola, Rajasthan',
    country: 'India',
    latitude: 24.5854,
    longitude: 73.7125,
    meta: 'Royal Heritage · 28 palaces & villas',
    image: 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=900',
    villasCount: 28,
  },
  {
    name: 'Kerala Backwaters',
    region: 'Alleppey & Kumarakom',
    country: 'India',
    latitude: 9.4981,
    longitude: 76.3388,
    meta: 'Waterside · 35 estate villas',
    image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=900',
    villasCount: 35,
  },
  {
    name: 'Manali & Shimla',
    region: 'Himachal Pradesh',
    country: 'India',
    latitude: 32.2432,
    longitude: 77.1892,
    meta: 'Himalayas · 24 mountain chalets',
    image: 'https://images.pexels.com/photos/2670898/pexels-photo-2670898.jpeg?auto=compress&cs=tinysrgb&w=900',
    villasCount: 24,
  },
  {
    name: 'Jaipur',
    region: 'Amer & Pink City',
    country: 'India',
    latitude: 26.9124,
    longitude: 75.7873,
    meta: 'Regal Rajasthan · 30 villas',
    image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=900',
    villasCount: 30,
  },
  {
    name: 'Alibaug',
    region: 'Coastal Maharashtra',
    country: 'India',
    latitude: 18.6414,
    longitude: 72.8722,
    meta: 'Beachside · 18 private estates',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=900',
    villasCount: 18,
  },
];

const VILLAS_STORAGE_KEY = 'stayvilla-custom-villas';
const DESTINATIONS_STORAGE_KEY = 'stayvilla-custom-destinations';

// Helper to get effective villas
export function getEffectiveVillas(): Villa[] {
  if (typeof window === 'undefined') return allVillas;
  try {
    const custom = localStorage.getItem(VILLAS_STORAGE_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading custom villas from storage', e);
  }
  return allVillas;
}

// Helper to save effective villas
export function saveEffectiveVillas(villas: Villa[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VILLAS_STORAGE_KEY, JSON.stringify(villas));
    window.dispatchEvent(new Event('stayvilla-villas-updated'));
  } catch (e) {
    console.error('Error saving custom villas to storage', e);
  }
}

// Helper to get effective destinations
export function getEffectiveDestinations(): DestinationItem[] {
  if (typeof window === 'undefined') return initialDestinations;
  try {
    const custom = localStorage.getItem(DESTINATIONS_STORAGE_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading custom destinations from storage', e);
  }
  return initialDestinations;
}

// Helper to save effective destinations
export function saveEffectiveDestinations(destinations: DestinationItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DESTINATIONS_STORAGE_KEY, JSON.stringify(destinations));
    window.dispatchEvent(new Event('stayvilla-destinations-updated'));
  } catch (e) {
    console.error('Error saving custom destinations to storage', e);
  }
}
