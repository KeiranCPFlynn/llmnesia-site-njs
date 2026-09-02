'use client';

import { useEffect } from 'react';
import {
  CHROME_WEB_STORE_URL,
  EDGE_ADDONS_URL,
  installStoreForUserAgent
} from '../../lib/site';
import { trackEvent } from '../../lib/analytics';

export default function SiteBehavior() {
  useEffect(() => {
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('primary-nav');
    const yearNode = document.getElementById('year');
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-form-message');
    const contactSubmit = document.getElementById('contact-submit');
    const revealNodes = Array.from(document.querySelectorAll('[data-reveal], [data-reveal-stagger]'));
    const kineticPanel = document.querySelector('.kinetic-panel');
    const kineticInput = document.querySelector('[data-kp-input]');
    const kineticInputWrap = document.querySelector('[data-kp-input-wrap]');
    const kineticResults = document.querySelector('[data-kp-results]');
    const kineticCount = document.querySelector('[data-kp-count]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeouts = [];
    let revealObserver = null;

    // Serve Edge users the native Edge Add-ons listing. Chrome remains the
    // server-rendered fallback for crawlers, browsers without JavaScript, and
    // every non-Edge browser. Preserve CTA attribution when swapping stores.
    const { store: installStore, url: installStoreUrl } = installStoreForUserAgent(
      window.navigator.userAgent
    );
    const isDesktopEdge = installStore === 'edge';
    const installLinkSelector = [
      'a[data-install-link]',
      `a[href^="${CHROME_WEB_STORE_URL}"]`,
      `a[href^="${EDGE_ADDONS_URL}"]`
    ].join(',');

    document.querySelectorAll(installLinkSelector).forEach((link) => {
      if (!(link instanceof HTMLAnchorElement)) return;

      try {
        const currentUrl = new URL(link.href);
        const storeUrl = new URL(installStoreUrl);
        currentUrl.searchParams.forEach((value, key) => storeUrl.searchParams.set(key, value));
        link.href = storeUrl.toString();
      } catch {
        link.href = installStoreUrl;
      }

      link.dataset.installLink = '';
      link.dataset.installStore = installStore;
      if (isDesktopEdge && link.dataset.edgeLabel) {
        link.textContent = link.dataset.edgeLabel;
      }
    });

    document.documentElement.classList.add('reveal-ready');

    if (revealNodes.length > 0) {
      if ('IntersectionObserver' in window && !prefersReducedMotion) {
        revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              entry.target.classList.add('is-in');
              revealObserver.unobserve(entry.target);
            });
          },
          { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
        );

        revealNodes.forEach((node) => revealObserver.observe(node));
      } else {
        revealNodes.forEach((node) => node.classList.add('is-in'));
      }
    }

    if (kineticPanel && kineticInput && kineticResults && kineticCount) {
      const setTimer = (callback, delay) => {
        const id = window.setTimeout(callback, delay);
        timeouts.push(id);
        return id;
      };

      const labels = {
        chatgpt: 'ChatGPT',
        claude: 'Claude',
        gemini: 'Gemini',
        perplexity: 'Perplexity',
        deepseek: 'DeepSeek',
        characterai: 'Character.AI'
      };

      const data = [
        {
          query: 'mediterranean diet inflammation',
          rows: [
            {
              platform: 'perplexity',
              title: 'Mediterranean diet effects on chronic inflammation markers',
              snippet: 'Multiple cohorts show a mediterranean diet lowers CRP and other inflammation markers.',
              date: '6 days ago'
            },
            {
              platform: 'chatgpt',
              title: 'Build a mediterranean diet meal plan low in inflammation triggers',
              snippet: 'A mediterranean diet built on olive oil, fish, and greens limits inflammation triggers.',
              date: '2 weeks ago'
            },
            {
              platform: 'claude',
              title: 'Summarise this paper on mediterranean diet and inflammation',
              snippet: 'The paper finds mediterranean diet adherence correlates with reduced systemic inflammation.',
              date: '3 weeks ago'
            },
            {
              platform: 'gemini',
              title: 'Track inflammation markers while shifting to a mediterranean diet',
              snippet: 'Check CRP and ESR before and after twelve weeks on a mediterranean diet to see real inflammation change.',
              date: '1 month ago'
            }
          ]
        },
        {
          query: 'wedding speech for my brother',
          rows: [
            {
              platform: 'chatgpt',
              title: 'Wedding speech for my brother — warm, short, a little funny',
              snippet: 'A wedding speech for your brother lands best when one specific memory does the heavy lifting.',
              date: '2 days ago'
            },
            {
              platform: 'claude',
              title: 'Trim this wedding speech for my brother',
              snippet: 'The wedding speech for my brother is sweet but loses energy in the middle paragraph.',
              date: '6 days ago'
            }
          ]
        },
        {
          query: 'Q3 pricing rationale',
          rows: [
            {
              platform: 'chatgpt',
              title: 'Q3 pricing rationale memo for the board',
              snippet: 'The Q3 pricing rationale leans on retention, not net new ARR.',
              date: '2 days ago'
            },
            {
              platform: 'claude',
              title: 'Pressure-test the Q3 pricing rationale',
              snippet: 'The weakest part of the Q3 pricing rationale is the assumed annual mix.',
              date: '5 days ago'
            },
            {
              platform: 'gemini',
              title: 'Compare Q3 pricing rationale against last year',
              snippet: 'Last year the pricing rationale ignored geographic split — Q3 should fix that.',
              date: '2 weeks ago'
            }
          ]
        },
        {
          query: 'kyoto itinerary 5 days',
          rows: [
            {
              platform: 'chatgpt',
              title: 'Kyoto itinerary 5 days with a side trip to Nara',
              snippet: 'A Kyoto itinerary of 5 days fits Higashiyama, Arashiyama, Fushimi, Nara, and a slow day.',
              date: '3 days ago'
            },
            {
              platform: 'perplexity',
              title: 'Kyoto itinerary 5 days for autumn maple season',
              snippet: 'Time a Kyoto itinerary of 5 days to mid-November for peak maples in the eastern hills.',
              date: '1 week ago'
            },
            {
              platform: 'claude',
              title: 'Cut my Kyoto itinerary from 7 days down to 5',
              snippet: 'A 5-day Kyoto itinerary should drop the far day trip and double up Arashiyama in the morning.',
              date: '3 weeks ago'
            },
            {
              platform: 'gemini',
              title: 'Vegetarian food picks for a Kyoto itinerary of 5 days',
              snippet: 'A Kyoto itinerary of 5 days has strong vegetarian options around Daitoku-ji and Nishiki Market.',
              date: '1 month ago'
            }
          ]
        },
        {
          query: 'interview quotes onboarding friction',
          rows: [
            {
              platform: 'claude',
              title: 'Interview quotes about onboarding friction from week 3',
              snippet: 'Three users described onboarding friction around the first import step.',
              date: '4 days ago'
            },
            {
              platform: 'chatgpt',
              title: 'Cluster these interview quotes by friction theme',
              snippet: 'Group the interview quotes so onboarding friction patterns surface clearly.',
              date: '1 week ago'
            },
            {
              platform: 'perplexity',
              title: 'Onboarding friction benchmarks for browser extensions',
              snippet: 'Typical onboarding friction shows up in install, permission, and first-value moments.',
              date: '3 weeks ago'
            }
          ]
        },
        {
          query: 'useReducer typing',
          rows: [
            {
              platform: 'chatgpt',
              title: 'React useReducer typing pattern',
              snippet: 'Use a discriminated union for the action type, then tighten the reducer return.',
              date: '3 days ago'
            },
            {
              platform: 'claude',
              title: 'Generic useReducer with discriminated unions',
              snippet: 'type State = { ... }; type Action handles the useReducer typing safely.',
              date: '1 week ago'
            },
            {
              platform: 'gemini',
              title: 'When useReducer typing beats useState',
              snippet: 'Reach for useReducer when typed updates depend on prior state.',
              date: '2 weeks ago'
            }
          ]
        }
      ];

      let paused = false;

      const setHasQuery = (value) => {
        if (kineticInputWrap) {
          kineticInputWrap.classList.toggle('has-query', value);
        }
      };

      const escapeHtml = (value) =>
        value
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');

      const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const highlight = (text, query) => {
        const words = query.split(/\s+/).filter((word) => word.length > 1);
        const escapedText = escapeHtml(text);

        if (words.length === 0) {
          return escapedText;
        }

        const matcher = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'gi');
        return escapedText.replace(matcher, '<mark>$1</mark>');
      };

      const renderEmpty = () => {
        kineticResults.innerHTML = '<div class="kp-empty" data-kp-empty>Type to search across your AI history.</div>';
        kineticCount.textContent = '—';
        setHasQuery(false);
      };

      const renderResults = (query, rows) => {
        kineticResults.innerHTML = '';

        rows.forEach((row, index) => {
          const node = document.createElement('div');
          node.className = 'kp-res';
          node.setAttribute('data-p', row.platform);
          node.innerHTML = `
            <div class="kp-title">${highlight(row.title, query)}</div>
            <div class="kp-snippet">${highlight(row.snippet, query)}</div>
            <div class="kp-meta">
              <span class="kp-pill">${labels[row.platform] || row.platform}</span>
              <span class="kp-date">${escapeHtml(row.date)}</span>
            </div>
          `;
          kineticResults.appendChild(node);
          setTimer(() => {
            node.classList.add('on');
          }, 60 + index * 90);
        });

        kineticCount.textContent = `${rows.length} result${rows.length === 1 ? '' : 's'}`;
      };

      const typeQuery = (query, done) => {
        let charIndex = 0;
        kineticInput.textContent = '';

        const step = () => {
          if (paused) {
            setTimer(step, 200);
            return;
          }

          charIndex += 1;
          kineticInput.textContent = query.slice(0, charIndex);

          if (charIndex === 1) {
            setHasQuery(true);
          }

          if (charIndex < query.length) {
            setTimer(step, 38 + Math.random() * 42);
            return;
          }

          done();
        };

        step();
      };

      if (prefersReducedMotion) {
        kineticInput.textContent = data[0].query;
        setHasQuery(true);
        renderResults(data[0].query, data[0].rows);
      } else {
        let queryIndex = 0;

        const onMouseEnter = () => {
          paused = true;
        };

        const onMouseLeave = () => {
          paused = false;
        };

        kineticPanel.addEventListener('mouseenter', onMouseEnter);
        kineticPanel.addEventListener('mouseleave', onMouseLeave);
        kineticPanel.__llmnesiaKineticCleanup = () => {
          kineticPanel.removeEventListener('mouseenter', onMouseEnter);
          kineticPanel.removeEventListener('mouseleave', onMouseLeave);
        };

        const cycle = () => {
          renderEmpty();
          const item = data[queryIndex % data.length];
          queryIndex += 1;
          typeQuery(item.query, () => {
            setTimer(() => {
              renderResults(item.query, item.rows);
            }, 180);
            setTimer(cycle, 5200);
          });
        };

        setTimer(cycle, 700);
      }
    }

    const onNavToggle = () => {
      if (!navToggle || !nav) {
        return;
      }

      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    const onNavClick = (event) => {
      if (!navToggle || !nav) {
        return;
      }

      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.tagName === 'A' && window.matchMedia('(max-width: 900px)').matches) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    };

    const onDocumentClick = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      // Prefix match so UTM-tagged CTA links (…?utm_content=copilot) are caught
      // alongside plain install buttons. platform/placement come from the link's
      // UTM params, defaulting to generic/other for untagged buttons.
      const installLink = target.closest(installLinkSelector);
      if (installLink) {
        let platform = 'generic';
        let placement = 'other';
        let campaign = null;
        let slug = null;
        try {
          const params = new URL(installLink.href).searchParams;
          platform = params.get('utm_content') || platform;
          placement = params.get('utm_medium') || placement;
          campaign = params.get('utm_campaign') || null;
          slug = params.get('utm_term') || null;
        } catch {
          // Malformed href — fall back to defaults.
        }
        const store = installLink.getAttribute('data-install-store') || installStore;
        trackEvent('install_click', { platform, placement, store });

        const ctaEl = installLink.closest('[data-cta-placement]');
        const ctaPlacement = ctaEl ? ctaEl.getAttribute('data-cta-placement') : 'other';

        // New canonical article-CTA event carrying the intent family and the
        // above/below-fold position. Fires alongside (does not replace) the
        // existing events so current funnels keep working.
        if (ctaEl) {
          const position = ctaPlacement === 'inline' ? 'intro' : 'foot';
          const family = ctaEl.getAttribute('data-cta-family') || 'unknown';
          const ctaSlug = slug || ctaEl.getAttribute('data-cta-slug') || null;
          trackEvent('cta_install_click', {
            family,
            position,
            platform,
            store,
            ...(ctaSlug && { slug: ctaSlug })
          });
        }

        if (campaign === 'blog_install_cta' && slug) {
          trackEvent('blog_install_cta_clicked', { slug, placement: ctaPlacement, store });
        }
        return;
      }

      const trackedLink = target.closest('a[data-analytics]');
      if (trackedLink) {
        const eventName = trackedLink.getAttribute('data-analytics');
        if (eventName) {
          const platform = trackedLink.getAttribute('data-analytics-platform');
          const slug = trackedLink.getAttribute('data-analytics-slug');
          trackEvent(eventName, {
            ...(platform && { platform }),
            ...(slug && { slug })
          });
        }
      }
    };

    if (navToggle && nav) {
      navToggle.addEventListener('click', onNavToggle);
      nav.addEventListener('click', onNavClick);
    }

    if (yearNode) {
      yearNode.textContent = String(new Date().getFullYear());
    }

    document.addEventListener('click', onDocumentClick);

    // Pre-fill contact form from URL query params (e.g. from extension report button)
    if (contactForm) {
      const params = new URLSearchParams(window.location.search);
      const prefillMessage = params.get('message');
      const prefillSubject = params.get('subject');

      if (prefillMessage) {
        const textarea = document.getElementById('contact-message');
        if (textarea) {
          textarea.value = prefillMessage;
        }
      }

      if (prefillSubject) {
        const hiddenSubject = contactForm.querySelector('input[name="subject"]');
        if (hiddenSubject) {
          hiddenSubject.value = prefillSubject;
        }
      }

      if (prefillMessage || prefillSubject) {
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    let onContactSubmit = null;

    if (contactForm && contactMessage && contactSubmit) {
      onContactSubmit = async (event) => {
        event.preventDefault();

        contactMessage.textContent = '';
        contactMessage.removeAttribute('data-state');

        if (!(contactForm instanceof HTMLFormElement)) {
          return;
        }

        if (!contactForm.checkValidity()) {
          contactMessage.textContent = 'Please complete all fields.';
          contactMessage.setAttribute('data-state', 'error');
          contactForm.reportValidity();
          return;
        }

        const action = contactForm.getAttribute('action') || '';
        if (!action) {
          contactMessage.textContent = 'Contact form is not configured yet.';
          contactMessage.setAttribute('data-state', 'error');
          return;
        }

        const payload = new FormData(contactForm);
        const honeypot = payload.get('botcheck');
        if (typeof honeypot === 'string' && honeypot.trim() !== '') {
          contactForm.reset();
          contactMessage.textContent = 'Message sent.';
          contactMessage.setAttribute('data-state', 'success');
          return;
        }

        contactSubmit.disabled = true;
        contactSubmit.textContent = 'Sending...';

        try {
          const response = await fetch(action, {
            method: 'POST',
            body: payload,
            headers: {
              Accept: 'application/json'
            }
          });

          let data = null;
          try {
            data = await response.json();
          } catch {
            data = null;
          }

          if (!response.ok || !data || data.success !== true) {
            throw new Error('Request failed');
          }

          contactForm.reset();
          contactMessage.textContent = 'Thanks. Your message has been sent.';
          contactMessage.setAttribute('data-state', 'success');
          trackEvent('contact_submit');
        } catch {
          contactMessage.textContent = 'Could not send your message. Please try again.';
          contactMessage.setAttribute('data-state', 'error');
        } finally {
          contactSubmit.disabled = false;
          contactSubmit.textContent = 'Send message';
        }
      };

      contactForm.addEventListener('submit', onContactSubmit);
    }

    const emailCaptureForm = document.getElementById('email-capture-form');
    const emailCaptureMessage = document.getElementById('email-capture-message');
    const emailCaptureSubmit = document.getElementById('email-capture-submit');
    const emailCaptureFields = document.getElementById('email-capture-fields');
    const emailCaptureSuccess = document.getElementById('email-capture-success');

    let onEmailCaptureSubmit = null;

    if (
      emailCaptureForm &&
      emailCaptureMessage &&
      emailCaptureSubmit &&
      emailCaptureFields &&
      emailCaptureSuccess
    ) {
      onEmailCaptureSubmit = async (event) => {
        event.preventDefault();

        if (!(emailCaptureForm instanceof HTMLFormElement)) return;
        if (!emailCaptureForm.checkValidity()) {
          emailCaptureForm.reportValidity();
          return;
        }

        const payload = new FormData(emailCaptureForm);
        const honeypot = payload.get('botcheck');
        if (typeof honeypot === 'string' && honeypot.trim() !== '') {
          emailCaptureFields.style.display = 'none';
          emailCaptureSuccess.removeAttribute('hidden');
          return;
        }

        emailCaptureSubmit.disabled = true;
        emailCaptureSubmit.textContent = 'Joining...';

        const emailInput = document.getElementById('email-capture-input');
        try {
          const params = new URLSearchParams(window.location.search);
          const leadSource = params.get('lead_source') || 'website_homepage';
          const leadContext = params.get('lead_context') || 'homepage_updates';
          const ecResponse = await fetch('/api/leads', {
            method: 'POST',
            body: JSON.stringify({
              email: emailInput ? emailInput.value.trim() : '',
              source: leadSource,
              context: leadContext,
              captured_at: new Date().toISOString(),
              page_path: window.location.pathname
            }),
            headers: { 'Content-Type': 'application/json' }
          });
          let ecData = null;
          try {
            ecData = await ecResponse.json();
          } catch {
            ecData = null;
          }

          if (!ecResponse.ok || !ecData || ecData.success !== true) {
            throw new Error('failed');
          }

          emailCaptureFields.style.display = 'none';
          emailCaptureSuccess.removeAttribute('hidden');
          trackEvent('email_signup');
        } catch {
          emailCaptureMessage.textContent = 'Something went wrong. Please try again.';
          emailCaptureMessage.setAttribute('data-state', 'error');
          emailCaptureSubmit.disabled = false;
          emailCaptureSubmit.textContent = 'Stay updated';
        }
      };

      emailCaptureForm.addEventListener('submit', onEmailCaptureSubmit);
    }

    // Delegated handler for the mobile-only email capture inside article CTAs.
    // There can be two per page (intro + foot), so this is class-based rather
    // than bound to a single id like the homepage capture above.
    const onCtaEmailCaptureSubmit = async (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.classList.contains('cta-email-capture__form')) {
        return;
      }

      event.preventDefault();

      const wrap = form.closest('.cta-email-capture');
      const cta = form.closest('[data-cta-placement]');
      const message = form.querySelector('.cta-email-capture__msg');
      const submit = form.querySelector('.cta-email-capture__submit');
      const emailInput = form.querySelector('.cta-email-capture__input');
      const lead = wrap ? wrap.querySelector('.cta-email-capture__lead') : null;
      const success = wrap ? wrap.querySelector('.cta-email-capture__success') : null;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const honeypot = new FormData(form).get('botcheck');
      const family = cta ? cta.getAttribute('data-cta-family') || 'unknown' : 'unknown';
      const slug = cta ? cta.getAttribute('data-cta-slug') || '' : '';
      const rawPlacement = cta ? cta.getAttribute('data-cta-placement') : null;
      const position = rawPlacement === 'inline' ? 'intro' : rawPlacement === 'bottom' ? 'foot' : 'other';

      // `emailed` decides which of the two success messages is revealed: the
      // "check your inbox" one only when the install email actually went out,
      // otherwise the fallback that shows the link inline.
      const showSuccess = (emailed) => {
        if (lead) lead.style.display = 'none';
        form.style.display = 'none';
        if (!success) return;

        const result = success.querySelector(
          `[data-capture-result="${emailed ? 'sent' : 'fallback'}"]`
        );
        if (result) result.removeAttribute('hidden');
        success.removeAttribute('hidden');
      };

      if (typeof honeypot === 'string' && honeypot.trim() !== '') {
        // Bots get the sent-copy dead end; nothing was submitted or mailed.
        showSuccess(true);
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Sending...';
      }
      if (message) {
        message.textContent = 'No spam. Just the install link.';
        message.removeAttribute('data-state');
      }

      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          body: JSON.stringify({
            email: emailInput ? emailInput.value.trim() : '',
            source: 'blog_mobile_capture',
            context: slug,
            variant: family,
            captured_at: new Date().toISOString(),
            page_path: window.location.pathname
          }),
          headers: { 'Content-Type': 'application/json' }
        });

        let data = null;
        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok || !data || data.success !== true) {
          throw new Error('failed');
        }

        showSuccess(data.emailed === true);
        trackEvent('mobile_email_capture', {
          family,
          position,
          // Separates captures that kept the "we'll email you" promise from
          // those that fell back to showing the link.
          emailed: data.emailed === true,
          ...(slug && { slug })
        });
      } catch {
        if (message) {
          message.textContent = 'Something went wrong. Please try again.';
          message.setAttribute('data-state', 'error');
        }
        if (submit) {
          submit.disabled = false;
          submit.textContent = 'Email me the link';
        }
      }
    };

    document.addEventListener('submit', onCtaEmailCaptureSubmit);

    return () => {
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('submit', onCtaEmailCaptureSubmit);

      if (navToggle && nav) {
        navToggle.removeEventListener('click', onNavToggle);
        nav.removeEventListener('click', onNavClick);
      }

      if (contactForm && onContactSubmit) {
        contactForm.removeEventListener('submit', onContactSubmit);
      }

      if (emailCaptureForm && onEmailCaptureSubmit) {
        emailCaptureForm.removeEventListener('submit', onEmailCaptureSubmit);
      }

      if (revealObserver) {
        revealObserver.disconnect();
      }

      if (kineticPanel && typeof kineticPanel.__llmnesiaKineticCleanup === 'function') {
        kineticPanel.__llmnesiaKineticCleanup();
      }

      timeouts.forEach((id) => window.clearTimeout(id));
      document.documentElement.classList.remove('reveal-ready');
    };
  }, []);

  return null;
}
