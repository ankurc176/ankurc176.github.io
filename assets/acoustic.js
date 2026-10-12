// Acoustic Connect SDK config for Northfold Outfitters (production mode).
// Source: acoConnectSdkConfig-ankurc176.js from the SDK config assistant. Replace this whole file when regenerating.
(function () {
    function loadFromCDN(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load ${url}`));
            document.head.appendChild(script);
        });
    }

    function configureSDK() {
        // Get the default config from the SDK core
        const config = window.TLT.getDefaultConfig();

        // Override core defaults
        config.core.buildNote = "ankurc176.github.io - 12102026";
        config.core.modules.gestures.enabled = true;
        config.core.modules.ajaxListener.enabled = true;
        config.core.modules.dataLayer.enabled = false;
        config.core.frames = {
            enableCrossDomainCommunication: true,
            eventProducer: { producerId: "goAcoustic-com" },
            eventConsumer: { childFrameHostnameWhitelist: ["go.acoustic.com"] },
        }

        // Override services defaults
        config.services.queue.xhrEnabled = false;
        config.services.queue.queues[0].timerInterval = 30000;
        if (TLT.utils.isiOS || TLT.utils.isAndroid) {
            config.services.queue.queues[0].timerInterval = 10000;
        }
        config.services.message.privacy = [{
            exclude: true,
            targets: [
                "input[type=hidden]",
                "input[type=radio]",
                "input[type=checkbox]",
                "input[type=submit]",
                "input[type=button]",
                "input[type=reset]",
                "input[type=image]",
                "input[type=email]",
                "input[type=text]",
                "button",
                "[role=button]",
                
                // Identified email field — captured without masking (identification signal):
                "[name=\"email\"]",
                { id: { regex: 'goAcoustic-com' }, idType: -2 }
            ], maskType: 2
        }];
        config.services.message.privacyPatterns = [];
        config.services.domCapture.options = { maxLength: 5000000 };
        config.services.browser.logAttributes = ["class", "id"];

        // Override modules defaults
        config.modules.performance.performanceAlert.blacklist = [{ regex: "brilliantcollector\\.com" }];
        config.modules.replay.domCapture.triggers = [
            { event: "change" },
            { event: "click" },
            { event: "dblclick" },
            { event: "contextmenu" },
            { event: "visibilitychange" },
            {
                event: "load",
                fullDOMCapture: true,
                delay: 300
            }
        ];
        config.modules.replay.mousemove.enabled = true;
        config.modules.ajaxListener = {
            blockNonJSONResponse: false,
            fieldBlocklist: [],
            urlBlocklist: [
                { regex: "brilliantcollector\\.com|clarity|collectorPost|crazyegg|doubleclick|google|yimg|cookielaw|stripe|subtotal|linkedin|aplo-evnt\\.com|app\\.qualified\\.com|content-us-1\\.content-cms\\.com", flags: "i" }
            ],
            filters: [
                {
                    url: { regex: "/secureLogin", flags: "i" },
                    status: { regex: "[45]\\d\\d" },
                    log: {
                        requestHeaders: true,
                        requestData: false,
                        responseHeaders: true,
                        responseData: true
                    }
                },
                {
                    status: { regex: "[45]\\d\\d" },
                    log: {
                        requestHeaders: true,
                        requestData: true,
                        responseHeaders: true,
                        responseData: true
                    }
                }
            ]
        };
        config.modules.TLCookie.secureTLTSID = true;
        return config;
    }

 // InitLogsignsal here - do not remove this comment

function initLogSignal() {
    if (TLT.getState() === "destroyed") return;
    // --------------------------------------------------------------------------
    // ----------------------------------------------- Signal configuration -----
    // --------------------------------------------------------------------------
    const cfg = {
        errorLog: false,
        eventLog: false,
        signalsLog: true,
        fakeSignals: false,
        messageTypes: [
            // "all", // Verbose, use only during development
            "load",
            "click",
            "change",
            "dlListener"
            // "ajaxListener"
        ],
        GAdataLayerName: "dataLayer", // For GA typically "dataLayer". Do not include "window." in the name.
        GAeventsAllowList: ["view_item", "add_to_cart", "purchase", "remove_from_cart", "search", "select_item_option", "login", "sign_up"],
        signals: {
            loggedIn: {
                signal: {
                    signalType: "loggedIn",
                    // <<schema-start: loggedIn>>
                    loginMethod: null, // Text, Required
                    ssoProvider: null, // Text, Optional
                    mfaUsed: null, // Boolean, Optional
                    mfaMethod: null, // Text, Optional
                    // <<schema-end: loggedIn>>
                    effect: "positive", // Enum ("negative"|"positive"), Required
                    audience: { // Objet, Optional
                        // Object attributes in key: value format
                        // Key must match attribute in audience! Check the audience in Connect.
                        // Using "email" will not work if the attribute is named "Email Address".
                        // Value can be Text|Boolean|Number|Date as appropriate
                        // Date format: 2025-08-26T08:22:22.773Z
                        // Phone format: Text in ISO E.164 format: +447888004567
                        // Example:
                        // "Email Address": "test@sample.com" // Text|Boolean|Number|Date
                        // You can pass in as many identifiers as key:value pairs as you want
                    },
                    consent: { // Objet, Optional
                        // enableOverrideExistingOptOut: false, // Boolean, Required
                        // email: [ // Also available: "sms", "whatsapp"
                        // {
                        // status: "OPT_IN", // Enum ("OPT_IN"|"OPT_OUT"|"OPT_IN_UNVERIFIED"), Required
                        // consentGroupIds: ["72d01db0-a422-5a0d-9b6c-86dd997e0000"] // Array, Optional
                        // }
                        // ]
                    },
                    signalCustomAttributes: [] // Object, Optional
                },
                triggers: [
            {
                attributes: {
                "customEvent.data.event": "login"
}
            }
        ],
                // Sample triggers:
                // triggers: [{ attributes: { "screenview.type": "LOAD" } }],
                enhance: function(signal, help) {
    const _email = sessionStorage.getItem('aco_email_value');
    if (_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email)) {
        help.store('audience', { Email: _email });
        signal.audience = { Email: _email };
    }
    const dlData = help.webEvent?.customEvent?.data;
    const dlEmail = dlData?.email || dlData?.user_email || dlData?.userEmail || null;
    const loginMethod = dlData?.method || dlData?.loginMethod || 'email';
    if (dlEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dlEmail)) {
        sessionStorage.setItem('aco_email_value', dlEmail);
        help.store('audience', { Email: dlEmail });
        signal.audience = { Email: dlEmail };
        signal.loginMethod = loginMethod;
    } else {
        // Fallback: read email from any visible form field on the page
        const emailEl = document.querySelector('input[type="email"], input[name="email"]');
        const formEmail = emailEl?.value?.trim() || null;
        if (!formEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) return false;
        sessionStorage.setItem('aco_email_value', formEmail);
        help.store('audience', { Email: formEmail });
        signal.audience = { Email: formEmail };
        signal.loginMethod = loginMethod;
    }
    signal.audience = help.retrieve('audience') || {};
    return signal;
                
                }
            },
            accountRegistered: {
                signal: {
                    signalType: "accountRegistered",
                    // <<schema-start: accountRegistered>>
                    registrationMethod: null, // Text, Required
                    ssoProvider: null, // Text, Optional
                    registrationSource: null, // Text, Optional
                    mfaEnabled: null, // Boolean, Optional
                    // <<schema-end: accountRegistered>>
                    effect: "positive", // Enum ("negative"|"positive"), Required
                    audience: {}, // Object, Optional
                    consent: {}, // Object, Optional
                    signalCustomAttributes: [] // Object, Optional
                },
                triggers: [{ attributes: { "customEvent.data.event": "sign_up" } }],
                // Sample triggers:
                // triggers: [{ attributes: {
                // "event.type": "click",
                // "target.attributes.class": "fc--control-button fc--submit-button",
                // } }],
                enhance: function(signal, help) {
                    const dlData = help.webEvent?.customEvent?.data || {};
                    const email = (dlData.user_email || '').trim();
                    if (email && help.validateEmailFormat(email)) {
                        sessionStorage.setItem('aco_email_value', email);
                        help.store('audience', { Email: email });
                    }
                    signal.registrationMethod = dlData.method || 'email';
                    signal.registrationSource = 'website';
                    signal.audience = help.retrieve('audience') || {};
                    return signal;
                }
            },
            pageView: {
                signal: {
                    signalType: "pageView",
                    // <<schema-start: pageView>>
                    url: null, // Text, Required
                    pageCategory: null, // Text, Optional
                    pageGroup: null, // Text, Optional
                    pageTitle: null, // Text, Optional
                    // <<schema-end: pageView>>
                    effect: "positive", // Enum ("negative"|"positive"), Required
                    audience: {}, // Object, Optional
                    consent: {}, // Object, Optional
                    signalCustomAttributes: [] // Object, Optional
                },
                triggers: [
            {
                attributes: {
                "screenview.type": "LOAD"
}
            }
        ],
                // Sample trigger
                // { attributes: { "screenview.type": "LOAD" } }
                enhance: function(signal, help) {
    signal.url = location.href.split('?')[0];
    signal.pageTitle = document.title || null;
    const _p = location.pathname;
    signal.pageCategory = /\/(index\.html)?$/.test(_p) ? 'homepage'
        : /\/category\.html$/.test(_p) ? 'collection'
        : /\/product\.html$/.test(_p) ? 'product'
        : /\/search\.html$/.test(_p) ? 'search'
        : /\/cart\.html$/.test(_p) ? 'cart'
        : /\/checkout\.html$/.test(_p) ? 'checkout'
        : /\/order-confirmation\.html$/.test(_p) ? 'thank-you'
        : /\/(login|register|register-success|account)\.html$/.test(_p) ? 'account'
        : 'unknown';
    signal.audience = help.retrieve('audience') || {};
    return signal;
                
                }
            },
            onSiteSearch: {
                signal: {
                    signalType: "onSiteSearch",
                    // <<schema-start: onSiteSearch>>
                    searchTerm: null, // Text, Required
                    numberOfResults: null, // Number, Required
                    // <<schema-end: onSiteSearch>>
                    effect: "positive", // Enum ("negative"|"positive"), Required
                    audience: {}, // Object, Optional
                    consent: {}, // Object, Optional
                    signalCustomAttributes: [] // Object, Optional
                },
                triggers: [
            {
                attributes: {
                "customEvent.data.event": "search"
}
            }
        ],
                // Sample trigger
                // { attributes: { "screenview.type": "LOAD" } }
                enhance: function(signal, help) {
    const _email = sessionStorage.getItem('aco_email_value');
    if (_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email)) {
        help.store('audience', { Email: _email });
        signal.audience = { Email: _email };
    }
    // Read from dlListener data first; fall back to URL search param
    const dlData = help.webEvent?.customEvent?.data || {};
    // Try common field name patterns across different dataLayer implementations
    const dlSearchTerm = dlData?.search_keyword || dlData?.searchTerm
        || dlData?.query || dlData?.search_term || dlData?.term || null;
    signal.searchTerm = dlSearchTerm || (new URLSearchParams(location.search)).get('q') || null;
    if (!signal.searchTerm) return false; // required — only fires on search result pages
    const dlCount = dlData?.total_number_of_items ?? dlData?.numberOfResults
        ?? dlData?.resultCount ?? dlData?.total_results ?? dlData?.search_results ?? null;
    signal.numberOfResults = dlCount !== null ? Number(dlCount) : null;
    signal.effect = signal.numberOfResults === 0 ? 'negative' : 'positive';
    signal.audience = help.retrieve('audience') || {};
    return signal;
                
                }
            },
            productView: {
                signal: {
                    signalType: "productView",
                    // <<schema-start: productView>>
                    productId: null, // Text, Required
                    productName: null, // Text, Required
                    availability: null, // Text, Optional
                    brandName: null, // Text, Optional
                    brandDescription: null, // Text, Optional
                    model: null, // Text, Optional
                    msrp: null, // Number, Optional
                    sku: null, // Text, Optional
                    productStatus: null, // Text, Optional
                    productRating: null, // Number, Optional
                    dateAdded: null, // Date, Optional
                    tags: [], // Array, Optional
                    categories: null, // Text, Optional
                    currency: null, // Text, Optional
                    productDescription: null, // Text, Optional
                    inventoryQuantity: null, // Number, Optional
                    unitPrice: null, // Number, Optional
                    discount: null, // Number, Optional
                    productCategory: null, // Text, Optional
                    productUrls: [], // Array, Optional
                    imageUrls: [], // Array, Optional
                    shoppingCartUrl: null, // Text, Optional
                    virtualCategory: null, // Text, Optional
                    actionState: null, // Text, Optional
                    resumedCartItem: null, // Text, Optional
                    promotionId: null, // Text, Optional
                    productCategoryId: null, // Text, Optional
                    externalVariantId: null, // Text, Optional
                    // <<schema-end: productView>>
                    effect: "positive", // Enum ("negative"|"positive"), Required
                    audience: {}, // Object, Optional
                    consent: {}, // Object, Optional
                    signalCustomAttributes: [] // Object, Optional
                },
                triggers: [
            {
                attributes: {
                "customEvent.data.event": "view_item"
}
            }
        ],
                enhance: function(signal, help) {
    const _email = sessionStorage.getItem('aco_email_value');
    if (_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email)) {
        help.store('audience', { Email: _email });
        signal.audience = { Email: _email };
    }
    const ec = help.webEvent?.customEvent?.data?.ecommerce;
    const items = ec?.items || [];
    const item = items[0] || {};
    const actionField = { id: ec?.transaction_id, revenue: ec?.value, currency: ec?.currency };
    // Field names: GA4 uses item_id/item_name, UA uses id/name — try both
    signal.productId = item?.item_id || item?.id || help.cssGet('[data-product-id]','dataset.productId') || null;
    if (!signal.productId) return false; // required
    signal.productName = item?.item_name || item?.name || help.jsonLdGet('0.name') || help.cssGet("meta[property='og:title']", 'content') || null;
    signal.unitPrice = typeof item?.price === 'number' ? item.price : parseFloat(item?.price) || parseFloat(help.jsonLdGet('0.offers.0.price')) || null;
    signal.currency = ec?.currency || help.jsonLdGet('0.offers.0.priceCurrency') || null;
    signal.productCategory = item?.item_category || item?.category || null;
    signal.brandName = item?.item_brand || item?.brand || help.jsonLdGet('0.brand.name') || null;
    signal.sku = item?.item_variant || item?.sku || help.jsonLdGet('0.sku') || null;
    signal.productUrls = [help.cssGet("meta[property='og:url']", 'content') || window.location.href];
    signal.imageUrls = [help.cssGet("meta[property='og:image']", 'content') || null].filter(Boolean);
    signal.audience = help.retrieve('audience') || {};
    return signal;
                }
            },
            productConfiguration: {
                signal: {
                    signalType: "productConfiguration",
                    // <<schema-start: productConfiguration>>
                    productId: null, // Text, Required
                    productName: null, // Text, Required
                    configurationType: null, // Text, Optional
                    currency: null, // Text, Optional
                    productDescription: null, // Text, Optional
                    inventoryQuantity: null, // Number, Optional
                    unitPrice: null, // Number, Optional
                    discount: null, // Number, Optional
                    productCategory: null, // Text, Optional
                    productUrls: [], // Array, Optional
                    imageUrls: [], // Array, Optional
                    shoppingCartUrl: null, // Text, Optional
                    virtualCategory: null, // Text, Optional
                    actionState: null, // Text, Optional
                    resumedCartItem: null, // Text, Optional
                    promotionId: null, // Text, Optional
                    productCategoryId: null, // Text, Optional
                    externalVariantId: null, // Text, Optional
                    // <<schema-end: productConfiguration>>
                    effect: "positive", // Enum ("negative"|"positive"), Required
                    audience: {}, // Object, Optional
                    consent: {}, // Object, Optional
                    signalCustomAttributes: [] // Object, Optional
                },
                triggers: [
            {
                attributes: {
                "customEvent.data.event": "select_item_option"
}
            }
        ],
                // Sample trigger
                // {
                // attributes: {
                // "event.type": "click",
                // "target.attributes.class": "btn btn-touchup"
                // },
                // label: "quantity up",
                // }
                enhance: function(signal, help) {
    const _email = sessionStorage.getItem('aco_email_value');
    if (_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email)) {
        help.store('audience', { Email: _email });
        signal.audience = { Email: _email };
    }
    const ec = help.webEvent?.customEvent?.data?.ecommerce;
    const items = ec?.items || [];
    const item = items[0] || {};
    const actionField = { id: ec?.transaction_id, revenue: ec?.value, currency: ec?.currency };
    // Field names: GA4 uses item_id/item_name, UA uses id/name — try both
    signal.productId = help.webEvent?.customEvent?.data?.item_id;
    if (signal.productId==null) return false; // required
    signal.productName = help.cssGet('h1.product-title', 'innerText');
    if (signal.productName==null) return false; // required
    const _opt = help.webEvent?.customEvent?.data?.option_name;
    signal.configurationType = _opt === 'color' ? 'colour' : _opt;
    signal.actionState = help.webEvent?.customEvent?.data?.option_value;
    signal.unitPrice = parseFloat(String(help.cssGet('.product-price', 'innerText')).replace(/[^0-9.-]/g,''))||null;
    signal.currency = 'USD';
    signal.productCategory = help.cssGet('.breadcrumb a:nth-of-type(2)', 'innerText');
    signal.audience = help.retrieve('audience') || {};
    return signal;
                }
            },
            // Include removedFromCart within addToCart logic
            addToCart: {
                signal: {
                    signalType: "addToCart",
                    // <<schema-start: addToCart>>
                    productId: null, // Text, Required
                    productName: null, // Text, Required
                    itemQuantity: null, // Number, Required
                    unitPrice: null, // Number, Required
                    currency: null, // Text, Optional
                    productDescription: null, // Text, Optional
                    discount: null, // Number, Optional
                    productCategory: null, // Text, Optional
                    productUrls: [], // Array, Optional
                    imageUrls: [], // Array, Optional
                    shoppingCartUrl: null, // Text, Optional
                    virtualCategory: null, // Text, Optional
                    actionState: null, // Text, Optional
                    resumedCartItem: null, // Text, Optional
                    promotionId: null, // Text, Optional
                    productCategoryId: null, // Text, Optional
                    externalVariantId: null, // Text, Optional
                    // <<schema-end: addToCart>>
                    effect: "positive", // Enum ("negative"|"positive"), Required
                    audience: {}, // Object, Optional
                    consent: {}, // Object, Optional
                    signalCustomAttributes: [] // Object, Optional
                },
                triggers: [
            {
                attributes: {
                "customEvent.data.event": "add_to_cart"
}
            }, {
                attributes: {
                    "customEvent.data.event": "remove_from_cart"
                }
            }
        ],
                enhance: function(signal, help) {
    const _email = sessionStorage.getItem('aco_email_value');
    if (_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email)) {
        help.store('audience', { Email: _email });
        signal.audience = { Email: _email };
    }
    const ec = help.webEvent?.customEvent?.data?.ecommerce;
    const items = ec?.items || [];
    const item = items[0] || {};
    const actionField = { id: ec?.transaction_id, revenue: ec?.value, currency: ec?.currency };
    // Field names: GA4 uses item_id/item_name, UA uses id/name — try both
    signal.productId = item?.item_id || item?.id || help.cssGet('[data-product-id]','dataset.productId') || null;
    if (!signal.productId) return false; // required
    signal.productName = item?.item_name || item?.name || help.cssGet("meta[property='og:title']", 'content') || null;
    signal.unitPrice = typeof item?.price === 'number' ? item.price : parseFloat(item?.price) || null;
    signal.itemQuantity = item?.quantity || 1;
    if (help.webEvent?.customEvent?.data?.event === 'remove_from_cart') {
        signal.signalType = 'removedFromCart';
        signal.effect = 'negative';
    }
    signal.currency = ec?.currency || null;
    signal.productCategory = item?.item_category || item?.category || null;
    signal.brandName = item?.item_brand || item?.brand || null;
    signal.productUrls = [help.cssGet("meta[property='og:url']", 'content') || window.location.href];
    signal.imageUrls = [help.cssGet("meta[property='og:image']", 'content') || null].filter(Boolean);
    signal.audience = help.retrieve('audience') || {};
    return signal;
                }
            },
            order: {
                signal: {
                    signalType: "order",
                    // <<schema-start: order>>
                    orderId: null, // Text, Required
                    orderedItems: [], // Array, Required
                    orderSubtotal: null, // Number, Optional
                    orderShippingHandling: null, // Number, Optional
                    orderTax: null, // Number, Optional
                    orderDiscount: null, // Number, Optional
                    orderValue: null, // Number, Optional
                    currency: null, // Text, Optional
                    externalVariantId: null, // Text, Optional
                    // <<schema-end: order>>
                    effect: "positive", // Enum ("negative"|"positive"), Required
                    audience: {}, // Object, Optional
                    consent: {}, // Object, Optional
                    signalCustomAttributes: [] // Object, Optional
                },
                // <<schema-items-start: order>>
                // orderedItem properties:
                // productId: "", // Text, Required
                // productName: "", // Text, Required
                // productDescription: "", // Text, Optional
                // itemQuantity: 0, // Number, Optional
                // unitPrice: 0, // Number, Required
                // discount: 0, // Number, Optional
                // productCategory: "", // Text, Optional
                // productUrls: [], // Array, Optional
                // imageUrls: [], // Array, Optional
                // shoppingCartUrl: "", // Text, Optional
                // virtualCategory: "", // Text, Optional
                // actionState: "", // Text, Optional
                // resumedCartItem: "", // Text, Optional
                // promotionId: "", // Text, Optional
                // productCategoryId: "" // Text, Optional
                // <<schema-items-end: order>>
                triggers: [
            {
                attributes: {
                "customEvent.data.event": "purchase"
}
            }
        ],
                enhance: function(signal, help) {
    const _email = sessionStorage.getItem('aco_email_value');
    if (_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email)) {
        help.store('audience', { Email: _email });
        signal.audience = { Email: _email };
    }
    const ec = help.webEvent?.customEvent?.data?.ecommerce;
    const items = ec?.items || [];
    const item = items[0] || {};
    const actionField = { id: ec?.transaction_id, revenue: ec?.value, currency: ec?.currency };
    // Field names: GA4 uses item_id/item_name, UA uses id/name — try both
    signal.orderId = actionField?.id || ec?.transaction_id || null;
    if (!signal.orderId) return false; // required
    signal.orderValue = typeof actionField?.revenue === 'number' ? actionField.revenue
        : parseFloat(actionField?.revenue) || ec?.value || null;
    signal.orderTax = typeof ec?.tax === 'number' ? ec.tax : parseFloat(ec?.tax) || null;
    signal.orderShippingHandling = typeof ec?.shipping === 'number' ? ec.shipping : parseFloat(ec?.shipping) || null;
    signal.currency = ec?.currency || null;
    signal.orderedItems = items.map(function(it) { return {
        productId: it?.item_id || it?.id || null,
        productName: it?.item_name || it?.name || null,
        unitPrice: typeof it?.price === 'number' ? it.price : parseFloat(it?.price) || null,
        itemQuantity: it?.quantity || 1,
        productCategory: it?.item_category || it?.category || null,
    }; });
    if (!signal.orderedItems.length) return false; // required
    signal.audience = help.retrieve('audience') || {};
    return signal;
                }
            },
            error: {
                signal: {
                    signalType: "error",
                    // <<schema-start: error>>
                    errorType: null, // Enum ("USER"|"APPLICATION"), Required
                    errorText: null, // Text, Required
                    errorIdentifier: null, // Text, Optional
                    // <<schema-end: error>>
                    effect: "negative", // Enum ("negative"|"positive"), Required
                    audience: {}, // Object, Optional
                    consent: {}, // Object, Optional
                    signalCustomAttributes: [] // Object, Optional
                },
                triggers: [],
                enhance: function(signal, help) {}
            },
            richMediaInteraction: {
                signal: {
                    signalType: "richMediaInteraction",
                    // <<schema-start: richMediaInteraction>>
                    mediaId: null, // Text, Required
                    url: null, // Text, Optional
                    mediaCategory: null, // Text, Optional
                    mediaName: null, // Text, Optional
                    interactionType: null, // Enum ("LOAD"|"LAUNCH"|"PAUSE"|"CONTINUE"|"COMPLETE"|"STOP"|"ENLARGE"), Optional
                    // <<schema-end: richMediaInteraction>>
                    effect: "positive", // Enum ("negative"|"positive"), Required
                    audience: {}, // Object, Optional
                    consent: {}, // Object, Optional
                    signalCustomAttributes: [] // Object, Optional
                },
                triggers: [],
                enhance: function(signal, help) {}
            },
            wishlistItemAdded: {
                signal: {
                    signalType: "wishlistItemAdded",
                    // <<schema-start: wishlistItemAdded>>
                    productId: null, // Text, Required
                    externalVariantId: null, // Text, Optional
                    productName: null, // Text, Optional
                    productCategory: null, // Text, Optional
                    price: null, // Number, Optional
                    currency: null, // Text, Optional
                    wishlistId: null, // Text, Optional
                    // <<schema-end: wishlistItemAdded>>
                    effect: "positive", // Enum ("negative"|"positive"), Required
                    audience: {}, // Object, Optional
                    consent: {}, // Object, Optional
                    signalCustomAttributes: [] // Object, Optional
                },
                triggers: [],
                enhance: function(signal, help) {}
            },
            wishlistItemRemoved: {
                signal: {
                    signalType: "wishlistItemRemoved",
                    // <<schema-start: wishlistItemRemoved>>
                    productId: null, // Text, Required
                    externalVariantId: null, // Text, Optional
                    productName: null, // Text, Optional
                    productCategory: null, // Text, Optional
                    price: null, // Number, Optional
                    currency: null, // Text, Optional
                    wishlistId: null, // Text, Optional
                    // <<schema-end: wishlistItemRemoved>>
                    effect: "negative", // Enum ("negative"|"positive"), Required
                    audience: {}, // Object, Optional
                    consent: {}, // Object, Optional
                    signalCustomAttributes: [] // Object, Optional
                },
                triggers: [],
                enhance: function(signal, help) {}
            },
            // ---------------------------------------------------------------
            // Audience utility signal — injected automatically when identification
            // is configured. NOT an Acoustic Connect signal (always returns false).
            // Captures the email address typed into the identified form field and
            // stores it in sessionStorage. Other signals read from sessionStorage
            // to populate their audience object (help.retrieve('audience') || {}).
            // ---------------------------------------------------------------
            audience: {
                signal: { signalType: "audience" },
                triggers: [{ attributes: { "event.type": "change", "target.name": "email" } }],
                enhance: function (signal, help) {
                    const _guardPaths = ['/login.html', '/register.html'];
                    if (!_guardPaths.some(function(p) { return location.pathname === p; })) return false;
                    const rawEmail = help.webEvent?.target?.currState?.value || null;
                    if (!rawEmail || !help.validateEmailFormat(rawEmail)) return false;
                    // Always overwrite — keep sessionStorage current with latest typed value.
                    sessionStorage.setItem('aco_email_value', rawEmail);
                    help.store('audience', { Email: rawEmail });
                    return false; // utility only — never logs to Acoustic Connect
                }
            }
        }
    };

    // --------------------------------------------------------------------------
    // ----------------------------------------- logSignal helper functions -----
    // --------------------------------------------------------------------------

    function warn(clog, e) {
        if (clog && console && cfg.errorLog) {
            console.warn("Acoustic Connect: Warning! \u{1F6A8}");
            console.warn(clog);
            if (e) console.warn(e);
        }
    }

    const requiredFields = {
        loggedIn: ["loginMethod"],
        accountRegistered: ["registrationMethod"],
        pageView: ["url"],
        onSiteSearch: ["searchTerm", "numberOfResults"],
        productView: ["productId", "productName"],
        productConfiguration: ["productId", "productName"],
        addToCart: [
            "productId",
            "productName",
            "itemQuantity",
            "unitPrice"
        ],
        removedFromCart: [
            "productId",
            "productName",
            "itemQuantity",
            "unitPrice"
        ],
        order: ["orderId", "orderedItems"],
        error: ["errorType", "errorText"],
        richMediaInteraction: ["mediaId"],
        wishlistItemAdded: ["productId"],
        wishlistItemRemoved: ["productId"],
    };
    const requiredOrderedItemFields = [
        "productId",
        "productName",
        "unitPrice"
    ];

    function validateSignal(signal) {
        function isEmpty(v) {
            return v === null || v === undefined || v === "" ||
                (Array.isArray(v) && v.length === 0) ||
                (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);
        }

        function getMissing(obj, fields) {
            return fields.filter(function(f) {
                return isEmpty(obj[f]);
            });
        }
        // Remove optional fields (those not listed in `required`) that carry no
        // meaningful value — no point sending empty data points to Connect.
        // `signalType` is never stripped; it is the lookup key and the caller
        // relies on it.
        function stripEmptyOptional(obj, required) {
            Object.keys(obj).forEach(function(key) {
                if (key === "signalType" || required.indexOf(key) !== -1) return;
                if (isEmpty(obj[key])) delete obj[key];
            });
        }
        const required = requiredFields[signal.signalType] || [];
        const missing = getMissing(signal, required);
        if (missing.length) {
            warn("Signal '" + signal.signalType + "' is missing required field(s): " + missing.join(", ") + ". Signal not sent.");
            return false;
        }
        if (signal.signalType === "order") {
            for (let idx = 0; idx < signal.orderedItems.length; idx++) {
                const missingItem = getMissing(signal.orderedItems[idx], requiredOrderedItemFields);
                if (missingItem.length) {
                    warn("Signal 'order' orderedItems[" + idx + "] is missing required field(s): " + missingItem.join(", ") + ". Signal not sent.");
                    return false;
                }
                stripEmptyOptional(signal.orderedItems[idx], requiredOrderedItemFields);
            }
        }
        stripEmptyOptional(signal, required);
        return signal;
    }

    function log(signal) {
        let bufferStr;
        let newBuffer;
        let bufferObj;
        if (!validateSignal(signal)) return;
        signal.name = signal.signalType + " generated by website";
        signal.category = "Behavior";
        if (TLT.isInitialized()) {
            if (cfg.fakeSignals === true) {
                window.TLT.logCustomEvent("logSignal", {
                    description: "Fake logSignal Message",
                    signal: signal
                });
                window.TLT.flushAll();
            } else {
                window.TLT.logSignal(signal);
                window.TLT.flushAll();
            }
            return;
        }
        if (!TLT.isInitialized() && sessionStorage) {
            warn("TLT is not initialized! Buffering signal until next time TLT initializes.");
            signal.buffered = true;
            bufferStr = sessionStorage.getItem("aco-buffer");
            if (!bufferStr) {
                newBuffer = [signal];
                sessionStorage.setItem("aco-buffer", JSON.stringify(newBuffer));
            } else {
                bufferObj = JSON.parse(bufferStr);
                bufferObj.push(signal);
                sessionStorage.setItem("aco-buffer", JSON.stringify(bufferObj));
            }
        }
    }

    function getNodeFromXpath(query, scope = document) {
        const xpath = JSON.parse(query);

        let elem = scope;
        let pathElem;
        let pathElemIsHost;
        let x;
        let j;
        let k;
        let len;
        let jlen;

        if (!query || !xpath) return null;

        for (x = 0, len = xpath.length; x < len && elem; x += 1) {
            pathElem = xpath[x];
            pathElemIsHost = pathElem.length > 1 && pathElem[pathElem.length - 1] === "h";
            if (pathElem.length === 1 || (pathElem.length === 2 && pathElemIsHost)) {
                if (scope.getElementById) {
                    elem = scope.getElementById(pathElem[0]); // HTML ID component of XPath
                } else if (scope.querySelector) {
                    elem = scope.querySelector("#" + pathElem[0]);
                } else {
                    elem = null;
                }
            } else { // Search in children
                for (j = 0, k = -1, jlen = elem.childNodes.length; j < jlen; j += 1) {
                    if (elem.childNodes[j].nodeType === 1 && TLT.utils.getTagName(elem.childNodes[j]) === pathElem[0].toLowerCase()) {
                        k += 1;
                        if (k === pathElem[1]) {
                            elem = elem.childNodes[j];
                            break;
                        }
                    }
                }
                if (k !== pathElem[1]) return null;
            }

            if (!elem) return null;
        }

        return (elem === scope || !elem) ? null : elem;
    }

    // Splits a path string into keys, treating quoted bracket segments (e.g.
    // ['ep.content_group']) as a single literal key even when they contain dots.
    function parsePath(pathStr) {
        const keys = [];
        const re = /\[(['"])((?:(?!\1).)*)\1\]|([^.[\]]+)/g;
        let m = re.exec(pathStr);
        while (m !== null) {
            keys.push(m[2] !== undefined ? m[2] : m[3]);
            m = re.exec(pathStr);
        }
        return keys;
    }

    function getAttribute(dotStr, webEvent) {
        try {
            const value = parsePath(dotStr).reduce((o, n) => o[n], webEvent);
            return value;
        } catch {
            return undefined;
        }
    }

    function matchEvent(attributes, webEvent) {
        const keysArr = Object.keys(attributes);
        for (let k = 0; k < keysArr.length; k++) {
            const dotStr = keysArr[k];
            const attrVal = getAttribute(dotStr, webEvent);
            // Exact match if attribute value specified as string
            if (typeof attributes[dotStr] === "string") {
                if (attributes[dotStr] !== attrVal) return false;
            }
            // Regex match if attribute value is specified as a regex
            if (typeof attributes[dotStr] === "object" && attributes[dotStr] instanceof RegExp) {
                if (!attributes[dotStr].test(attrVal)) return false;
            }
        }
        return true;
    }

    function store(key, value) {
        const storeKey = cfg.sessionStorageKey || "aco-store";

        if (!sessionStorage) {
            warn("Session storage unavailable");
            return false;
        }

        let acoStore = sessionStorage.getItem(storeKey) || "{}";
        acoStore = JSON.parse(acoStore);
        // If a signal is being passed in
        if (typeof key === "object" && key.signalType && value === undefined) {
            // If a key for this signalType exists
            if (acoStore[key.signalType]) {
                acoStore[key.signalType].push(key);
            } else {
                acoStore[key.signalType] = [key];
            }
        }
        if (key && value !== undefined) {
            acoStore[key] = value;
        }
        sessionStorage.setItem(storeKey, JSON.stringify(acoStore));
        return true;
    }

    function retrieve(key, del) {
        const storeKey = cfg.sessionStorageKey || "aco-store";

        if (!sessionStorage) {
            warn("Session storage unavailable");
            return false;
        }

        let acoStore = sessionStorage.getItem(storeKey) || "{}";
        acoStore = JSON.parse(acoStore);
        const value = acoStore[key] || "";
        if (del && del === "delete") {
            delete acoStore[key];
            if (Object.keys(acoStore).length === 0) {
                sessionStorage.removeItem(storeKey);
            } else {
                sessionStorage.setItem(storeKey, JSON.stringify(acoStore));
            }
        }
        return value;
    }

    function cssGet(selector, attr, flag, root = document) {
        let num;
        if (root) {
            if (root.shadowRoot) {
                // eslint-disable-next-line no-param-reassign
                root = root.shadowRoot;
            }
            const element = root.querySelector(selector);
            if (element) {
                if (!attr) {
                    return element;
                }
                if (element[attr]) {
                    if (flag === "n" || flag === "ne") {
                        if (flag === "n") {
                            num = element[attr].replace(/[^0-9. ]+/g, "");
                        }
                        if (flag === "ne") {
                            num = element[attr].replace(/[^0-9, ]+/g, "").replace(",", ".");
                        }
                        num = Number(num.trim().split(" ")[0]); // Handle strings like "$9.95 ST2"
                        return num || null;
                    }
                    return String(element[attr]).trim() || null;
                }
            }
        }
        return null;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateEmailFormat(email) {
        return emailRegex.test(email);
    }

    function stripHtml(html) {
        if (!html || typeof html !== "string") return "";
        return html
            .replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    // If the data source is the current page URL pass window.location.href as string
    function getQueryParam(str, param, n) {
        let value;
        try {
            const url = new URL(str);
            value = url.searchParams.get(param);
        } catch {
            const params = new URLSearchParams(str);
            value = params.get(param);
        }
        if (n === "n") {
            return Number(value) || null;
        }
        return value ? decodeURIComponent(value) : null;
    }

        function jsonLdGet(path, scope) {
        var root = scope || document;
        var scripts = root.querySelectorAll('script[type="application/ld+json"]');
        var data = [];
        for (var s = 0; s < scripts.length; s++) {
            try {
                var parsed = JSON.parse(scripts[s].textContent);
                if (Array.isArray(parsed)) {
                    for (var a = 0; a < parsed.length; a++) {
                        if (Array.isArray(parsed[a])) {
                            for (var b = 0; b < parsed[a].length; b++) {
                                data.push(parsed[a][b]);
                            }
                        } else {
                            data.push(parsed[a]);
                        }
                    }
                } else {
                    data.push(parsed);
                }
            } catch (e) {}
        }
        if (!path) return data;
        var parts = path.split(".");
        var result = data;
        for (var p = 0; p < parts.length; p++) {
            if (result === null || result === undefined) return null;
            var key = isNaN(parts[p]) ? parts[p] : parseInt(parts[p], 10);
            result = result[key];
        }
        return (result !== undefined && result !== null) ? result : null;
    }

    function logEnhanced(thisSig, thisWebEvent, thisDlEvent, thisLabel, thisDelay) {
        function delayLogEnhanced() {
            const help = {
                webEvent: thisWebEvent,
                dlEvent: thisDlEvent,
                cssGet: cssGet,
                jsonLdGet: jsonLdGet,
                label: thisLabel,
                log: log,
                store: store,
                retrieve: retrieve,
                getNodeFromXpath: getNodeFromXpath,
                validateEmailFormat: validateEmailFormat,
                stripHtml: stripHtml,
                getQueryParam: getQueryParam
            };
            let thisSignal;
            try {
                thisSignal = thisSig.enhance(structuredClone(thisSig.signal), help);
                if (thisSignal && thisSignal.signalType) {
                    log(thisSignal);
                }
            } catch (e) {
                const sigDisplayType = thisSig.signal?.signalType || "utility";
                warn("Error enhancing " + sigDisplayType + " signal:\n" + JSON.stringify(thisSig, undefined, 2), e);
            }
        }
        window.setTimeout(delayLogEnhanced, thisDelay);
    }

    // If any signals have been buffered from a previous page, send them now
    (function() {
        const bufferStr = sessionStorage.getItem("aco-buffer");
        if (bufferStr) {
            const signals = JSON.parse(bufferStr);
            for (const signal of signals) {
                log(signal);
            }
            warn(signals.length + " signal(s) sent from buffer");
            sessionStorage.removeItem("aco-buffer");
        }
    }());

    const sigArr = Object.keys(cfg.signals);

    function msgHandler(msg) {
        let dlEvent;
        let sig;
        // Log webEvents to the console if logging enabled
        if (cfg.eventLog) {
            console.log("%cAcoustic Connect: Type " + msg.type + " message \u{1F441}%c\n" + JSON.stringify(msg, undefined, 2), "font-weight: bold", "");
        }
        try {
            // Iterate through signals object
            for (let s = 0; s < sigArr.length; s++) {
                sig = cfg.signals[sigArr[s]];
                // If the signal has triggers
                if (sig.triggers && sig.triggers.length) {
                    // Iterate through each trigger
                    for (let i = 0; i < sig.triggers.length; i++) {
                        // Get optional label that can be passed in (e.g. button friendly name)
                        const label = sig.triggers[i].label || "";
                        // Get optional delay that can be passed in
                        const delay = sig.triggers[i].delay || 0;
                        // If current webEvent matches trigger attributes
                        if (matchEvent(sig.triggers[i].attributes, msg)) {
                            // If a signal enhancement function exists, execute it
                            if (sig.enhance) {
                                if (msg.type === 5 && msg.customEvent.name === "dataLayerPush") {
                                    dlEvent = msg.customEvent.data.dlEvent;
                                }
                                logEnhanced(sig, msg, dlEvent, label, delay);
                            } else {
                                log(sig.signal);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            warn("error evaluating " + sig.signal.signalType + " signal", e);
        }
    }

    TLT.registerBridgeCallbacks([{
        enabled: true,
        cbType: "messageRedirect",
        cbFunction: (function() {
            let lastCount = 0;
            return function(msg, msgObj) {
                if (msgObj && msgObj.count > lastCount) {
                    lastCount = msgObj.count;
                    if (cfg.signalsLog && msgObj.type === 21) {
                        console.log("%cAcoustic Connect: Type 21 " + msgObj.signal.signalType + " signal \u{1F3AF}%c\n" + JSON.stringify(msgObj.signal, undefined, 2), "font-weight: bold", "");
                        return msgObj;
                    }
                    if (cfg.signalsLog && cfg.fakeSignals && msgObj.type === 5 && msgObj?.customEvent?.name === "logSignal") {
                        console.log("%cAcoustic Connect: Type 5 fake " + msgObj.customEvent.data.signal.signalType + " signal \u{1F978}%c\n" + JSON.stringify(msgObj.customEvent.data.signal, undefined, 2), "font-weight: bold", "");
                        return msgObj;
                    }
                    if (cfg.messageTypes.includes("all") ||
                        (cfg.messageTypes.includes("load") && msgObj.type === 2 && msgObj.screenview.type === "LOAD") ||
                        (cfg.messageTypes.includes("click") && msgObj.type === 4 && msgObj.event.type === "click") ||
                        (cfg.messageTypes.includes("change") && msgObj.type === 4 && msgObj.event.type === "change") ||
                        (cfg.messageTypes.includes("mousedown") && msgObj.type === 4 && msgObj.event.type === "mousedown") ||
                        (cfg.messageTypes.includes("dlListener") && msgObj.type === 5 && msgObj.customEvent.name === "dlListener") ||
                        (cfg.messageTypes.includes("ajaxListener") && msgObj.type === 5 && msgObj.customEvent.name === "ajaxListener")
                    ) {
                        msgHandler(msgObj);
                    }
                    if (msgObj.type === 5 && msgObj.customEvent.name === "dlListener") return null;
                }
                return msgObj;
            };
        }())
    }]);

    // Run dataLayer listener by monkey patching dataLayer.push
    (function() {
        if (!cfg.messageTypes.includes("dlListener")) return;
        if ((TLT.getCoreConfig().modules.dataLayer && TLT.getCoreConfig().modules.dataLayer.enabled !== false) ||
            !cfg.GAdataLayerName ||
            !cfg.GAeventsAllowList.length) {
            warn("Invalid dlListener configuration");
            return;
        }

        // If there is no dataLayer
        if (!window[cfg.GAdataLayerName]) {
            warn("No dataLayer found");
            return;
        }
        // Check dataLayer is an array and that the push method exists
        if (!Array.isArray(window[cfg.GAdataLayerName]) ||
            typeof window[cfg.GAdataLayerName].push !== "function") {
            warn("window." + cfg.GAdataLayerName + " exists but is not a standard dataLayer");
            return;
        }
        // Check dataLayer.push has not already been patched
        if (window[cfg.GAdataLayerName].__istrackingPush) {
            warn("dataLayer push is already patched");
            return;
        }
        // Make a copy of the dataLayer before patch is applied
        if (!window.__tempDataLayer) {
            window.__tempDataLayer = [...window[cfg.GAdataLayerName]];
        }

        // Monkey patch the dataLayer.push method
        // NOTE: the dataLayer.push method is not a native push, GTM has already patched it.

        // Store reference to original push method
        const originalPush = window[cfg.GAdataLayerName].push;

        // Function to dispatch dlListener messages
        function dlListener(arg) {
            try {
                if (arg.event && (cfg.GAeventsAllowList.includes(arg.event) || cfg.GAeventsAllowList.includes("all"))) {
                    TLT.logCustomEvent("dlListener", arg);
                }
            } catch (e) {
                warn("Error sending dlListener message: " + e.message);
            }
        }

        // Override the dataLayer.push method
        try {
            Object.defineProperty(window[cfg.GAdataLayerName], "push", {
                value: function(...args) {
                    args.forEach((arg) => dlListener(arg)); // Handles multiple arguments passed to push
                    return originalPush.apply(this, args);
                },
                writable: true, // Make push assignable; allow other scripts to override this monkey patch
                configurable: true // Allows push to be redefined or deleted later, e.g. to revert patch
            });
            window[cfg.GAdataLayerName].__istrackingPush = true;

            // If patching fails, revert to original
        } catch (e) {
            warn("Error monkey patching dataLayer.push: " + e.message);
            window[cfg.GAdataLayerName] = originalPush;
        }

        // Process events captured in temporary dataLayer before the patch was applied
        try {
            if (window[cfg.GAdataLayerName].__istrackingPush && window.__tempDataLayer && window.__tempDataLayer.length) {
                window.__tempDataLayer.forEach((oldEvent) => {
                    if (oldEvent?.event) {
                        if (cfg.GAeventsAllowList.includes(oldEvent.event) || cfg.GAeventsAllowList.includes("all")) {
                            TLT.logCustomEvent("dlListener", oldEvent);
                        }
                    }
                });
                delete window.__tempDataLayer;
            }
        } catch (e) {
            warn("Error processing temporary dataLayer: " + e.message);
        }
    }());
}



    window.initLogSignal = initLogSignal;
    async function initSDK() {
        if (window.__ACO_SDK_INIT_IN_PROGRESS || window.__ACO_SDK_INIT_DONE) {
            console.warn("[ACO] initSDK already invoked. Skipping duplicate call.");
            return;
        }
        window.__ACO_SDK_INIT_IN_PROGRESS = true;

        try {
            if (window.TLT && typeof window.TLT.isInitialized === "function" && window.TLT.isInitialized()) {
                console.warn("[ACO] TLT already initialized. Skipping initLibAdv and running initLogSignal only.");
                window.initLogSignal();
                window.__ACO_SDK_INIT_DONE = true;
                return;
            }

            console.log("[ACO] loading CDN...");
            await loadFromCDN("https://cdn.goacoustic.com/connect/latest/acoconnect.min.js");

            if (window.TLT && typeof window.TLT.isInitialized === "function" && window.TLT.isInitialized()) {
                console.warn("[ACO] TLT already initialized after CDN load. Skipping initLibAdv and running initLogSignal only.");
                window.initLogSignal();
                window.__ACO_SDK_INIT_DONE = true;
                return;
            }

            console.log("[ACO] calling initLibAdv...");
            TLT.initLibAdv({
                appKey: "324386d02bd2444a81aa6b909c3eeb2f",
                postUrl: "https://lib-us-1.brilliantcollector.com/collector/collectorPost",
                newConfig: configureSDK(),
                addAjaxListener: true,
                callback: window.initLogSignal
            });
            window.__ACO_SDK_INIT_DONE = true;

        } catch (error) {
            console.error("[ACO] Failed to initialize:", error);
        } finally {
            window.__ACO_SDK_INIT_IN_PROGRESS = false;
        }
    }
    initSDK();
}());
