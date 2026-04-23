import { useState, useEffect, useRef, useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Save,
  UploadCloud,
  Image as ImageIcon,
  ShieldAlert,
  KeyRound,
  Truck,
  QrCode,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

// ─── Reusable Sub-Components ───────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, iconColor, iconBg, title, description }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      padding: '20px 24px',
      borderBottom: '1px solid #f0f0f4',
      background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
    }}
  >
    <div
      style={{
        padding: '10px',
        borderRadius: '12px',
        background: iconBg,
        color: iconColor,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon size={20} />
    </div>
    <div>
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{title}</h2>
      {description && (
        <p style={{ fontSize: '13px', color: '#8a8a9a', margin: '3px 0 0', fontWeight: 500 }}>
          {description}
        </p>
      )}
    </div>
  </div>
);

const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: '#fff',
      borderRadius: '16px',
      border: '1px solid #ebebf0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 4px 24px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

const InputField = ({ label, helper, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && (
      <label
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#374151',
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </label>
    )}
    {children}
    {helper && (
      <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, margin: 0 }}>{helper}</p>
    )}
  </div>
);

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  fontSize: '14px',
  fontWeight: 500,
  border: '1.5px solid #e5e7eb',
  borderRadius: '10px',
  background: '#f9fafb',
  color: '#1f2937',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
  boxSizing: 'border-box',
};

const PrimaryButton = ({ children, disabled, onClick, type = 'button', style = {} }) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '11px 24px',
      fontSize: '14px',
      fontWeight: 700,
      borderRadius: '10px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? '#93c5fd' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: '#fff',
      boxShadow: disabled ? 'none' : '0 4px 14px rgba(59,130,246,0.35)',
      transition: 'all 0.2s',
      ...style,
    }}
  >
    {children}
  </button>
);

const DangerButton = ({ children, disabled, type = 'button', onClick, style = {} }) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '11px 24px',
      fontSize: '14px',
      fontWeight: 700,
      borderRadius: '10px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? '#fca5a5' : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      color: '#fff',
      boxShadow: disabled ? 'none' : '0 4px 14px rgba(239,68,68,0.30)',
      transition: 'all 0.2s',
      ...style,
    }}
  >
    {children}
  </button>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const Settings = () => {
  const { logout } = useContext(AdminAuthContext);

  const [settings, setSettings] = useState({ deliveryCharge: '', upiId: '', qrImageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // File Upload
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  // Security Credentials
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data) {
          setSettings(data);
          setPreviewUrl(data.qrImageUrl || '');
        }
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please upload a valid image file');
    if (file.size > 2 * 1024 * 1024) return toast.error('Image must be less than 2MB');
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let finalQrUrl = settings.qrImageUrl;
      if (uploadedFile) {
        toast.loading('Uploading QR Image...', { id: 'upload' });
        const formData = new FormData();
        formData.append('qrImage', uploadedFile);
        const { data } = await api.post('/admin/upload-qr', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (!data.success) throw new Error(data.message);
        finalQrUrl = data.imageUrl;
        toast.dismiss('upload');
      }
      await api.put('/admin/settings', {
        deliveryCharge: settings.deliveryCharge,
        upiId: settings.upiId,
        qrImageUrl: finalQrUrl,
      });
      setSettings({ ...settings, qrImageUrl: finalQrUrl });
      setUploadedFile(null);
      toast.success('Configuration saved successfully!');
    } catch {
      toast.dismiss('upload');
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSecurityRequest = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      setSecurityLoading(true);
      await api.post('/admin/request-credential-change');
      toast.success('OTP sent to your current email', { duration: 4000 });
      setOtpSent(true);
    } catch {
      toast.error('Failed to request change');
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleSecurityVerify = async (e) => {
    e.preventDefault();
    if (!otp) return;
    try {
      setSecurityLoading(true);
      await api.post('/admin/verify-credential-change', { otp, newEmail, newPassword });
      toast.success('Credentials Updated! Logging out...', { duration: 4000 });
      setTimeout(() => logout(), 1500);
    } catch {
      toast.error('Invalid or expired OTP');
      setSecurityLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '320px',
          gap: '16px',
          color: '#9ca3af',
        }}
      >
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ fontSize: '14px', fontWeight: 600 }}>Loading System Preferences…</p>
      </div>
    );
  }

  return (
    <>
      {/* Spin keyframe injected once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important; background: #fff !important; }`}</style>

      <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '48px' }}>

        {/* ── Page Header ── */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1a2e', margin: '0 0 6px' }}>
            System Preferences
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, margin: 0 }}>
            Manage store configuration, payment routing, and admin security in one place.
          </p>
        </div>

        {/* ── Section 1: Delivery Settings ── */}
        <Card style={{ marginBottom: '24px' }}>
          <SectionHeader
            icon={Truck}
            iconBg="#dbeafe"
            iconColor="#2563eb"
            title="Delivery Settings"
            description="Configure universal delivery charge applied at checkout"
          />
          <div style={{ padding: '24px' }}>
            <div style={{ maxWidth: '400px' }}>
              <InputField
                label="Base Delivery Charge (₹)"
                helper="This charge is applied uniformly to every customer order."
              >
                <input
                  type="number"
                  style={inputStyle}
                  value={settings.deliveryCharge}
                  onChange={(e) =>
                    setSettings({ ...settings, deliveryCharge: Number(e.target.value) })
                  }
                  placeholder="e.g. 40"
                />
              </InputField>
            </div>
          </div>
        </Card>

        {/* ── Section 2: UPI Payment Settings ── */}
        <Card style={{ marginBottom: '24px' }}>
          <SectionHeader
            icon={QrCode}
            iconBg="#f3e8ff"
            iconColor="#7c3aed"
            title="UPI Payment Settings"
            description="Set your merchant UPI ID and upload a QR code for order payments"
          />
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Merchant UPI ID */}
            <InputField label="Merchant UPI ID">
              <input
                type="text"
                style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '0.04em' }}
                value={settings.upiId}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                placeholder="yourname@upi"
              />
            </InputField>

            {/* QR Code Upload */}
            <InputField label="Payment QR Code" helper="Supported: JPG, PNG · Max size: 2 MB · Cloudinary CDN enabled">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  flexWrap: 'wrap',
                }}
              >
                {/* QR Preview Box */}
                <div
                  style={{
                    width: '140px',
                    height: '140px',
                    flexShrink: 0,
                    border: '1.5px dashed #d1d5db',
                    borderRadius: '12px',
                    background: '#f9fafb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="QR Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#d1d5db',
                      }}
                    >
                      <ImageIcon size={28} />
                      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>
                        NO QR
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', paddingTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '9px 18px',
                      fontSize: '13px',
                      fontWeight: 600,
                      borderRadius: '9px',
                      border: '1.5px solid #e5e7eb',
                      background: '#ffffff',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                    onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
                  >
                    <UploadCloud size={15} />
                    Browse & Upload
                  </button>
                  {uploadedFile && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: '#16a34a',
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 size={14} />
                      {uploadedFile.name}
                    </div>
                  )}
                </div>
              </div>
            </InputField>

            {/* Save Button — aligned right */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: '16px',
                borderTop: '1px solid #f0f0f4',
              }}
            >
              <PrimaryButton disabled={saving} onClick={handleSettingsUpdate}>
                {saving ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Configuration
                  </>
                )}
              </PrimaryButton>
            </div>
          </div>
        </Card>

        {/* ── Section 3: Admin Security ── */}
        <Card>
          <SectionHeader
            icon={ShieldAlert}
            iconBg="#fee2e2"
            iconColor="#dc2626"
            title="Security & Access Control"
            description="Update root admin email and password — requires OTP verification"
          />

          <div style={{ padding: '24px' }}>
            {!otpSent ? (
              <form onSubmit={handleSecurityRequest}>
                {/* Warning Banner */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: '#fff7ed',
                    border: '1px solid #fed7aa',
                    marginBottom: '24px',
                  }}
                >
                  <ShieldAlert size={16} style={{ color: '#f97316', marginTop: '1px', flexShrink: 0 }} />
                  <p style={{ fontSize: '13px', color: '#92400e', fontWeight: 500, margin: 0, lineHeight: 1.6 }}>
                    Updating credentials will immediately log you out. An OTP will be sent to the
                    currently registered admin email for verification.
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <InputField label="New Admin Email">
                    <input
                      required
                      type="email"
                      style={inputStyle}
                      placeholder="new-admin@diwedi.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </InputField>

                  <InputField label="New Password">
                    <input
                      required
                      type="password"
                      style={inputStyle}
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </InputField>

                  <InputField label="Confirm Password">
                    <input
                      required
                      type="password"
                      style={inputStyle}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </InputField>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    paddingTop: '16px',
                    borderTop: '1px solid #f0f0f4',
                  }}
                >
                  <DangerButton type="submit" disabled={securityLoading}>
                    {securityLoading ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Sending OTP…
                      </>
                    ) : (
                      <>
                        <KeyRound size={16} />
                        Request Credential Change
                      </>
                    )}
                  </DangerButton>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSecurityVerify}>
                {/* OTP Panel */}
                <div
                  style={{
                    maxWidth: '420px',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '32px 24px',
                    border: '1.5px dashed #e5e7eb',
                    borderRadius: '14px',
                    background: '#fafafa',
                    marginBottom: '24px',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: '#dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <KeyRound size={24} color="#2563eb" />
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: '18px', color: '#1a1a2e', margin: '0 0 8px' }}>
                    Enter Verification Code
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, margin: '0 0 24px', lineHeight: 1.6 }}>
                    A 6-digit OTP was sent to your registered admin email.
                    <br />
                    This code expires in 10 minutes.
                  </p>
                  <input
                    required
                    minLength="6"
                    maxLength="6"
                    type="text"
                    placeholder="· · · · · ·"
                    style={{
                      width: '180px',
                      textAlign: 'center',
                      fontSize: '28px',
                      letterSpacing: '0.45em',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#1a1a2e',
                      border: 'none',
                      borderBottom: '3px solid #d1d5db',
                      background: 'transparent',
                      outline: 'none',
                      padding: '8px 0',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                    paddingTop: '16px',
                    borderTop: '1px solid #f0f0f4',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    style={{
                      padding: '11px 20px',
                      fontSize: '14px',
                      fontWeight: 600,
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '10px',
                      background: '#fff',
                      color: '#6b7280',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseOut={(e) => (e.currentTarget.style.background = '#fff')}
                  >
                    ← Go Back
                  </button>

                  <button
                    type="submit"
                    disabled={securityLoading}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '11px 24px',
                      fontSize: '14px',
                      fontWeight: 700,
                      borderRadius: '10px',
                      border: 'none',
                      cursor: securityLoading ? 'not-allowed' : 'pointer',
                      background: securityLoading
                        ? '#86efac'
                        : 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
                      color: '#fff',
                      boxShadow: securityLoading ? 'none' : '0 4px 14px rgba(34,197,94,0.35)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {securityLoading ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Verifying…
                      </>
                    ) : (
                      <>
                        <ShieldAlert size={16} />
                        Verify & Update
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Settings;
