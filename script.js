(function () {
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");
  var yearNode = document.getElementById("year");
  var contactForm = document.getElementById("contact-form");
  var contactMessage = document.getElementById("contact-form-message");
  var contactSubmit = document.getElementById("contact-submit");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (target.tagName === "A" && window.matchMedia("(max-width: 900px)").matches) {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  if (contactForm && contactMessage && contactSubmit) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      contactMessage.textContent = "";
      contactMessage.removeAttribute("data-state");

      if (!(contactForm instanceof HTMLFormElement)) {
        return;
      }

      if (!contactForm.checkValidity()) {
        contactMessage.textContent = "Please complete all fields.";
        contactMessage.setAttribute("data-state", "error");
        contactForm.reportValidity();
        return;
      }

      var action = contactForm.getAttribute("action") || "";
      if (!action) {
        contactMessage.textContent = "Contact form is not configured yet.";
        contactMessage.setAttribute("data-state", "error");
        return;
      }

      var payload = new FormData(contactForm);
      var honeypot = payload.get("botcheck");
      if (typeof honeypot === "string" && honeypot.trim() !== "") {
        contactForm.reset();
        contactMessage.textContent = "Message sent.";
        contactMessage.setAttribute("data-state", "success");
        return;
      }

      contactSubmit.disabled = true;
      contactSubmit.textContent = "Sending...";

      try {
        var response = await fetch(action, {
          method: "POST",
          body: payload,
          headers: {
            Accept: "application/json"
          }
        });

        var data = null;
        try {
          data = await response.json();
        } catch (parseError) {
          data = null;
        }

        if (!response.ok || !data || data.success !== true) {
          throw new Error("Request failed");
        }

        contactForm.reset();
        contactMessage.textContent = "Thanks. Your message has been sent.";
        contactMessage.setAttribute("data-state", "success");
      } catch (error) {
        contactMessage.textContent = "Could not send your message. Please try again.";
        contactMessage.setAttribute("data-state", "error");
      } finally {
        contactSubmit.disabled = false;
        contactSubmit.textContent = "Send message";
      }
    });
  }
})();
