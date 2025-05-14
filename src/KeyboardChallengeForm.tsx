import React, { useState, useRef } from 'react';

export interface FormState {
  name: string;
  email: string;
  age: string;
  country: string;
  state: string;
  city: string;
  slider: number;
}

export interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
  country?: string;
  state?: string;
  city?: string;
  slider?: string;
}

interface KeyboardChallengeFormProps {
  onSubmit: (state: FormState) => void;
  submitted: boolean;
}

const initialState: FormState = {
  name: '',
  email: '',
  age: '',
  country: '',
  state: '',
  city: '',
  slider: 50,
};

const data = {
  USA: {
    California: ['San Francisco', 'Los Angeles'],
    Texas: ['Austin', 'Houston'],
  },
  Canada: {
    Ontario: ['Toronto', 'Ottawa'],
    Quebec: ['Montreal', 'Quebec City'],
  },
};

export const KeyboardChallengeForm: React.FC<KeyboardChallengeFormProps> = ({
  onSubmit,
  submitted,
}) => {
  const [state, setState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const errorRegionRef = useRef<HTMLDivElement>(null);

  const countryList = Object.keys(data);
  const stateList = state.country ? Object.keys(data[state.country as keyof typeof data]) : [];
  const cityList = state.country && state.state
    ? (data[state.country as keyof typeof data] as Record<string, string[]>)[state.state as string] || []
    : [];

  function validate(s: FormState): FormErrors {
    const newErrors: FormErrors = {};
    if (!s.name.trim()) newErrors.name = 'Name is required.';
    if (!s.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(s.email)) {
      newErrors.email = 'Email must be valid.';
    }
    if (!s.age.trim()) {
      newErrors.age = 'Age is required.';
    } else {
      const ageNum = Number(s.age);
      if (isNaN(ageNum) || !Number.isInteger(ageNum)) {
        newErrors.age = 'Age must be a valid number.';
      } else if (ageNum < 18 || ageNum > 99) {
        newErrors.age = 'Age must be between 18 and 99.';
      }
    }
    if (!s.country) newErrors.country = 'Country is required.';
    if (!s.state) newErrors.state = 'State/Province is required.';
    if (!s.city) newErrors.city = 'City is required.';
    return newErrors;
  }

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    const newState = { ...state, [key]: value };
    // Reset dependent fields
    if (key === 'country') {
      newState.state = '';
      newState.city = '';
    } else if (key === 'state') {
      newState.city = '';
    }
    setState(newState);
    // Do not validate or set errors here
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate(state);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(state);
    } else {
      // Move focus to first error field
      if (errorRegionRef.current) errorRegionRef.current.focus();
    }
  }

  // Only reset state when the form is first mounted or when modal is opened
  React.useEffect(() => {
    if (!submitted) {
      setState(initialState);
      setErrors({});
    }
  }, [submitted]);

  return !submitted ? (
    <form onSubmit={handleSubmit} className="challenge-form" aria-labelledby="modal-title">
      <div
        ref={errorRegionRef}
        aria-live="assertive"
        aria-atomic="true"
        className="form-errors"
      >
        {Object.values(errors).length > 0 && (
          <ul>
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
        value={state.name}
        onChange={e => handleChange('name', e.target.value)}
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? 'name-error' : undefined}
        autoComplete="off"
      />
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        name="email"
        type="email"
        value={state.email}
        onChange={e => handleChange('email', e.target.value)}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? 'email-error' : undefined}
        autoComplete="off"
      />
      <label htmlFor="age">Age:</label>
      <input
        id="age"
        name="age"
        type="number"
        min={18}
        max={99}
        value={state.age}
        onChange={e => handleChange('age', e.target.value)}
        aria-invalid={!!errors.age}
        aria-describedby={errors.age ? 'age-error' : undefined}
        autoComplete="off"
      />
      <label htmlFor="country-select">Country:</label>
      <select
        id="country-select"
        name="country"
        value={state.country}
        onChange={e => handleChange('country', e.target.value)}
        aria-invalid={!!errors.country}
      >
        <option value="">Select country</option>
        {countryList.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <label htmlFor="state-select">State/Province:</label>
      <select
        id="state-select"
        name="state"
        value={state.state}
        onChange={e => handleChange('state', e.target.value)}
        aria-invalid={!!errors.state}
        disabled={!state.country}
      >
        <option value="">Select state</option>
        {stateList.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <label htmlFor="city-select">City:</label>
      <select
        id="city-select"
        name="city"
        value={state.city}
        onChange={e => handleChange('city', e.target.value)}
        aria-invalid={!!errors.city}
        disabled={!state.state}
      >
        <option value="">Select city</option>
        {cityList.map(ct => (
          <option key={ct} value={ct}>{ct}</option>
        ))}
      </select>
      <label id="slider-label" htmlFor="slider-widget">Satisfaction (1-100):</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1em' }}>
        <input
          id="slider-widget"
          type="range"
          min={0}
          max={100}
          value={state.slider}
          onChange={e => handleChange('slider', Number(e.target.value))}
          style={{
            flex: 1,
            accentColor: 'var(--wave-blue)',
            background: 'linear-gradient(to right, var(--wave-blue) 0%, var(--wave-blue) ' + state.slider + '%, var(--mist-gray) ' + state.slider + '%, var(--mist-gray) 100%)',
            borderRadius: 8,
            height: 6,
            boxShadow: 'none',
            border: 'none',
            transition: 'background 0.2s',
          }}
          aria-valuenow={state.slider}
          aria-valuemin={1}
          aria-valuemax={100}
          aria-labelledby="slider-label"
        />
        <span style={{ minWidth: 40, textAlign: 'right', color: 'var(--wave-blue)', fontWeight: 700 }}>
          {state.slider}
        </span>
      </div>
      <div ref={undefined} aria-live="polite" style={{ minHeight: 24, marginBottom: 8 }}>
        {`Current value: ${state.slider}`}
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <button type="submit">Submit</button>
      </div>
    </form>
  ) : null;
}; 