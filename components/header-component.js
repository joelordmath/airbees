document.addEventListener('DOMContentLoaded', function () {
  // Find the dropdown toggle by ID so it works wherever it's located
  const button = document.getElementById('propertyDropdownButton');
  if (!button) return;

  const btnGroup = button.closest('.btn-group');
  const menu = btnGroup ? btnGroup.querySelector('.dropdown-menu') : null;

  // Fallback toggle when Bootstrap JS is not available
  function fallbackToggle(e) {
    if (typeof bootstrap !== 'undefined') return; // let Bootstrap handle when present
    if (!menu) return;
    e.preventDefault();
    const isOpen = menu.classList.contains('show');
    document.querySelectorAll('.dropdown-menu.show').forEach(function (m) {
      if (m !== menu) m.classList.remove('show');
    });
    if (!isOpen) {
      menu.classList.add('show');
      button.setAttribute('aria-expanded', 'true');
    } else {
      menu.classList.remove('show');
      button.setAttribute('aria-expanded', 'false');
    }
  }

  // Attach fallback toggle
  button.addEventListener('click', fallbackToggle);

  // Close fallback menus when clicking outside
  document.addEventListener('click', function (e) {
    if (typeof bootstrap !== 'undefined') return; // bootstrap handles this
    if (!e.target.closest('.btn-group')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(function (m) {
        m.classList.remove('show');
        const t = m.parentElement.querySelector('.dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Handle selection of items: update button text (location only) and close
  document.addEventListener('click', function (e) {
    const item = e.target.closest('.dropdown-item');
    if (!item) return;

    const location = (item.getAttribute('data-location') || item.textContent.trim()).toLowerCase();
    if (button) {
      // show nice capitalized label on the button
      button.textContent = location.charAt(0).toUpperCase() + location.slice(1);
      button.setAttribute('data-location', location);
    }

    // Update the site brand link to point to the correct Airbnb listing for the selected property
    const brandLink = document.querySelector('.site-brand-link');
    if (brandLink) {
      const hrefMap = {
        'nunez': 'https://www.airbnb.com.ar/h/sweetbees-nunez-quesada',
        'palermo': 'https://www.airbnb.com.ar/h/sweetbees-palermo-santafe'
      };
      if (hrefMap[location]) {
        brandLink.setAttribute('href', hrefMap[location]);
      }
    }

    if (typeof bootstrap !== 'undefined') {
      try {
        const dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(button);
        dropdownInstance.hide();
      } catch (err) {
        // ignore
      }
    } else {
      if (menu) {
        menu.classList.remove('show');
        button.setAttribute('aria-expanded', 'false');
      }
    }
    // allow normal anchor navigation
  });

  // Initialize button data-location and brand href on load if possible
  (function initBrandLink() {
    const current = button.getAttribute('data-location') || button.textContent.trim().toLowerCase();
    if (current) button.setAttribute('data-location', current);
    const brandLink = document.querySelector('.site-brand-link');
    if (brandLink) {
      const hrefMap = {
        'nunez': 'https://www.airbnb.com.ar/h/sweetbees-nunez-quesada',
        'palermo': 'https://www.airbnb.com.ar/h/sweetbees-palermo-santafe'
      };
      if (hrefMap[current]) brandLink.setAttribute('href', hrefMap[current]);
    }
  })();
});