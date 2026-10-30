import InstallLink from './install-link';

// Phones can't run the extension, so this lets a visitor email themselves the
// install link. Submission is handled by the delegated handler in
// site-behavior.js, and the wrapper only shows below the mobile breakpoint.
export default function ComputerLinkCapture({ lead, utm }) {
  return (
    <div className="inline-install-cta__mobile cta-email-capture">
      <p className="cta-email-capture__lead">{lead}</p>
      <form className="cta-email-capture__form" noValidate>
        <div className="cta-email-capture__row">
          <input
            type="email"
            name="email"
            className="cta-email-capture__input"
            placeholder="you@example.com"
            required
            autoComplete="email"
            aria-label="Email address"
          />
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            className="form-honeypot"
            aria-hidden="true"
          />
          <button type="submit" className="button button-small cta-email-capture__submit">
            Email me the computer link
          </button>
        </div>
        <p className="cta-email-capture__msg" role="status" aria-live="polite">
          No spam. Just the install link.
        </p>
      </form>
      {/* Two outcomes, two messages. The API reports whether the install
          email actually went out; site-behavior.js reveals the matching one
          so the success state never claims a delivery that did not happen. */}
      <div className="cta-email-capture__success" hidden>
        <p className="cta-email-capture__result" data-capture-result="sent" hidden>
          Check your inbox for the computer install link. Open it in Chrome or Edge on your computer.
          The extension doesn’t run on phones or tablets.
        </p>
        <p className="cta-email-capture__result" data-capture-result="fallback" hidden>
          Saved. The email did not go through. The extension doesn’t run on phones or tablets,
          so open this link in Chrome or Edge on a computer:{' '}
          <InstallLink className="cta-email-capture__result-link" utm={utm}>
            Add LLMnesia to Chrome
          </InstallLink>
        </p>
      </div>
    </div>
  );
}
