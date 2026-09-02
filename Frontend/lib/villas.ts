export interface Villa {
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
  galleryImages: string[];
  tag: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  details: string;
  description: string;
  longDescription?: string;
  amenities: {
    icon: string;
    label: string;
    description: string;
  }[];
  rooms: {
    name: string;
    bedType: string;
    enSuite: boolean;
    features: string;
  }[];
  highlights: string[];
  houseRules: string[];
  host: {
    name: string;
    role: string;
    avatar: string;
    badge: string;
    responseRate: string;
  };
  reviews: {
    id: string;
    author: string;
    avatar: string;
    date: string;
    rating: number;
    comment: string;
    stayType: string;
  }[];
}

export const allVillas: Villa[] = [
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
    image: 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galleryImages: [
      'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    tag: 'Royal Heritage',
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    details: '4 bedrooms · 8 guests · Private Pool',
    description: 'Overlooking tranquil Lake Pichola with hand-carved marble jharokhas, private courtyards, infinity plunge pool, and royal Rajputana chef service.',
    longDescription: 'Set against the shimmering waters of Lake Pichola and the iconic Aravalli mountain ranges, The Royal Pichola Villa is an architectural homage to Mewar majesty. Designed with pristine Makrana white marble, hand-painted gold leaf murals, and grand scalloped arches, this exclusive heritage estate blends centuries-old regal hospitality with ultra-modern private sanctuary luxury. Enjoy sunrise yoga by the infinity plunge pool, candlelit thali dinners curated by a royal lineage chef, and private shikara boat transfers right from your private jetty.',
    highlights: [
      'Panoramic Lake Pichola & Aravalli Mountain Views',
      'Private Temperature-Controlled Infinity Plunge Pool',
      'Dedicated Royal Rajputana Private Chef & Butler Team',
      'Exclusive Lakefront Private Jetty with Shikara Access',
      'Handcrafted Marble Jharokhas & Courtyard Fountain',
    ],
    amenities: [
      { icon: 'Waves', label: 'Infinity Plunge Pool', description: 'Private temperature-controlled pool overlooking Lake Pichola' },
      { icon: 'Utensils', label: 'Private Chef Included', description: 'Bespoke Mewari & contemporary world menus crafted on demand' },
      { icon: 'Wifi', label: 'Ultra High-Speed Wi-Fi', description: '500 Mbps fiber mesh across entire estate & grounds' },
      { icon: 'ShieldCheck', label: '24/7 Butler & Security', description: 'Personalized discrete concierge assistance at all times' },
      { icon: 'Sparkles', label: 'Ayurvedic Spa Pavilion', description: 'On-site therapist for rejuvenating herbal therapies' },
      { icon: 'Car', label: 'Private Airport Chauffeur', description: 'Complimentary luxury SUV pick-up & drop from Udaipur Airport' },
      { icon: 'Coffee', label: 'Artisanal Breakfast', description: 'Gourmet organic breakfast served on the lakeside terrace' },
      { icon: 'Tv', label: 'Home Cinema Lounge', description: '85" 4K OLED with Bang & Olufsen surround sound acoustics' },
    ],
    rooms: [
      { name: 'Mewar Master Suite', bedType: '1 King Bed', enSuite: true, features: 'Lake view, private jharokha balcony, marble soaking tub' },
      { name: 'Maharani Suite', bedType: '1 King Bed', enSuite: true, features: 'Courtyard garden access, rain shower, walk-in wardrobe' },
      { name: 'Aravalli Guest Room', bedType: '1 Queen Bed', enSuite: true, features: 'Mountain views, handcrafted teakwood furnishings' },
      { name: 'Pichola Garden Room', bedType: '2 Twin Beds (convertible)', enSuite: true, features: 'Lush lawn access, direct patio entrance' },
    ],
    houseRules: [
      'Check-in: 2:00 PM onwards · Check-out: 11:00 AM',
      'Quiet hours after 10:00 PM for lakeside wildlife harmony',
      'Smoking permitted only in designated outdoor verandas',
      'Pet friendly upon prior request & concierge confirmation',
    ],
    host: {
      name: 'StayVilla Heritage Reserve',
      role: 'Superhost & Estate Manager',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      badge: 'StayVilla Verified Luxury Host',
      responseRate: '100% (within 15 minutes)',
    },
    reviews: [
      {
        id: 'r-1',
        author: 'Vikramaditya S.',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        date: 'February 2026',
        rating: 5,
        comment: 'An absolute masterpiece of luxury. The private chef prepared authentic Mewari banquets that rivalled 7-star palaces. Sunset over Lake Pichola from the plunge pool is unforgettable.',
        stayType: 'Family Celebration',
      },
      {
        id: 'r-2',
        author: 'Elena & Mark K.',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
        date: 'January 2026',
        rating: 5,
        comment: 'Impeccable service, surreal location, and pristine heritage details. The private boat ride directly to the villa jetty was breathtaking.',
        stayType: 'Couples Retreat',
      },
    ],
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
    image: 'https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galleryImages: [
      'https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    tag: 'Guest Favourite',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    details: '3 bedrooms · 6 guests · Private Pool',
    description: 'Restored 19th-century Indo-Portuguese estate set amid coconut groves, featuring private lap pool, shaded verandahs, and private beach access.',
    longDescription: 'Embrace the soul of Bohemian luxury in North Goa. Villa Sol De Goa is a meticulously restored Indo-Portuguese manor house cocooned by swaying palm trees and lush bougainvillea gardens. Featuring oyster shell windows, terracotta tiled roofing, exposed basalt stone masonry, and a 20-meter private turquoise lap pool, this sanctuary offers the quintessential Goan susegad experience. Just 5 minutes from Anjuna & Vagator beaches, yet enveloped in serene tropical seclusion.',
    highlights: [
      '20-Meter Private Swimming Pool & Sunken Sun Loungers',
      'Authentic 19th-Century Indo-Portuguese Architecture',
      'Alfresco Barbecue Patio with Outdoor Wood-Fired Pizza Oven',
      'Private Goan & Continental Chef on Request',
      'Lush 1.5-Acre Tropical Coconut Grove & Organic Herb Garden',
    ],
    amenities: [
      { icon: 'Waves', label: 'Private Lap Pool', description: 'Crystal-clear pool with outdoor sun loungers and cabana' },
      { icon: 'Utensils', label: 'Full Kitchen & Chef', description: 'Fresh seafood & tropical curries cooked to order' },
      { icon: 'Wifi', label: 'High Speed Fiber Wi-Fi', description: 'Ideal for remote work and digital nomads' },
      { icon: 'ShieldCheck', label: '24/7 Gated Security', description: 'Night security guard and day concierge' },
      { icon: 'Coffee', label: 'Complimentary Breakfast', description: 'Daily fresh tropical fruit baskets, poi breads & eggs' },
      { icon: 'Car', label: 'Free Parking On Premises', description: 'Private secure driveway for up to 3 cars' },
      { icon: 'Tv', label: 'Smart Entertainment', description: 'Smart TV with Netflix, Spotify, Marshall Bluetooth speakers' },
      { icon: 'Wind', label: 'Air Conditioned Suites', description: 'Individual climate control throughout all rooms' },
    ],
    rooms: [
      { name: 'Palm View Master Suite', bedType: '1 King Bed', enSuite: true, features: 'Balcony overlooking pool & coconut grove, open sky shower' },
      { name: 'Portuguese Veranda Suite', bedType: '1 Queen Bed', enSuite: true, features: 'Direct access to shaded veranda, vintage four-poster bed' },
      { name: 'Bougainvillea Room', bedType: '1 Queen Bed', enSuite: true, features: 'Garden views, antique writing desk, rain shower' },
    ],
    houseRules: [
      'Check-in: 2:00 PM · Check-out: 11:00 AM',
      'Pool closes for maintenance between 11 PM and 6 AM',
      'Small gatherings allowed with prior host approval',
      'Smoking outdoors only',
    ],
    host: {
      name: 'Armaan & Sarah Noronha',
      role: 'Goa Superhost',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      badge: 'StayVilla Certified Host',
      responseRate: '100% (within 30 minutes)',
    },
    reviews: [
      {
        id: 'r-3',
        author: 'Rohan Mehta',
        avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
        date: 'January 2026',
        rating: 5,
        comment: 'Best villa experience we have had in Goa! The private pool is massive and clean, and the outdoor pizza oven was a huge hit with our group.',
        stayType: 'Friends Getaway',
      },
      {
        id: 'r-4',
        author: 'Ananya Deshmukh',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
        date: 'December 2025',
        rating: 5,
        comment: 'The Portuguese aesthetic was so charming. Cleanliness was 10/10 and the host provided wonderful recommendations for hidden cafes.',
        stayType: 'Family Vacation',
      },
    ],
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
    image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galleryImages: [
      'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/261108/pexels-photo-261108.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    tag: 'Rare Find',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    details: '3 bedrooms · 6 guests · Waterfront',
    description: 'Traditional teakwood Kerala nalukettu estate on the backwaters with private shikara boat, infinity pool, and personalized Ayurvedic wellness.',
    longDescription: 'Immerse yourself in God\'s Own Country at Kumarakom Waters Edge. Situated directly on the tranquil banks of Vembanad Lake, this estate features classical teakwood Nalukettu architecture, an open central courtyard, infinity water deck, and private boat jetty. Unwind with authentic Kerala Ayurvedic massages, cruise the lily-covered canals on your private wooden shikara boat, and savor authentic karimeen pollichathu prepared fresh by your dedicated in-house chef.',
    highlights: [
      'Direct Lakefront Access with Private Wooden Shikara Boat',
      'Water-Level Infinity Plunge Pool overlooking Vembanad Lake',
      'Dedicated Ayurvedic Wellness Pavilion & Expert Masseuse',
      'Authentic Kerala Culinary Experience with Fresh Catch of the Day',
      'Birdwatcher Paradise with Views of Migratory Canals',
    ],
    amenities: [
      { icon: 'Waves', label: 'Lakefront Infinity Pool', description: 'Stunning sunset views directly facing Vembanad Lake' },
      { icon: 'Utensils', label: 'Kerala Specialty Chef', description: 'Fresh backwater delicacies, organic sadhya, and continental cuisine' },
      { icon: 'Wifi', label: 'High Speed Wi-Fi', description: 'Fast Wi-Fi available across the villa and waterfront deck' },
      { icon: 'Sparkles', label: 'Ayurvedic Treatment Room', description: 'Customized massage therapies using organic herbal oils' },
      { icon: 'Compass', label: 'Private Shikara Rides', description: 'Complimentary 2-hour sunset canal cruise every evening' },
      { icon: 'Coffee', label: 'Traditional Kerala Breakfast', description: 'Appams with stew, fresh coconut water, and artisanal filter coffee' },
      { icon: 'ShieldCheck', label: 'Full Estate Concierge', description: 'Private butler service and boat captain available round the clock' },
      { icon: 'Car', label: 'Kochi Airport Transfers', description: 'Seamless private chauffeur service from Cochin International Airport' },
    ],
    rooms: [
      { name: 'Vembanad Waterfront Suite', bedType: '1 King Bed', enSuite: true, features: 'Unobstructed lake views, private wooden deck, outdoor stone tub' },
      { name: 'Nalukettu Courtyard Room', bedType: '1 Queen Bed', enSuite: true, features: 'Opens to the open-air rain courtyard, carved rosewood bed' },
      { name: 'Canal Garden Suite', bedType: '2 Twin Beds (convertible)', enSuite: true, features: 'Water lily pond view, serene veranda' },
    ],
    houseRules: [
      'Check-in: 2:00 PM · Check-out: 11:00 AM',
      'Life jackets mandatory during private shikara excursions',
      'Eco-friendly policy: zero single-use plastics',
      'Pets welcomed with prior arrangement',
    ],
    host: {
      name: 'StayVilla Backwater Reserves',
      role: 'Kerala Superhost & Naturalist',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200',
      badge: 'StayVilla Premium Partner',
      responseRate: '100% (within 10 minutes)',
    },
    reviews: [
      {
        id: 'r-5',
        author: 'Devika Krishnan',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
        date: 'January 2026',
        rating: 5,
        comment: 'Waking up to the serene lake with fishermen gliding past was pure poetry. The private boat rides during sunset were heavenly. Best stay in Kerala by far!',
        stayType: 'Honeymoon',
      },
    ],
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
    image: 'https://images.pexels.com/photos/2670898/pexels-photo-2670898.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galleryImages: [
      'https://images.pexels.com/photos/2670898/pexels-photo-2670898.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    tag: 'Mountain & Snow',
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    details: '4 bedrooms · 8 guests · Mountain Views',
    description: 'Cedar wood and stone lodge with 360° snow-capped Himalayan views, roaring stone fireplace, heated floors, and a private stargazing deck.',
    longDescription: 'Perched high amidst fragrant deodar and pine forests overlooking the snow-crested Pir Panjal mountains, The Himalayan Pine Chalet is an alpine retreat of exceptional warmth. Crafted from local river stone and fragrant cedar timber, the chalet features double-height vaulted ceilings, a massive floor-to-ceiling stone fireplace, radiant underfloor heating, and an outdoor heated glass gazebo for stargazing beneath pristine Himalayan night skies.',
    highlights: [
      '360° Panoramic Views of Snow-Capped Himalayan Peaks',
      'Grand Stone Fireplace with Unlimited Pinewood Logs',
      'Radiant Heated Floors & Luxury Down Feather Bedding',
      'Glass-Enclosed Heated Stargazing Deck with Telescope',
      'Private Chef Serving Himachali Dham & Alpine Specialties',
    ],
    amenities: [
      { icon: 'Flame', label: 'Stone Fireplace & Firepit', description: 'Cozy indoor fireplace and outdoor evening bonfire setup' },
      { icon: 'Sparkles', label: 'Heated Jacuzzi & Sauna', description: 'Outdoor heated cedar hot tub with snowy mountain views' },
      { icon: 'Utensils', label: 'Private Hill Chef', description: 'Warm soups, Himachali delicacies, and barbecue grills' },
      { icon: 'Wifi', label: 'High-Speed Starlink/Fiber', description: 'Seamless connectivity even in high alpine conditions' },
      { icon: 'Coffee', label: 'Mountain High Tea & Breakfast', description: 'Fresh orchard apples, rhododendron honey, warm bakery treats' },
      { icon: 'Tv', label: 'Alpine Games Room', description: 'Billiards table, board games, and 4K cinema projection' },
      { icon: 'Car', label: '4x4 Airport Chauffeur', description: 'All-weather 4x4 luxury transport from Kullu / Chandigarh' },
      { icon: 'ShieldCheck', label: '24/7 Caretaker & Staff', description: 'Always on hand to keep the fires stoked and drinks poured' },
    ],
    rooms: [
      { name: 'Pir Panjal Master Chalet', bedType: '1 King Bed', enSuite: true, features: 'Snow peak views, private balcony, private fireplace' },
      { name: 'Deodar Forest Room', bedType: '1 King Bed', enSuite: true, features: 'Forest vistas, bay window reading nook, rain shower' },
      { name: 'Solang Valley Suite', bedType: '1 Queen Bed', enSuite: true, features: 'Direct lawn access, heated flooring' },
      { name: 'Stargazer Loft', bedType: '2 Twin Beds', enSuite: true, features: 'Skylight roof windows, cozy alpine timber paneling' },
    ],
    houseRules: [
      'Check-in: 2:00 PM · Check-out: 11:00 AM',
      'Indoor fireplace operated with assistance from villa caretaker',
      'Quiet mountain hours after 10:30 PM',
      'Pet friendly',
    ],
    host: {
      name: 'Aditya & Tenzin',
      role: 'Himalayan Mountain Host',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      badge: 'StayVilla Mountain Specialist',
      responseRate: '100% (within 20 minutes)',
    },
    reviews: [
      {
        id: 'r-6',
        author: 'Siddharth Rao',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
        date: 'January 2026',
        rating: 5,
        comment: 'Staying here during fresh snowfall was magical. The heated jacuzzi with views of snow-dusted pines is an experience of a lifetime. The staff treated us like royalty.',
        stayType: 'Winter Vacation',
      },
    ],
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
    image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galleryImages: [
      'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    tag: 'Palace Living',
    bedrooms: 5,
    bathrooms: 5,
    maxGuests: 10,
    details: '5 bedrooms · 10 guests · Private Courtyard & Pool',
    description: 'Exquisite regal architecture with frescoed arches, stepwell plunge pool, rooftop baradari, and private evening musical recitals.',
    longDescription: 'Step into the grandeur of Rajasthan\'s golden age at Haveli Amer Heritage. Located within whispering distance of the historic Amer Fort, this 300-year-old restored noble haveli boasts hand-painted sheesh mahal mirror-work, arched colonnades, fragrant jasmine courtyards, and a restored subterranean stepwell plunge pool. In the evenings, relax on the rooftop baradari with live sitar and sarangi performances while the lit battlements of Amer Fort glow across the night sky.',
    highlights: [
      'Direct Unobstructed Views of Illuminated Amer Fort',
      'Restored Subterranean Stepwell Plunge Pool with Ambient Candlelight',
      'Rooftop Baradari for Sunset Cocktails & Live Sitar Recitals',
      'Five Royal Suites with Authentic Antique Mewar Furniture',
      'Private Master Chef specializing in Royal Rajasthani Thalis',
    ],
    amenities: [
      { icon: 'Waves', label: 'Stepwell Plunge Pool', description: 'Atmospheric sandstone plunge pool in private courtyard' },
      { icon: 'Utensils', label: 'Royal Kitchen & Khansama', description: 'Traditional Laal Maas, Dal Baati Churma, and bespoke menu' },
      { icon: 'Sparkles', label: 'Evening Cultural Recital', description: 'Live classical Rajasthani music and folk performances' },
      { icon: 'Wifi', label: 'High-Speed Internet', description: 'Full coverage throughout all suites and courtyards' },
      { icon: 'Coffee', label: 'Royal Breakfast Feast', description: 'Gourmet morning spread served in the fountain courtyard' },
      { icon: 'Car', label: 'Jaipur Airport Chauffeur', description: 'Complimentary private transfer in luxury vehicle' },
      { icon: 'ShieldCheck', label: 'Full Butler & Security', description: 'Discrete 24-hour service and personal concierge' },
      { icon: 'Wind', label: 'Modern Climate Control', description: 'Whisper-quiet AC and heating in all suites' },
    ],
    rooms: [
      { name: 'Amer Royal Grand Suite', bedType: '1 King Bed', enSuite: true, features: 'Fort view, mirror-work ceiling, hand-carved marble bathroom' },
      { name: 'Sheesh Mahal Suite', bedType: '1 King Bed', enSuite: true, features: 'Intricate glass mosaic, private dressing parlor' },
      { name: 'Jasmine Courtyard Suite', bedType: '1 King Bed', enSuite: true, features: 'Opens directly to scented garden courtyard' },
      { name: 'Amber Heritage Suite', bedType: '1 Queen Bed', enSuite: true, features: 'Carved rosewood four-poster bed, antique brass fixtures' },
      { name: 'Baradari View Suite', bedType: '2 Twin Beds (convertible)', enSuite: true, features: 'Rooftop access, panoramic hill views' },
    ],
    houseRules: [
      'Check-in: 2:00 PM · Check-out: 11:00 AM',
      'Respect heritage fresco walls (strictly non-smoking inside)',
      'Evening music ceases by 10:30 PM',
      'Events and royal dinners upon prior reservation',
    ],
    host: {
      name: 'StayVilla Royal Collection',
      role: 'Heritage Custodian & Superhost',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
      badge: 'StayVilla Ultra Luxury Heritage',
      responseRate: '100% (within 5 minutes)',
    },
    reviews: [
      {
        id: 'r-7',
        author: 'Princess Alisha & Family',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        date: 'January 2026',
        rating: 5,
        comment: 'Like living in our own private palace! Watching Amer Fort light up from the rooftop baradari with live flute music was a cinematic experience.',
        stayType: 'Royal Celebration',
      },
    ],
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
    image: 'https://images.pexels.com/photos/4482064/pexels-photo-4482064.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galleryImages: [
      'https://images.pexels.com/photos/4482064/pexels-photo-4482064.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    tag: 'Coffee Plantation',
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    details: '4 bedrooms · 8 guests · 50-Acre Estate',
    description: 'Colonial bungalow spread across a 50-acre private coffee estate with glass conservatory, outdoor bonfire pit, and curated plantation walks.',
    longDescription: 'Escape into the misty hills of the Western Ghats at Coorg Mistwood Estate. Nestled within 50 acres of Arabica coffee bushes, cardamom plantations, and silver oak trees, this colonial estate bungalow offers pure serenity. Sip single-origin estate coffee on the wraparound veranda, take guided coffee picking and birdwatching tours with the estate botanist, and gather around a crackling bonfire under starry skies with authentic Kodava pork pandi curry and akki rotis.',
    highlights: [
      '50-Acre Private Organic Coffee & Spice Plantation',
      'Colonial Wraparound Veranda & Glass Botanical Conservatory',
      'Private Estate Botanist for Guided Treks & Birdwatching',
      'Outdoor Evening Firepit & Barbecue Grilling Station',
      'Authentic Kodava Culinary Specialist on Premises',
    ],
    amenities: [
      { icon: 'Coffee', label: 'Single-Origin Coffee Bar', description: 'Freshly roasted Arabica & Robusta brewed by private barista' },
      { icon: 'Flame', label: 'Outdoor Bonfire & BBQ', description: 'Daily evening firepit with grilled skewers & local drinks' },
      { icon: 'Utensils', label: 'Kodava Master Chef', description: 'Authentic local delicacies and customizable world cuisine' },
      { icon: 'Wifi', label: 'High-Speed Fiber Wi-Fi', description: 'Fast broadband throughout the bungalow and lawn gazebo' },
      { icon: 'Compass', label: 'Guided Plantation Walks', description: 'Daily morning nature treks, stream walks, and birding' },
      { icon: 'Tv', label: 'Library & Board Game Den', description: 'Over 500 books, vinyl record player, and classic board games' },
      { icon: 'ShieldCheck', label: 'Estate Caretaker Service', description: '24-hour estate staff for housekeeping and personal assistance' },
      { icon: 'Car', label: 'Mangalore / Bangalore Transfers', description: 'Private scenic SUV transfer available upon booking' },
    ],
    rooms: [
      { name: 'Planter’s Master Suite', bedType: '1 King Bed', enSuite: true, features: 'Wraparound veranda access, bay windows with plantation views' },
      { name: 'Arabica Suite', bedType: '1 King Bed', enSuite: true, features: 'Forest views, fireplace, standalone clawfoot tub' },
      { name: 'Cardamom Garden Room', bedType: '1 Queen Bed', enSuite: true, features: 'Direct garden patio access, rainfall shower' },
      { name: 'Mistwood Twin Suite', bedType: '2 Twin Beds (convertible)', enSuite: true, features: 'Lawn views, teakwood desk and wardrobe' },
    ],
    houseRules: [
      'Check-in: 2:00 PM · Check-out: 11:00 AM',
      'Plantation walks require closed footwear (provided if needed)',
      'Quiet hours after 10:00 PM',
      'Pet friendly estate',
    ],
    host: {
      name: 'Kavery & Bopanna',
      role: '3rd-Generation Planters & Hosts',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
      badge: 'StayVilla Superhost',
      responseRate: '100% (within 15 minutes)',
    },
    reviews: [
      {
        id: 'r-8',
        author: 'Sanjay Nair',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        date: 'January 2026',
        rating: 5,
        comment: 'The scent of blooming coffee flowers, the chilly misty mornings, and the incredible food made this our best weekend trip ever. 5 stars all the way.',
        stayType: 'Family Vacation',
      },
    ],
  },
];

export function getVillaById(id: string): Villa | undefined {
  if (typeof window !== 'undefined') {
    try {
      const custom = localStorage.getItem('stayvilla-custom-villas');
      if (custom) {
        const parsed: Villa[] = JSON.parse(custom);
        const match = parsed.find((v) => v.id === id);
        if (match) return match;
      }
    } catch {
      // fallback
    }
  }
  return allVillas.find((v) => v.id === id);
}

export function formatINR(val: number): string {
  return val.toLocaleString('en-IN');
}
