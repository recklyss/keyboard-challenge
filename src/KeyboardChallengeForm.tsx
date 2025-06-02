import { useState, useEffect } from 'react';

// Validation constants
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const AGE_MIN = 18;
const AGE_MAX = 99;

// Form data
const data = {
  USA: {
    California: ['San Francisco', 'Los Angeles'],
    Texas: ['Austin', 'Houston'],
  },
  Canada: {
    Ontario: ['Toronto', 'Ottawa'],
    Quebec: ['Montreal', 'Quebec City'],
  },
} as const;

export interface FormState {
  name: string;
  email: string;
  age: string;
  country: string;
  state: string;
  city: string;
  slider: number;
  agree: boolean;
  contactMethod: string;
  interests: string[];
}

export interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
  country?: string;
  state?: string;
  city?: string;
  slider?: string;
  agree?: string;
  contactMethod?: string;
  interests?: string;
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
  agree: false,
  contactMethod: '',
  interests: [],
};

export const KeyboardChallengeForm: React.FC<KeyboardChallengeFormProps> = ({
  onSubmit,
  submitted,
}) => {
  const [state, setState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const countryList = Object.keys(data);
  const stateList = state.country ? Object.keys(data[state.country as keyof typeof data]) : [];
  const cityList = state.country && state.state
    ? (data[state.country as keyof typeof data] as Record<string, readonly string[]>)[state.state as string] || []
    : [];

  function validate(s: FormState): FormErrors {
    const newErrors: FormErrors = {};
    if (!s.name.trim()) newErrors.name = 'Name is required.';
    if (!s.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(s.email)) {
      newErrors.email = 'Email must be valid.';
    }
    if (!s.age.trim()) {
      newErrors.age = 'Age is required.';
    } else {
      const ageNum = Number(s.age);
      if (isNaN(ageNum) || !Number.isInteger(ageNum)) {
        newErrors.age = 'Age must be a valid number.';
      } else if (ageNum < AGE_MIN || ageNum > AGE_MAX) {
        newErrors.age = `Age must be between ${AGE_MIN} and ${AGE_MAX}.`;
      }
    }
    if (!s.country) newErrors.country = 'Country is required.';
    if (!s.state) newErrors.state = 'State/Province is required.';
    if (!s.city) newErrors.city = 'City is required.';
    if (!s.agree) newErrors.agree = 'You must agree to the terms.';
    if (!s.contactMethod) newErrors.contactMethod = 'Preferred contact method is required.';
    if (!s.interests.length) newErrors.interests = 'Select at least one interest.';
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

  function handleCheckboxGroupChange(option: string) {
    setState(prev => {
      const interests = prev.interests.includes(option)
        ? prev.interests.filter(i => i !== option)
        : [...prev.interests, option];
      return { ...prev, interests };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate(state);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(state);
    } else {
      // Focus on the first field with an error
      const firstErrorField = Object.keys(newErrors)[0];
      const fieldMap: Record<string, string> = {
        name: 'name',
        email: 'email',
        age: 'age',
        country: 'country-select',
        state: 'state-select',
        city: 'city-select',
        contactMethod: 'contactMethod-Email',
        interests: 'interests-Tech',
        agree: 'agree',
      };

      const fieldId = fieldMap[firstErrorField];
      if (fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
          field.focus();
        }
      }
    }
  }

  // Only reset state when the form is first mounted or when modal is opened
  useEffect(() => {
    if (!submitted) {
      setState(initialState);
      setErrors({});
    }
  }, [submitted]);

  return !submitted ? (
    <form onSubmit={handleSubmit} className="challenge-form" aria-labelledby="modal-title" id="keyboard-challenge-form">
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
        className="form-input"
        placeholder="Enter your full name"
      />
      {errors.name && (
        <div id="name-error" className="form-error-text" role="alert" aria-live="polite">
          {errors.name}
        </div>
      )}

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
        className="form-input"
        placeholder="you@example.com"
      />
      {errors.email && (
        <div id="email-error" className="form-error-text" role="alert" aria-live="polite">
          {errors.email}
        </div>
      )}

      <label htmlFor="age">Age:</label>
      <input
        id="age"
        name="age"
        type="number"
        min={AGE_MIN}
        max={AGE_MAX}
        value={state.age}
        onChange={e => handleChange('age', e.target.value)}
        aria-invalid={!!errors.age}
        aria-describedby={errors.age ? 'age-error' : undefined}
        autoComplete="off"
        className="form-input"
        placeholder="18-99"
      />
      {errors.age && (
        <div id="age-error" className="form-error-text" role="alert" aria-live="polite">
          {errors.age}
        </div>
      )}

      <label htmlFor="country-select">Country:</label>
      <select
        id="country-select"
        name="country"
        value={state.country}
        onChange={e => handleChange('country', e.target.value)}
        aria-invalid={!!errors.country}
        aria-describedby={errors.country ? 'country-error' : undefined}
        className="form-select"
      >
        <option value="">Select country</option>
        {countryList.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      {errors.country && (
        <div id="country-error" className="form-error-text" role="alert" aria-live="polite">
          {errors.country}
        </div>
      )}

      <label htmlFor="state-select">State/Province:</label>
      <select
        id="state-select"
        name="state"
        value={state.state}
        onChange={e => handleChange('state', e.target.value)}
        aria-invalid={!!errors.state}
        aria-describedby={errors.state ? 'state-error' : undefined}
        disabled={!state.country}
        className="form-select"
      >
        <option value="">Select state</option>
        {stateList.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {errors.state && (
        <div id="state-error" className="form-error-text" role="alert" aria-live="polite">
          {errors.state}
        </div>
      )}

      <label htmlFor="city-select">City:</label>
      <select
        id="city-select"
        name="city"
        value={state.city}
        onChange={e => handleChange('city', e.target.value)}
        aria-invalid={!!errors.city}
        aria-describedby={errors.city ? 'city-error' : undefined}
        disabled={!state.state}
        className="form-select"
      >
        <option value="">Select city</option>
        {cityList.map(ct => (
          <option key={ct} value={ct}>{ct}</option>
        ))}
      </select>
      {errors.city && (
        <div id="city-error" className="form-error-text" role="alert" aria-live="polite">
          {errors.city}
        </div>
      )}

      <label id="slider-label" htmlFor="slider-widget">Satisfaction (1-100):</label>
      <div className="slider-row">
        <input
          id="slider-widget"
          type="range"
          min={0}
          max={100}
          value={state.slider}
          onChange={e => handleChange('slider', Number(e.target.value))}
          className="form-slider"
          aria-valuenow={state.slider}
          aria-valuemin={1}
          aria-valuemax={100}
          aria-labelledby="slider-label"
        />
        <span className="slider-value">{state.slider}</span>
      </div>

      <fieldset className="form-fieldset">
        <legend className="form-legend">Preferred contact method<span aria-hidden="true" className="required-asterisk">*</span>:</legend>
        <div role="radiogroup" aria-labelledby="contact-method-group-label" className="option-row">
          <label id="contact-method-group-label" className="sr-only">Preferred contact method</label>
          <label className="option-label">
            <input
              id="contactMethod-Email"
              type="radio"
              name="contactMethod"
              value="Email"
              checked={state.contactMethod === 'Email'}
              onChange={() => handleChange('contactMethod', 'Email')}
              aria-invalid={!!errors.contactMethod}
              aria-describedby={errors.contactMethod ? 'contactMethod-error' : undefined}
              className="form-radio"
            />
            Email
          </label>
          <label className="option-label">
            <input
              id="contactMethod-Phone"
              type="radio"
              name="contactMethod"
              value="Phone"
              checked={state.contactMethod === 'Phone'}
              onChange={() => handleChange('contactMethod', 'Phone')}
              aria-invalid={!!errors.contactMethod}
              aria-describedby={errors.contactMethod ? 'contactMethod-error' : undefined}
              className="form-radio"
            />
            Phone
          </label>
        </div>
        {errors.contactMethod && (
          <div id="contactMethod-error" className="form-error-text" role="alert" aria-live="polite">
            {errors.contactMethod}
          </div>
        )}
      </fieldset>

      <fieldset className="form-fieldset">
        <legend className="form-legend">Interests<span aria-hidden="true" className="required-asterisk">*</span>:</legend>
        <div className="option-row">
          <label className="option-label">
            <input
              id="interests-Tech"
              type="checkbox"
              name="interests"
              value="Tech"
              checked={state.interests.includes('Tech')}
              onChange={() => handleCheckboxGroupChange('Tech')}
              aria-invalid={!!errors.interests}
              aria-describedby={errors.interests ? 'interests-error' : undefined}
              className="form-checkbox"
            />
            Tech
          </label>
          <label className="option-label">
            <input
              id="interests-Art"
              type="checkbox"
              name="interests"
              value="Art"
              checked={state.interests.includes('Art')}
              onChange={() => handleCheckboxGroupChange('Art')}
              aria-invalid={!!errors.interests}
              aria-describedby={errors.interests ? 'interests-error' : undefined}
              className="form-checkbox"
            />
            Art
          </label>
          <label className="option-label">
            <input
              id="interests-Sports"
              type="checkbox"
              name="interests"
              value="Sports"
              checked={state.interests.includes('Sports')}
              onChange={() => handleCheckboxGroupChange('Sports')}
              aria-invalid={!!errors.interests}
              aria-describedby={errors.interests ? 'interests-error' : undefined}
              className="form-checkbox"
            />
            Sports
          </label>
        </div>
        {errors.interests && (
          <div id="interests-error" className="form-error-text" role="alert" aria-live="polite">
            {errors.interests}
          </div>
        )}
      </fieldset>

      <div className="agree-row">
        <label htmlFor="agree" className="option-label agree-label">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            checked={state.agree}
            onChange={e => handleChange('agree', e.target.checked)}
            aria-invalid={!!errors.agree}
            aria-describedby={errors.agree ? 'agree-error' : undefined}
            className="form-checkbox"
          />
          I agree to the terms and conditions<span aria-hidden="true" className="required-asterisk">*</span>
        </label>
        {errors.agree && (
          <div id="agree-error" className="form-error-text" role="alert" aria-live="polite">
            {errors.agree}
          </div>
        )}
      </div>
    </form>
  ) : null;
}; 