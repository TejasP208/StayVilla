'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Heart,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
  Calendar as CalendarIcon,
  SlidersHorizontal,
  BedDouble,
  Bath,
  RotateCcw,
  Sparkle,
  LocateFixed,
  Loader2,
  AlertCircle,
  Compass,
  User,
  CalendarCheck,
  LogOut,
  LogIn,
  Edit3,
  Award,
  Trash2,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
  addDays,
  differenceInCalendarDays,
  startOfToday,
  isWithinInterval,
} from 'date-fns';

const heroImage = '/Villa_img.avif';

interface Villa {
  id: string;
  name: string;
  location: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  currency: string;
  rating: string;
  reviewsCount: number;
  image: string;
  tag: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  details: string;
  description: string;
}

interface Destination {
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  meta: string;
  image: string;
  villasCount: number;
}

interface Booking {
  id: string;
  reference: string;
  villaId: string;
  villaName: string;
  villaLocation: string;
  villaImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  adults: number;
  children: number;
  rooms: number;
  totalPrice: number;
  currency: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  country: string;
  tier: string;
  memberSince: string;
  completedStays: number;
}

const destinationsData: Destination[] = [
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
    meta: 'Regal Rajasthan · 30 havelis',
    image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=900',
    villasCount: 30,
  },
  {
    name: 'Coorg',
    region: 'Western Ghats, Karnataka',
    country: 'India',
    latitude: 12.3375,
    longitude: 75.8069,
    meta: 'Plantation · 22 coffee estates',
    image: 'https://images.pexels.com/photos/4482064/pexels-photo-4482064.jpeg?auto=compress&cs=tinysrgb&w=900',
    villasCount: 22,
  },
];

const allVillas: Villa[] = [
  {
    id: 'the-royal-pichola',
    name: 'The Royal Pichola Villa',
    location: 'Lake Pichola, Udaipur, Rajasthan',
    region: 'Udaipur',
    country: 'India',
    latitude: 24.5854,
    longitude: 73.7125,
    pricePerNight: 65000,
    currency: '₹',
    rating: '4.98',
    reviewsCount: 52,
    image: 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1000',
    tag: 'Royal Heritage',
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    details: '4 bedrooms · 8 guests',
    description: 'Overlooking tranquil Lake Pichola with hand-carved marble jharokhas, private courtyards, infinity plunge pool, and royal Rajputana chef service.',
  },
  {
    id: 'villa-sol-de-goa',
    name: 'Villa Sol De Goa',
    location: 'Anjuna, North Goa',
    region: 'Goa',
    country: 'India',
    latitude: 15.58,
    longitude: 73.742,
    pricePerNight: 42000,
    currency: '₹',
    rating: '4.96',
    reviewsCount: 48,
    image: 'https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=1000',
    tag: 'Guest Favourite',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    details: '3 bedrooms · 6 guests',
    description: 'Restored 19th-century Indo-Portuguese estate set amid coconut groves, featuring private lap pool, shaded verandahs, and private beach access.',
  },
  {
    id: 'kumarakom-waters-edge',
    name: 'Kumarakom Waters Edge',
    location: 'Vembanad Lake, Kerala',
    region: 'Kerala Backwaters',
    country: 'India',
    latitude: 9.6175,
    longitude: 76.4301,
    pricePerNight: 38000,
    currency: '₹',
    rating: '5.0',
    reviewsCount: 39,
    image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=1000',
    tag: 'Rare Find',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    details: '3 bedrooms · 6 guests',
    description: 'Traditional teakwood Kerala nalukettu estate on the backwaters with private shikara boat, infinity pool, and personalized Ayurvedic wellness.',
  },
  {
    id: 'the-himalayan-pine-chalet',
    name: 'The Himalayan Pine Chalet',
    location: 'Old Manali, Himachal Pradesh',
    region: 'Manali & Shimla',
    country: 'India',
    latitude: 32.2432,
    longitude: 77.1892,
    pricePerNight: 32000,
    currency: '₹',
    rating: '4.95',
    reviewsCount: 41,
    image: 'https://images.pexels.com/photos/2670898/pexels-photo-2670898.jpeg?auto=compress&cs=tinysrgb&w=1000',
    tag: 'Mountain & Snow',
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    details: '4 bedrooms · 8 guests',
    description: 'Cedar wood and stone lodge with 360° snow-capped Himalayan views, roaring stone fireplace, heated floors, and a private stargazing deck.',
  },
  {
    id: 'haveli-amer-heritage',
    name: 'Haveli Amer Heritage',
    location: 'Amer, Jaipur, Rajasthan',
    region: 'Jaipur',
    country: 'India',
    latitude: 26.9855,
    longitude: 75.8507,
    pricePerNight: 75000,
    currency: '₹',
    rating: '4.99',
    reviewsCount: 64,
    image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1000',
    tag: 'Palace Living',
    bedrooms: 5,
    bathrooms: 5,
    maxGuests: 10,
    details: '5 bedrooms · 10 guests',
    description: 'Exquisite regal architecture with frescoed arches, stepwell plunge pool, rooftop baradari, and private evening musical recitals.',
  },
  {
    id: 'coorg-mistwood-estate',
    name: 'Coorg Mistwood Estate',
    location: 'Madikeri, Coorg, Karnataka',
    region: 'Coorg',
    country: 'India',
    latitude: 12.4244,
    longitude: 75.7382,
    pricePerNight: 28000,
    currency: '₹',
    rating: '4.97',
    reviewsCount: 36,
    image: 'https://images.pexels.com/photos/4482064/pexels-photo-4482064.jpeg?auto=compress&cs=tinysrgb&w=1000',
    tag: 'Coffee Plantation',
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    details: '4 bedrooms · 8 guests',
    description: 'Colonial bungalow spread across a 50-acre private coffee estate with glass conservatory, outdoor bonfire pit, and curated plantation walks.',
  },
];

const initialVillaImages = [
  'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1000',
  'https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=1000',
  'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=1000',
];

const initialBookings: Booking[] = [
  {
    id: 'b-1',
    reference: 'SV-849201',
    villaId: 'the-royal-pichola',
    villaName: 'The Royal Pichola Villa',
    villaLocation: 'Lake Pichola, Udaipur, Rajasthan',
    villaImage: 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800',
    checkIn: '18 Jun 2025',
    checkOut: '25 Jun 2025',
    nights: 7,
    guests: 2,
    adults: 2,
    children: 0,
    rooms: 1,
    totalPrice: 479250,
    currency: '₹',
    status: 'Confirmed',
    createdAt: '12 May 2025',
  },
  {
    id: 'b-2',
    reference: 'SV-719382',
    villaId: 'villa-sol-de-goa',
    villaName: 'Villa Sol De Goa',
    villaLocation: 'Anjuna, North Goa',
    villaImage: 'https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=800',
    checkIn: '10 Oct 2025',
    checkOut: '18 Oct 2025',
    nights: 8,
    guests: 4,
    adults: 3,
    children: 1,
    rooms: 2,
    totalPrice: 356300,
    currency: '₹',
    status: 'Confirmed',
    createdAt: '02 Aug 2025',
  },
  {
    id: 'b-3',
    reference: 'SV-392019',
    villaId: 'kumarakom-waters-edge',
    villaName: 'Kumarakom Waters Edge',
    villaLocation: 'Vembanad Lake, Kerala',
    villaImage: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
    checkIn: '12 Jan 2024',
    checkOut: '19 Jan 2024',
    nights: 7,
    guests: 2,
    adults: 2,
    children: 0,
    rooms: 1,
    totalPrice: 282800,
    currency: '₹',
    status: 'Completed',
    createdAt: '14 Nov 2023',
  },
];

// Helper to format currency in Indian numbering format
function formatINR(val: number): string {
  return val.toLocaleString('en-IN');
}

// Calculate distance between two coordinates in kilometers using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Home() {
  // Authentication & User Profile State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Aarav Mehta',
    email: 'aarav.mehta@stayvilla.in',
    phone: '+91 9167914640',
    country: 'India',
    tier: 'Connoisseur Club',
    memberSince: 'March 2023',
    completedStays: 4,
  });

  // Modal Views State
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeBookingsTab, setActiveBookingsTab] = useState<'all' | 'upcoming' | 'past'>('all');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState<UserProfile>({ ...userProfile });
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Bookings List State
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // Search input & geolocation state
  const [locationQuery, setLocationQuery] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [detectedLocationName, setDetectedLocationName] = useState<string | null>(null);

  // Date selection state
  const today = useMemo(() => startOfToday(), []);
  const defaultCheckIn = useMemo(() => addDays(today, 14), [today]);
  const defaultCheckOut = useMemo(() => addDays(today, 21), [today]);

  const [checkIn, setCheckIn] = useState<Date | null>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<Date | null>(defaultCheckOut);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeCalendarField, setActiveCalendarField] = useState<'checkIn' | 'checkOut'>('checkIn');
  const [currentMonth, setCurrentMonth] = useState<Date>(defaultCheckIn);

  // Guest counters state
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(1);
  const [guestsOpen, setGuestsOpen] = useState(false);

  // Saved / active search filters state
  const [activeFilters, setActiveFilters] = useState<{
    location: string;
    checkIn: Date | null;
    checkOut: Date | null;
    adults: number;
    children: number;
    infants: number;
    rooms: number;
  }>({
    location: '',
    checkIn: defaultCheckIn,
    checkOut: defaultCheckOut,
    adults: 2,
    children: 0,
    infants: 0,
    rooms: 1,
  });

  // UI interaction state
  const [searchSent, setSearchSent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedVillas, setSavedVillas] = useState<Record<string, boolean>>({});
  const [selectedVillaForBooking, setSelectedVillaForBooking] = useState<Villa | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [lastCreatedBookingRef, setLastCreatedBookingRef] = useState<string>('');

  // Login Form state
  const [loginEmail, setLoginEmail] = useState('aarav.mehta@stayvilla.in');
  const [loginName, setLoginName] = useState('Aarav Mehta');

  // Search bar ref for click outside
  const searchBarRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // User initials avatar
  const userInitials = useMemo(() => {
    if (!userProfile.name) return 'U';
    return userProfile.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [userProfile.name]);

  // Calculate total guests
  const totalGuests = adults + childrenCount;

  // Nights calculation
  const nights = useMemo(() => {
    if (checkIn && checkOut && isAfter(checkOut, checkIn)) {
      return differenceInCalendarDays(checkOut, checkIn);
    }
    return 0;
  }, [checkIn, checkOut]);

  // Close popovers on click / touch outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setLocationOpen(false);
        setCalendarOpen(false);
        setGuestsOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Filter destination suggestions
  const filteredDestinations = useMemo(() => {
    if (!locationQuery.trim()) return destinationsData;
    const q = locationQuery.toLowerCase();
    return destinationsData.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q)
    );
  }, [locationQuery]);

  // Filter villas based on active search criteria
  const filteredVillas = useMemo(() => {
    return allVillas.filter((villa) => {
      if (activeFilters.location.trim()) {
        const query = activeFilters.location.toLowerCase();
        const matchesLocation =
          villa.location.toLowerCase().includes(query) ||
          villa.region.toLowerCase().includes(query) ||
          villa.country.toLowerCase().includes(query) ||
          villa.name.toLowerCase().includes(query);
        if (!matchesLocation) return false;
      }

      const totalFilterGuests = activeFilters.adults + activeFilters.children;
      if (totalFilterGuests > 0 && villa.maxGuests < totalFilterGuests) {
        return false;
      }

      if (activeFilters.rooms > 0 && villa.bedrooms < activeFilters.rooms) {
        return false;
      }

      return true;
    });
  }, [activeFilters]);

  // Filter Bookings for My Bookings Modal
  const displayedBookings = useMemo(() => {
    if (activeBookingsTab === 'upcoming') {
      return bookings.filter((b) => b.status === 'Confirmed');
    }
    if (activeBookingsTab === 'past') {
      return bookings.filter((b) => b.status === 'Completed' || b.status === 'Cancelled');
    }
    return bookings;
  }, [bookings, activeBookingsTab]);

  // Handle Search Submission
  const submitSearch = useCallback(
    (overrideLocation?: string) => {
      const loc = overrideLocation !== undefined ? overrideLocation : locationQuery;
      setActiveFilters({
        location: loc,
        checkIn,
        checkOut,
        adults,
        children: childrenCount,
        infants: infantsCount,
        rooms: roomsCount,
      });

      setLocationOpen(false);
      setCalendarOpen(false);
      setGuestsOpen(false);

      setSearchSent(true);
      setToastMessage(loc ? `Searching luxury villas in ${loc}` : 'Updated search filters');

      setTimeout(() => {
        setSearchSent(false);
        setToastMessage(null);
      }, 3200);

      const villasEl = document.getElementById('villas');
      if (villasEl) {
        villasEl.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [locationQuery, checkIn, checkOut, adults, childrenCount, infantsCount, roomsCount]
  );

  // GEOLOCATION: Enable Location Handler
  const handleEnableLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        let closestDest = destinationsData[0];
        let minDistance = Infinity;

        destinationsData.forEach((dest) => {
          const dist = calculateDistance(lat, lng, dest.latitude, dest.longitude);
          if (dist < minDistance) {
            minDistance = dist;
            closestDest = dest;
          }
        });

        let detectedCity = closestDest.name;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.city || data.locality || data.principalSubdivision) {
              const placeName = data.city || data.locality || data.principalSubdivision;
              const state = data.principalSubdivision || '';
              detectedCity = `${placeName}, ${state}`.replace(/^, |, $/g, '');
            }
          }
        } catch {
          // fallback to closest destination
        }

        setIsLocating(false);
        setDetectedLocationName(detectedCity);
        setLocationQuery(detectedCity);
        setLocationOpen(false);

        setToastMessage(`📍 Location detected: ${detectedCity}`);
        setSearchSent(true);
        setTimeout(() => setSearchSent(false), 3000);

        submitSearch(detectedCity);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please allow location access in your browser or pick a destination.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location position is unavailable. Please select an Indian destination manually.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('Unable to detect location. Please pick a destination below.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Handle Location Quick Select
  const handleSelectLocation = (destName: string) => {
    setLocationQuery(destName);
    setLocationOpen(false);
  };

  // Handle Destination Card Click
  const handleDestinationCardClick = (e: React.MouseEvent, destName: string) => {
    e.preventDefault();
    setLocationQuery(destName);
    submitSearch(destName);
  };

  // Handle Date Click in Calendar
  const handleDateClick = (day: Date) => {
    if (isBefore(day, today)) return;

    if (activeCalendarField === 'checkIn') {
      setCheckIn(day);
      if (checkOut && (isBefore(checkOut, day) || isSameDay(checkOut, day))) {
        setCheckOut(addDays(day, 2));
      }
      setActiveCalendarField('checkOut');
    } else {
      if (checkIn && (isBefore(day, checkIn) || isSameDay(day, checkIn))) {
        setCheckIn(day);
        setCheckOut(addDays(day, 2));
      } else {
        setCheckOut(day);
        setCalendarOpen(false);
      }
    }
  };

  // Date presets
  const applyPreset = (type: 'weekend' | 'week' | 'twoweeks' | 'clear') => {
    if (type === 'clear') {
      setCheckIn(null);
      setCheckOut(null);
      return;
    }
    const start = addDays(today, 3);
    if (type === 'weekend') {
      setCheckIn(start);
      setCheckOut(addDays(start, 3));
    } else if (type === 'week') {
      setCheckIn(start);
      setCheckOut(addDays(start, 7));
    } else if (type === 'twoweeks') {
      setCheckIn(start);
      setCheckOut(addDays(start, 14));
    }
    setCalendarOpen(false);
  };

  // Guest summary label
  const guestSummaryLabel = useMemo(() => {
    const total = adults + childrenCount;
    let text = `${total} guest${total === 1 ? '' : 's'}`;
    if (roomsCount > 1) {
      text += ` · ${roomsCount} rooms`;
    }
    return text;
  }, [adults, childrenCount, roomsCount]);

  // Reset all filters
  const resetAllFilters = () => {
    setLocationQuery('');
    setDetectedLocationName(null);
    setCheckIn(defaultCheckIn);
    setCheckOut(defaultCheckOut);
    setAdults(2);
    setChildrenCount(0);
    setInfantsCount(0);
    setRoomsCount(1);
    setActiveFilters({
      location: '',
      checkIn: defaultCheckIn,
      checkOut: defaultCheckOut,
      adults: 2,
      children: 0,
      infants: 0,
      rooms: 1,
    });
  };

  // Toggle favorite
  const toggleSaveVilla = (id: string) => {
    setSavedVillas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setMenuOpen(false);
    setToastMessage('You have been logged out.');
    setSearchSent(true);
    setTimeout(() => setSearchSent(false), 2600);
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setUserProfile((prev) => ({
      ...prev,
      name: loginName || 'Aarav Mehta',
      email: loginEmail || 'aarav.mehta@stayvilla.in',
    }));
    setProfileForm((prev) => ({
      ...prev,
      name: loginName || 'Aarav Mehta',
      email: loginEmail || 'aarav.mehta@stayvilla.in',
    }));
    setLoginModalOpen(false);
    setToastMessage(`Welcome back, ${loginName || 'Aarav'}!`);
    setSearchSent(true);
    setTimeout(() => setSearchSent(false), 3000);
  };

  // Handle Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({ ...profileForm });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2800);
  };

  // Handle Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
    setToastMessage('Reservation cancelled successfully.');
    setSearchSent(true);
    setTimeout(() => setSearchSent(false), 2600);
  };

  // Open full booking detail page in a new tab
  const handleOpenBookingDetail = (b: Booking) => {
    const villa = allVillas.find((v) => v.id === b.villaId);
    try {
      localStorage.setItem(
        `stayvilla-booking-${b.id}`,
        JSON.stringify({ booking: b, villa: villa || null })
      );
    } catch (err) {
      console.error('Failed to save booking to localStorage', err);
    }
    window.open(`/booking/${b.id}`, '_blank');
  };

  // Confirm Reservation and add to Bookings
  const handleConfirmReservation = (villa: Villa) => {
    const activeNights = nights > 0 ? nights : 7;
    const subtotal = villa.pricePerNight * activeNights;
    const cleaningFee = 3500;
    const serviceFee = Math.round(subtotal * 0.05);
    const total = subtotal + cleaningFee + serviceFee;
    const refCode = `SV-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      reference: refCode,
      villaId: villa.id,
      villaName: villa.name,
      villaLocation: villa.location,
      villaImage: villa.image,
      checkIn: checkIn ? format(checkIn, 'dd MMM yyyy') : format(addDays(today, 14), 'dd MMM yyyy'),
      checkOut: checkOut ? format(checkOut, 'dd MMM yyyy') : format(addDays(today, 21), 'dd MMM yyyy'),
      nights: activeNights,
      guests: totalGuests,
      adults,
      children: childrenCount,
      rooms: roomsCount,
      totalPrice: total,
      currency: villa.currency,
      status: 'Confirmed',
      createdAt: format(today, 'dd MMM yyyy'),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setLastCreatedBookingRef(refCode);
    setBookingSuccess(true);
  };

  // Calendar days generation
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <main className="site-shell">
      {/* HERO SECTION */}
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay" />

        {/* Navigation */}
        <header className="nav-wrap">
          <a href="#top" className="brand" aria-label="StayVilla home">
            <span className="brand-mark">⌁</span>
            <span className="brand-name">
              STAY<span>VILLA</span>
              <small>LUXURY VILLAS ACROSS INDIA</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#villas">Villas</a>
            <a href="#destinations">Destinations</a>
            <a href="#experiences">Experiences</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="nav-actions" ref={profileMenuRef}>
            {isLoggedIn ? (
              <>
                <button
                  className="nav-link bookings-nav-btn"
                  onClick={() => setMyBookingsOpen(true)}
                >
                  <CalendarCheck size={14} /> My bookings ({bookings.filter((b) => b.status === 'Confirmed').length})
                </button>
                <button
                  className="profile-button"
                  aria-label="Open profile menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {userInitials}
                </button>
                {menuOpen && (
                  <div className="profile-menu">
                    <div className="profile-heading">
                      <strong>{userProfile.name}</strong>
                      <span>{userProfile.email}</span>
                      <small className="member-tier-tag">{userProfile.tier}</small>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setMyBookingsOpen(true);
                      }}
                    >
                      <CalendarCheck size={14} /> My bookings
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setProfileForm({ ...userProfile });
                        setViewProfileOpen(true);
                      }}
                    >
                      <User size={14} /> View profile
                    </button>
                    <div className="menu-divider" />
                    <button type="button" className="logout-menu-item" onClick={handleLogout}>
                      <LogOut size={14} /> Log out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                className="nav-link login-link-btn"
                onClick={() => setLoginModalOpen(true)}
              >
                <LogIn size={15} /> Log in
              </button>
            )}

            <button
              className="mobile-menu-button"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {mobileOpen && (
          <nav className="mobile-nav">
            <a href="#villas" onClick={() => setMobileOpen(false)}>
              Villas
            </a>
            <a href="#destinations" onClick={() => setMobileOpen(false)}>
              Destinations
            </a>
            <a href="#experiences" onClick={() => setMobileOpen(false)}>
              Experiences
            </a>
            <a href="#about" onClick={() => setMobileOpen(false)}>
              About
            </a>
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  className="mobile-menu-link"
                  onClick={() => {
                    setMobileOpen(false);
                    setMyBookingsOpen(true);
                  }}
                >
                  <CalendarCheck size={16} /> My bookings
                </button>
                <button
                  type="button"
                  className="mobile-menu-link"
                  onClick={() => {
                    setMobileOpen(false);
                    setViewProfileOpen(true);
                  }}
                >
                  <User size={16} /> View profile ({userProfile.name})
                </button>
                <button type="button" className="mobile-menu-link logout-link" onClick={handleLogout}>
                  <LogOut size={16} /> Log out
                </button>
              </>
            ) : (
              <button
                type="button"
                className="mobile-menu-link"
                onClick={() => {
                  setMobileOpen(false);
                  setLoginModalOpen(true);
                }}
              >
                <LogIn size={16} /> Log in
              </button>
            )}
          </nav>
        )}

        <div className="hero-content" id="top">
          <p className="eyebrow light-eyebrow">
            <span />Curated stays, unforgettable places<span />
          </p>
          <h1>
            India&apos;s Finest<br />
            <em>Luxury Villas.</em>
          </h1>
          <p className="hero-subtitle">Exceptional villas in India's most beautiful corners</p>
        </div>

        {/* SEARCH BAR CONTAINER */}
        <div className="search-card" ref={searchBarRef}>
          {/* LOCATION FIELD */}
          <div className={`search-field location-field ${locationOpen ? 'field-active' : ''}`}>
            <MapPin size={19} className="field-icon" />
            <label htmlFor="location-input">Where</label>
            <div className="input-with-clear">
              <input
                id="location-input"
                value={locationQuery}
                onFocus={() => {
                  setLocationOpen(true);
                  setCalendarOpen(false);
                  setGuestsOpen(false);
                }}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setLocationError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitSearch();
                  if (e.key === 'Escape') setLocationOpen(false);
                }}
                placeholder="Search..."
                autoComplete="off"
              />
              {locationQuery && (
                <button
                  type="button"
                  className="clear-icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocationQuery('');
                    setDetectedLocationName(null);
                  }}
                  title="Clear location"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* LOCATION AUTOCOMPLETE & ENABLE LOCATION POPOVER */}
            {locationOpen && (
              <div className="search-popover location-popover">
                {/* PROMINENT ENABLE LOCATION ACTION */}
                <div className="enable-location-card">
                  <button
                    type="button"
                    className="enable-location-btn"
                    onClick={handleEnableLocation}
                    disabled={isLocating}
                  >
                    <div className="location-action-icon">
                      {isLocating ? (
                        <Loader2 size={18} className="spin-loader" />
                      ) : (
                        <LocateFixed size={18} />
                      )}
                    </div>
                    <div className="location-action-text">
                      <strong>
                        {isLocating ? 'Detecting your location in India...' : 'Enable Current Location'}
                      </strong>
                      <span>
                        {isLocating
                          ? 'Finding nearest luxury villas across India'
                          : 'Use GPS to find exceptional Indian stays near you'}
                      </span>
                    </div>
                    {!isLocating && <span className="location-badge">Detect</span>}
                  </button>

                  {locationError && (
                    <div className="location-error-banner">
                      <AlertCircle size={14} />
                      <span>{locationError}</span>
                    </div>
                  )}

                  {detectedLocationName && (
                    <div className="location-detected-banner">
                      <Check size={14} />
                      <span>Active Location: {detectedLocationName}</span>
                    </div>
                  )}
                </div>

                <div className="popover-header">
                  <span>Popular Indian Destinations</span>
                  {locationQuery && (
                    <button
                      type="button"
                      className="popover-action-text"
                      onClick={() => setLocationQuery('')}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="destinations-list">
                  <button
                    type="button"
                    className="destination-item anywhere-item"
                    onClick={() => {
                      setLocationQuery('');
                      setLocationOpen(false);
                      submitSearch('');
                    }}
                  >
                    <div className="dest-icon-wrap anywhere-icon">
                      <Compass size={16} />
                    </div>
                    <div className="dest-info">
                      <strong>All Destinations in India</strong>
                      <span>Browse all curated StayVilla properties in India</span>
                    </div>
                  </button>

                  {filteredDestinations.length > 0 ? (
                    filteredDestinations.map((dest) => (
                      <button
                        type="button"
                        key={dest.name}
                        className="destination-item"
                        onClick={() => handleSelectLocation(dest.name)}
                      >
                        <div className="dest-icon-wrap">
                          <MapPin size={15} />
                        </div>
                        <div className="dest-info">
                          <strong>{dest.name}</strong>
                          <span>
                            {dest.region} · {dest.villasCount} villas
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="no-destinations-found">
                      <p>No Indian destinations found matching &quot;{locationQuery}&quot;</p>
                      <button
                        type="button"
                        className="preset-btn"
                        onClick={() => setLocationQuery('')}
                      >
                        Show all destinations
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CHECK IN FIELD */}
          <div
            className={`search-field date-field ${calendarOpen && activeCalendarField === 'checkIn' ? 'field-active' : ''
              }`}
            onClick={() => {
              setActiveCalendarField('checkIn');
              setCalendarOpen(true);
              setLocationOpen(false);
              setGuestsOpen(false);
            }}
          >
            <CalendarIcon size={18} className="field-icon" />
            <label>Check in</label>
            <button type="button" className="date-button">
              {checkIn ? format(checkIn, 'dd MMM yyyy') : 'Add date'}
            </button>
          </div>

          {/* CHECK OUT FIELD */}
          <div
            className={`search-field date-field ${calendarOpen && activeCalendarField === 'checkOut' ? 'field-active' : ''
              }`}
            onClick={() => {
              setActiveCalendarField('checkOut');
              setCalendarOpen(true);
              setLocationOpen(false);
              setGuestsOpen(false);
            }}
          >
            <CalendarIcon size={18} className="field-icon" />
            <label>Check out</label>
            <button type="button" className="date-button">
              {checkOut ? format(checkOut, 'dd MMM yyyy') : 'Add date'}
            </button>
          </div>

          {/* CALENDAR POPOVER */}
          {calendarOpen && (
            <div className="search-popover calendar-popover">
              <div className="calendar-top-bar">
                <div className="calendar-nav-title">
                  <strong>{format(currentMonth, 'MMMM yyyy')}</strong>
                  {nights > 0 && (
                    <span className="nights-badge">
                      {nights} {nights === 1 ? 'night' : 'nights'} stay
                    </span>
                  )}
                </div>
                <div className="calendar-nav-buttons">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentMonth(subMonths(currentMonth, 1));
                    }}
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentMonth(addMonths(currentMonth, 1));
                    }}
                    aria-label="Next month"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="calendar-weekdays">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              <div className="calendar-grid">
                {calendarDays.map((day, idx) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isPast = isBefore(day, today);
                  const isSelectedStart = checkIn ? isSameDay(day, checkIn) : false;
                  const isSelectedEnd = checkOut ? isSameDay(day, checkOut) : false;
                  const isInRange =
                    checkIn && checkOut && isAfter(checkOut, checkIn)
                      ? isWithinInterval(day, { start: checkIn, end: checkOut })
                      : false;

                  let cellClass = 'cal-day';
                  if (!isCurrentMonth) cellClass += ' cal-outside';
                  if (isPast) cellClass += ' cal-past';
                  if (isSelectedStart) cellClass += ' cal-range-start';
                  if (isSelectedEnd) cellClass += ' cal-range-end';
                  if (isInRange && !isSelectedStart && !isSelectedEnd) cellClass += ' cal-in-range';

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isPast}
                      className={cellClass}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(day);
                      }}
                    >
                      <span>{format(day, 'd')}</span>
                    </button>
                  );
                })}
              </div>

              <div className="calendar-footer">
                <div className="presets-row">
                  <button type="button" onClick={() => applyPreset('weekend')}>
                    Weekend (3n)
                  </button>
                  <button type="button" onClick={() => applyPreset('week')}>
                    7 Nights
                  </button>
                  <button type="button" onClick={() => applyPreset('twoweeks')}>
                    14 Nights
                  </button>
                  <button type="button" onClick={() => applyPreset('clear')}>
                    Clear
                  </button>
                </div>
                <button
                  type="button"
                  className="calendar-done-btn"
                  onClick={() => setCalendarOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* GUESTS FIELD */}
          <div className={`search-field guests-field ${guestsOpen ? 'field-active' : ''}`}>
            <Users size={19} className="field-icon" />
            <label>Guests</label>
            <button
              type="button"
              className="guests-button"
              onClick={() => {
                setGuestsOpen(!guestsOpen);
                setLocationOpen(false);
                setCalendarOpen(false);
              }}
            >
              <span>{guestSummaryLabel}</span>
              <ChevronDown size={15} className={`chevron-icon ${guestsOpen ? 'rotated' : ''}`} />
            </button>

            {/* GUESTS STEPPER POPOVER */}
            {guestsOpen && (
              <div className="search-popover guest-popover">
                <div className="guest-row">
                  <div className="guest-label">
                    <strong>Adults</strong>
                    <small>Ages 13 or above</small>
                  </div>
                  <div className="stepper">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        setAdults(Math.max(1, adults - 1));
                      }}
                      aria-label="Decrease adults"
                    >
                      <Minus size={13} />
                    </button>
                    <b>{adults}</b>
                    <button
                      type="button"
                      disabled={adults >= 16}
                      onClick={(e) => {
                        e.stopPropagation();
                        setAdults(adults + 1);
                      }}
                      aria-label="Increase adults"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                <div className="guest-row">
                  <div className="guest-label">
                    <strong>Children</strong>
                    <small>Ages 2–12</small>
                  </div>
                  <div className="stepper">
                    <button
                      type="button"
                      disabled={childrenCount <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setChildrenCount(Math.max(0, childrenCount - 1));
                      }}
                      aria-label="Decrease children"
                    >
                      <Minus size={13} />
                    </button>
                    <b>{childrenCount}</b>
                    <button
                      type="button"
                      disabled={childrenCount >= 10}
                      onClick={(e) => {
                        e.stopPropagation();
                        setChildrenCount(childrenCount + 1);
                      }}
                      aria-label="Increase children"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                <div className="guest-row">
                  <div className="guest-label">
                    <strong>Infants</strong>
                    <small>Under 2</small>
                  </div>
                  <div className="stepper">
                    <button
                      type="button"
                      disabled={infantsCount <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setInfantsCount(Math.max(0, infantsCount - 1));
                      }}
                      aria-label="Decrease infants"
                    >
                      <Minus size={13} />
                    </button>
                    <b>{infantsCount}</b>
                    <button
                      type="button"
                      disabled={infantsCount >= 6}
                      onClick={(e) => {
                        e.stopPropagation();
                        setInfantsCount(infantsCount + 1);
                      }}
                      aria-label="Increase infants"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                <div className="guest-row guest-row-divider">
                  <div className="guest-label">
                    <strong>Bedrooms</strong>
                    <small>Minimum required</small>
                  </div>
                  <div className="stepper">
                    <button
                      type="button"
                      disabled={roomsCount <= 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoomsCount(Math.max(1, roomsCount - 1));
                      }}
                      aria-label="Decrease rooms"
                    >
                      <Minus size={13} />
                    </button>
                    <b>{roomsCount}</b>
                    <button
                      type="button"
                      disabled={roomsCount >= 8}
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoomsCount(roomsCount + 1);
                      }}
                      aria-label="Increase rooms"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                <div className="guest-footer">
                  <button
                    type="button"
                    className="guest-reset-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAdults(2);
                      setChildrenCount(0);
                      setInfantsCount(0);
                      setRoomsCount(1);
                    }}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="guest-apply-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGuestsOpen(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SEARCH BUTTON */}
          <button
            type="button"
            className="search-button"
            onClick={() => submitSearch()}
          >
            <Search size={18} />
            <span>Search</span>
          </button>
        </div>

        {/* TOAST FEEDBACK */}
        {searchSent && (
          <div className="search-toast">
            <Check size={17} />
            <span>{toastMessage || 'Finding your next escape'}</span>
          </div>
        )}

        <div className="hero-foot">
          <span>Scroll to explore luxury stays</span>
          <span className="scroll-line" />
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="intro-section section-pad" id="about">
        <div className="intro-copy">
          <p className="eyebrow">The StayVilla Indian Standard</p>
          <h2>
            More than a place to stay <em>stay.</em>
          </h2>
        </div>
        <div className="intro-text">
          <p>
            From centuries-old Rajasthani havelis and serene Kerala backwater sanctuaries to mist-shrouded Himalayan chalets,
            each StayVilla across India is handpicked for soul-stirring architecture and warm Indian hospitality.
          </p>
          <a className="text-link" href="#villas">
            Discover our story <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* VILLAS SECTION */}
      <section className="section-pad villas-section" id="villas">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A little extraordinary</p>
            <h2>
              Featured <em>villas & havelis</em>
            </h2>
          </div>
          <div className="heading-actions">
            <span className="villas-count-badge">
              {filteredVillas.length} {filteredVillas.length === 1 ? 'villa' : 'villas'} available in India
            </span>
          </div>
        </div>

        {/* ACTIVE SEARCH FILTER PILLS */}
        {(activeFilters.location ||
          nights > 0 ||
          activeFilters.adults + activeFilters.children !== 2 ||
          activeFilters.rooms !== 1) && (
            <div className="active-filters-bar">
              <div className="filters-label">
                <SlidersHorizontal size={14} />
                <span>Active filters:</span>
              </div>
              <div className="filter-chips">
                {activeFilters.location && (
                  <span className="filter-chip">
                    <MapPin size={12} /> {activeFilters.location}
                    <button
                      type="button"
                      onClick={() => {
                        setLocationQuery('');
                        setDetectedLocationName(null);
                        setActiveFilters((prev) => ({ ...prev, location: '' }));
                      }}
                      title="Remove location filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {activeFilters.checkIn && activeFilters.checkOut && nights > 0 && (
                  <span className="filter-chip">
                    <CalendarIcon size={12} /> {format(activeFilters.checkIn, 'dd MMM')} –{' '}
                    {format(activeFilters.checkOut, 'dd MMM')} ({nights} {nights === 1 ? 'night' : 'nights'})
                    <button
                      type="button"
                      onClick={() => {
                        setCheckIn(null);
                        setCheckOut(null);
                        setActiveFilters((prev) => ({ ...prev, checkIn: null, checkOut: null }));
                      }}
                      title="Remove date filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {(activeFilters.adults + activeFilters.children !== 2 || activeFilters.rooms !== 1) && (
                  <span className="filter-chip">
                    <Users size={12} /> {activeFilters.adults + activeFilters.children} guests ·{' '}
                    {activeFilters.rooms} {activeFilters.rooms === 1 ? 'room' : 'rooms'}
                    <button
                      type="button"
                      onClick={() => {
                        setAdults(2);
                        setChildrenCount(0);
                        setRoomsCount(1);
                        setActiveFilters((prev) => ({
                          ...prev,
                          adults: 2,
                          children: 0,
                          rooms: 1,
                        }));
                      }}
                      title="Reset guest filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                <button type="button" className="reset-filters-btn" onClick={resetAllFilters}>
                  <RotateCcw size={13} /> Reset all
                </button>
              </div>
            </div>
          )}

        {/* VILLAS GRID OR EMPTY STATE */}
        {filteredVillas.length > 0 ? (
          <div className="villa-grid">
            {filteredVillas.map((villa) => {
              const isSaved = savedVillas[villa.id];
              const totalStayPrice = nights > 0 ? villa.pricePerNight * nights : null;

              return (
                <article className="villa-card" key={villa.id}>
                  <div className="villa-image-wrap" onClick={() => setSelectedVillaForBooking(villa)}>
                    <img src={villa.image} alt={`${villa.name} exterior`} />
                    <span className="villa-tag">{villa.tag}</span>
                    <button
                      type="button"
                      className={`heart-button ${isSaved ? 'heart-saved' : ''}`}
                      aria-label={`Save ${villa.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveVilla(villa.id);
                      }}
                    >
                      <Heart size={18} fill={isSaved ? '#c8a46a' : 'none'} />
                    </button>
                    <div className="villa-image-hover-overlay">
                      <span>View details & reserve</span>
                    </div>
                  </div>

                  <div className="villa-info">
                    <div>
                      <h3 onClick={() => setSelectedVillaForBooking(villa)} className="villa-title-clickable">
                        {villa.name}
                      </h3>
                      <p>
                        <MapPin size={14} /> {villa.location}
                      </p>
                    </div>
                    <div className="rating">
                      <Star size={14} fill="currentColor" /> {villa.rating}
                      <span className="reviews-count">({villa.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="villa-features">
                    <span>
                      <BedDouble size={13} /> {villa.bedrooms} bedrooms
                    </span>
                    <span>
                      <Users size={13} /> Up to {villa.maxGuests} guests
                    </span>
                    <span>
                      <Bath size={13} /> {villa.bathrooms} baths
                    </span>
                  </div>

                  <div className="villa-meta">
                    <div className="pricing-block">
                      <div className="rate-per-night">
                        <strong>
                          {villa.currency}
                          {formatINR(villa.pricePerNight)}
                        </strong>{' '}
                        <span>/ night</span>
                      </div>
                      {totalStayPrice !== null && (
                        <span className="total-calc-badge">
                          {villa.currency}
                          {formatINR(totalStayPrice)} total ({nights}n)
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="reserve-card-btn"
                      onClick={() => setSelectedVillaForBooking(villa)}
                    >
                      Reserve
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="no-villas-empty">
            <div className="empty-icon-wrap">
              <MapPin size={32} />
            </div>
            <h3>No villas match your current search in India</h3>
            <p>
              We couldn&apos;t find any available properties in &quot;{activeFilters.location}&quot; for{' '}
              {activeFilters.adults + activeFilters.children} guests and {activeFilters.rooms} rooms.
            </p>
            <div className="empty-actions">
              <button type="button" className="outline-link" onClick={resetAllFilters}>
                <RotateCcw size={15} /> Clear filters & show all Indian villas
              </button>
            </div>
          </div>
        )}
      </section>

      {/* DESTINATIONS SECTION */}
      <section className="destination-section section-pad" id="destinations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Go somewhere extraordinary in India</p>
            <h2>
              Popular <em>destinations</em>
            </h2>
          </div>
          <div className="arrow-buttons">
            <button aria-label="Previous destinations">
              <ChevronLeft size={18} />
            </button>
            <button aria-label="Next destinations">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="destination-grid">
          {destinationsData.slice(0, 3).map((destination) => (
            <a
              className="destination-card"
              href="#villas"
              key={destination.name}
              onClick={(e) => handleDestinationCardClick(e, destination.name)}
            >
              <img src={destination.image} alt={destination.name} />
              <div className="destination-overlay">
                <span>{destination.meta}</span>
                <h3>{destination.name}</h3>
                <ArrowRight size={19} />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* TRUST / EXPERIENCES SECTION */}
      <section className="trust-section section-pad" id="experiences">
        <div className="trust-intro">
          <p className="eyebrow">A better way to travel across India</p>
          <h2>
            Thoughtfully<br />
            <em>different.</em>
          </h2>
          <p>From private butler arrival to curated regional delicacies, every detail is considered.</p>
        </div>
        <div className="trust-grid">
          <div className="trust-item">
            <span className="trust-icon">
              <ShieldCheck size={22} />
            </span>
            <h3>Verified Indian Estates</h3>
            <p>Every palace, haveli, and modern villa is personally audited by our local curators.</p>
          </div>
          <div className="trust-item">
            <span className="trust-icon">
              <Sparkles size={22} />
            </span>
            <h3>Bespoke Hospitality</h3>
            <p>Royal thali banquets, private Ayurvedic therapists, and personalized cultural itineraries.</p>
          </div>
          <div className="trust-item">
            <span className="trust-icon">
              <Users size={22} />
            </span>
            <h3>Always Here</h3>
            <p>Our 24/7 private concierge team is at your service across all Indian states.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="testimonial-section section-pad">
        <div className="testimonial-quote">
          <div className="quote-mark">“</div>
          <p>
            {[
              'StayVilla made our anniversary in Udaipur feel like a royal fairytale. The lake view, the personal thali dining, the private courtyard — quietly magical.',
              'The backwaters villa in Kerala gave us the deep rest we needed away from Mumbai’s rush. Waking up to bird songs over the lake was incomparable.',
              'Our family reunion in Manali was unforgettable. The roaring fireplace, cedar scent, and snow peaks view were breathtaking.',
            ][activeTestimonial]}
          </p>
          <div className="testimonial-person">
            <div className="initial-avatar">{['AS', 'PH', 'KS'][activeTestimonial]}</div>
            <div>
              <strong>{['Aditi & Rohan Sharma', 'Pooja Hegde', 'Kabir Singhania'][activeTestimonial]}</strong>
              <span>
                Stayed in {['The Royal Pichola Villa, Udaipur', 'Kumarakom Waters Edge, Kerala', 'The Himalayan Pine Chalet, Manali'][activeTestimonial]} · {['May 2025', 'April 2025', 'March 2025'][activeTestimonial]}
              </span>
            </div>
          </div>
          <div className="testimonial-controls">
            <span>{String(activeTestimonial + 1).padStart(2, '0')} / 03</span>
            <button
              onClick={() => setActiveTestimonial((activeTestimonial + 2) % 3)}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => setActiveTestimonial((activeTestimonial + 1) % 3)}
              aria-label="Next testimonial"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
        <div className="testimonial-image">
          <img src={initialVillaImages[activeTestimonial]} alt="Villa view" />
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="newsletter-section section-pad">
        <div>
          <p className="eyebrow">Stay connected</p>
          <h2>
            Notes from India&apos;s<br />
            <em>beautiful places.</em>
          </h2>
        </div>
        <div className="newsletter-form">
          <p>A curated monthly letter. Newly restored havelis, hidden plantation gems, and seasonal travel inspiration across India.</p>
          <div className="email-row">
            <input aria-label="Email address" placeholder="Enter your email address" type="email" />
            <button>
              Sign me up <ArrowRight size={17} />
            </button>
          </div>
          <small>By subscribing, you agree to our privacy policy.</small>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contact">
        <div className="footer-brand">
          <a href="#top" className="brand footer-logo">
            <span className="brand-mark">⌁</span>
            <span className="brand-name">
              STAY<span>VILLA</span>
              <small>LUXURY VILLAS ACROSS INDIA</small>
            </span>
          </a>
          <p>
            Exceptional Indian homes.<br />
            Unforgettable royal places.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Explore</strong>
            <a href="#villas">Goa Villas</a>
            <a href="#destinations">Udaipur Havelis</a>
            <a href="#experiences">Kerala Backwaters</a>
            <a href="#villas">Himachal Chalets</a>
          </div>
          <div>
            <strong>Company</strong>
            <a href="#about">Our story</a>
            <a href="#contact">Contact concierge</a>
            <a href="#contact">Journal</a>
          </div>
          <div>
            <strong>Follow along</strong>
            <a href="#contact">Instagram</a>
            <a href="#contact">Pinterest</a>
            <a href="#contact">Facebook</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 StayVilla India Pvt. Ltd. All rights reserved.</span>
          <span>Privacy · Terms · Cookies</span>
          <span className="payment-icons">UPI · RuPay · NetBanking · VISA · Master · Pay</span>
        </div>
      </footer>

      {/* INTERACTIVE RESERVATION / DETAILS MODAL */}
      {selectedVillaForBooking && (
        <div className="modal-backdrop" onClick={() => setSelectedVillaForBooking(null)}>
          <div className="reservation-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => {
                setSelectedVillaForBooking(null);
                setBookingSuccess(false);
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {bookingSuccess ? (
              <div className="booking-success-view">
                <div className="success-icon-badge">
                  <Check size={36} />
                </div>
                <h2>Reservation Confirmed!</h2>
                <p className="success-subtitle">
                  We have secured your stay at <strong>{selectedVillaForBooking.name}</strong>.
                </p>
                <div className="booking-confirmation-details">
                  <div className="conf-row">
                    <span>Reference</span>
                    <strong>{lastCreatedBookingRef}</strong>
                  </div>
                  <div className="conf-row">
                    <span>Dates</span>
                    <strong>
                      {checkIn ? format(checkIn, 'dd MMM yyyy') : 'Flexible'} –{' '}
                      {checkOut ? format(checkOut, 'dd MMM yyyy') : 'Flexible'} ({nights || 7} nights)
                    </strong>
                  </div>
                  <div className="conf-row">
                    <span>Guests</span>
                    <strong>
                      {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'} ({adults} Adults
                      {childrenCount > 0 ? `, ${childrenCount} Children` : ''})
                    </strong>
                  </div>
                  <div className="conf-row">
                    <span>Location</span>
                    <strong>{selectedVillaForBooking.location}</strong>
                  </div>
                </div>
                <p className="concierge-note">
                  <Sparkle size={14} /> Our dedicated StayVilla concierge will contact you 48 hours prior to check-in
                  with private arrival arrangements and local airport transfers.
                </p>
                <div className="success-actions-row">
                  <button
                    type="button"
                    className="modal-outline-btn"
                    onClick={() => {
                      setSelectedVillaForBooking(null);
                      setBookingSuccess(false);
                      setMyBookingsOpen(true);
                    }}
                  >
                    <CalendarCheck size={16} /> View in My Bookings
                  </button>
                  <button
                    type="button"
                    className="modal-primary-btn"
                    onClick={() => {
                      setSelectedVillaForBooking(null);
                      setBookingSuccess(false);
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="modal-content-grid">
                <div className="modal-left-media">
                  <img src={selectedVillaForBooking.image} alt={selectedVillaForBooking.name} />
                  <div className="modal-media-caption">
                    <span className="villa-tag">{selectedVillaForBooking.tag}</span>
                    <div className="rating">
                      <Star size={14} fill="currentColor" /> {selectedVillaForBooking.rating} (
                      {selectedVillaForBooking.reviewsCount} reviews)
                    </div>
                  </div>
                </div>

                <div className="modal-right-info">
                  <div className="modal-header">
                    <p className="modal-eyebrow">
                      <MapPin size={13} /> {selectedVillaForBooking.location}
                    </p>
                    <h2>{selectedVillaForBooking.name}</h2>
                    <p className="modal-description">{selectedVillaForBooking.description}</p>
                  </div>

                  <div className="modal-specs">
                    <div>
                      <BedDouble size={16} />
                      <span>{selectedVillaForBooking.bedrooms} Bedrooms</span>
                    </div>
                    <div>
                      <Users size={16} />
                      <span>Up to {selectedVillaForBooking.maxGuests} Guests</span>
                    </div>
                    <div>
                      <Bath size={16} />
                      <span>{selectedVillaForBooking.bathrooms} Bathrooms</span>
                    </div>
                  </div>

                  <div className="booking-summary-box">
                    <div className="box-section">
                      <label>Dates</label>
                      <div className="box-val">
                        <CalendarIcon size={14} />
                        <span>
                          {checkIn ? format(checkIn, 'dd MMM yyyy') : 'Flexible'} →{' '}
                          {checkOut ? format(checkOut, 'dd MMM yyyy') : 'Flexible'} (
                          {nights > 0 ? `${nights} nights` : '7 nights stay'})
                        </span>
                      </div>
                    </div>
                    <div className="box-section">
                      <label>Guests & Rooms</label>
                      <div className="box-val">
                        <Users size={14} />
                        <span>
                          {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}, {roomsCount}{' '}
                          {roomsCount === 1 ? 'Room' : 'Rooms'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const activeNights = nights > 0 ? nights : 7;
                    const subtotal = selectedVillaForBooking.pricePerNight * activeNights;
                    const cleaningFee = 3500;
                    const serviceFee = Math.round(subtotal * 0.05);
                    const total = subtotal + cleaningFee + serviceFee;

                    return (
                      <div className="price-breakdown">
                        <div className="price-row">
                          <span>
                            {selectedVillaForBooking.currency}
                            {formatINR(selectedVillaForBooking.pricePerNight)} × {activeNights} nights
                          </span>
                          <span>
                            {selectedVillaForBooking.currency}
                            {formatINR(subtotal)}
                          </span>
                        </div>
                        <div className="price-row">
                          <span>Cleaning & villa sanitization</span>
                          <span>
                            {selectedVillaForBooking.currency}
                            {formatINR(cleaningFee)}
                          </span>
                        </div>
                        <div className="price-row">
                          <span>StayVilla concierge service fee (5%)</span>
                          <span>
                            {selectedVillaForBooking.currency}
                            {formatINR(serviceFee)}
                          </span>
                        </div>
                        <div className="price-divider" />
                        <div className="price-row total-row">
                          <strong>Total (INR)</strong>
                          <strong>
                            {selectedVillaForBooking.currency}
                            {formatINR(total)}
                          </strong>
                        </div>
                      </div>
                    );
                  })()}

                  <button
                    type="button"
                    className="modal-primary-btn"
                    onClick={() => handleConfirmReservation(selectedVillaForBooking)}
                  >
                    Confirm Reservation
                  </button>
                  <p className="no-charge-note">No cancellation fee up to 7 days before arrival.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MY BOOKINGS MODAL */}
      {myBookingsOpen && (
        <div className="modal-backdrop" onClick={() => setMyBookingsOpen(false)}>
          <div className="user-dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <div>
                <span className="dash-modal-eyebrow">
                  <CalendarCheck size={14} /> Account Stays
                </span>
                <h2>My Bookings in India</h2>
              </div>
              <button
                type="button"
                className="dash-close-btn"
                onClick={() => setMyBookingsOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Bookings Filter Tabs */}
            <div className="dash-tabs">
              <button
                type="button"
                className={`dash-tab ${activeBookingsTab === 'all' ? 'active-tab' : ''}`}
                onClick={() => setActiveBookingsTab('all')}
              >
                All Bookings ({bookings.length})
              </button>
              <button
                type="button"
                className={`dash-tab ${activeBookingsTab === 'upcoming' ? 'active-tab' : ''}`}
                onClick={() => setActiveBookingsTab('upcoming')}
              >
                Upcoming ({bookings.filter((b) => b.status === 'Confirmed').length})
              </button>
              <button
                type="button"
                className={`dash-tab ${activeBookingsTab === 'past' ? 'active-tab' : ''}`}
                onClick={() => setActiveBookingsTab('past')}
              >
                Past & Cancelled ({bookings.filter((b) => b.status !== 'Confirmed').length})
              </button>
            </div>

            <div className="dash-bookings-list">
              {displayedBookings.length > 0 ? (
                displayedBookings.map((b) => (
                  <div
                    className={`booking-record-card ${b.status.toLowerCase()}`}
                    key={b.id}
                    onClick={() => handleOpenBookingDetail(b)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="booking-thumb">
                      <img src={b.villaImage} alt={b.villaName} />
                      <span className={`booking-status-tag status-${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="booking-details">
                      <div className="booking-top-row">
                        <div>
                          <h3>{b.villaName}</h3>
                          <p className="booking-loc">
                            <MapPin size={13} /> {b.villaLocation}
                          </p>
                        </div>
                        <div className="booking-ref-badge">
                          <span>Ref:</span> <strong>{b.reference}</strong>
                        </div>
                      </div>

                      <div className="booking-info-grid">
                        <div className="info-block">
                          <label>Dates</label>
                          <span>
                            {b.checkIn} – {b.checkOut}
                          </span>
                          <small>({b.nights} nights)</small>
                        </div>
                        <div className="info-block">
                          <label>Guests & Rooms</label>
                          <span>{b.guests} Guests</span>
                          <small>{b.rooms} Bedrooms</small>
                        </div>
                        <div className="info-block">
                          <label>Total Price (INR)</label>
                          <strong className="booking-price">
                            {b.currency}
                            {formatINR(b.totalPrice)}
                          </strong>
                          <small>GST & concierge included</small>
                        </div>
                      </div>

                      <div className="booking-actions-row">
                        {b.status === 'Confirmed' ? (
                          <a
                            href={`https://wa.me/919167914640?text=${encodeURIComponent(
                              `Hello StayVilla Concierge, I would like to request cancellation for reservation ${b.reference} (${b.villaName}).`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whatsapp-cancel-disclaimer"
                            onClick={(e) => e.stopPropagation()}
                            title="Contact concierge on WhatsApp for cancellation"
                          >
                            <span className="whatsapp-icon-badge">
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.336 11.893-11.893a11.82 11.82 0 00-3.475-8.412z" />
                              </svg>
                            </span>
                            <span className="whatsapp-disclaimer-text">
                              For cancellation, contact via <strong>WhatsApp</strong>
                            </span>
                          </a>
                        ) : null}
                        <span className="booking-created-text">Booked on {b.createdAt}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dash-empty-state">
                  <CalendarCheck size={40} />
                  <h3>No bookings found</h3>
                  <p>You don&apos;t have any {activeBookingsTab !== 'all' ? activeBookingsTab : ''} bookings at the moment.</p>
                  <button
                    type="button"
                    className="modal-primary-btn"
                    style={{ maxWidth: '240px', margin: '16px auto 0' }}
                    onClick={() => {
                      setMyBookingsOpen(false);
                      const el = document.getElementById('villas');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Explore Curated Indian Villas
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW PROFILE MODAL */}
      {viewProfileOpen && (
        <div className="modal-backdrop" onClick={() => setViewProfileOpen(false)}>
          <div className="user-dashboard-modal profile-modal-wrap" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <div>
                <span className="dash-modal-eyebrow">
                  <User size={14} /> Member Account
                </span>
                <h2>Guest Profile</h2>
              </div>
              <button
                type="button"
                className="dash-close-btn"
                onClick={() => setViewProfileOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="profile-modal-body">
              {/* Member Card Banner */}
              <div className="member-status-banner">
                <div className="member-avatar-lg">{userInitials}</div>
                <div className="member-banner-info">
                  <div className="member-name-row">
                    <h3>{userProfile.name}</h3>
                    <span className="tier-badge">
                      <Award size={14} /> {userProfile.tier}
                    </span>
                  </div>
                  <p>{userProfile.email}</p>
                  <span className="member-since">Member since {userProfile.memberSince} · {bookings.length} Indian stays booked</span>
                </div>
              </div>

              {profileSavedToast && (
                <div className="profile-saved-banner">
                  <CheckCircle2 size={16} /> Profile changes saved successfully!
                </div>
              )}

              {/* Profile Edit Form */}
              <form onSubmit={handleSaveProfile} className="profile-edit-form">
                <h4>Personal Information</h4>
                <div className="form-grid">
                  <div className="form-field">
                    <label>
                      <User size={13} /> Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      <Mail size={13} /> Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      <Phone size={13} /> Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      <Globe size={13} /> Country / City
                    </label>
                    <input
                      type="text"
                      value={profileForm.country}
                      onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                    />
                  </div>
                </div>

                <div className="preferences-section">
                  <h4>StayVilla India Privileges</h4>
                  <div className="privilege-tags">
                    <span>✓ 24/7 Dedicated Concierge & Butler</span>
                    <span>✓ Airport & Helipad Transfers</span>
                    <span>✓ Curated Regional Culinary Banquets</span>
                    <span>✓ Early Check-in & Late Check-out</span>
                  </div>
                </div>

                <div className="profile-modal-actions">
                  <button
                    type="button"
                    className="modal-outline-btn"
                    onClick={() => {
                      setViewProfileOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={14} /> Log out
                  </button>
                  <button type="submit" className="modal-primary-btn" style={{ width: 'auto', minWidth: '160px' }}>
                    <Edit3 size={15} /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {loginModalOpen && (
        <div className="modal-backdrop" onClick={() => setLoginModalOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setLoginModalOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="auth-modal-header">
              <span className="brand-mark" style={{ fontSize: '32px' }}>⌁</span>
              <h2>Welcome to StayVilla India</h2>
              <p>Log in to access your royal bookings, saved havelis and bespoke concierge services.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-field">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Aarav Mehta"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="aarav.mehta@stayvilla.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="modal-primary-btn" style={{ marginTop: '12px' }}>
                <LogIn size={16} /> Log In as {loginName || 'Aarav'}
              </button>

              <button
                type="button"
                className="quick-demo-btn"
                onClick={() => {
                  setLoginName('Aarav Mehta');
                  setLoginEmail('aarav.mehta@stayvilla.in');
                  setIsLoggedIn(true);
                  setLoginModalOpen(false);
                  setToastMessage('Welcome back, Aarav Mehta!');
                  setSearchSent(true);
                  setTimeout(() => setSearchSent(false), 3000);
                }}
              >
                1-Click Demo Login (Aarav Mehta)
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
