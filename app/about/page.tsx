import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — The Dispatch',
  description:
    'The Dispatch is an AI-native newsroom that produces real journalism through an autonomous editorial pipeline, enriched with real-time trending intelligence from Virlo.',
};

import { Newspaper, Target, Search, Scale, Construction } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <section className="hero" id="about-hero">
        <div className="hero-badge">
          <span className="badge badge-accent"><Newspaper size={16} style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '4px' }} /> Our Mission</span>
        </div>
        <h1 className="hero-headline">
          News That Earns{' '}
          <span className="hero-headline-highlight">Your Trust</span>
        </h1>
        <p className="hero-deck">
          The Dispatch exists to prove that AI can produce journalism worthy of the
          world&apos;s best newsrooms — transparent, rigorous, and free from the
          commercial pressures that compromise human editorial judgment.
        </p>
      </section>

      <hr className="divider" />

      <section className="section" id="about-content">
        <div style={{ maxWidth: '740px', margin: '0 auto' }}>
          <div className="article-page-body">
            <p>
              <strong style={{ fontFamily: 'var(--font-display)' }}>The Dispatch</strong>{' '}is
              an experiment in AI-native journalism. We believe that the editorial
              standards associated with the world&apos;s great newsrooms — careful
              sourcing, rigorous fact-checking, balanced analysis, and transparent
              methodology — are not inherently human capabilities. They are
              processes. And processes can be automated.
            </p>
            <p>
              Our editorial pipeline monitors 34+ RSS feeds from trusted
              publications across six editorial beats, extracts structured fact
              sheets from source material, synthesizes original reporting in
              professional editorial style, and subjects every article to
              automated quality review before publication. Alongside traditional
              sourcing, we integrate real-time trending intelligence from Virlo
              to surface what the world is actually talking about — giving
              readers both the stories that matter and the context of what&apos;s
              capturing public attention right now. No human touches the
              editorial path.
            </p>
            <p>
              This is not a gimmick. It is a serious attempt to explore whether AI
              can meet the bar that readers expect from trustworthy journalism. We
              publish every article with its complete pipeline record — the sources
              consulted, the verification steps taken, and the quality scores
              achieved — because transparency is not optional when the writer is a
              machine.
            </p>
            <p>
              We cover six beats: Technology, Geopolitics, Climate, Finance, Health,
              and Culture. Each story is selected by editorial-weight algorithms
              that prioritize significance, timeliness, and reader impact — not
              engagement bait, not outrage, not virality.
            </p>
            <p>
              The Dispatch is built for readers who take news seriously. We aim to
              be the first AI newsroom that deserves to be taken seriously in return.
            </p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section className="section section-full section-gray" id="principles">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="section-header">
            <h2 className="section-title">Our Principles</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon-blue"><Target size={24} /></div>
              <h3 className="feature-title">Accuracy First</h3>
              <p className="feature-desc">
                Every factual claim is extracted from source material and scored
                for confidence. Articles are reviewed for accuracy before
                publication.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-green"><Search size={24} /></div>
              <h3 className="feature-title">Radical Transparency</h3>
              <p className="feature-desc">
                Every article includes its full editorial pipeline record. Readers
                can see exactly how each story was produced.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-purple"><Scale size={24} /></div>
              <h3 className="feature-title">Zero Bias Tolerance</h3>
              <p className="feature-desc">
                Automated bias detection catches political lean, framing issues,
                and source imbalance before publication.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-yellow"><Construction size={24} /></div>
              <h3 className="feature-title">Depth Over Speed</h3>
              <p className="feature-desc">
                We prioritize thorough reporting over being first. Context and
                analysis matter more than headlines.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section className="cta-section" id="about-cta">
        <h2 className="cta-title">Ready to Read?</h2>
        <p className="cta-desc">
          See AI journalism that meets the bar of the world&apos;s best newsrooms.
        </p>
        <a href="/latest" className="cta-btn">
          Start Reading
        </a>
      </section>
    </>
  );
}
