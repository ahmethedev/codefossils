import { useEffect, useRef, useCallback } from 'react';
import { CATEGORIES, timeAgo, scoreColor, scoreGlowColor } from '../utils/helpers';

export default function ReelsView({ repos, loadMore, hasMore, loadingMore, onClose }) {
  const containerRef = useRef(null);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Infinite scroll inside reels container
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || loadingMore || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - window.innerHeight) {
      loadMore();
    }
  }, [loadMore, hasMore, loadingMore]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="reels-overlay">
      <button className="reels-close" onClick={onClose} aria-label="Close Reels">
        {"\u2715"}
      </button>

      <div className="reels-container" ref={containerRef}>
        {repos.map((repo, i) => (
          <ReelSlide key={repo.id} repo={repo} index={i} />
        ))}

        {loadingMore && (
          <div className="reels-slide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 40, height: 40,
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: '#818cf8',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}
      </div>
    </div>
  );
}

function ReelSlide({ repo, index }) {
  const cat = CATEGORIES.find(c => c.id === repo.category) || CATEGORIES[7];
  const score = repo.idea_score;
  const color = scoreColor(score);
  const glowColor = scoreGlowColor(score);
  const pushed = timeAgo(repo.pushed_at);
  const lang = repo.language;

  return (
    <div className="reels-slide" style={{ animationDelay: `${index * 50}ms` }}>
      {/* Background gradient accent */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 20%, ${glowColor}12 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      <div className="reels-slide-content">
        {/* Category */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20, padding: '6px 14px',
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 18 }}>{cat.icon}</span>
          <span style={{
            fontSize: 12, color: 'rgba(255,255,255,0.7)',
            fontFamily: "'IBM Plex Mono', monospace",
            textTransform: 'uppercase', letterSpacing: 1,
          }}>{cat.label}</span>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 700, color: '#ffffff',
          margin: '0 0 12px', lineHeight: 1.2,
          textShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}>
          {repo.name.replace(/[-_]/g, ' ')}
        </h2>

        {/* Description */}
        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 'clamp(14px, 2.5vw, 17px)',
          color: 'rgba(255,255,255,0.75)',
          margin: '0 0 24px', lineHeight: 1.6,
          maxWidth: 520,
        }}>
          {repo.description || 'No description \u2014 an ancient fossil, waiting to be excavated.'}
        </p>

        {/* Score indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 24,
        }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: '50%',
            background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 20px ${glowColor}40`,
          }}>
            <div style={{
              width: 38, height: 38,
              borderRadius: '50%',
              background: '#1a1a2e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color,
              fontFamily: "'IBM Plex Mono', monospace",
            }}>
              {score}
            </div>
          </div>
          <div>
            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.5)',
              fontFamily: "'IBM Plex Mono', monospace",
              textTransform: 'uppercase', letterSpacing: 1,
            }}>Idea Score</div>
            <div style={{
              fontSize: 13, color: 'rgba(255,255,255,0.8)',
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}>
              {score >= 70 ? 'High potential' : score >= 40 ? 'Worth exploring' : 'Hidden gem'}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 20, marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          {[
            { icon: '\u2605', label: 'Stars', value: repo.stargazers_count },
            { icon: '\u2442', label: 'Forks', value: repo.forks_count },
            ...(lang ? [{ icon: '\u25CF', label: 'Language', value: lang }] : []),
            { icon: '\u2620', label: 'Last seen', value: pushed },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '10px 16px',
              minWidth: 80,
            }}>
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.45)',
                fontFamily: "'IBM Plex Mono', monospace",
                marginBottom: 4,
              }}>{s.icon} {s.label}</div>
              <div style={{
                fontSize: 16, color: '#fff',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
              }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Topics */}
        {(repo.topics || []).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            {repo.topics.slice(0, 6).map(t => (
              <span key={t} style={{
                fontSize: 11, color: 'rgba(255,255,255,0.7)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6, padding: '3px 10px',
                fontFamily: "'IBM Plex Mono', monospace",
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* GitHub button */}
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff', textDecoration: 'none',
            fontSize: 14, fontWeight: 600,
            fontFamily: "'IBM Plex Sans', sans-serif",
            transition: 'opacity 0.2s, transform 0.2s',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          View on GitHub {"\u2192"}
        </a>
      </div>

      {/* Scroll hint on first slide */}
      {index === 0 && (
        <div className="reels-scroll-hint">
          <span style={{ fontSize: 18, animation: 'float 2s infinite' }}>{"\u2193"}</span>
          <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>Scroll to explore</span>
        </div>
      )}
    </div>
  );
}
