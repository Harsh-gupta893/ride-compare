/* CabCompare (static) - Shared logic for signup/login/dashboard */

const STORAGE_USERS = "cabcompare_users";
const STORAGE_USER = "cabcompare_user";
const GEOAPIFY_KEY = "f85a61cd8bf74bada3ebe6f130617ea7";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USER));
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(STORAGE_USER);
}

function isPasswordValid(pwd) {
  const hasMinLength = pwd.length >= 8;
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasLowercase = /[a-z]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
  return hasMinLength && hasUppercase && hasLowercase && hasSpecial;
}

function showError(el, message) {
  if (!el) return;
  el.textContent = message;
  el.style.display = message ? "block" : "none";
}

function createToast(message) {
  const existing = document.getElementById("toast-container");
  if (!existing) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  existing.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

function signup(name, email, password) {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return false;
  }
  users.push({ name, email, password: btoa(password) });
  saveUsers(users);
  setCurrentUser({ name, email });
  return true;
}

function login(email, password) {
  const users = getUsers();
  const found = users.find((u) => u.email === email && u.password === btoa(password));
  if (!found) return false;
  setCurrentUser({ name: found.name, email: found.email });
  return true;
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

function logout() {
  clearCurrentUser();
  window.location.href = "login.html";
}

function initSignup() {
  const form = document.getElementById("signupForm");
  const errorEl = document.getElementById("error");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showError(errorEl, "");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
      showError(errorEl, "Please fill all fields");
      return;
    }

    if (!isPasswordValid(password)) {
      showError(errorEl, "Password must be at least 8 characters and include uppercase, lowercase, and a special character.");
      return;
    }

    const success = signup(name, email, password);
    if (success) {
      window.location.href = "index.html";
    } else {
      showError(errorEl, "Email already exists");
    }
  });
}

function initLogin() {
  const form = document.getElementById("loginForm");
  const errorEl = document.getElementById("error");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showError(errorEl, "");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      showError(errorEl, "Please fill all fields");
      return;
    }

    const success = login(email, password);
    if (success) {
      window.location.href = "index.html";
    } else {
      showError(errorEl, "Invalid credentials");
    }
  });
}

function initDashboard() {
  const user = requireAuth();
  if (!user) return;

  const userNameEl = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");
  const compareBtn = document.getElementById("compareBtn");
  const pickupEl = document.getElementById("pickup");
  const dropEl = document.getElementById("drop");
  const errorEl = document.getElementById("compareError");
  const resultsEl = document.getElementById("results");
  const loadingEl = document.getElementById("loading");
  const featuresSection = document.getElementById("featuresSection");

  if (userNameEl) {
    userNameEl.textContent = user.name;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
    });
  }

  const setLoading = (isLoading) => {
    if (!loadingEl) return;
    loadingEl.style.display = isLoading ? "block" : "none";
  };

  const setError = (message) => {
    showError(errorEl, message);
  };

  const setResults = (compareResult) => {
    if (!resultsEl) return;

    if (!compareResult) {
      resultsEl.innerHTML = "";
      if (featuresSection) featuresSection.style.display = "block";
      return;
    }

    if (featuresSection) featuresSection.style.display = "none";

    const cheapest = compareResult.results.reduce((a, b) => (a.price < b.price ? a : b));

    const cardsHtml = compareResult.results
      .map((ride) => {
        const isCheapest = ride.name === cheapest.name;
        return `
          <article class="result-card ${isCheapest ? "result-card--highlight" : ""}">
            ${
              isCheapest
                ? `<div class="result-card__badge">✨ Cheapest</div>`
                : ""
            }
            <header class="result-card__header">
              <span class="result-card__icon">${ride.icon}</span>
              <div>
                <p class="result-card__title">${ride.name}</p>
                <p class="result-card__subtitle">${ride.brand}</p>
              </div>
            </header>
            <div class="result-card__price">
              <span class="result-card__amount">₹${ride.price}</span>
              <span class="result-card__estimate">est.</span>
            </div>
            <a
              href="${ride.link}"
              target="_blank"
              rel="noopener noreferrer"
              class="button button--primary button--block"
            >
              Book Ride
            </a>
          </article>
        `;
      })
      .join("");

    resultsEl.innerHTML = `
      <section class="results">
        <div class="results__summary">
          <div class="results__summary-left">
            <div class="results__summary-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p class="results__distance">${compareResult.distance} km</p>
              <p class="results__time">≈ ${compareResult.time} mins drive</p>
            </div>
          </div>
          ${
            compareResult.surge > 1
              ? `<span class="surge">⚡ ${compareResult.surge}x surge pricing</span>`
              : ""
          }
        </div>
        <div class="results__grid">
          ${cardsHtml}
        </div>
      </section>
    `;
  };

  const comparePrices = async () => {
    const pickup = pickupEl?.value.trim() ?? "";
    const drop = dropEl?.value.trim() ?? "";
    if (!pickup || !drop) {
      setError("Please enter both locations");
      return;
    }

    setError("");
    setLoading(true);
    setResults(null);

    try {
      const geoUrl = (addr) =>
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addr)}&apiKey=${GEOAPIFY_KEY}`;

      const [resP, resD] = await Promise.all([fetch(geoUrl(pickup)), fetch(geoUrl(drop))]);
      const [dataP, dataD] = await Promise.all([resP.json(), resD.json()]);

      if (!dataP.features?.length || !dataD.features?.length) {
        setError("Could not find one or both locations. Try being more specific.");
        setLoading(false);
        return;
      }

      const pCoord = dataP.features[0].geometry.coordinates;
      const dCoord = dataD.features[0].geometry.coordinates;

      const routeUrl = `https://api.geoapify.com/v1/routing?waypoints=${pCoord[1]},${pCoord[0]}|${dCoord[1]},${dCoord[0]}&mode=drive&apiKey=${GEOAPIFY_KEY}`;
      const routeRes = await fetch(routeUrl);
      const routeData = await routeRes.json();

      if (!routeData.features?.length) {
        setError("Could not calculate route between these locations.");
        setLoading(false);
        return;
      }

      const distanceKm = routeData.features[0].properties.distance / 1000;
      const timeMin = Math.round(routeData.features[0].properties.time / 60);

      document.cookie = "uber_session=1773249917337|consent:true; path=/";

      const hour = new Date().getHours();
      const isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
      const isLateNight = hour >= 22 || hour <= 5;
      const surgeFactor = isPeak ? 1.4 : isLateNight ? 1.25 : 1.0;

      const calcPrice = (base, perKm, perMin, bookingFee, minFare) => {
        const raw = (base + perKm * distanceKm + perMin * timeMin + bookingFee) * surgeFactor;
        return Math.round(Math.max(raw, minFare));
      };

      const results = [
        { name: "Uber Go", price: calcPrice(50, 12, 2, 25, 80), link: "https://m.uber.com/ul/?action=setPickup", icon: "🚗", brand: "uber" },
        { name: "Uber Premier", price: calcPrice(80, 16, 3, 30, 150), link: "https://m.uber.com/ul/?action=setPickup", icon: "🚘", brand: "uber" },
        { name: "Ola Mini", price: calcPrice(45, 11, 1.5, 20, 70), link: "https://book.olacabs.com/", icon: "🚕", brand: "ola" },
        { name: "Ola Prime", price: calcPrice(70, 14, 2.5, 25, 120), link: "https://book.olacabs.com/", icon: "🚖", brand: "ola" },
        { name: "Rapido Bike", price: calcPrice(15, 5, 1, 10, 30), link: "https://rapido.bike/", icon: "🏍️", brand: "rapido" },
        { name: "Rapido Auto", price: calcPrice(30, 9, 1.5, 15, 50), link: "https://rapido.bike/", icon: "🛺", brand: "rapido" },
      ];

      setResults({ distance: distanceKm.toFixed(1), time: timeMin, results, surge: surgeFactor });
    } catch (err) {
      setError("Error fetching prices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (compareBtn) {
    compareBtn.addEventListener("click", comparePrices);
  }
}

window.CabCompare = {
  initSignup,
  initLogin,
  initDashboard,
  logout,
};
