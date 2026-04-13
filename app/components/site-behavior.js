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
      if (!installLink) {
        return;
      }

      trackEvent('install_click');
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
    };
  }, []);

  return null;
}
