import { useState } from 'react';
import PlatformLogo from '../components/PlatformLogo';
import { formatPrice } from '../data/catalog';
import {
  defaultProfile,
  experienceOptions,
  getSuggestions,
  goalOptions,
  loadProfile,
  saveProfile,
} from '../data/profile';

export default function Profile() {
  const [profile, setProfile] = useState(loadProfile);
  const [saved, setSaved] = useState(false);
  const suggestions = getSuggestions(profile);

  const toggleGoal = (goal) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
    setSaved(false);
  };

  const addTopic = (raw) => {
    const topic = raw.trim();
    if (!topic || profile.topics.includes(topic)) return;
    setProfile((prev) => ({ ...prev, topics: [...prev.topics, topic] }));
    setSaved(false);
  };

  const removeTopic = (topic) => {
    setProfile((prev) => ({
      ...prev,
      topics: prev.topics.filter((t) => t !== topic),
    }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveProfile(profile);
    setSaved(true);
  };

  const handleReset = () => {
    setProfile({ ...defaultProfile });
    saveProfile(defaultProfile);
    setSaved(true);
  };

  return (
    <div className="page-content page-content--narrow">
      <header className="page-header">
        <p className="eyebrow">Profile</p>
        <h1 className="page-header__title">Your background</h1>
        <p className="page-header__sub">
          Tell Cadence about your role and goals to get tailored recommendations.
        </p>
      </header>

      <form className="profile-form" onSubmit={handleSave}>
        <div className="form-field">
          <label htmlFor="role">Role</label>
          <input
            id="role"
            type="text"
            value={profile.role}
            onChange={(e) => {
              setProfile((p) => ({ ...p, role: e.target.value }));
              setSaved(false);
            }}
            placeholder="e.g. Product Designer"
          />
        </div>

        <div className="form-field">
          <label htmlFor="experience">Experience level</label>
          <select
            id="experience"
            value={profile.experience}
            onChange={(e) => {
              setProfile((p) => ({ ...p, experience: e.target.value }));
              setSaved(false);
            }}
          >
            {experienceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <span>Goals</span>
          <div className="chip-select" role="group" aria-label="Learning goals">
            {goalOptions.map((goal) => (
              <button
                key={goal}
                type="button"
                className={`chip-select__btn${
                  profile.goals.includes(goal) ? ' chip-select__btn--active' : ''
                }`}
                onClick={() => toggleGoal(goal)}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="topic-input">Topics of interest</label>
          <input
            id="topic-input"
            type="text"
            placeholder="Add a topic and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTopic(e.target.value);
                e.target.value = '';
              }
            }}
          />
          <div className="chip-select">
            {profile.topics.map((topic) => (
              <button
                key={topic}
                type="button"
                className="chip-select__btn chip-select__btn--active"
                onClick={() => removeTopic(topic)}
                title="Click to remove"
              >
                {topic} ×
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button type="submit" className="btn btn--primary">
            Save profile
          </button>
          <button type="button" className="btn" onClick={handleReset}>
            Reset defaults
          </button>
          {saved && (
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Saved ✓</span>
          )}
        </div>
      </form>

      <section aria-labelledby="suggestions-heading">
        <h2 id="suggestions-heading" className="settings-section__title">
          Suggested for you
        </h2>
        <p className="settings-section__sub">
          Based on your role, goals, and topics.
        </p>

        {suggestions.length > 0 ? (
          <div className="suggestion-grid">
            {suggestions.map((item) => (
              <article key={item.id} className="suggestion-card">
                <div className="result-row__meta">
                  <PlatformLogo platform={item.platform} size={18} />
                  <span style={{ fontSize: 12 }}>{item.platform}</span>
                  {item.validated && (
                    <span className="status-pill status-pill--validated">
                      Validated
                    </span>
                  )}
                </div>
                <h3 className="result-row__title">{item.title}</h3>
                <p className="suggestion-card__reason">{item.reason}</p>
                <span className="status-pill status-pill--price">
                  {formatPrice(item.price)}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>
              Add goals and topics above, then save to see personalized suggestions.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
