'use client';

import { useEffect } from 'react';
import { CHROME_WEB_STORE_URL } from '../../lib/site';
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
        deepseek: 'DeepSeek'
      };

      const data = [
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
        },
        {
          query: 'subgrid safari',
          rows: [
            {
              platform: 'claude',
              title: 'CSS subgrid Safari support timeline',
              snippet: 'Subgrid landed in Safari 16; iOS shipped support a few months later.',
              date: '5 days ago'
            },
            {
              platform: 'chatgpt',
              title: 'Polyfill subgrid for older Safari',
              snippet: 'Fall back from subgrid to explicit tracks for older Safari versions.',
              date: '3 weeks ago'
            }
          ]
        },
        {
          query: 'rate limit node api',
          rows: [
            {
              platform: 'chatgpt',
              title: 'Rate limit Node API endpoints with Redis',
              snippet: 'A token-bucket rate limit for a Node API can use INCR and EXPIRE.',
              date: '6 days ago'
            },
            {
              platform: 'perplexity',
              title: 'Node API rate limit middleware comparison',
              snippet: 'Compare express-rate-limit, rate-limiter-flexible, and Bottleneck.',
              date: '1 week ago'
            },
            {
              platform: 'claude',
              title: 'Sliding-window rate limit in Node',
              snippet: 'A sliding rate limit in Node avoids fixed-window edge bursts.',
              date: '2 weeks ago'
            },
            {
              platform: 'gemini',
              title: 'Cloudflare WAF rate limit rules for a Node API',
              snippet: 'Configure rate limit thresholds before traffic reaches the Node API.',
              date: '4 weeks ago'
            }
          ]
        },
        {
          query: 'founder update may',
          rows: [
            {
              platform: 'claude',
              title: 'Founder update for May with a calmer tone',
              snippet: 'The May founder update should lead with activation, then explain why.',
              date: '2 days ago'
            },
            {
              platform: 'chatgpt',
              title: 'Tighten this founder update intro',
              snippet: 'For a May founder update, open with the new MAU number.',
              date: '4 days ago'
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

      const installLink = target.closest(`a[href="${CHROME_WEB_STORE_URL}"]`);
      if (installLink) {
        trackEvent('install_click');
        return;
      }

      const trackedLink = target.closest('a[data-analytics]');
      if (trackedLink) {
        const eventName = trackedLink.getAttribute('data-analytics');
        if (eventName) {
          trackEvent(eventName);
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
          const ecResponse = await fetch(
            'https://script.google.com/macros/s/AKfycbxmUkdHDfvKH5818w3WfioWp0ALK3NvrzU_tz_8FXE4PjgyG1rdpoc13vIz18P-PGLo/exec',
            {
              method: 'POST',
              body: JSON.stringify({ email: emailInput ? emailInput.value.trim() : '' }),
              headers: { 'Content-Type': 'text/plain' }
            }
          );
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

    return () => {
      document.removeEventListener('click', onDocumentClick);

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
