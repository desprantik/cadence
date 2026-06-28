import courseraIcon from '../assets/icons/coursera.svg';
import skillshareIcon from '../assets/icons/skillshare.svg';
import udemyIcon from '../assets/icons/udemy.svg';
import youtubeIcon from '../assets/icons/youtube.svg';

const icons = {
  Udemy: udemyIcon,
  Coursera: courseraIcon,
  Skillshare: skillshareIcon,
  YouTube: youtubeIcon,
};

const initialsColors = [
  '#5b6ee1',
  '#1f7a4a',
  '#c0392b',
  '#8a6d1a',
  '#6b4c9a',
  '#2a7b8f',
];

function hashName(name) {
  return name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

export default function PlatformLogo({ platform, size = 24 }) {
  const src = icons[platform];

  if (src) {
    return (
      <span className="platform-logo" style={{ width: size, height: size }}>
        <img src={src} alt={`${platform} logo`} width={size} height={size} />
      </span>
    );
  }

  const initial = platform.charAt(0).toUpperCase();
  const color = initialsColors[hashName(platform) % initialsColors.length];

  return (
    <span
      className="platform-logo platform-logo--initial"
      style={{ width: size, height: size, background: color, fontSize: size * 0.45 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
