// App.tsx - Keyboard-Only Challenge Main App (React + TypeScript)
import * as React from 'react'
import './App.css'

function App() {
  const [modalOpen, setModalOpen] = React.useState(false)
  const startButtonRef = React.useRef<HTMLButtonElement>(null)
  const modalRef = React.useRef<HTMLDivElement>(null)

  // Step 1 form state
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [age, setAge] = React.useState('')
  const [errors, setErrors] = React.useState<{
    name?: string;
    email?: string;
    age?: string;
    country?: string;
    state?: string;
    city?: string;
    slider?: string;
  }>({})
  const errorRegionRef = React.useRef<HTMLDivElement>(null)

  // Focus trap logic
  React.useEffect(() => {
    if (modalOpen && modalRef.current) {
      const focusableSelectors = [
        'button', 'input', 'select', 'textarea', '[tabindex]:not([tabindex="-1"])'
      ]
      const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
      const firstEl = focusableEls[0]
      const lastEl = focusableEls[focusableEls.length - 1]
      if (firstEl) firstEl.focus()

      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          setModalOpen(false)
        } else if (e.key === 'Tab') {
          if (focusableEls.length === 0) return
          if (e.shiftKey) {
            if (document.activeElement === firstEl) {
              e.preventDefault()
              lastEl.focus()
            }
          } else {
            if (document.activeElement === lastEl) {
              e.preventDefault()
              firstEl.focus()
            }
          }
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [modalOpen])

  // Return focus to start button after modal closes
  React.useEffect(() => {
    if (!modalOpen && startButtonRef.current) {
      startButtonRef.current.focus()
    }
  }, [modalOpen])

  // Validation logic
  function validate() {
    const newErrors: {
      name?: string;
      email?: string;
      age?: string;
      country?: string;
      state?: string;
      city?: string;
      slider?: string;
    } = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Email must be valid.';
    }
    if (!age.trim()) {
      newErrors.age = 'Age is required.';
    } else {
      const ageNum = Number(age);
      if (isNaN(ageNum) || !Number.isInteger(ageNum)) {
        newErrors.age = 'Age must be a valid number.';
      } else if (ageNum < 18 || ageNum > 99) {
        newErrors.age = 'Age must be between 18 and 99.';
      }
    }
    return newErrors;
  }

  // Dropdown and slider state
  const [country, setCountry] = React.useState('');
  const [state, setState] = React.useState('');
  const [city, setCity] = React.useState('');
  const [sliderValue, setSliderValue] = React.useState(50);
  const [sliderConfirmed, setSliderConfirmed] = React.useState(false);
  const sliderLiveRef = React.useRef<HTMLDivElement>(null);

  // Track slider focus for visible outline
  const [sliderFocused, setSliderFocused] = React.useState(false);

  // Hardcoded data
  const data = {
    USA: {
      California: ['San Francisco', 'Los Angeles'],
      Texas: ['Austin', 'Houston']
    },
    Canada: {
      Ontario: ['Toronto', 'Ottawa'],
      Quebec: ['Montreal', 'Quebec City']
    }
  };
  const countryList = Object.keys(data);
  const stateList = country ? Object.keys(data[country as keyof typeof data]) : [];
  const cityList = country && state
    ? (data[country as keyof typeof data] as Record<string, string[]>)[state as string] || []
    : [];

  function handleSliderKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSliderValue(v => Math.max(0, v - 1));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSliderValue(v => Math.min(100, v + 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderValue(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderValue(100);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSliderConfirmed(true);
    }
  }

  // Step 4: Review & Submit
  const [submitted, setSubmitted] = React.useState(false);

  // Confetti state
  const [showConfetti, setShowConfetti] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    // Validate dropdowns
    if (!country) newErrors.country = 'Country is required.';
    if (!state) newErrors.state = 'State/Province is required.';
    if (!city) newErrors.city = 'City is required.';
    // Validate slider
    if (sliderValue < 0 || sliderValue > 100) newErrors.slider = 'Satisfaction must be between 0 and 100.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      setShowConfetti(true);
    } else {
      // Move focus to first error field
      if (newErrors.name && modalRef.current) {
        const el = modalRef.current.querySelector<HTMLInputElement>('input[name="name"]');
        if (el) el.focus();
      } else if (newErrors.email && modalRef.current) {
        const el = modalRef.current.querySelector<HTMLInputElement>('input[name="email"]');
        if (el) el.focus();
      } else if (newErrors.age && modalRef.current) {
        const el = modalRef.current.querySelector<HTMLInputElement>('input[name="age"]');
        if (el) el.focus();
      } else if (newErrors.country && modalRef.current) {
        const el = modalRef.current.querySelector<HTMLDivElement>('#country-select');
        if (el) el.focus();
      } else if (newErrors.state && modalRef.current) {
        const el = modalRef.current.querySelector<HTMLDivElement>('#state-select');
        if (el) el.focus();
      } else if (newErrors.city && modalRef.current) {
        const el = modalRef.current.querySelector<HTMLDivElement>('#city-select');
        if (el) el.focus();
      } else if (newErrors.slider && modalRef.current) {
        const el = modalRef.current.querySelector<HTMLDivElement>('#slider-widget');
        if (el) el.focus();
      }
    }
  }

  function handleCancel() {
    setModalOpen(false);
    setName(''); setEmail(''); setAge(''); setCountry(''); setState(''); setCity(''); setSliderValue(50); setSliderConfirmed(false); setErrors({} as {
      name?: string;
      email?: string;
      age?: string;
      country?: string;
      state?: string;
      city?: string;
      slider?: string;
    });
    setShowConfetti(false);
  }

  // Reset confetti when starting a new challenge
  React.useEffect(() => {
    if (modalOpen) setShowConfetti(false);
  }, [modalOpen]);

  return (
    <div className="app-container">
      <button
        ref={startButtonRef}
        onClick={() => setModalOpen(true)}
        aria-haspopup="dialog"
        aria-controls="keyboard-challenge-modal"
      >
        Start Keyboard Challenge
      </button>
      {modalOpen && (
        <div
          className="modal-backdrop"
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
        >
          <div
            id="keyboard-challenge-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            className="modal-content"
            style={{ background: 'white', maxWidth: 500, margin: '10vh auto', padding: 24, borderRadius: 8, outline: 'none', position: 'relative' }}
          >
            <h2 id="modal-title">Keyboard-Only Challenge</h2>
            <button
              onClick={() => setModalOpen(false)}
              aria-label="Close dialog"
              style={{ position: 'absolute', top: 8, right: 8 }}
            >
              ×
            </button>
            {!submitted && (
              <form onSubmit={handleSubmit} style={{ marginTop: 32 }} aria-labelledby="modal-title">
                <div
                  ref={errorRegionRef}
                  tabIndex={-1}
                  aria-live="assertive"
                  aria-atomic="true"
                  style={{ color: 'red', minHeight: 24, marginBottom: 8 }}
                >
                  {Object.values(errors).length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {Object.values(errors).map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  autoComplete="off"
                  style={{ display: 'block', marginBottom: 16, width: '100%' }}
                />
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  autoComplete="off"
                  style={{ display: 'block', marginBottom: 16, width: '100%' }}
                />
                <label htmlFor="age">Age:</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min={18}
                  max={99}
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  aria-invalid={!!errors.age}
                  aria-describedby={errors.age ? 'age-error' : undefined}
                  autoComplete="off"
                  style={{ display: 'block', marginBottom: 16, width: '100%' }}
                />
                {/* Country Dropdown */}
                <label htmlFor="country-select">Country:</label>
                <select
                  id="country-select"
                  name="country"
                  value={country}
                  onChange={e => {
                    setCountry(e.target.value);
                    setState('');
                    setCity('');
                  }}
                  style={{ display: 'block', marginBottom: 16, width: '100%' }}
                  aria-invalid={!!errors.country}
                >
                  <option value="">Select country</option>
                  {countryList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {/* State Dropdown */}
                <label htmlFor="state-select">State/Province:</label>
                <select
                  id="state-select"
                  name="state"
                  value={state}
                  onChange={e => {
                    setState(e.target.value);
                    setCity('');
                  }}
                  style={{ display: 'block', marginBottom: 16, width: '100%' }}
                  aria-invalid={!!errors.state}
                  disabled={!country}
                >
                  <option value="">Select state</option>
                  {stateList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {/* City Dropdown */}
                <label htmlFor="city-select">City:</label>
                <select
                  id="city-select"
                  name="city"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  style={{ display: 'block', marginBottom: 16, width: '100%' }}
                  aria-invalid={!!errors.city}
                  disabled={!state}
                >
                  <option value="">Select city</option>
                  {cityList.map(ct => (
                    <option key={ct} value={ct}>{ct}</option>
                  ))}
                </select>
                {/* Slider */}
                <label id="slider-label" htmlFor="slider-widget">Satisfaction (0-100):</label>
                <div
                  id="slider-widget"
                  role="slider"
                  tabIndex={0}
                  aria-valuenow={sliderValue}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-labelledby="slider-label"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    padding: 8,
                    marginBottom: 16,
                    width: 300,
                    userSelect: 'none',
                    background: '#fafafa',
                    outline: sliderFocused ? '3px solid var(--flamingo-pink)' : 'none',
                    outlineOffset: sliderFocused ? 2 : undefined
                  }}
                  onKeyDown={handleSliderKeyDown}
                  onClick={() => setSliderConfirmed(false)}
                  onFocus={() => setSliderFocused(true)}
                  onBlur={() => setSliderFocused(false)}
                >
                  <div style={{ flex: 1, marginRight: 12 }}>
                    <div style={{ height: 6, background: '#eee', borderRadius: 3, position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, height: 6, width: `${sliderValue}%`, background: '#007bff', borderRadius: 3 }} />
                    </div>
                  </div>
                  <span style={{ minWidth: 40, textAlign: 'right' }}>{sliderValue}</span>
                </div>
                <div ref={sliderLiveRef} aria-live="polite" style={{ minHeight: 24, marginBottom: 8 }}>
                  {sliderConfirmed ? `Value confirmed: ${sliderValue}` : `Current value: ${sliderValue}`}
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button type="submit">Submit</button>
                  <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            )}
            {submitted && (
              <div style={{ color: 'green', marginTop: 32, position: 'relative', minHeight: 120 }} role="status" aria-live="polite">
                Challenge completed! Thank you for doing the keyboard only challenge!
                {showConfetti && (
                  <svg width="100%" height="120" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
                    {[...Array(30)].map((_, i) => (
                      <circle
                        key={i}
                        cx={Math.random() * 500}
                        cy={Math.random() * 120}
                        r={6 + Math.random() * 4}
                        fill={`hsl(${Math.random() * 360},90%,60%)`}
                        opacity={0.7}
                      />
                    ))}
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
