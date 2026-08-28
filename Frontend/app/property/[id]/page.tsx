'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  MapPin,
  BedDouble,
  Bath,
  Users,
  Heart,
  Share2,
  Check,
  Calendar as CalendarIcon,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Waves,
  Utensils,
  Wifi,
  Coffee,
  Flame,
  Tv,
  Car,
  Wind,
  Compass,
  FileText,
  CalendarCheck,
  CheckCircle2,
  HelpCircle,
  Sparkle,
} from 'lucide-react';
import {
  format,
  addDays,
  differenceInCalendarDays,
  startOfToday,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
  addMonths,
  subMonths,
} from 'date-fns';
import { allVillas, getVillaById, formatINR, Villa } from '@/lib/villas';

// Helper icon component
function AmenityIcon({ name }: { name: string }) {
  switch (name) {
    case 'Waves':
      return <Waves size={20} />;
    case 'Utensils':
      return <Utensils size={20} />;
    case 'Wifi':
      return <Wifi size={20} />;
    case 'ShieldCheck':
      return <ShieldCheck size={20} />;
    case 'Sparkles':
      return <Sparkles size={20} />;
    case 'Car':
      return <Car size={20} />;
    case 'Coffee':
      return <Coffee size={20} />;
    case 'Tv':
      return <Tv size={20} />;
    case 'Flame':
      return <Flame size={20} />;
    case 'Wind':
      return <Wind size={20} />;
    case 'Compass':
      return <Compass size={20} />;
    default:
      return <Sparkles size={20} />;
  }
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const villaId = params.id as string;

  const villa = useMemo(() => getVillaById(villaId) || allVillas[0], [villaId]);

  const today = useMemo(() => startOfToday(), []);

  // Dates state
  const [checkIn, setCheckIn] = useState<Date | null>(() => {
    const qIn = searchParams.get('checkIn');
    if (qIn) {
      const parsed = new Date(qIn);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return addDays(today, 14);
  });

  const [checkOut, setCheckOut] = useState<Date | null>(() => {
    const qOut = searchParams.get('checkOut');
    if (qOut) {
      const parsed = new Date(qOut);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return addDays(today, 21);
  });

  // Guests & Rooms state
  const [adults, setAdults] = useState<number>(() => {
    const a = searchParams.get('adults');
    return a ? Math.max(1, parseInt(a, 10)) : 2;
  });
  const [childrenCount, setChildrenCount] = useState<number>(() => {
    const c = searchParams.get('children');
    return c ? Math.max(0, parseInt(c, 10)) : 0;
  });
  const [roomsCount, setRoomsCount] = useState<number>(() => {
    const r = searchParams.get('rooms');
    return r ? Math.max(1, parseInt(r, 10)) : 1;
  });

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(checkIn || today);
  const [selectingMode, setSelectingMode] = useState<'in' | 'out'>('in');

  // Lightbox / Full Gallery State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Wishlist / Share state
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reservation Confirmation Modal
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [lastBookingId, setLastBookingId] = useState<string>('');
  const [lastBookingRef, setLastBookingRef] = useState<string>('');
  const [isReserving, setIsReserving] = useState(false);

  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestPickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setIsDatePickerOpen(false);
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(e.target as Node)) {
        setIsGuestPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Saved villas from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('stayvilla-saved');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[villa.id]) setIsSaved(true);
      }
    } catch {
      // ignore
    }
  }, [villa.id]);

  const toggleSave = () => {
    try {
      const saved = localStorage.getItem('stayvilla-saved');
      const parsed = saved ? JSON.parse(saved) : {};
      parsed[villa.id] = !parsed[villa.id];
      localStorage.setItem('stayvilla-saved', JSON.stringify(parsed));
      setIsSaved(!isSaved);
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Calculate nights and prices
  const totalGuests = adults + childrenCount;
  const nights = useMemo(() => {
    if (checkIn && checkOut) {
      const diff = differenceInCalendarDays(checkOut, checkIn);
      return diff > 0 ? diff : 7;
    }
    return 7;
  }, [checkIn, checkOut]);

  const subtotal = villa.pricePerNight * nights;
  const cleaningFee = 3500;
  const serviceFee = Math.round(subtotal * 0.05);
  const totalPrice = subtotal + cleaningFee + serviceFee;

  // Calendar Day Click Handler
  const handleDateClick = (day: Date) => {
    if (isBefore(day, today)) return;

    if (selectingMode === 'in') {
      setCheckIn(day);
      if (checkOut && (isBefore(checkOut, day) || isSameDay(checkOut, day))) {
        setCheckOut(addDays(day, 2));
      }
      setSelectingMode('out');
    } else {
      if (checkIn && isBefore(day, checkIn)) {
        setCheckIn(day);
        setSelectingMode('out');
      } else {
        setCheckOut(day);
        setIsDatePickerOpen(false);
        setSelectingMode('in');
      }
    }
  };

  // Confirm Reservation Action
  const handleConfirmReservation = () => {
    setIsReserving(true);

    const refCode = `SV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBookingId = `b-${Date.now()}`;

    const newBooking = {
      id: newBookingId,
      reference: refCode,
      villaId: villa.id,
      villaName: villa.name,
      villaLocation: villa.location,
      villaImage: villa.image,
      checkIn: checkIn ? format(checkIn, 'dd MMM yyyy') : format(addDays(today, 14), 'dd MMM yyyy'),
      checkOut: checkOut ? format(checkOut, 'dd MMM yyyy') : format(addDays(today, 21), 'dd MMM yyyy'),
      nights,
      guests: totalGuests,
      adults,
      children: childrenCount,
      rooms: roomsCount,
      totalPrice,
      currency: villa.currency,
      status: 'Confirmed' as const,
      createdAt: format(today, 'dd MMM yyyy'),
    };

    try {
      // Store in individual booking cache for /booking/[id]
      localStorage.setItem(
        `stayvilla-booking-${newBookingId}`,
        JSON.stringify({
          booking: newBooking,
          villa: {
            id: villa.id,
            name: villa.name,
            description: villa.description,
            bedrooms: villa.bedrooms,
            bathrooms: villa.bathrooms,
            maxGuests: villa.maxGuests,
            rating: villa.rating,
            reviewsCount: villa.reviewsCount,
            pricePerNight: villa.pricePerNight,
            currency: villa.currency,
          },
        })
      );

      // Store in all bookings list
      const existing = localStorage.getItem('stayvilla-bookings');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newBooking);
      localStorage.setItem('stayvilla-bookings', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to store reservation in localStorage', e);
    }

    setLastBookingId(newBookingId);
    setLastBookingRef(refCode);
    setIsReserving(false);
    setBookingSuccessModal(true);
  };

  // Calendar days generation
  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const galleryList = villa.galleryImages && villa.galleryImages.length > 0
    ? villa.galleryImages
    : [villa.image];

  return (
    <div className="prop-page-root">
      {/* TOP LUXURY NAVBAR */}
      <header className="prop-navbar">
        <div className="prop-navbar-inner">
          <div className="prop-nav-left">
            <Link href="/#villas" className="prop-back-link">
              <ArrowLeft size={16} />
              <span>All Villas</span>
            </Link>
          </div>

          <Link href="/" className="prop-brand">
            <span className="brand-mark">⌁</span>
            <span className="brand-name">
              STAY<span>VILLA</span>
            </span>
          </Link>

          <div className="prop-nav-right">
            <button
              type="button"
              className="prop-action-btn"
              onClick={handleShare}
              title="Share property link"
            >
              {copiedLink ? <Check size={16} color="#16a34a" /> : <Share2 size={16} />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              type="button"
              className={`prop-action-btn ${isSaved ? 'saved' : ''}`}
              onClick={toggleSave}
              title={isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
            >
              <Heart size={16} fill={isSaved ? '#c8a46a' : 'none'} color={isSaved ? '#c8a46a' : 'currentColor'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="prop-main-container">
        {/* PROPERTY TITLE HEADER */}
        <section className="prop-header-section">
          <div className="prop-header-badge-row">
            <span className="prop-tag-badge">{villa.tag}</span>
            <div className="prop-rating-pill">
              <Star size={14} fill="currentColor" />
              <strong>{villa.rating}</strong>
              <span>({villa.reviewsCount} verified reviews)</span>
            </div>
            <span className="prop-verified-badge">
              <ShieldCheck size={14} /> StayVilla Verified Sanctuary
            </span>
          </div>

          <h1 className="prop-title">{villa.name}</h1>

          <div className="prop-location-row">
            <MapPin size={16} className="loc-pin" />
            <span>{villa.location}</span>
            <span className="bullet">·</span>
            <span className="region-tag">{villa.region}, {villa.country}</span>
          </div>
        </section>

        {/* IMAGE SHOWCASE GALLERY */}
        <section className="prop-gallery-section">
          <div className="prop-mosaic-grid">
            {/* Primary Featured Large Photo */}
            <div
              className="mosaic-item mosaic-item-primary"
              onClick={() => {
                setActiveGalleryIndex(0);
                setIsGalleryOpen(true);
              }}
            >
              <img src={galleryList[0]} alt={`${villa.name} main view`} />
              <div className="mosaic-hover-overlay">
                <span>View Fullscreen</span>
              </div>
            </div>

            {/* Supporting 4 Grid Photos */}
            <div className="mosaic-subgrid">
              {galleryList.slice(1, 5).map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="mosaic-item mosaic-item-sub"
                  onClick={() => {
                    setActiveGalleryIndex(idx + 1);
                    setIsGalleryOpen(true);
                  }}
                >
                  <img src={imgUrl} alt={`${villa.name} detail ${idx + 1}`} />
                  <div className="mosaic-hover-overlay">
                    <span>View Photo</span>
                  </div>
                  {idx === 3 && galleryList.length > 5 && (
                    <div className="mosaic-more-badge">
                      <span>+{galleryList.length - 4} photos</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="prop-all-photos-btn"
            onClick={() => {
              setActiveGalleryIndex(0);
              setIsGalleryOpen(true);
            }}
          >
            <Sparkles size={15} /> Show all {galleryList.length} photos
          </button>
        </section>

        {/* MAIN TWO-COLUMN CONTENT & BOOKING SECTION */}
        <div className="prop-content-layout">
          {/* LEFT COLUMN: PROPERTY INFO */}
          <div className="prop-left-column">
            {/* Specs Quick Strip */}
            <div className="prop-specs-bar">
              <div className="spec-card">
                <BedDouble size={20} />
                <div>
                  <strong>{villa.bedrooms} Bedrooms</strong>
                  <span>Private En-Suites</span>
                </div>
              </div>
              <div className="spec-card">
                <Users size={20} />
                <div>
                  <strong>Up to {villa.maxGuests} Guests</strong>
                  <span>Spacious Living</span>
                </div>
              </div>
              <div className="spec-card">
                <Bath size={20} />
                <div>
                  <strong>{villa.bathrooms} Bathrooms</strong>
                  <span>Luxury Marble & Soaking Tubs</span>
                </div>
              </div>
            </div>

            {/* Highlights List */}
            {villa.highlights && villa.highlights.length > 0 && (
              <div className="prop-section-box">
                <h2 className="section-title">Property Highlights</h2>
                <div className="highlights-grid">
                  {villa.highlights.map((hl, i) => (
                    <div key={i} className="highlight-pill">
                      <Sparkle size={16} className="hl-star" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About & Description */}
            <div className="prop-section-box">
              <h2 className="section-title">About this Luxury Estate</h2>
              <p className="prop-description-text">
                {villa.longDescription || villa.description}
              </p>
            </div>

            {/* Luxury Amenities */}
            <div className="prop-section-box">
              <h2 className="section-title">Luxury Amenities & Inclusions</h2>
              <div className="amenities-grid">
                {villa.amenities.map((am, i) => (
                  <div key={i} className="amenity-card">
                    <div className="amenity-icon-box">
                      <AmenityIcon name={am.icon} />
                    </div>
                    <div>
                      <h4 className="amenity-title">{am.label}</h4>
                      <p className="amenity-desc">{am.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sleeping Arrangements */}
            {villa.rooms && villa.rooms.length > 0 && (
              <div className="prop-section-box">
                <h2 className="section-title">Sleeping Arrangements</h2>
                <div className="rooms-grid">
                  {villa.rooms.map((room, i) => (
                    <div key={i} className="room-card">
                      <div className="room-header">
                        <BedDouble size={20} />
                        <h4>{room.name}</h4>
                      </div>
                      <span className="room-bed-type">{room.bedType}</span>
                      <p className="room-features">{room.features}</p>
                      {room.enSuite && (
                        <span className="room-ensuite-badge">
                          <Check size={12} /> En-suite bathroom
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host & Concierge Guarantee */}
            <div className="prop-section-box host-box">
              <div className="host-header">
                <img src={villa.host.avatar} alt={villa.host.name} className="host-avatar" />
                <div>
                  <h3 className="host-name">{villa.host.name}</h3>
                  <span className="host-role">{villa.host.role}</span>
                  <div className="host-badge">
                    <ShieldCheck size={14} /> {villa.host.badge}
                  </div>
                </div>
              </div>
              <p className="host-note">
                Our on-property hospitality staff and dedicated 24/7 StayVilla Concierge curate seamless airport transfers, customized dining itineraries, and private excursions tailored to your preferences.
              </p>
              <div className="host-stats">
                <div>
                  <label>Response Rate</label>
                  <span>{villa.host.responseRate}</span>
                </div>
                <div>
                  <label>Hospitality Rating</label>
                  <span>{villa.rating} / 5.0</span>
                </div>
              </div>
            </div>

            {/* Guest Reviews */}
            {villa.reviews && villa.reviews.length > 0 && (
              <div className="prop-section-box">
                <div className="reviews-header">
                  <h2 className="section-title">Guest Reviews</h2>
                  <div className="reviews-score">
                    <Star size={16} fill="currentColor" />
                    <strong>{villa.rating}</strong>
                    <span>· {villa.reviewsCount} reviews</span>
                  </div>
                </div>
                <div className="reviews-list">
                  {villa.reviews.map((rev) => (
                    <div key={rev.id} className="review-card">
                      <div className="rev-author-row">
                        <img src={rev.avatar} alt={rev.author} className="rev-avatar" />
                        <div>
                          <strong>{rev.author}</strong>
                          <span>{rev.date} · {rev.stayType}</span>
                        </div>
                        <div className="rev-stars">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star key={idx} size={13} fill="#c8a46a" color="#c8a46a" />
                          ))}
                        </div>
                      </div>
                      <p className="rev-comment">&quot;{rev.comment}&quot;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House Rules & Policies */}
            <div className="prop-section-box">
              <h2 className="section-title">Stay Policies & House Rules</h2>
              <div className="rules-list">
                {villa.houseRules.map((rule, idx) => (
                  <div key={idx} className="rule-item">
                    <Clock size={16} className="rule-icon" />
                    <span>{rule}</span>
                  </div>
                ))}
                <div className="rule-item">
                  <ShieldCheck size={16} className="rule-icon" />
                  <span>Free cancellation up to 7 days before arrival date.</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: BOOKING RESERVATION CARD (STICKY) */}
          <div className="prop-right-column">
            <div className="prop-booking-card" id="reservation-widget">
              <div className="booking-card-header">
                <div className="booking-rate">
                  <span className="currency">{villa.currency}</span>
                  <span className="price">{formatINR(villa.pricePerNight)}</span>
                  <span className="unit">/ night</span>
                </div>
                <div className="booking-score">
                  <Star size={14} fill="currentColor" /> {villa.rating} ({villa.reviewsCount})
                </div>
              </div>

              {/* DATE SELECTION ACCORDION / PICKER */}
              <div className="booking-selectors-box" ref={datePickerRef}>
                <div
                  className="selector-row dates-trigger"
                  onClick={() => {
                    setIsDatePickerOpen(!isDatePickerOpen);
                    setIsGuestPickerOpen(false);
                  }}
                >
                  <div className="date-half">
                    <label>CHECK-IN</label>
                    <span>{checkIn ? format(checkIn, 'dd MMM yyyy') : 'Select date'}</span>
                  </div>
                  <div className="date-divider" />
                  <div className="date-half">
                    <label>CHECKOUT</label>
                    <span>{checkOut ? format(checkOut, 'dd MMM yyyy') : 'Select date'}</span>
                  </div>
                </div>

                {isDatePickerOpen && (
                  <div className="inline-calendar-popover">
                    <div className="cal-nav-row">
                      <button
                        type="button"
                        className="cal-btn"
                        onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                        disabled={isBefore(startOfMonth(calendarMonth), startOfMonth(today))}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="cal-current-month">
                        {format(calendarMonth, 'MMMM yyyy')}
                      </span>
                      <button
                        type="button"
                        className="cal-btn"
                        onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="cal-days-header">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>

                    <div className="cal-days-grid">
                      {calendarDays.map((day, i) => {
                        const isPast = isBefore(day, today);
                        const isSelectedIn = checkIn && isSameDay(day, checkIn);
                        const isSelectedOut = checkOut && isSameDay(day, checkOut);
                        const isInRange =
                          checkIn &&
                          checkOut &&
                          isAfter(day, checkIn) &&
                          isBefore(day, checkOut);
                        const isCurrentM = isSameMonth(day, calendarMonth);

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isPast || !isCurrentM}
                            className={`cal-day-cell ${isPast || !isCurrentM ? 'disabled' : ''} ${
                              isSelectedIn ? 'selected-in' : ''
                            } ${isSelectedOut ? 'selected-out' : ''} ${
                              isInRange ? 'in-range' : ''
                            }`}
                            onClick={() => handleDateClick(day)}
                          >
                            {format(day, 'd')}
                          </button>
                        );
                      })}
                    </div>

                    <div className="cal-footer">
                      <span>{nights} Nights selected</span>
                      <button
                        type="button"
                        className="cal-close-btn"
                        onClick={() => setIsDatePickerOpen(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                {/* GUEST & ROOM SELECTION */}
                <div className="guest-selector-container" ref={guestPickerRef}>
                  <div
                    className="selector-row guest-trigger"
                    onClick={() => {
                      setIsGuestPickerOpen(!isGuestPickerOpen);
                      setIsDatePickerOpen(false);
                    }}
                  >
                    <label>GUESTS & ROOMS</label>
                    <span className="guest-summary-text">
                      {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'} ({adults} Adults
                      {childrenCount > 0 ? `, ${childrenCount} Children` : ''}), {roomsCount}{' '}
                      {roomsCount === 1 ? 'Room' : 'Rooms'}
                    </span>
                  </div>

                  {isGuestPickerOpen && (
                    <div className="inline-guests-popover">
                      {/* Adults */}
                      <div className="guest-counter-row">
                        <div>
                          <strong>Adults</strong>
                          <small>Age 13+</small>
                        </div>
                        <div className="counter-controls">
                          <button
                            type="button"
                            disabled={adults <= 1}
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                          >
                            -
                          </button>
                          <span>{adults}</span>
                          <button
                            type="button"
                            disabled={totalGuests >= villa.maxGuests}
                            onClick={() => setAdults(adults + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="guest-counter-row">
                        <div>
                          <strong>Children</strong>
                          <small>Ages 2–12</small>
                        </div>
                        <div className="counter-controls">
                          <button
                            type="button"
                            disabled={childrenCount <= 0}
                            onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                          >
                            -
                          </button>
                          <span>{childrenCount}</span>
                          <button
                            type="button"
                            disabled={totalGuests >= villa.maxGuests}
                            onClick={() => setChildrenCount(childrenCount + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div className="guest-counter-row">
                        <div>
                          <strong>Bedrooms</strong>
                          <small>Max {villa.bedrooms} rooms</small>
                        </div>
                        <div className="counter-controls">
                          <button
                            type="button"
                            disabled={roomsCount <= 1}
                            onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                          >
                            -
                          </button>
                          <span>{roomsCount}</span>
                          <button
                            type="button"
                            disabled={roomsCount >= villa.bedrooms}
                            onClick={() => setRoomsCount(roomsCount + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="guest-done-btn"
                        onClick={() => setIsGuestPickerOpen(false)}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* TRANSPARENT PRICE BREAKDOWN */}
              <div className="prop-price-breakdown">
                <div className="p-row">
                  <span>
                    {villa.currency}
                    {formatINR(villa.pricePerNight)} × {nights} nights
                  </span>
                  <span>
                    {villa.currency}
                    {formatINR(subtotal)}
                  </span>
                </div>
                <div className="p-row">
                  <span>Cleaning &amp; villa sanitization</span>
                  <span>
                    {villa.currency}
                    {formatINR(cleaningFee)}
                  </span>
                </div>
                <div className="p-row">
                  <span>StayVilla concierge service (5%)</span>
                  <span>
                    {villa.currency}
                    {formatINR(serviceFee)}
                  </span>
                </div>
                <div className="p-divider" />
                <div className="p-row p-total">
                  <strong>Total Amount (INR)</strong>
                  <strong>
                    {villa.currency}
                    {formatINR(totalPrice)}
                  </strong>
                </div>
              </div>

              {/* PROMINENT CONFIRM RESERVATION BUTTON */}
              <button
                type="button"
                className="prop-confirm-reservation-btn"
                onClick={handleConfirmReservation}
                disabled={isReserving}
                id="confirm-reservation-btn"
              >
                <CalendarCheck size={18} />
                <span>Confirm Reservation</span>
              </button>

              <p className="cancellation-badge">
                <CheckCircle2 size={14} color="#16a34a" /> Free cancellation up to 7 days before arrival
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* FULLSCREEN PHOTO LIGHTBOX */}
      {isGalleryOpen && (
        <div className="lightbox-backdrop" onClick={() => setIsGalleryOpen(false)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setIsGalleryOpen(false)}
              aria-label="Close photo gallery"
            >
              <X size={24} />
            </button>

            <div className="lightbox-main-img-wrap">
              <img
                src={galleryList[activeGalleryIndex]}
                alt={`${villa.name} photo ${activeGalleryIndex + 1}`}
                className="lightbox-img"
              />

              <button
                type="button"
                className="lightbox-nav-btn prev"
                onClick={() =>
                  setActiveGalleryIndex(
                    (activeGalleryIndex - 1 + galleryList.length) % galleryList.length
                  )
                }
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                className="lightbox-nav-btn next"
                onClick={() =>
                  setActiveGalleryIndex((activeGalleryIndex + 1) % galleryList.length)
                }
              >
                <ChevronRight size={28} />
              </button>
            </div>

            <div className="lightbox-thumbs">
              {galleryList.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`lightbox-thumb-btn ${i === activeGalleryIndex ? 'active' : ''}`}
                  onClick={() => setActiveGalleryIndex(i)}
                >
                  <img src={img} alt={`Thumb ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESERVATION CONFIRMATION SUCCESS MODAL */}
      {bookingSuccessModal && (
        <div className="modal-backdrop" onClick={() => setBookingSuccessModal(false)}>
          <div className="reservation-modal success-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setBookingSuccessModal(false)}
              aria-label="Close confirmation"
            >
              <X size={20} />
            </button>

            <div className="booking-success-view">
              <div className="success-icon-badge">
                <Check size={36} />
              </div>
              <h2>Reservation Confirmed!</h2>
              <p className="success-subtitle">
                Your luxury stay at <strong>{villa.name}</strong> has been secured.
              </p>

              <div className="booking-confirmation-details">
                <div className="conf-row">
                  <span>Booking Reference</span>
                  <strong className="ref-code">{lastBookingRef}</strong>
                </div>
                <div className="conf-row">
                  <span>Dates</span>
                  <strong>
                    {checkIn ? format(checkIn, 'dd MMM yyyy') : 'Flexible'} –{' '}
                    {checkOut ? format(checkOut, 'dd MMM yyyy') : 'Flexible'} ({nights} nights)
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
                  <span>Total Amount Paid</span>
                  <strong>
                    {villa.currency}
                    {formatINR(totalPrice)}
                  </strong>
                </div>
              </div>

              <p className="concierge-note">
                <Sparkle size={14} /> Our dedicated StayVilla concierge will contact you 48 hours prior to check-in with private arrival arrangements and local airport transfers.
              </p>

              <div className="success-actions-row">
                <Link
                  href={`/booking/${lastBookingId}`}
                  className="modal-primary-btn invoice-btn"
                  target="_blank"
                >
                  <FileText size={16} /> View Tax Invoice &amp; Details
                </Link>
                <Link href="/#villas" className="modal-outline-btn">
                  Back to All Villas
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM RESERVATION BAR */}
      <div className="mobile-sticky-bar">
        <div>
          <span className="mob-rate">
            {villa.currency}
            {formatINR(villa.pricePerNight)} <span>/ night</span>
          </span>
          <span className="mob-nights">
            {nights} nights · {villa.currency}{formatINR(totalPrice)} total
          </span>
        </div>
        <button
          type="button"
          className="mob-reserve-btn"
          onClick={handleConfirmReservation}
        >
          Confirm Reservation
        </button>
      </div>
    </div>
  );
}
