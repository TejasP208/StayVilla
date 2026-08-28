'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CalendarCheck,
  MapPin,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { formatINR } from '@/lib/villas';

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
    reference: 'SV-392011',
    villaId: 'villa-sol-de-goa',
    villaName: 'Villa Sol De Goa',
    villaLocation: 'Anjuna, North Goa',
    villaImage: 'https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=800',
    checkIn: '10 Feb 2025',
    checkOut: '14 Feb 2025',
    nights: 4,
    guests: 4,
    adults: 4,
    children: 0,
    rooms: 2,
    totalPrice: 179900,
    currency: '₹',
    status: 'Completed',
    createdAt: '22 Jan 2025',
  },
  {
    id: 'b-3',
    reference: 'SV-719302',
    villaId: 'kumarakom-waters-edge',
    villaName: 'Kumarakom Waters Edge',
    villaLocation: 'Vembanad Lake, Kerala',
    villaImage: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
    checkIn: '05 Nov 2024',
    checkOut: '08 Nov 2024',
    nights: 3,
    guests: 2,
    adults: 2,
    children: 0,
    rooms: 1,
    totalPrice: 123200,
    currency: '₹',
    status: 'Cancelled',
    createdAt: '14 Oct 2024',
  },
];

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('stayvilla-bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBookings(parsed);
        }
      }
    } catch {
      // fallback
    }
    setIsLoaded(true);
  }, []);

  const displayedBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'Confirmed';
    if (activeTab === 'completed') return b.status === 'Completed';
    if (activeTab === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const totalSpent = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const handleOpenBookingDetail = (booking: Booking) => {
    try {
      localStorage.setItem(
        `stayvilla-booking-${booking.id}`,
        JSON.stringify({
          booking,
          villa: {
            id: booking.villaId,
            name: booking.villaName,
            description: 'Luxury bespoke private villa stay in India.',
            bedrooms: booking.rooms,
            bathrooms: booking.rooms,
            maxGuests: booking.guests,
            rating: '4.98',
            reviewsCount: 48,
            pricePerNight: Math.round((booking.totalPrice - 3500) / (booking.nights * 1.05)),
            currency: booking.currency,
          },
        })
      );
    } catch {
      // ignore
    }
    router.push(`/booking/${booking.id}`);
  };

  return (
    <div className="prop-page-root">
      {/* NAVBAR */}
      <header className="prop-navbar">
        <div className="prop-navbar-inner">
          <div className="prop-nav-left">
            <Link href="/" className="prop-back-link">
              <ArrowLeft size={16} />
              <span>Back to StayVilla</span>
            </Link>
          </div>

          <Link href="/" className="prop-brand">
            <span className="brand-mark">⌁</span>
            <span className="brand-name">
              STAY<span>VILLA</span>
            </span>
          </Link>

          <div className="prop-nav-right">
            <a
              href="https://wa.me/919167914640?text=Hello%20StayVilla%20Concierge,%20I%20have%20an%20inquiry%20about%20my%20bookings."
              target="_blank"
              rel="noopener noreferrer"
              className="prop-action-btn"
            >
              <ShieldCheck size={16} color="#16a34a" />
              <span>24/7 Concierge</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="prop-main-container">
        {/* PAGE HEADER & METRICS */}
        <section className="myb-header-section">
          <div className="myb-header-text">
            <span className="dash-modal-eyebrow">
              <CalendarCheck size={15} /> Verified Guest Account
            </span>
            <h1 className="myb-title">My Bookings in India</h1>
            <p className="myb-subtitle">
              Manage your reserved luxury stays, access official tax invoices, and connect with your StayVilla concierge.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="myb-metrics-grid">
            <div className="myb-metric-card">
              <label>Total Reservations</label>
              <strong>{bookings.length} Stays</strong>
            </div>
            <div className="myb-metric-card">
              <label>Upcoming Stays</label>
              <strong className="text-forest">{confirmedCount} Active</strong>
            </div>
            <div className="myb-metric-card">
              <label>Total Value</label>
              <strong>₹{formatINR(totalSpent)}</strong>
            </div>
          </div>
        </section>

        {/* TABS */}
        <div className="myb-tabs-wrap">
          <button
            type="button"
            className={`myb-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Stays ({bookings.length})
          </button>
          <button
            type="button"
            className={`myb-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({confirmedCount})
          </button>
          <button
            type="button"
            className={`myb-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({bookings.filter((b) => b.status === 'Completed').length})
          </button>
          <button
            type="button"
            className={`myb-tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled ({bookings.filter((b) => b.status === 'Cancelled').length})
          </button>
        </div>

        {/* BOOKINGS LIST */}
        <div className="myb-list-container">
          {displayedBookings.length > 0 ? (
            displayedBookings.map((b) => (
              <article
                key={b.id}
                className={`myb-booking-card ${b.status.toLowerCase()}`}
                onClick={() => handleOpenBookingDetail(b)}
              >
                <div className="myb-card-image-wrap">
                  <img src={b.villaImage} alt={b.villaName} />
                  <span className={`myb-status-pill status-${b.status.toLowerCase()}`}>
                    {b.status}
                  </span>
                </div>

                <div className="myb-card-body">
                  <div className="myb-card-header">
                    <div>
                      <h3 className="myb-villa-name">{b.villaName}</h3>
                      <p className="myb-location">
                        <MapPin size={14} className="loc-pin" /> {b.villaLocation}
                      </p>
                    </div>
                    <div className="myb-ref-tag">
                      <span>Booking Ref:</span>
                      <strong>{b.reference}</strong>
                    </div>
                  </div>

                  <div className="myb-info-strip">
                    <div className="myb-info-item">
                      <label>Dates & Duration</label>
                      <span>
                        {b.checkIn} → {b.checkOut}
                      </span>
                      <small>({b.nights} nights)</small>
                    </div>
                    <div className="myb-info-item">
                      <label>Guests & Rooms</label>
                      <span>
                        {b.guests} Guests ({b.adults} Adults
                        {b.children > 0 ? `, ${b.children} Children` : ''})
                      </span>
                      <small>{b.rooms} {b.rooms === 1 ? 'Bedroom' : 'Bedrooms'}</small>
                    </div>
                    <div className="myb-info-item">
                      <label>Total Amount (INR)</label>
                      <strong className="myb-price">
                        {b.currency}
                        {formatINR(b.totalPrice)}
                      </strong>
                      <small>All taxes & fees included</small>
                    </div>
                  </div>

                  <div className="myb-card-footer">
                    <div className="myb-actions-left">
                      <button
                        type="button"
                        className="myb-invoice-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBookingDetail(b);
                        }}
                      >
                        <FileText size={15} /> View Tax Invoice &amp; Voucher
                      </button>

                      {b.status === 'Confirmed' && (
                        <a
                          href={`https://wa.me/919167914640?text=${encodeURIComponent(
                            `Hello StayVilla Concierge, I would like to request assistance/cancellation for booking ${b.reference} (${b.villaName}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="myb-whatsapp-action-btn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.336 11.893-11.893a11.82 11.82 0 00-3.475-8.412z" />
                          </svg>
                          <span>Cancellation &amp; Support</span>
                        </a>
                      )}
                    </div>

                    <span className="myb-created-date">Booked on {b.createdAt}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="myb-empty-state">
              <CalendarCheck size={48} className="empty-icon" />
              <h3>No {activeTab !== 'all' ? activeTab : ''} bookings found</h3>
              <p>You have not made any bookings under this category yet.</p>
              <Link href="/#villas" className="prop-confirm-reservation-btn myb-explore-btn">
                <Sparkles size={16} /> Explore Luxury Indian Villas
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
