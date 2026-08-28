'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  User,
  Mail,
  Phone,
  Building2,
  FileCheck2,
  Calendar,
  Users,
  Utensils,
  Coffee,
  CheckCircle2,
  CreditCard,
  Sparkles,
  MapPin,
  Star,
  Check,
} from 'lucide-react';
import { allVillas, formatINR, Villa } from '@/lib/villas';

interface PendingCheckout {
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
  mealPlan: 'with-food' | 'without-food';
  mealPrice: number;
  staySubtotal: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  currency: string;
  pricePerNight: number;
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const villaId = params.id as string;

  const [villa, setVilla] = useState<Villa | null>(null);
  const [checkoutData, setCheckoutData] = useState<PendingCheckout | null>(null);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [firstName, setFirstName] = useState('Aarav');
  const [lastName, setLastName] = useState('Mehta');
  const [email, setEmail] = useState('aarav.mehta@stayvilla.in');
  const [phone, setPhone] = useState('+91 91679 14640');
  const [hasGst, setHasGst] = useState(false);
  const [gstNumber, setGstNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const foundVilla = allVillas.find((v) => v.id === villaId) || allVillas[0];
    setVilla(foundVilla);

    // Try loading pending checkout data
    try {
      const stored = localStorage.getItem('stayvilla-pending-checkout');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.villaId === villaId || !villaId) {
          setCheckoutData(parsed);
        }
      }

      // Pre-fill user profile if logged in
      const userProfileStr = localStorage.getItem('stayvilla-user');
      if (userProfileStr) {
        const profile = JSON.parse(userProfileStr);
        if (profile.name) {
          const parts = profile.name.split(' ');
          setFirstName(parts[0] || 'Aarav');
          setLastName(parts.slice(1).join(' ') || 'Mehta');
        }
        if (profile.email) setEmail(profile.email);
        if (profile.phone) setPhone(profile.phone);
      }
    } catch {
      // ignore
    }

    setLoading(false);
  }, [villaId]);

  // Fallback defaults if page refreshed directly
  const bookingNights = checkoutData?.nights || 7;
  const bookingGuests = checkoutData?.guests || 4;
  const bookingAdults = checkoutData?.adults || 4;
  const bookingChildren = checkoutData?.children || 0;
  const bookingRooms = checkoutData?.rooms || 2;
  const bookingMealPlan = checkoutData?.mealPlan || 'with-food';
  const bookingCheckIn = checkoutData?.checkIn || '14 Oct 2026';
  const bookingCheckOut = checkoutData?.checkOut || '21 Oct 2026';

  const pricePerNight = villa?.pricePerNight || 48000;
  const staySubtotal = checkoutData?.staySubtotal || pricePerNight * bookingNights;
  const mealTotal = checkoutData?.mealPrice !== undefined
    ? checkoutData.mealPrice
    : bookingMealPlan === 'with-food'
    ? 2500 * bookingGuests * bookingNights
    : 0;
  const cleaningFee = checkoutData?.cleaningFee || 3500;
  const serviceFee = checkoutData?.serviceFee || Math.round((staySubtotal + mealTotal) * 0.05);
  const totalPrice = checkoutData?.totalPrice || staySubtotal + mealTotal + cleaningFee + serviceFee;

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const refCode = `SV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBookingId = `b-${Date.now()}`;
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    const confirmedBooking = {
      id: newBookingId,
      reference: refCode,
      villaId: villa?.id || villaId,
      villaName: villa?.name || 'Luxury Estate',
      villaLocation: villa?.location || 'India',
      villaImage: villa?.image || '',
      checkIn: bookingCheckIn,
      checkOut: bookingCheckOut,
      nights: bookingNights,
      guests: bookingGuests,
      adults: bookingAdults,
      children: bookingChildren,
      rooms: bookingRooms,
      mealPlan: bookingMealPlan,
      mealPrice: mealTotal,
      guestName: fullName,
      guestEmail: email,
      guestPhone: phone,
      hasGst: hasGst && !!gstNumber,
      gstNumber: hasGst ? gstNumber.toUpperCase() : undefined,
      companyName: hasGst ? companyName : undefined,
      specialRequests: specialRequests || undefined,
      totalPrice,
      currency: villa?.currency || '₹',
      status: 'Confirmed' as const,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    try {
      // Store in individual cache for /booking/[id]
      localStorage.setItem(
        `stayvilla-booking-${newBookingId}`,
        JSON.stringify({
          booking: confirmedBooking,
          villa: villa
            ? {
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
              }
            : null,
        })
      );

      // Store in all bookings list for /my-bookings
      const existing = localStorage.getItem('stayvilla-bookings');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(confirmedBooking);
      localStorage.setItem('stayvilla-bookings', JSON.stringify(list));

      // Clean pending checkout
      localStorage.removeItem('stayvilla-pending-checkout');
    } catch (err) {
      console.error('Failed to save booking', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        router.push(`/booking/${newBookingId}`);
      }, 900);
    }, 1200);
  };

  return (
    <div className="checkout-page-root">
      {/* NAVBAR */}
      <header className="prop-navbar">
        <div className="prop-navbar-inner">
          <div className="prop-nav-left">
            <Link href={`/property/${villaId}`} className="prop-back-link">
              <ArrowLeft size={16} />
              <span>Back to Property</span>
            </Link>
          </div>

          <Link href="/" className="prop-brand">
            <span className="brand-mark">⌁</span>
            <span className="brand-name">
              STAY<span>VILLA</span>
            </span>
          </Link>

          <div className="prop-nav-right">
            <span className="prop-verified-badge">
              <ShieldCheck size={14} /> 256-Bit SSL Encrypted
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="checkout-main-container">
        <div className="checkout-page-title-row">
          <h1>Complete Your Reservation</h1>
          <p>Please provide guest contact details to receive your instant tax invoice and stay voucher.</p>
        </div>

        <div className="checkout-layout-grid">
          {/* LEFT COLUMN: GUEST DETAILS & PAYMENT FORM */}
          <div className="checkout-form-column">
            {paymentSuccess ? (
              <div className="checkout-card checkout-success-card">
                <div className="success-icon-badge">
                  <Check size={36} />
                </div>
                <h2>Payment Successful!</h2>
                <p>Generating your tax invoice &amp; booking confirmation voucher…</p>
              </div>
            ) : (
              <form onSubmit={handlePaySubmit} className="checkout-actual-form">
                {/* 1. GUEST CONTACT DETAILS CARD */}
                <div className="checkout-card">
                  <div className="checkout-card-header">
                    <span className="checkout-step-badge">Step 1</span>
                    <h2>Guest Information</h2>
                  </div>

                  <div className="checkout-fields-grid">
                    <div className="checkout-field">
                      <label>First Name <span className="req">*</span></label>
                      <div className="input-with-icon">
                        <User size={16} className="input-icon" />
                        <input
                          type="text"
                          placeholder="e.g. Aarav"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="checkout-field">
                      <label>Last Name <span className="req">*</span></label>
                      <div className="input-with-icon">
                        <User size={16} className="input-icon" />
                        <input
                          type="text"
                          placeholder="e.g. Mehta"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="checkout-field">
                      <label>Email Address (For Booking Voucher) <span className="req">*</span></label>
                      <div className="input-with-icon">
                        <Mail size={16} className="input-icon" />
                        <input
                          type="email"
                          placeholder="aarav.mehta@stayvilla.in"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="checkout-field">
                      <label>Mobile Number <span className="req">*</span></label>
                      <div className="input-with-icon">
                        <Phone size={16} className="input-icon" />
                        <input
                          type="tel"
                          placeholder="+91 91679 14640"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. OPTIONAL GST TAX INVOICE CARD */}
                <div className="checkout-card">
                  <div className="checkout-card-header">
                    <span className="checkout-step-badge">Step 2</span>
                    <h2>GST Invoicing Details (Optional)</h2>
                  </div>

                  <div className="gst-checkbox-row">
                    <label className="gst-custom-label">
                      <input
                        type="checkbox"
                        checked={hasGst}
                        onChange={(e) => setHasGst(e.target.checked)}
                        className="gst-checkbox-input"
                      />
                      <span className="gst-checkbox-text">
                        <strong>I have a GST number</strong>
                        <small>Check this to receive a B2B tax invoice with input tax credit</small>
                      </span>
                    </label>
                  </div>

                  {hasGst && (
                    <div className="gst-inputs-drawer">
                      <div className="checkout-fields-grid">
                        <div className="checkout-field">
                          <label>15-Digit GSTIN Number <span className="req">*</span></label>
                          <div className="input-with-icon">
                            <FileCheck2 size={16} className="input-icon" />
                            <input
                              type="text"
                              placeholder="e.g. 27AAAAA0000A1Z5"
                              value={gstNumber}
                              onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                              required={hasGst}
                              maxLength={15}
                            />
                          </div>
                        </div>

                        <div className="checkout-field">
                          <label>Registered Company / Business Name <span className="req">*</span></label>
                          <div className="input-with-icon">
                            <Building2 size={16} className="input-icon" />
                            <input
                              type="text"
                              placeholder="e.g. Mehta Hospitality Pvt Ltd"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              required={hasGst}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. SPECIAL REQUESTS */}
                <div className="checkout-card">
                  <div className="checkout-card-header">
                    <span className="checkout-step-badge">Step 3</span>
                    <h2>Special Requests &amp; Arrival Notes(Optional)</h2>
                  </div>

                  <div className="checkout-field">
                    <textarea
                      placeholder="e.g. Dietary preferences, early arrival shikara transfer request, or occasion celebration…"
                      rows={3}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="checkout-textarea"
                    />
                  </div>
                </div>

                {/* 4. FINAL PAY ACTION */}
                <div className="checkout-pay-action-box">
                  <div className="pay-security-notice">
                    <Lock size={15} className="text-forest" />
                    <span>Safe &amp; Secure 256-Bit SSL Encrypted Payment</span>
                  </div>

                  <button
                    type="submit"
                    className="prop-confirm-reservation-btn checkout-pay-btn"
                    disabled={isProcessing}
                    id="checkout-pay-btn"
                  >
                    <CreditCard size={18} />
                    <span>
                      {isProcessing
                        ? 'Processing Payment with Gateway…'
                        : `Pay ₹${formatINR(totalPrice)} & Confirm Stay`}
                    </span>
                  </button>

                  <p className="checkout-terms-note">
                    By clicking <strong>Pay</strong>, you agree to StayVilla&apos;s Terms of Booking and Cancellation Policy.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: BOOKING & FARE SUMMARY (STICKY) */}
          <div className="checkout-summary-column">
            <div className="checkout-summary-card">
              <div className="summary-villa-header">
                {villa?.image && (
                  <img
                    src={villa.image}
                    alt={villa.name}
                    className="summary-villa-img"
                  />
                )}
                <div>
                  <span className="summary-tag">
                    <Sparkles size={12} /> Confirmed Stay
                  </span>
                  <h3>{villa?.name || 'StayVilla Sanctuary'}</h3>
                  <p className="summary-location">
                    <MapPin size={13} /> {villa?.location || 'India'}
                  </p>
                  <div className="summary-rating">
                    <Star size={13} fill="currentColor" /> {villa?.rating || '4.95'} ({villa?.reviewsCount || 42} reviews)
                  </div>
                </div>
              </div>

              <div className="summary-divider" />

              {/* RESERVATION ATTRIBUTES */}
              <div className="summary-details-list">
                <div className="summary-row">
                  <div className="summary-icon-label">
                    <Calendar size={15} />
                    <span>Dates</span>
                  </div>
                  <strong>{bookingCheckIn} – {bookingCheckOut} ({bookingNights} Nights)</strong>
                </div>

                <div className="summary-row">
                  <div className="summary-icon-label">
                    <Users size={15} />
                    <span>Guests</span>
                  </div>
                  <strong>
                    {bookingGuests} Guests ({bookingAdults} Adults{bookingChildren > 0 ? `, ${bookingChildren} Ch` : ''}), {bookingRooms} Rooms
                  </strong>
                </div>

                <div className="summary-row">
                  <div className="summary-icon-label">
                    {bookingMealPlan === 'with-food' ? (
                      <Utensils size={15} className="text-forest" />
                    ) : (
                      <Coffee size={15} />
                    )}
                    <span>Dining Plan</span>
                  </div>
                  <strong className={bookingMealPlan === 'with-food' ? 'text-forest' : ''}>
                    {bookingMealPlan === 'with-food'
                      ? '🍽️ With Food (Private Chef)'
                      : '🏡 Without Food (Villa Only)'}
                  </strong>
                </div>
              </div>

              <div className="summary-divider" />

              {/* ITEMIZED PRICE BREAKDOWN */}
              <div className="prop-price-breakdown">
                <div className="p-row">
                  <span>
                    Villa Stay ({villa?.currency || '₹'}{formatINR(pricePerNight)} × {bookingNights}n)
                  </span>
                  <span>
                    {villa?.currency || '₹'}{formatINR(staySubtotal)}
                  </span>
                </div>

                {bookingMealPlan === 'with-food' ? (
                  <div className="p-row meal-highlight-row">
                    <span>Royal Gourmet Food ({bookingGuests}g × {bookingNights}n)</span>
                    <span className="text-forest">
                      +{villa?.currency || '₹'}{formatINR(mealTotal)}
                    </span>
                  </div>
                ) : (
                  <div className="p-row">
                    <span>Dining Plan: Villa Only (No Meals)</span>
                    <span>₹0</span>
                  </div>
                )}

                <div className="p-row">
                  <span>Cleaning &amp; Maintenance Fee</span>
                  <span>{villa?.currency || '₹'}{formatINR(cleaningFee)}</span>
                </div>

                <div className="p-row">
                  <span>StayVilla Concierge Fee (5%)</span>
                  <span>{villa?.currency || '₹'}{formatINR(serviceFee)}</span>
                </div>

                <div className="p-divider" />

                <div className="p-row p-total">
                  <strong>Total Payable (INR)</strong>
                  <strong>
                    {villa?.currency || '₹'}{formatINR(totalPrice)}
                  </strong>
                </div>
              </div>

              <div className="summary-guarantee-strip">
                <CheckCircle2 size={15} color="#16a34a" />
                <span>Free cancellation up to 7 days prior to check-in</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
