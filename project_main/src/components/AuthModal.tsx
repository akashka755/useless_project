import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Lock, KeyRound, Eye, Compass } from 'lucide-react';
import { CAPTCHA_TILES } from '../data/captcha';
import type { UserProfile } from '../types';
import { sounds } from '../utils/audio';
import { QuantumLookAway } from './QuantumLookAway';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

const HIEROGLYPHS = ['𓀀', '𓀁', '𓀃', '𓆣', '𓇋', '𓏏', '𓊝', '𓃠', '𓆏', '𓈖', '𓋹', '𓍯'];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'quantum' | 'classic'>('quantum');
  const [step, setStep] = useState<'captcha' | 'password'>('captcha');

  // Captcha state
  const [selectedTileIds, setSelectedTileIds] = useState<number[]>([]);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  // Password state
  const [email, setEmail] = useState('victim_shopper@flopkart.in');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Quantum Look-Away Success Handler
  const handleQuantumSuccess = () => {
    const quantumUser: UserProfile = {
      name: "Schrödinger's Shopper",
      email: 'unobserved_qubit@flopkart.in',
      tier: 'Quantum Minus VIP (Superposed)',
      bermudaCoordinates: '25.0N, 71.0W (Probabilistic)',
      hieroglyph: '𓆣',
      secretLength: 42,
    };
    onLoginSuccess(quantumUser);
    onClose();
  };

  // Classic password validation rules
  const hasHieroglyph = HIEROGLYPHS.some((h) => password.includes(h)) ||
    /[\u{13000}-\u{1342F}]/u.test(password);

  const hasSecret = password.length >= 10 && (
    /secret|confidential|hidden|shh|guilt|fear|trauma/i.test(password) || password.length >= 14
  );

  const hasBermudaCoord = /(?:(?:1[8-9]|2[0-9]|3[0-3])(?:\.\d+)?\s*°?\s*[Nn]?)[,\s]+(?:-?(?:6[4-9]|7[0-9]|8[0-1])(?:\.\d+)?\s*°?\s*[Ww]?)/.test(password) ||
    /25\.7N,\s*71\.5W|32N,\s*64W|bermuda/i.test(password);

  const toggleTile = (id: number) => {
    sounds.playTick();
    setCaptchaError(null);
    setSelectedTileIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleVerifyCaptcha = () => {
    const hasJoy = selectedTileIds.includes(3) || selectedTileIds.includes(8);
    const dreadCount = selectedTileIds.filter((id) => id !== 3 && id !== 8).length;

    if (hasJoy) {
      sounds.playErrorBuzzer();
      setCaptchaError('REJECTED: You selected a joy-inducing tile (Puppy/Croissant). Flopkart operates strictly on pure unmitigated existential dread.');
      return;
    }

    if (dreadCount < 3) {
      sounds.playErrorBuzzer();
      setCaptchaError(`Existential dread insufficient (${dreadCount}/3 selected). Please feel worse and select at least 3 harrowing tiles.`);
      return;
    }

    sounds.playTick();
    setCaptchaError(null);
    setStep('password');
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasHieroglyph) {
      sounds.playErrorBuzzer();
      setPasswordError('Missing Ancient Egyptian Hieroglyphic! Please embed Pharaoh\'s curse into your password.');
      return;
    }

    if (!hasSecret) {
      sounds.playErrorBuzzer();
      setPasswordError('Password must contain a genuine secret (type at least 14 characters or include the word "secret" / "fear").');
      return;
    }

    if (!hasBermudaCoord) {
      sounds.playErrorBuzzer();
      setPasswordError('Missing valid Bermuda Triangle coordinates! (Try inserting e.g. "28.5N, 70.2W").');
      return;
    }

    sounds.playSuccessFanfare();
    const newUser: UserProfile = {
      name: 'Guest #404',
      email,
      tier: 'Flopkart Minus VIP (Vulnerable)',
      bermudaCoordinates: '28.5N, 70.2W',
      hieroglyph: '𓀀',
      secretLength: password.length,
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-300 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#2874f0] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#ffe500]" />
            <h3 className="font-bold text-base">The Authentication Crisis</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authentication Mode Tabs */}
        <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('quantum')}
            className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              authMode === 'quantum'
                ? 'bg-white text-[#2874f0] border-b-2 border-[#2874f0]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-500" />
            <span>Quantum Look-Away Login</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('classic')}
            className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              authMode === 'classic'
                ? 'bg-white text-[#2874f0] border-b-2 border-[#2874f0]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Compass className="w-4 h-4 text-blue-500" />
            <span>Dread Captcha & Bermuda</span>
          </button>
        </div>

        {authMode === 'quantum' ? (
          /* QUANTUM OBSERVER LOOK-AWAY COMPONENT (AI Webcam Head Tracker + Sensor Mode) */
          <QuantumLookAway onSuccess={handleQuantumSuccess} />
        ) : step === 'captcha' ? (
          /* STEP 1: EXISTENTIAL DREAD CAPTCHA */
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-blue-900">
              <p className="font-bold text-sm mb-0.5 text-blue-950">
                Select all images containing existential dread
              </p>
              <p className="text-gray-600">
                Click all tiles that trigger acute mid-career panic or administrative paralysis.
              </p>
            </div>

            {captchaError && (
              <div className="bg-red-50 border border-red-300 text-red-800 text-xs p-3 rounded flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{captchaError}</span>
              </div>
            )}

            {/* 3x3 Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {CAPTCHA_TILES.map((tile) => {
                const isSelected = selectedTileIds.includes(tile.id);
                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => toggleTile(tile.id)}
                    className={`relative p-2.5 rounded border text-left flex flex-col justify-between h-28 sm:h-32 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500 shadow-xs'
                        : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <span className="text-2xl sm:text-3xl">{tile.emoji}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-100 shrink-0" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[11px] text-gray-900 leading-tight">
                        {tile.title}
                      </p>
                      <p className="text-[9.5px] text-gray-500 mt-0.5 line-clamp-2 leading-tight">
                        {tile.scenario}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500">
                Selected: <strong className="text-blue-600">{selectedTileIds.length}</strong> / 9
              </span>
              <button
                onClick={handleVerifyCaptcha}
                className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded text-xs shadow-md transition-colors cursor-pointer"
              >
                Verify Despair & Continue
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: ABSURD PASSWORD POLICY */
          <form onSubmit={handleSubmitPassword} className="p-4 sm:p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-900 space-y-1">
              <p className="font-bold text-amber-950 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-600" />
                Flopkart High-Paranoia Password Policy
              </p>
              <p className="text-[11px] text-amber-800">
                Password must contain at least one ancient Egyptian hieroglyphic, a secret, and a valid coordinate in the Bermuda Triangle.
              </p>
            </div>

            {passwordError && (
              <div className="bg-red-50 border border-red-300 text-red-800 text-xs p-3 rounded flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{passwordError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Flopkart Registered Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-800 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Complex Password
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(null);
                }}
                placeholder="e.g. MyDeepestSecret_𓆣_28.5N, 70.2W"
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-800 outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Hieroglyphic Virtual Keyboard */}
            <div className="bg-gray-50 border border-gray-200 p-2.5 rounded">
              <p className="text-[11px] font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                <span>Ancient Egyptian Hieroglyphic Quick-Insert:</span>
                <span className="text-[10px] text-gray-400 font-normal">Click to append</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {HIEROGLYPHS.map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPassword((prev) => prev + h)}
                    className="w-8 h-8 rounded bg-white hover:bg-amber-100 border border-gray-300 hover:border-amber-400 text-base flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Requirements Checklist */}
            <div className="space-y-1.5 text-xs bg-gray-50 p-3 rounded border border-gray-200">
              <div className="flex items-center gap-2">
                {hasHieroglyph ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                )}
                <span className={hasHieroglyph ? 'text-green-800 font-medium' : 'text-gray-600'}>
                  Contains at least one ancient Egyptian hieroglyphic (e.g. 𓀀, 𓆣)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasSecret ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                )}
                <span className={hasSecret ? 'text-green-800 font-medium' : 'text-gray-600'}>
                  Contains a deep personal secret (14+ characters or contains "secret"/"fear")
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {hasBermudaCoord ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                  )}
                  <span className={hasBermudaCoord ? 'text-green-800 font-medium' : 'text-gray-600'}>
                    Contains valid coordinates in Bermuda Triangle (18-33°N, 64-81°W)
                  </span>
                </div>
                {!hasBermudaCoord && (
                  <button
                    type="button"
                    onClick={() => setPassword((p) => p + ' 28.5N, 70.2W ')}
                    className="text-[10px] text-blue-600 hover:underline shrink-0 font-semibold cursor-pointer"
                  >
                    + Insert Coord
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('captcha')}
                className="text-xs text-gray-500 hover:underline cursor-pointer"
              >
                ← Back to Captcha
              </button>
              <button
                type="submit"
                className="bg-[#fb641b] hover:bg-orange-600 text-white font-extrabold py-2.5 px-6 rounded text-xs shadow-md transition-colors cursor-pointer"
              >
                Authenticate Despair
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
