// Northfold Outfitters demo store. Fictional, for Acoustic Connect signal training only.
// Cart, account and orders live in localStorage. Nothing is sent anywhere.
// Pushes GA4-style ecommerce events to window.dataLayer, like a typical retail site.
(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];
  var catalog = window.NF_CATALOG || [];
  var categories = window.NF_CATEGORIES || {};
  var CURRENCY = "USD";

  // ---------- storage ----------
  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ }
  }
  function getCart() { return read("nf_cart", []); }
  function setCart(c) { write("nf_cart", c); updateCartCount(); }
  function getUser() { return read("nf_user", null); }

  // ---------- helpers ----------
  function qs(name) { return new URLSearchParams(location.search).get(name); }
  function money(n) { return "$" + Number(n).toFixed(2); }
  function byId(id) { return catalog.find(function (p) { return p.id === id; }); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function image(p, size) {
    var initials = p.name.split(" ").slice(0, 2).map(function (w) { return w[0]; }).join("");
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 100 100">' +
      '<rect width="100" height="100" fill="' + p.hex + '"/>' +
      '<text x="50" y="58" font-family="Georgia,serif" font-size="26" fill="#fff" text-anchor="middle">' + initials + "</text></svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function gaItem(p, extra) {
    var item = { item_id: p.id, item_name: p.name, item_brand: p.brand, item_category: categories[p.category], price: p.price, quantity: 1 };
    return Object.assign(item, extra || {});
  }
  function push(event, data) {
    if (data && data.ecommerce) window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push(Object.assign({ event: event }, data || {}));
  }
  function cartTotals(cart) {
    var subtotal = cart.reduce(function (s, l) { return s + l.price * l.quantity; }, 0);
    var shipping = subtotal > 0 && subtotal < 100 ? 7.95 : 0;
    var tax = Math.round(subtotal * 0.08 * 100) / 100;
    return { subtotal: subtotal, shipping: shipping, tax: tax, total: subtotal + shipping + tax };
  }

  // ---------- layout ----------
  function renderChrome() {
    var user = getUser();
    var header = document.getElementById("site-header");
    if (header) {
      header.innerHTML =
        '<div class="promo">Free shipping on orders over $100. Demo store, no real orders.</div>' +
        '<div class="bar">' +
        '<a class="logo" href="index.html">Northfold<span>Outfitters</span></a>' +
        '<nav class="cats">' + Object.keys(categories).map(function (k) {
          return '<a href="category.html?c=' + k + '">' + categories[k] + "</a>";
        }).join("") + "</nav>" +
        '<form class="search-form" id="search-form" action="search.html" method="get" role="search">' +
        '<input type="search" name="q" id="search-input" placeholder="Search products" aria-label="Search products">' +
        '<button type="submit" class="search-button">Search</button></form>' +
        '<div class="util">' +
        (user
          ? '<a href="account.html" class="account-link" data-user-email="' + esc(user.email) + '">Hi, ' + esc(user.firstName || "there") + "</a>"
          : '<a href="login.html" class="account-link">Sign in</a>') +
        '<a href="cart.html" class="cart-link">Bag (<span id="cart-count">0</span>)</a>' +
        "</div></div>";
    }
    var footer = document.getElementById("site-footer");
    if (footer) {
      footer.innerHTML = '<p>Northfold Outfitters is a fictional store built for Acoustic Connect training. No real products, payments or orders.</p>';
    }
    updateCartCount();
  }
  function updateCartCount() {
    var el = document.getElementById("cart-count");
    if (el) el.textContent = getCart().reduce(function (s, l) { return s + l.quantity; }, 0);
  }
  function card(p) {
    return '<a class="product-card" href="product.html?id=' + p.id + '" data-product-id="' + p.id + '">' +
      '<img src="' + image(p, 400) + '" alt="' + esc(p.name) + '">' +
      '<span class="product-card-name">' + esc(p.name) + "</span>" +
      '<span class="product-card-price">' + money(p.price) + "</span></a>";
  }
  function grid(el, list, listName) {
    el.innerHTML = list.length ? list.map(card).join("") : '<p class="empty">No products found.</p>';
    if (list.length) {
      push("view_item_list", { ecommerce: { item_list_name: listName, items: list.map(function (p, i) { return gaItem(p, { index: i }); }) } });
    }
  }

  // ---------- pages ----------
  var pages = {
    home: function () {
      grid(document.getElementById("featured"), catalog.slice(0, 8), "Home featured");
    },

    category: function () {
      var c = qs("c");
      var name = categories[c] || "All products";
      document.getElementById("category-title").textContent = name;
      document.title = name + " | Northfold Outfitters";
      grid(document.getElementById("category-grid"), catalog.filter(function (p) { return !c || p.category === c; }), name);
    },

    product: function () {
      var p = byId(qs("id")) || catalog[0];
      document.title = p.name + " | Northfold Outfitters";
      var root = document.getElementById("product");
      root.setAttribute("data-product-id", p.id);
      root.setAttribute("data-sku", p.sku);
      root.innerHTML =
        '<div class="pdp-media"><img id="product-image" src="' + image(p, 800) + '" alt="' + esc(p.name) + '"></div>' +
        '<div class="pdp-info">' +
        '<p class="breadcrumb"><a href="index.html">Home</a> / <a href="category.html?c=' + p.category + '">' + categories[p.category] + "</a></p>" +
        '<h1 class="product-title" itemprop="name">' + esc(p.name) + "</h1>" +
        '<p class="product-sku">Item # <span class="sku-value">' + p.sku + "</span></p>" +
        '<p class="product-price" data-price="' + p.price + '">' + money(p.price) + "</p>" +
        '<p class="product-description">' + esc(p.description) + "</p>" +
        '<form id="add-to-cart-form" class="pdp-form">' +
        '<fieldset class="option-color"><legend>Color: <span id="selected-color">' + p.colors[0] + "</span></legend>" +
        p.colors.map(function (c, i) {
          return '<label class="swatch"><input type="radio" name="color" value="' + c + '"' + (i === 0 ? " checked" : "") + "><span>" + c + "</span></label>";
        }).join("") + "</fieldset>" +
        '<label class="option-size">Size <select name="size" id="size-select"><option value="">Select a size</option>' +
        p.sizes.map(function (s) { return '<option value="' + s + '">' + s + "</option>"; }).join("") + "</select></label>" +
        '<label class="option-qty">Quantity <input type="number" name="quantity" id="quantity" min="1" max="10" value="1"></label>' +
        '<p class="form-error" id="pdp-error" hidden>Please select a size.</p>' +
        '<button type="submit" class="btn btn-primary add-to-cart-button" id="add-to-cart" data-product-id="' + p.id + '">Add to bag</button>' +
        "</form>" +
        '<p class="added-msg" id="added-msg" hidden>Added to your bag. <a href="cart.html">View bag</a></p>' +
        '<div class="pdp-video"><h2>See it styled</h2>' +
        '<video id="product-video" controls preload="none" width="100%" poster="' + image(p, 640) + '">' +
        '<source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4"></video></div>' +
        "</div>";

      var ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org", "@type": "Product", sku: p.sku, productID: p.id, name: p.name,
        brand: { "@type": "Brand", name: p.brand }, description: p.description, category: categories[p.category],
        offers: { "@type": "Offer", price: p.price.toFixed(2), priceCurrency: CURRENCY, availability: "https://schema.org/InStock" }
      });
      document.head.appendChild(ld);

      push("view_item", { ecommerce: { currency: CURRENCY, value: p.price, items: [gaItem(p)] } });

      var form = document.getElementById("add-to-cart-form");
      form.addEventListener("change", function (e) {
        if (e.target.name === "color") document.getElementById("selected-color").textContent = e.target.value;
        push("select_item_option", { option_name: e.target.name, option_value: e.target.value, item_id: p.id });
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var color = form.color.value, size = form.size.value, qty = Math.max(1, parseInt(form.quantity.value, 10) || 1);
        var err = document.getElementById("pdp-error");
        if (!size) { err.hidden = false; return; }
        err.hidden = true;
        var cart = getCart();
        var line = cart.find(function (l) { return l.id === p.id && l.color === color && l.size === size; });
        if (line) line.quantity += qty;
        else cart.push({ id: p.id, sku: p.sku, name: p.name, price: p.price, color: color, size: size, quantity: qty });
        setCart(cart);
        document.getElementById("added-msg").hidden = false;
        push("add_to_cart", { ecommerce: { currency: CURRENCY, value: p.price * qty, items: [gaItem(p, { item_variant: color + " / " + size, quantity: qty })] } });
      });
    },

    search: function () {
      var q = (qs("q") || "").trim();
      var input = document.getElementById("search-input");
      if (input) input.value = q;
      var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      var results = catalog.filter(function (p) {
        var hay = (p.name + " " + p.description + " " + categories[p.category] + " " + p.colors.join(" ")).toLowerCase();
        return terms.length && terms.every(function (t) { return hay.indexOf(t) !== -1; });
      });
      document.getElementById("search-title").textContent = q ? 'Results for "' + q + '"' : "Search";
      document.getElementById("search-count").textContent = results.length + (results.length === 1 ? " result" : " results");
      document.getElementById("search-count").setAttribute("data-result-count", results.length);
      grid(document.getElementById("search-results"), results, "Search results");
      if (q) push("search", { search_term: q, search_results: results.length });
    },

    cart: function () {
      var root = document.getElementById("cart");
      function draw() {
        var cart = getCart();
        if (!cart.length) { root.innerHTML = '<p class="empty">Your bag is empty. <a href="index.html">Keep shopping</a></p>'; return; }
        var t = cartTotals(cart);
        root.innerHTML =
          '<table class="cart-table"><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th></th></tr></thead><tbody>' +
          cart.map(function (l, i) {
            return '<tr class="cart-line" data-product-id="' + l.id + '"><td><a href="product.html?id=' + l.id + '">' + esc(l.name) + "</a><br><small>" + esc(l.color) + " / " + esc(l.size) + "</small></td>" +
              '<td><input type="number" min="1" max="10" value="' + l.quantity + '" data-line="' + i + '" class="qty-input" aria-label="Quantity"></td>' +
              "<td>" + money(l.price * l.quantity) + '</td><td><button class="link remove" data-line="' + i + '">Remove</button></td></tr>';
          }).join("") + "</tbody></table>" +
          '<div class="totals"><p>Subtotal <span>' + money(t.subtotal) + "</span></p><p>Shipping <span>" + money(t.shipping) + "</span></p>" +
          "<p>Tax <span>" + money(t.tax) + '</span></p><p class="grand">Total <span id="cart-total">' + money(t.total) + "</span></p>" +
          '<a class="btn btn-primary" href="checkout.html" id="checkout-button">Check out</a></div>';
      }
      root.addEventListener("change", function (e) {
        if (!e.target.classList.contains("qty-input")) return;
        var cart = getCart();
        cart[+e.target.dataset.line].quantity = Math.max(1, parseInt(e.target.value, 10) || 1);
        setCart(cart); draw();
      });
      root.addEventListener("click", function (e) {
        if (!e.target.classList.contains("remove")) return;
        var cart = getCart();
        var removed = cart.splice(+e.target.dataset.line, 1)[0];
        setCart(cart); draw();
        push("remove_from_cart", { ecommerce: { currency: CURRENCY, value: removed.price * removed.quantity, items: [{ item_id: removed.id, item_name: removed.name, price: removed.price, quantity: removed.quantity }] } });
      });
      draw();
      var cart = getCart();
      if (cart.length) push("view_cart", { ecommerce: { currency: CURRENCY, value: cartTotals(cart).total, items: cart.map(lineItem) } });
    },

    checkout: function () {
      var cart = getCart();
      if (!cart.length) { location.href = "cart.html"; return; }
      var t = cartTotals(cart);
      var user = getUser();
      document.getElementById("checkout-summary").innerHTML =
        cart.map(function (l) { return "<p>" + esc(l.name) + " × " + l.quantity + " <span>" + money(l.price * l.quantity) + "</span></p>"; }).join("") +
        '<p class="grand">Total <span>' + money(t.total) + "</span></p>";
      var form = document.getElementById("checkout-form");
      if (user) {
        form.email.value = user.email;
        form.firstName.value = user.firstName || "";
        form.lastName.value = user.lastName || "";
      }
      push("begin_checkout", { ecommerce: { currency: CURRENCY, value: t.total, items: cart.map(lineItem) } });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var order = {
          orderId: "NF" + Date.now().toString().slice(-8),
          email: form.email.value.trim(),
          firstName: form.firstName.value.trim(),
          lastName: form.lastName.value.trim(),
          lines: cart, totals: t, placedAt: new Date().toISOString()
        };
        write("nf_last_order", order);
        setCart([]);
        location.href = "order-confirmation.html?order=" + encodeURIComponent(order.orderId);
      });
    },

    confirmation: function () {
      var order = read("nf_last_order", null);
      var root = document.getElementById("confirmation");
      if (!order || order.orderId !== qs("order")) { root.innerHTML = '<p class="empty">We couldn\'t find that order. <a href="index.html">Keep shopping</a></p>'; return; }
      root.innerHTML =
        '<h1>Thank you, ' + esc(order.firstName || "") + '</h1>' +
        '<p>Your order number is <strong id="order-number" data-order-id="' + order.orderId + '">' + order.orderId + "</strong>.</p>" +
        '<p>A confirmation would be sent to <span id="order-email">' + esc(order.email) + "</span> (demo store, nothing is sent).</p>" +
        '<table class="cart-table"><tbody>' + order.lines.map(function (l) {
          return '<tr class="order-line" data-product-id="' + l.id + '"><td>' + esc(l.name) + "<br><small>" + esc(l.color) + " / " + esc(l.size) + "</small></td><td>" + l.quantity + "</td><td>" + money(l.price * l.quantity) + "</td></tr>";
        }).join("") + "</tbody></table>" +
        '<div class="totals"><p class="grand">Order total <span id="order-total" data-order-total="' + order.totals.total.toFixed(2) + '">' + money(order.totals.total) + "</span></p></div>";
      // Fire purchase once per order, as real sites do.
      var fired = read("nf_purchase_fired", []);
      if (fired.indexOf(order.orderId) === -1) {
        push("purchase", { ecommerce: { transaction_id: order.orderId, currency: CURRENCY, value: order.totals.total, tax: order.totals.tax, shipping: order.totals.shipping, items: order.lines.map(lineItem) } });
        fired.push(order.orderId); write("nf_purchase_fired", fired);
      }
    },

    login: function () {
      var form = document.getElementById("login-form");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = form.email.value.trim();
        var existing = read("nf_accounts", {})[email.toLowerCase()];
        write("nf_user", existing || { email: email, firstName: email.split("@")[0] });
        push("login", { method: "email", user_email: email });
        location.href = "account.html";
      });
    },

    register: function () {
      var form = document.getElementById("register-form");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var user = { email: form.email.value.trim(), firstName: form.firstName.value.trim(), lastName: form.lastName.value.trim(), marketingOptIn: form.optin.checked };
        var accounts = read("nf_accounts", {});
        accounts[user.email.toLowerCase()] = user;
        write("nf_accounts", accounts);
        write("nf_user", user);
        push("sign_up", { method: "email", user_email: user.email });
        location.href = "account.html?registered=1";
      });
    },

    account: function () {
      var user = getUser();
      if (!user) { location.href = "login.html"; return; }
      document.getElementById("account").innerHTML =
        (qs("registered") ? '<p class="notice">Your account has been created.</p>' : "") +
        "<h1>Hi, " + esc(user.firstName || "there") + "</h1>" +
        '<p>Signed in as <span id="account-email">' + esc(user.email) + "</span></p>" +
        '<button class="btn" id="sign-out">Sign out</button>';
      document.getElementById("sign-out").addEventListener("click", function () {
        try { localStorage.removeItem("nf_user"); } catch (e) { /* ignore */ }
        location.href = "index.html";
      });
    }
  };

  function lineItem(l) {
    return { item_id: l.id, item_name: l.name, item_variant: l.color + " / " + l.size, price: l.price, quantity: l.quantity };
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderChrome();
    var page = document.body.getAttribute("data-page");
    if (pages[page]) pages[page]();
  });
})();
