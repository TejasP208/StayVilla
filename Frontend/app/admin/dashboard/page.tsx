'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  Sparkles,
  ShieldCheck,
  Star,
  Users,
  BedDouble,
  Bath,
  Upload,
  Image as ImageIcon,
  Save,
  X,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { Villa, allVillas } from '@/lib/villas';
import {
  DestinationItem,
  getEffectiveVillas,
  saveEffectiveVillas,
  getEffectiveDestinations,
  saveEffectiveDestinations,
} from '@/lib/admin-store';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth state
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Active Tab: 'villas' | 'destinations'
  const [activeTab, setActiveTab] = useState<'villas' | 'destinations'>('villas');

  // Data lists
  const [villas, setVillas] = useState<Villa[]>([]);
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal states for Villas
  const [isVillaModalOpen, setIsVillaModalOpen] = useState(false);
  const [editingVilla, setEditingVilla] = useState<Villa | null>(null);
  const [villaFormData, setVillaFormData] = useState<Partial<Villa>>({});
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Modal states for Destinations
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<DestinationItem | null>(null);
  const [destFormData, setDestFormData] = useState<Partial<DestinationItem>>({});

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'villa' | 'dest'; idOrName: string; title: string } | null>(null);

  // File input refs
  const villaMainFileInputRef = useRef<HTMLInputElement>(null);
  const villaGalleryFileInputRef = useRef<HTMLInputElement>(null);
  const destFileInputRef = useRef<HTMLInputElement>(null);

  // Check auth on mount
  useEffect(() => {
    try {
      const isAdmin = localStorage.getItem('stayvilla-is-admin');
      const adminData = localStorage.getItem('stayvilla-admin');

      if (!isAdmin || isAdmin !== 'true') {
        router.push('/admin');
        return;
      }

      if (adminData) {
        const parsed = JSON.parse(adminData);
        setAdminEmail(parsed.email || 'Admin');
      }
      setIsAuthorized(true);
    } catch {
      router.push('/admin');
    } finally {
      setIsLoadingAuth(false);
    }

    // Load dynamic data
    setVillas(getEffectiveVillas());
    setDestinations(getEffectiveDestinations());
  }, [router]);

  // Show temporary toast
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sign out
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('stayvilla-admin');
      localStorage.removeItem('stayvilla-is-admin');
    } catch {
      // ignore
    }
    router.push('/admin');
  };

  // -------------------------------------------------------------
  // IMAGE UPLOAD HANDLERS
  // -------------------------------------------------------------
  const handleSingleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSuccess(reader.result);
        showToast('Image uploaded successfully.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleMultipleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedUrls: string[] = [];
    let completed = 0;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            uploadedUrls.push(reader.result);
          }
          completed++;
          if (completed === files.length) {
            const currentGallery = villaFormData.galleryImages || [];
            setVillaFormData((prev) => ({
              ...prev,
              galleryImages: [...currentGallery, ...uploadedUrls],
            }));
            showToast(`Uploaded ${uploadedUrls.length} gallery image(s).`);
          }
        };
        reader.readAsDataURL(file);
      } else {
        completed++;
      }
    });
    e.target.value = '';
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    const currentGallery = villaFormData.galleryImages || [];
    setVillaFormData({
      ...villaFormData,
      galleryImages: [...currentGallery, newGalleryUrl.trim()],
    });
    setNewGalleryUrl('');
    showToast('Gallery image URL added.');
  };

  const handleDeleteGalleryImage = (indexToRemove: number) => {
    const currentGallery = villaFormData.galleryImages || [];
    const updatedGallery = currentGallery.filter((_, idx) => idx !== indexToRemove);
    setVillaFormData({
      ...villaFormData,
      galleryImages: updatedGallery,
    });
    showToast('Gallery image removed.');
  };

  // -------------------------------------------------------------
  // VILLA HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddVilla = () => {
    setEditingVilla(null);
    setNewGalleryUrl('');
    setVillaFormData({
      id: `villa-${Date.now()}`,
      name: '',
      location: '',
      region: '',
      country: 'India',
      pricePerNight: 25000,
      currency: '₹',
      rating: '4.95',
      reviewsCount: 12,
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
      tag: 'Luxury Estate',
      bedrooms: 3,
      bathrooms: 3,
      maxGuests: 6,
      details: '3 bedrooms · 6 guests · Private Pool',
      description: 'An exceptional private sanctuary crafted with bespoke luxury, offering panoramic views and dedicated concierge service.',
      highlights: ['Private Infinity Pool', 'Dedicated Chef & Butler Service', 'Panoramic Mountain/Sea Views'],
      galleryImages: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      ],
      amenities: [
        { icon: 'Waves', label: 'Private Pool', description: 'Exclusive swimming pool' },
        { icon: 'Wifi', label: 'High-Speed Wi-Fi', description: 'Fiber internet connection' },
        { icon: 'Utensils', label: 'Private Chef', description: 'Custom dining experience' },
      ],
      rooms: [
        { name: 'Master Suite', bedType: '1 King Bed', enSuite: true, features: 'Scenic view, private bath' },
      ],
      houseRules: ['Check-in after 2:00 PM', 'Check-out by 11:00 AM', 'No smoking inside'],
      host: {
        name: 'StayVilla Concierge',
        role: 'Estate Host',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
        badge: 'StayVilla Superhost',
        responseRate: '100% (within 15 minutes)',
      },
      reviews: [],
    });
    setIsVillaModalOpen(true);
  };

  const handleOpenEditVilla = (villa: Villa) => {
    setEditingVilla(villa);
    setNewGalleryUrl('');
    setVillaFormData({
      ...villa,
      galleryImages: villa.galleryImages && villa.galleryImages.length > 0 ? [...villa.galleryImages] : [villa.image],
    });
    setIsVillaModalOpen(true);
  };

  const handleSaveVilla = (e: React.FormEvent) => {
    e.preventDefault();
    if (!villaFormData.name || !villaFormData.location || !villaFormData.pricePerNight) {
      showToast('Please fill in all required property details.', 'error');
      return;
    }

    if (!villaFormData.image) {
      showToast('Please upload or enter a main property image.', 'error');
      return;
    }

    let updatedList: Villa[];
    if (editingVilla) {
      updatedList = villas.map((v) => (v.id === editingVilla.id ? ({ ...v, ...villaFormData } as Villa) : v));
      showToast(`Updated "${villaFormData.name}" successfully.`);
    } else {
      const newVilla = {
        ...villaFormData,
        id: villaFormData.id || `villa-${Date.now()}`,
        currency: '₹',
        rating: villaFormData.rating || '4.95',
        reviewsCount: villaFormData.reviewsCount || 8,
        details: `${villaFormData.bedrooms || 3} bedrooms · ${villaFormData.maxGuests || 6} guests · Luxury Villa`,
      } as Villa;
      updatedList = [newVilla, ...villas];
      showToast(`Added new property "${villaFormData.name}".`);
    }

    setVillas(updatedList);
    saveEffectiveVillas(updatedList);
    setIsVillaModalOpen(false);
  };

  const confirmDeleteVilla = (id: string, name: string) => {
    setDeleteTarget({ type: 'villa', idOrName: id, title: name });
  };

  const executeDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'villa') {
      const updated = villas.filter((v) => v.id !== deleteTarget.idOrName);
      setVillas(updated);
      saveEffectiveVillas(updated);
      showToast(`Property "${deleteTarget.title}" deleted.`);
    } else if (deleteTarget.type === 'dest') {
      const updated = destinations.filter((d) => d.name !== deleteTarget.idOrName);
      setDestinations(updated);
      saveEffectiveDestinations(updated);
      showToast(`Destination "${deleteTarget.title}" deleted.`);
    }

    setDeleteTarget(null);
  };

  const handleResetVillas = () => {
    if (confirm('Are you sure you want to reset all villas back to default?')) {
      setVillas(allVillas);
      saveEffectiveVillas(allVillas);
      showToast('All properties have been reset to factory defaults.');
    }
  };

  // -------------------------------------------------------------
  // DESTINATION HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddDest = () => {
    setEditingDest(null);
    setDestFormData({
      name: '',
      region: '',
      country: 'India',
      latitude: 19.076,
      longitude: 72.8777,
      meta: 'Luxury Living · 20 private estates',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=900',
      villasCount: 20,
    });
    setIsDestModalOpen(true);
  };

  const handleOpenEditDest = (dest: DestinationItem) => {
    setEditingDest(dest);
    setDestFormData({ ...dest });
    setIsDestModalOpen(true);
  };

  const handleSaveDest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destFormData.name || !destFormData.region) {
      showToast('Please provide destination name and region.', 'error');
      return;
    }

    if (!destFormData.image) {
      showToast('Please upload or enter a destination image.', 'error');
      return;
    }

    let updatedList: DestinationItem[];
    if (editingDest) {
      updatedList = destinations.map((d) =>
        d.name === editingDest.name ? ({ ...d, ...destFormData } as DestinationItem) : d
      );
      showToast(`Updated destination "${destFormData.name}".`);
    } else {
      const newDest = {
        ...destFormData,
        country: destFormData.country || 'India',
        villasCount: Number(destFormData.villasCount) || 15,
        meta: destFormData.meta || `${destFormData.region} · ${destFormData.villasCount || 15} luxury villas`,
      } as DestinationItem;
      updatedList = [...destinations, newDest];
      showToast(`Added new destination "${destFormData.name}".`);
    }

    setDestinations(updatedList);
    saveEffectiveDestinations(updatedList);
    setIsDestModalOpen(false);
  };

  const confirmDeleteDest = (name: string) => {
    setDeleteTarget({ type: 'dest', idOrName: name, title: name });
  };

  // Filter villas for display
  const filteredVillas = villas.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.region && v.region.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoadingAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          backgroundColor: '#fdfbf7',
          color: '#1a3c34',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e6ded2',
              borderTopColor: '#1a3c34',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ fontSize: '14px', fontWeight: 600 }}>Loading Admin Console…</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fdfbf7',
        color: '#1a221f',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
      }}
    >
      {/* TOAST ALERT */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: toastMessage.type === 'success' ? '#1a3c34' : '#dc2626',
            color: '#ffffff',
            padding: '14px 22px',
            borderRadius: '12px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: 600,
            animation: 'fadeInDown 0.3s ease',
          }}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 size={18} color="#4ade80" /> : <AlertCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header
        style={{
          borderBottom: '1px solid #e6ded2',
          backgroundColor: '#ffffff',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(26, 60, 52, 0.04)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px', color: '#c8a46a', fontFamily: 'serif' }}>⌁</span>
            <span
              style={{
                fontFamily: 'Georgia, serif',
                fontWeight: 700,
                fontSize: '18px',
                letterSpacing: '2px',
                color: '#1a3c34',
              }}
            >
              STAY<span style={{ color: '#c8a46a' }}>VILLA</span>
            </span>
          </Link>

          <span
            style={{
              fontSize: '11px',
              padding: '3px 10px',
              backgroundColor: 'rgba(200, 164, 106, 0.15)',
              border: '1px solid rgba(200, 164, 106, 0.35)',
              borderRadius: '20px',
              color: '#8c6827',
              fontWeight: 700,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
            }}
          >
            Management Dashboard
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fdfbf7',
              border: '1px solid #e6ded2',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12.5px',
              color: '#1a3c34',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                display: 'inline-block',
              }}
            />
            <span>Admin: <strong>{adminEmail}</strong></span>
          </div>

          <Link
            href="/"
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#1a3c34',
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: '#f5f0e8',
              border: '1px solid #e6ded2',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            <ExternalLink size={14} />
            <span>Live Site</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* MAIN BODY */}
      <main style={{ flex: 1, maxWidth: '1320px', width: '100%', margin: '0 auto', padding: '36px 24px 80px' }}>
        {/* STATS OVERVIEW CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e6ded2',
              borderRadius: '18px',
              padding: '20px 24px',
              boxShadow: '0 4px 14px rgba(26, 60, 52, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(26, 60, 52, 0.08)',
                color: '#1a3c34',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Building2 size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#62726d', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Properties
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1a3c34', margin: 0 }}>{villas.length}</h3>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e6ded2',
              borderRadius: '18px',
              padding: '20px 24px',
              boxShadow: '0 4px 14px rgba(26, 60, 52, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(200, 164, 106, 0.15)',
                color: '#8c6827',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <MapPin size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#62726d', fontWeight: 600, textTransform: 'uppercase' }}>
                Famous Destinations
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1a3c34', margin: 0 }}>{destinations.length}</h3>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e6ded2',
              borderRadius: '18px',
              padding: '20px 24px',
              boxShadow: '0 4px 14px rgba(26, 60, 52, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: '#16a34a',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#62726d', fontWeight: 600, textTransform: 'uppercase' }}>
                Database & Storage
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#16a34a', margin: 0 }}>Connected & Active</h3>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS & ACTION ROW */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* TABS */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#ffffff',
              border: '1px solid #e6ded2',
              borderRadius: '14px',
              padding: '4px',
              gap: '4px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('villas')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'villas' ? '#1a3c34' : 'transparent',
                color: activeTab === 'villas' ? '#ffffff' : '#62726d',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Building2 size={16} />
              <span>Properties & Villas</span>
              <span
                style={{
                  backgroundColor: activeTab === 'villas' ? 'rgba(255,255,255,0.2)' : '#f5f0e8',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                }}
              >
                {villas.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('destinations')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'destinations' ? '#1a3c34' : 'transparent',
                color: activeTab === 'destinations' ? '#ffffff' : '#62726d',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <MapPin size={16} />
              <span>Famous Destinations</span>
              <span
                style={{
                  backgroundColor: activeTab === 'destinations' ? 'rgba(255,255,255,0.2)' : '#f5f0e8',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                }}
              >
                {destinations.length}
              </span>
            </button>
          </div>

          {/* RIGHT ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {activeTab === 'villas' ? (
              <>
                <button
                  type="button"
                  onClick={handleResetVillas}
                  title="Reset to default sample villas"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e6ded2',
                    color: '#62726d',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Reset Default</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddVilla}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 20px',
                    borderRadius: '12px',
                    backgroundColor: '#1a3c34',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(26, 60, 52, 0.18)',
                  }}
                >
                  <Plus size={17} />
                  <span>Add New Property</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleOpenAddDest}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 20px',
                  borderRadius: '12px',
                  backgroundColor: '#1a3c34',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(26, 60, 52, 0.18)',
                }}
              >
                <Plus size={17} />
                <span>Add New Destination</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB CONTENT: VILLAS */}
        {activeTab === 'villas' && (
          <div>
            {/* SEARCH BAR */}
            <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '420px' }}>
              <Search
                size={16}
                color="#62726d"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search villas by name or location…"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e6ded2',
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  outline: 'none',
                  color: '#1a221f',
                }}
              />
            </div>

            {/* VILLAS GRID */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '24px',
              }}
            >
              {filteredVillas.map((villa) => (
                <div
                  key={villa.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e6ded2',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(26, 60, 52, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  {/* CARD IMAGE */}
                  <div style={{ position: 'relative', height: '200px', backgroundColor: '#e6ded2' }}>
                    <img
                      src={villa.image}
                      alt={villa.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(26, 60, 52, 0.85)',
                        backdropFilter: 'blur(8px)',
                        color: '#c8a46a',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {villa.tag || 'Luxury'}
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        color: '#1a3c34',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Star size={12} fill="#c8a46a" color="#c8a46a" />
                      {villa.rating || '4.95'}
                    </span>
                  </div>

                  {/* CARD BODY */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#1a3c34',
                        margin: '0 0 6px',
                      }}
                    >
                      {villa.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '12.5px',
                        color: '#62726d',
                        margin: '0 0 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <MapPin size={13} color="#8c6827" />
                      <span>{villa.location}</span>
                    </p>

                    {/* SPECS */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        fontSize: '12px',
                        color: '#62726d',
                        paddingBottom: '14px',
                        borderBottom: '1px solid #f0ebe1',
                        marginBottom: '14px',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BedDouble size={14} color="#8c6827" /> {villa.bedrooms} Beds
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Bath size={14} color="#8c6827" /> {villa.bathrooms} Baths
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={14} color="#8c6827" /> Max {villa.maxGuests} Guests
                      </span>
                    </div>

                    {/* PRICE & ACTIONS */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '11px', color: '#62726d', display: 'block' }}>Per Night</span>
                        <strong style={{ fontSize: '17px', color: '#1a3c34', fontFamily: 'Georgia, serif' }}>
                          ₹{villa.pricePerNight?.toLocaleString('en-IN')}
                        </strong>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditVilla(villa)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: '#f5f0e8',
                            border: '1px solid #e6ded2',
                            color: '#1a3c34',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => confirmDeleteVilla(villa.id, villa.name)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: DESTINATIONS */}
        {activeTab === 'destinations' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {destinations.map((dest) => (
              <div
                key={dest.name}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e6ded2',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(26, 60, 52, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', height: '180px', backgroundColor: '#e6ded2' }}>
                  <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(26, 60, 52, 0.85)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {dest.villasCount || 20} Villas
                  </span>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#1a3c34',
                      margin: '0 0 4px',
                    }}
                  >
                    {dest.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#8c6827', fontWeight: 600, margin: '0 0 8px' }}>
                    {dest.region}, {dest.country || 'India'}
                  </p>
                  <p style={{ fontSize: '12.5px', color: '#62726d', margin: '0 0 16px' }}>{dest.meta}</p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'auto' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditDest(dest)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#f5f0e8',
                        border: '1px solid #e6ded2',
                        color: '#1a3c34',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => confirmDeleteDest(dest.name)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* =========================================================
          MODAL: ADD / EDIT PROPERTY WITH IMAGE UPLOAD & DELETE
         ========================================================= */}
      {isVillaModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(15, 31, 26, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              maxWidth: '740px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '36px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                borderBottom: '1px solid #e6ded2',
                paddingBottom: '16px',
              }}
            >
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#1a3c34', margin: 0 }}>
                  {editingVilla ? 'Edit Property' : 'Add New Property'}
                </h2>
                <p style={{ fontSize: '12.5px', color: '#62726d', margin: '4px 0 0' }}>
                  Update details, upload photos, or manage the gallery.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsVillaModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#62726d',
                  padding: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveVilla}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8c6827', marginBottom: '6px' }}>
                    Property Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={villaFormData.name || ''}
                    onChange={(e) => setVillaFormData({ ...villaFormData, name: e.target.value })}
                    placeholder="e.g. The Royal Pichola Villa"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e6ded2', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8c6827', marginBottom: '6px' }}>
                    Full Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={villaFormData.location || ''}
                    onChange={(e) => setVillaFormData({ ...villaFormData, location: e.target.value })}
                    placeholder="e.g. Lake Pichola, Udaipur, Rajasthan"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e6ded2', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8c6827', marginBottom: '6px' }}>
                    Region / City
                  </label>
                  <input
                    type="text"
                    value={villaFormData.region || ''}
                    onChange={(e) => setVillaFormData({ ...villaFormData, region: e.target.value })}
                    placeholder="e.g. Udaipur"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e6ded2', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8c6827', marginBottom: '6px' }}>
                    Price Per Night (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={villaFormData.pricePerNight || ''}
                    onChange={(e) => setVillaFormData({ ...villaFormData, pricePerNight: Number(e.target.value) })}
                    placeholder="e.g. 45000"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e6ded2', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8c6827', marginBottom: '6px' }}>
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={villaFormData.tag || ''}
                    onChange={(e) => setVillaFormData({ ...villaFormData, tag: e.target.value })}
                    placeholder="e.g. Royal Heritage, Sea View, Mountain Chalet"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e6ded2', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8c6827', marginBottom: '6px' }}>
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={villaFormData.bedrooms || 3}
                    onChange={(e) => setVillaFormData({ ...villaFormData, bedrooms: Number(e.target.value) })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e6ded2', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8c6827', marginBottom: '6px' }}>
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={villaFormData.bathrooms || 3}
                    onChange={(e) => setVillaFormData({ ...villaFormData, bathrooms: Number(e.target.value) })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e6ded2', fontSize: '13.5px' }}
                  />
                </div>

                {/* ====================================================
                    MAIN PROPERTY IMAGE SECTION (UPLOAD / DELETE)
                   ==================================================== */}
                <div
                  style={{
                    gridColumn: 'span 2',
                    backgroundColor: '#fdfbf7',
                    border: '1px solid #e6ded2',
                    borderRadius: '16px',
                    padding: '18px',
                  }}
                >
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#1a3c34',
                      marginBottom: '10px',
                    }}
                  >
                    Main Property Image *
                  </label>

                  {/* PREVIEW + ACTIONS */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {villaFormData.image ? (
                      <div
                        style={{
                          position: 'relative',
                          width: '140px',
                          height: '100px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '2px solid #e6ded2',
                          backgroundColor: '#e6ded2',
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={villaFormData.image}
                          alt="Main preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => setVillaFormData({ ...villaFormData, image: '' })}
                          title="Delete Main Image"
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            backgroundColor: 'rgba(220, 38, 38, 0.9)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '140px',
                          height: '100px',
                          borderRadius: '12px',
                          border: '2px dashed #e6ded2',
                          display: 'grid',
                          placeItems: 'center',
                          backgroundColor: '#ffffff',
                          color: '#9ca3af',
                          flexShrink: 0,
                        }}
                      >
                        <ImageIcon size={28} />
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: '220px' }}>
                      {/* FILE INPUT (HIDDEN) */}
                      <input
                        type="file"
                        ref={villaMainFileInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) =>
                          handleSingleImageUpload(e, (dataUrl) =>
                            setVillaFormData((prev) => ({ ...prev, image: dataUrl }))
                          )
                        }
                      />

                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <button
                          type="button"
                          onClick={() => villaMainFileInputRef.current?.click()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '9px 14px',
                            borderRadius: '8px',
                            backgroundColor: '#1a3c34',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <Upload size={14} />
                          <span>Upload From Computer</span>
                        </button>

                        {villaFormData.image && (
                          <button
                            type="button"
                            onClick={() => setVillaFormData({ ...villaFormData, image: '' })}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              backgroundColor: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Delete Image</span>
                          </button>
                        )}
                      </div>

                      <div>
                        <input
                          type="url"
                          value={villaFormData.image || ''}
                          onChange={(e) => setVillaFormData({ ...villaFormData, image: e.target.value })}
                          placeholder="Or paste image web URL (https://...)"
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: '1px solid #e6ded2',
                            fontSize: '12.5px',
                            backgroundColor: '#ffffff',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ====================================================
                    GALLERY IMAGES SECTION (ADD / UPLOAD / DELETE)
                   ==================================================== */}
                <div
                  style={{
                    gridColumn: 'span 2',
                    backgroundColor: '#fdfbf7',
                    border: '1px solid #e6ded2',
                    borderRadius: '16px',
                    padding: '18px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#1a3c34',
                          margin: 0,
                        }}
                      >
                        Property Gallery Images ({villaFormData.galleryImages?.length || 0})
                      </label>
                      <span style={{ fontSize: '11px', color: '#62726d' }}>
                        Add multiple photos for guest gallery view
                      </span>
                    </div>

                    {/* HIDDEN MULTIPLE FILE INPUT */}
                    <input
                      type="file"
                      ref={villaGalleryFileInputRef}
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleMultipleGalleryUpload}
                    />

                    <button
                      type="button"
                      onClick={() => villaGalleryFileInputRef.current?.click()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#1a3c34',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Upload size={13} />
                      <span>Upload Photos</span>
                    </button>
                  </div>

                  {/* GALLERY GRID WITH DELETE OVERLAYS */}
                  {villaFormData.galleryImages && villaFormData.galleryImages.length > 0 ? (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '10px',
                        marginBottom: '14px',
                      }}
                    >
                      {villaFormData.galleryImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: 'relative',
                            height: '75px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #e6ded2',
                            backgroundColor: '#e6ded2',
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryImage(idx)}
                            title="Delete this image"
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              backgroundColor: 'rgba(220, 38, 38, 0.9)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', margin: '0 0 12px' }}>
                      No gallery images uploaded yet.
                    </p>
                  )}

                  {/* ADD GALLERY IMAGE BY URL */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="url"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="Add individual image URL to gallery (https://...)"
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e6ded2',
                        fontSize: '12.5px',
                        backgroundColor: '#ffffff',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      style={{
                        padding: '9px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#f5f0e8',
                        border: '1px solid #e6ded2',
                        color: '#1a3c34',
                        fontWeight: 600,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                      }}
                    >
                      + Add URL
                    </button>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8c6827', marginBottom: '6px' }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={villaFormData.description || ''}
                    onChange={(e) => setVillaFormData({ ...villaFormData, description: e.target.value })}
                    placeholder="Describe the villa, architecture, views and experience…"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e6ded2', fontSize: '13.5px', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setIsVillaModalOpen(false)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '10px',
                    backgroundColor: '#f5f0e8',
                    border: '1px solid #e6ded2',
                    color: '#62726d',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    backgroundColor: '#1a3c34',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Save size={16} />
                  <span>Save Property</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: ADD / EDIT DESTINATION WITH IMAGE UPLOAD & DELETE
         ========================================================= */}
      {isDestModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(15, 31, 26, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              maxWidth: '560px',
              width: '100%',
              padding: '36px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: '1px solid #e6ded2',
                paddingBottom: '14px',
              }}
            >
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#1a3c34', margin: 0 }}>
                  {editingDest ? 'Edit Destination' : 'Add New Destination'}
                </h2>
                <p style={{ fontSize: '12px', color: '#62726d', margin: '4px 0 0' }}>
                  Provide destination details and cover photo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDestModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#62726d' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDest}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8c6827', marginBottom: '6px' }}>
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={destFormData.name || ''}
                    onChange={(e) => setDestFormData({ ...destFormData, name: e.target.value })}
                    placeholder="e.g. Goa, Udaipur, Coorg"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e6ded2', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8c6827', marginBottom: '6px' }}>
                    Region / Subtitle *
                  </label>
                  <input
                    type="text"
                    required
                    value={destFormData.region || ''}
                    onChange={(e) => setDestFormData({ ...destFormData, region: e.target.value })}
                    placeholder="e.g. North & South Goa"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e6ded2', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8c6827', marginBottom: '6px' }}>
                    Meta Subtitle
                  </label>
                  <input
                    type="text"
                    value={destFormData.meta || ''}
                    onChange={(e) => setDestFormData({ ...destFormData, meta: e.target.value })}
                    placeholder="e.g. Coastal · 42 luxury villas"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e6ded2', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8c6827', marginBottom: '6px' }}>
                    Villa Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={destFormData.villasCount || 20}
                    onChange={(e) => setDestFormData({ ...destFormData, villasCount: Number(e.target.value) })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e6ded2', fontSize: '13.5px' }}
                  />
                </div>

                {/* DESTINATION IMAGE (UPLOAD / DELETE) */}
                <div
                  style={{
                    backgroundColor: '#fdfbf7',
                    border: '1px solid #e6ded2',
                    borderRadius: '16px',
                    padding: '16px',
                  }}
                >
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#1a3c34',
                      marginBottom: '10px',
                    }}
                  >
                    Destination Cover Photo *
                  </label>

                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    {destFormData.image ? (
                      <div
                        style={{
                          position: 'relative',
                          width: '120px',
                          height: '80px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '2px solid #e6ded2',
                          backgroundColor: '#e6ded2',
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={destFormData.image}
                          alt="Dest preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => setDestFormData({ ...destFormData, image: '' })}
                          title="Delete image"
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: 'rgba(220, 38, 38, 0.9)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '22px',
                            height: '22px',
                            cursor: 'pointer',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '120px',
                          height: '80px',
                          borderRadius: '10px',
                          border: '2px dashed #e6ded2',
                          display: 'grid',
                          placeItems: 'center',
                          backgroundColor: '#ffffff',
                          color: '#9ca3af',
                          flexShrink: 0,
                        }}
                      >
                        <ImageIcon size={24} />
                      </div>
                    )}

                    <div style={{ flex: 1 }}>
                      {/* HIDDEN FILE INPUT */}
                      <input
                        type="file"
                        ref={destFileInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) =>
                          handleSingleImageUpload(e, (dataUrl) =>
                            setDestFormData((prev) => ({ ...prev, image: dataUrl }))
                          )
                        }
                      />

                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <button
                          type="button"
                          onClick={() => destFileInputRef.current?.click()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: '#1a3c34',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <Upload size={13} />
                          <span>Upload From File</span>
                        </button>

                        {destFormData.image && (
                          <button
                            type="button"
                            onClick={() => setDestFormData({ ...destFormData, image: '' })}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              backgroundColor: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      <input
                        type="url"
                        value={destFormData.image || ''}
                        onChange={(e) => setDestFormData({ ...destFormData, image: e.target.value })}
                        placeholder="Or enter image URL (https://...)"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e6ded2',
                          fontSize: '12px',
                          backgroundColor: '#ffffff',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setIsDestModalOpen(false)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '10px',
                    backgroundColor: '#f5f0e8',
                    border: '1px solid #e6ded2',
                    color: '#62726d',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    backgroundColor: '#1a3c34',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Save size={16} />
                  <span>Save Destination</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          DELETE CONFIRMATION DIALOG
         ========================================================= */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(15, 31, 26, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Trash2 size={24} />
            </div>

            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, color: '#1a3c34', margin: '0 0 8px' }}>
              Confirm Deletion
            </h3>
            <p style={{ fontSize: '13.5px', color: '#62726d', margin: '0 0 24px', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>&quot;{deleteTarget.title}&quot;</strong>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#f5f0e8',
                  border: '1px solid #e6ded2',
                  color: '#62726d',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={executeDelete}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                }}
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
