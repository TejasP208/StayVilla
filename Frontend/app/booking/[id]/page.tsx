'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  FileText,
  MapPin,
  BedDouble,
  Bath,
  Users,
  Star,
  Trash2,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';

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

interface VillaDetail {
  id: string;
  name: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  rating: string;
  reviewsCount: number;
  pricePerNight: number;
  currency: string;
}

function formatINR(val: number): string {
  return val.toLocaleString('en-IN');
}

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [villa, setVilla] = useState<VillaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(`stayvilla-booking-${bookingId}`);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setBooking(parsed.booking);
        setVilla(parsed.villa || null);
      }
    } catch {
      // failed to parse
    }
    setLoading(false);
  }, [bookingId]);

  const handleDownloadInvoice = () => {
    if (!booking) return;

    const subtotal = villa
      ? villa.pricePerNight * booking.nights
      : Math.round(booking.totalPrice / 1.05 - 3500);
    const cleaningFee = 3500;
    const serviceFee = Math.round(subtotal * 0.05);

    const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${booking.reference} - StayVilla</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #fff; color: #1a1a1a; padding: 48px; max-width: 800px; margin: 0 auto; }
    .inv-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1a3c34; padding-bottom: 24px; margin-bottom: 32px; }
    .inv-brand { font-size: 28px; font-weight: 700; color: #1a3c34; letter-spacing: -0.5px; }
    .inv-brand small { display: block; font-size: 10px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-top: 2px; }
    .inv-ref { text-align: right; }
    .inv-ref h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px; }
    .inv-ref p { font-size: 22px; font-weight: 700; color: #1a3c34; }
    .inv-ref .inv-date { font-size: 12px; color: #888; margin-top: 4px; }
    .inv-villa { background: #f8f6f1; padding: 24px; border-radius: 12px; margin-bottom: 28px; }
    .inv-villa h3 { font-size: 22px; margin-bottom: 4px; color: #1a3c34; }
    .inv-villa p { font-size: 13px; color: #666; }
    .inv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px; }
    .inv-grid .inv-cell label { display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.8px; color: #999; font-weight: 700; margin-bottom: 4px; }
    .inv-grid .inv-cell span { font-size: 14px; font-weight: 600; color: #1a1a1a; }
    .inv-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    .inv-table th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #999; font-weight: 700; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .inv-table td { padding: 12px 0; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
    .inv-table td:last-child { text-align: right; font-weight: 600; }
    .inv-table th:last-child { text-align: right; }
    .inv-total { display: flex; justify-content: flex-end; margin-bottom: 40px; }
    .inv-total-box { background: #1a3c34; color: white; padding: 16px 28px; border-radius: 10px; text-align: right; }
    .inv-total-box label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; margin-bottom: 4px; }
    .inv-total-box span { font-size: 26px; font-weight: 700; font-family: Georgia, serif; }
    .inv-footer { border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center; color: #aaa; font-size: 11px; }
    .inv-status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-left: 12px; }
    .inv-status.confirmed { background: #dcfce7; color: #16a34a; }
    .inv-status.completed { background: #e2e8f0; color: #475569; }
    .inv-status.cancelled { background: #fee2e2; color: #dc2626; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="inv-header">
    <div>
      <div class="inv-brand">⌁ STAY<span style="font-weight:400">VILLA</span><small>Luxury Villas Across India</small></div>
    </div>
    <div class="inv-ref">
      <h2>Tax Invoice</h2>
      <p>${booking.reference}</p>
      <div class="inv-date">Issued: ${booking.createdAt}</div>
    </div>
  </div>

  <div class="inv-villa">
    <h3>${booking.villaName} <span class="inv-status ${booking.status.toLowerCase()}">${booking.status}</span></h3>
    <p>📍 ${booking.villaLocation}</p>
  </div>

  <div class="inv-grid">
    <div class="inv-cell"><label>Check-in</label><span>${booking.checkIn}</span></div>
    <div class="inv-cell"><label>Check-out</label><span>${booking.checkOut}</span></div>
    <div class="inv-cell"><label>Duration</label><span>${booking.nights} Nights</span></div>
    <div class="inv-cell"><label>Guests</label><span>${booking.adults} Adults${booking.children > 0 ? `, ${booking.children} Children` : ''}</span></div>
  </div>

  <table class="inv-table">
    <thead><tr><th>Description</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>Villa Stay — ${villa ? villa.currency : booking.currency}${villa ? formatINR(villa.pricePerNight) : '—'} × ${booking.nights} nights</td><td>${booking.currency}${formatINR(subtotal)}</td></tr>
      <tr><td>Cleaning &amp; Maintenance Fee</td><td>${booking.currency}${formatINR(cleaningFee)}</td></tr>
      <tr><td>StayVilla Concierge Fee (5%)</td><td>${booking.currency}${formatINR(serviceFee)}</td></tr>
    </tbody>
  </table>

  <div class="inv-total">
    <div class="inv-total-box">
      <label>Total Amount (INR)</label>
      <span>${booking.currency}${formatINR(booking.totalPrice)}</span>
    </div>
  </div>

  <div class="inv-footer">
    <p>StayVilla Luxury Hospitality Pvt. Ltd. · GSTIN: 27AABCS1234C1Z5 · CIN: U55101MH2022PTC384512</p>
    <p style="margin-top:6px">This is a computer-generated invoice and does not require a physical signature.</p>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 400);
    }
  };

  if (loading) {
    return (
      <main className="bd-page">
        <div className="bd-page-loading">
          <CalendarCheck size={48} />
          <p>Loading booking details…</p>
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="bd-page">
        <div className="bd-page-loading">
          <CalendarCheck size={48} />
          <h2>Booking not found</h2>
          <p>This booking may have expired or the link is invalid.</p>
          <a href="/" className="bd-back-link">
            <ArrowLeft size={16} /> Return to StayVilla
          </a>
        </div>
      </main>
    );
  }

  const subtotal = villa
    ? villa.pricePerNight * booking.nights
    : Math.round(booking.totalPrice / 1.05 - 3500);
  const cleaningFee = 3500;
  const serviceFee = Math.round(subtotal * 0.05);

  return (
    <div className="bd-standalone-layout">
      {/* TOP HEADER NAVBAR */}
      <header className="bd-header-nav">
        <div className="bd-header-inner">
          <a href="/" className="bd-header-back-btn">
            <ArrowLeft size={16} /> Back to StayVilla
          </a>
          <a href="/" className="bd-header-brand">
            <span className="brand-mark">⌁</span>
            <span className="brand-name">
              STAY<span>VILLA</span>
            </span>
          </a>
          <div className="bd-header-meta">
            <span className="bd-header-ref">Ref: <strong>{booking.reference}</strong></span>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <div className="bd-hero-container">
        <div className="bd-hero-card">
          <img src={booking.villaImage} alt={booking.villaName} className="bd-hero-bg-img" />
          <div className="bd-hero-card-overlay" />
          <div className="bd-hero-text-content">
            <div className="bd-status-wrapper">
              <span className={`bd-status-badge status-${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>
            <h1 className="bd-hero-title">{booking.villaName}</h1>
            <p className="bd-hero-subtitle">
              <MapPin size={15} /> {booking.villaLocation}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT DETAILS */}
      <div className="bd-content-container">
        {/* Booking Reference Bar */}
        <div className="bd-top-bar">
          <div className="bd-ref">
            <FileText size={15} />
            <span>Booking Reference:</span>
            <strong>{booking.reference}</strong>
          </div>
          <span className="bd-booked-on">Booked on {booking.createdAt}</span>
        </div>

        {/* Stay Details Grid */}
        <div className="bd-info-grid">
          <div className="bd-info-card">
            <label>Check-in</label>
            <span>{booking.checkIn}</span>
            <small>From 2:00 PM</small>
          </div>
          <div className="bd-info-card">
            <label>Check-out</label>
            <span>{booking.checkOut}</span>
            <small>Before 11:00 AM</small>
          </div>
          <div className="bd-info-card">
            <label>Duration</label>
            <span>{booking.nights} Nights</span>
            <small>{booking.nights + 1} Days</small>
          </div>
          <div className="bd-info-card">
            <label>Guests</label>
            <span>
              {booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Children` : ''}
            </span>
            <small>{booking.rooms} {booking.rooms === 1 ? 'Bedroom' : 'Bedrooms'}</small>
          </div>
        </div>

        {/* Villa Details */}
        {villa && (
          <div className="bd-villa-details">
            <h3>About the Villa</h3>
            <p>{villa.description}</p>
            <div className="bd-villa-features">
              <span><BedDouble size={14} /> {villa.bedrooms} Bedrooms</span>
              <span><Bath size={14} /> {villa.bathrooms} Bathrooms</span>
              <span><Users size={14} /> Up to {villa.maxGuests} Guests</span>
              <span><Star size={14} fill="currentColor" /> {villa.rating} ({villa.reviewsCount} reviews)</span>
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="bd-price-section">
          <h3>Price Breakdown</h3>
          <div className="bd-price-rows">
            <div className="bd-price-row">
              <span>
                Villa Stay — {villa ? `${villa.currency}${formatINR(villa.pricePerNight)}` : ''} × {booking.nights} nights
              </span>
              <span>{booking.currency}{formatINR(subtotal)}</span>
            </div>
            <div className="bd-price-row">
              <span>Cleaning &amp; Maintenance Fee</span>
              <span>{booking.currency}{formatINR(cleaningFee)}</span>
            </div>
            <div className="bd-price-row">
              <span>StayVilla Concierge Fee (5%)</span>
              <span>{booking.currency}{formatINR(serviceFee)}</span>
            </div>
            <div className="bd-price-row bd-price-total">
              <span>Total (INR)</span>
              <span>{booking.currency}{formatINR(booking.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Confirmation Notice */}
        {booking.status === 'Confirmed' && (
          <div className="bd-confirmation-notice">
            <CheckCircle2 size={18} />
            <div>
              <strong>Reservation Confirmed</strong>
              <p>Your stay is secured. A booking voucher with concierge contact details has been issued.</p>
            </div>
          </div>
        )}

        {/* WhatsApp Cancellation Disclaimer */}
        {booking.status === 'Confirmed' && (
          <div className="bd-whatsapp-disclaimer-box">
            <span className="bd-whatsapp-icon-badge">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.336 11.893-11.893a11.82 11.82 0 00-3.475-8.412z" />
              </svg>
            </span>
            <div className="bd-whatsapp-disclaimer-content">
              <strong>Need to cancel or make adjustments?</strong>
              <p>
                For cancellation and date modifications, please contact our concierge team directly via{' '}
                <a
                  href={`https://wa.me/919820147291?text=${encodeURIComponent(
                    `Hello StayVilla Concierge, I would like to request cancellation for reservation ${booking.reference} (${booking.villaName}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bd-whatsapp-link"
                >
                  WhatsApp (+91 98201 47291)
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bd-actions">
          <button
            type="button"
            className="bd-download-btn"
            onClick={handleDownloadInvoice}
          >
            <Download size={16} /> Download Invoice
          </button>
          <a href="/" className="bd-home-btn">
            <ArrowLeft size={16} /> Back to StayVilla
          </a>
        </div>

        {/* Footer */}
        <div className="bd-page-footer">
          <p>
            <span className="bd-footer-brand">⌁ STAY<span>VILLA</span></span>
            <small>Luxury Villas Across India</small>
          </p>
          <p className="bd-footer-legal">
            StayVilla Luxury Hospitality Pvt. Ltd. · GSTIN: 27AABCS1234C1Z5
          </p>
        </div>
      </div>
    </div>
  );
}
