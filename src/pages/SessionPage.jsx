import { useMemo, useState } from 'react';
import SocialProofStrip from '../components/SocialProofStrip';
import SoftTimerRing from '../components/SoftTimerRing';
import StarRating from '../components/StarRating';
import { useLearner } from '../context/LearnerContext';
import { buildSessionStack } from '../data/bytes';
import { getByteRating } from '../data/socialProof';
import { fireConfetti } from '../utils/confetti';

function ByteCard({ byte, isLast, onAdvance }) {
  const [quizState, setQuizState] = useState({ selected: null, retried: false });
  const { rating, reviews } = getByteRating(byte.id);

  const header = (
    <>
      <div className="byte-card__header">
        <span className="byte-card__topic">{byte.topic}</span>
        <StarRating rating={rating} reviews={reviews} size="xs" />
      </div>
      <h2 className="byte-card__title">{byte.title}</h2>
    </>
  );

  if (byte.type === 'text') {
    return (
      <div className="byte-card">
        {header}
        <p className="byte-card__body">{byte.body}</p>
        <button type="button" className="byte-card__btn" onClick={onAdvance}>
          Got it →
        </button>
      </div>
    );
  }

  if (byte.type === 'video') {
    return (
      <div className="byte-card">
        {header}
        <div className="byte-card__video">
          <img src={byte.videoThumb} alt="" className="byte-card__thumb" />
          <span className="byte-card__play" aria-hidden="true">▶</span>
        </div>
        <p className="byte-card__body">{byte.body}</p>
        <button type="button" className="byte-card__btn" onClick={onAdvance}>
          Watched →
        </button>
      </div>
    );
  }

  const { question, options, correctIndex } = byte.quiz;
  const { selected, retried } = quizState;
  const isCorrect = selected === correctIndex;
  const showAnswer = selected !== null && (isCorrect || retried);

  const handleSelect = (index) => {
    if (showAnswer && isCorrect) return;
    setQuizState({ selected: index, retried: selected !== null && !isCorrect });
  };

  const handleQuizAdvance = () => {
    if (!showAnswer) return;
    if (!isCorrect && !retried) return;
    onAdvance();
  };

  return (
    <div className="byte-card">
      {header}
      <p className="byte-card__quiz-q">{question}</p>
      <ul className="byte-card__options">
        {options.map((opt, i) => {
          let stateClass = '';
          if (selected !== null) {
            if (i === correctIndex) stateClass = ' byte-card__option--correct';
            else if (i === selected) stateClass = ' byte-card__option--wrong';
          }
          return (
            <li key={opt}>
              <button
                type="button"
                className={`byte-card__option${stateClass}`}
                onClick={() => handleSelect(i)}
                disabled={showAnswer && isCorrect}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {selected !== null && !isCorrect && !retried && (
        <p className="byte-card__feedback byte-card__feedback--wrong">Not quite — try once more</p>
      )}
      {showAnswer && (
        <p
          className={`byte-card__feedback${
            isCorrect ? ' byte-card__feedback--correct' : ' byte-card__feedback--wrong'
          }`}
        >
          {isCorrect ? 'Correct!' : `Answer: ${options[correctIndex]}`}
        </p>
      )}
      <button
        type="button"
        className="byte-card__btn"
        onClick={handleQuizAdvance}
        disabled={!showAnswer || (!isCorrect && !retried)}
      >
        {isLast ? 'Finish session →' : 'Continue →'}
      </button>
    </div>
  );
}

export default function SessionPage() {
  const { completeSession } = useLearner();
  const stack = useMemo(() => buildSessionStack(), []);
  const [step, setStep] = useState(0);
  const [finishing, setFinishing] = useState(false);

  const current = stack[step];
  const topics = [...new Set(stack.map((b) => b.topic))];

  const handleAdvance = () => {
    if (step < stack.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    setFinishing(true);
    completeSession();
    fireConfetti(2000);
    setTimeout(() => {
      window.location.hash = '#/?celebrate=1';
    }, 1200);
  };

  if (finishing) {
    return (
      <div className="session-page">
        <div className="session-page__finishing">
          <p className="session-page__finishing-title">Session complete!</p>
          <p className="session-page__finishing-sub">Taking you home…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="session-page">
      <SocialProofStrip />

      <header className="session-header">
        <div className="session-header__progress">
          <p className="session-header__step">
            Byte {step + 1} of {stack.length}
          </p>
          <div className="session-header__bar" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={stack.length}>
            {stack.map((_, i) => (
              <span
                key={i}
                className={`session-header__segment${
                  i <= step ? ' session-header__segment--done' : ''
                }`}
              />
            ))}
          </div>
        </div>
        <SoftTimerRing />
      </header>

      <main className="session-main">
        {current && (
          <ByteCard
            key={current.id}
            byte={current}
            isLast={step === stack.length - 1}
            onAdvance={handleAdvance}
          />
        )}
      </main>

      <footer className="session-footer">
        <div className="session-footer__topics">
          {topics.map((t) => (
            <span key={t} className="topic-pill">
              {t}
            </span>
          ))}
        </div>
        <span className="session-footer__hint">Finish all bytes to extend your streak</span>
      </footer>
    </div>
  );
}
