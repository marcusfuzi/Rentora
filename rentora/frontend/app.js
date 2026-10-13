const API = "http://localhost:5000/api";


/* =====================================
   PAGE LOAD
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadHomeProducts();

        setupListingType();

        setupOwnerForm();

        loadProductPage();

    }
);


/* =====================================
   LOAD HOME PRODUCTS
===================================== */

async function loadHomeProducts() {

    const grid =
        document.getElementById(
            "productGrid"
        );

    if (!grid) return;


    try {

        const response =
            await fetch(
                `${API}/products`
            );


        if (!response.ok) {
            throw new Error();
        }


        const products =
            await response.json();


        renderProducts(products);


    } catch (error) {

        grid.innerHTML = `

            <div class="error-box">

                <h3>
                    Backend not connected
                </h3>

                <p>
                    Start the Rentora backend
                    using:
                </p>

                <b>
                    node server.js
                </b>

            </div>

        `;

    }

}


/* =====================================
   RENDER PRODUCT CARDS
===================================== */

function renderProducts(products) {

    const grid =
        document.getElementById(
            "productGrid"
        );

    if (!grid) return;


    if (!products.length) {

        grid.innerHTML = `

            <div class="empty">

                No equipment found.

            </div>

        `;

        return;

    }


    grid.innerHTML =
        products.map(product => {

            const isRent =
                product.listingType === "rent";


            return `

                <article class="product-card">


                    <div class="product-image">

                        ${
                            product.image

                            ?

                            `
                            <img
                                src="${product.image}"
                                alt="${escapeHTML(
                                    product.name
                                )}"
                            >
                            `

                            :

                            `
                            <div
                                class="image-placeholder"
                            >
                                ${getCategoryIcon(
                                    product.category
                                )}
                            </div>
                            `
                        }


                        <span
                            class="
                                type-badge
                                ${
                                    isRent
                                    ? "rent-badge"
                                    : "sell-badge"
                                }
                            "
                        >

                            ${
                                isRent
                                ? "FOR RENT"
                                : "FOR SALE"
                            }

                        </span>

                    </div>



                    <div class="product-info">


                        <p class="product-category">

                            ${escapeHTML(
                                product.category
                            )}

                        </p>


                        <h3>

                            ${escapeHTML(
                                product.name
                            )}

                        </h3>


                        <p class="variant">

                            ${escapeHTML(
                                product.brand
                            )}

                            •

                            ${escapeHTML(
                                product.model
                            )}

                            <br>

                            ${escapeHTML(
                                product.variant
                            )}

                        </p>



                        <div class="price-row">


                            ${
                                isRent

                                ?

                                `
                                <strong>
                                    ₹${formatPrice(
                                        product.rentPrice
                                    )}
                                </strong>

                                <span>
                                    / day
                                </span>
                                `

                                :

                                `
                                <strong>
                                    ₹${formatPrice(
                                        product.salePrice
                                    )}
                                </strong>

                                <span>
                                    sale
                                </span>
                                `
                            }

                        </div>



                        <div class="owner-row">

                            <span>

                                ${
                                    product.verifiedSeller
                                    ? "✓ Verified Seller"
                                    : ""
                                }

                            </span>


                            <span>

                                ${escapeHTML(
                                    product.location || ""
                                )}

                            </span>

                        </div>



                        <a
                            class="view-btn"
                            href="
                                product.html?id=${product.id}
                            "
                        >
                            View Details
                        </a>


                    </div>

                </article>

            `;

        }).join("");

}


/* =====================================
   SEARCH
===================================== */

async function searchProducts() {

    const input =
        document.getElementById(
            "searchInput"
        );

    if (!input) return;


    const query =
        input.value.trim();


    if (!query) {

        loadHomeProducts();

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/products/search?q=${
                    encodeURIComponent(query)
                }`
            );


        const products =
            await response.json();


        renderProducts(products);


        document
            .getElementById(
                "productGrid"
            )
            ?.scrollIntoView({
                behavior: "smooth"
            });


    } catch (error) {

        alert(
            "Unable to search right now."
        );

    }

}


/* =====================================
   CATEGORY SEARCH
===================================== */

function categorySearch(category) {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (input) {

        input.value =
            category;

    }


    searchProducts();

}


/* =====================================
   PRODUCT PAGE
===================================== */

async function loadProductPage() {

    const container =
        document.getElementById(
            "productPage"
        );


    if (!container) return;


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("id");


    if (!id) {

        container.innerHTML = `

            <div class="error-box">

                Product ID missing.

            </div>

        `;

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/products/${id}`
            );


        if (!response.ok) {
            throw new Error();
        }


        const product =
            await response.json();


        renderProductPage(product);


    } catch (error) {

        container.innerHTML = `

            <div class="error-box">

                Equipment not found.

            </div>

        `;

    }

}


/* =====================================
   PRODUCT DETAILS
===================================== */

function renderProductPage(product) {

    const container =
        document.getElementById(
            "productPage"
        );


    const isRent =
        product.listingType === "rent";


    const externalPrices =
        product.externalPrices || [];


    /* EXTERNAL PURCHASE PRICES */

    const externalRows =
        externalPrices.map(item => {

            return `

                <div class="compare-row">

                    <div>

                        <strong>
                            ${escapeHTML(
                                item.platform
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                item.updated ||
                                "Price information"
                            )}
                        </small>

                    </div>


                    <strong>
                        ₹${formatPrice(
                            item.price
                        )}
                    </strong>

                </div>

            `;

        }).join("");


    /* RENTORA SELLER */

    const rentoraSellerRow =
        !isRent &&
        product.salePrice

        ?

        `

            <div class="compare-row rentora-row">

                <div>

                    <strong>
                        Rentora Seller
                    </strong>

                    <small>
                        ${escapeHTML(
                            product.owner
                        )}
                    </small>

                </div>


                <strong>
                    ₹${formatPrice(
                        product.salePrice
                    )}
                </strong>

            </div>

        `

        :

        "";


    /* LOWEST PRICE */

    const allPrices = [

        ...externalPrices
            .map(
                item =>
                    Number(item.price)
            ),

        ...(
            !isRent &&
            product.salePrice
            ?
            [Number(product.salePrice)]
            :
            []
        )

    ].filter(
        price =>
            Number.isFinite(price) &&
            price > 0
    );


    const lowestPrice =
        allPrices.length
        ? Math.min(...allPrices)
        : null;


    container.innerHTML = `

        <section class="product-detail">


            <div class="detail-image">

                ${
                    product.image

                    ?

                    `
                    <img
                        src="${product.image}"
                        alt="${escapeHTML(
                            product.name
                        )}"
                    >
                    `

                    :

                    `
                    <div class="big-placeholder">

                        ${getCategoryIcon(
                            product.category
                        )}

                    </div>
                    `
                }

            </div>



            <div class="detail-info">


                <p class="product-category">

                    ${escapeHTML(
                        product.category
                    )}

                </p>



                <h1>

                    ${escapeHTML(
                        product.name
                    )}

                </h1>



                <p class="detail-variant">

                    ${escapeHTML(
                        product.brand
                    )}

                    •

                    ${escapeHTML(
                        product.model
                    )}

                    •

                    ${escapeHTML(
                        product.variant
                    )}

                </p>



                <span class="condition">

                    ${escapeHTML(
                        product.condition
                    )}

                </span>



                <div class="main-price">

                    ${
                        isRent

                        ?

                        `
                        ₹${formatPrice(
                            product.rentPrice
                        )}

                        <small>
                            /day
                        </small>
                        `

                        :

                        `
                        ₹${formatPrice(
                            product.salePrice
                        )}
                        `
                    }

                </div>



                ${
                    isRent

                    ?

                    `

                    <div class="rental-info">


                        <div>

                            <span>
                                Security Deposit
                            </span>

                            <strong>
                                ₹${formatPrice(
                                    product.deposit || 0
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Owner
                            </span>

                            <strong>
                                ${escapeHTML(
                                    product.owner
                                )}
                            </strong>

                        </div>

                    </div>



                    <button
                        class="primary-action"
                        onclick="
                            rentProduct(
                                '${escapeJS(
                                    product.name
                                )}'
                            )
                        "
                    >

                        Rent Now

                    </button>

                    `

                    :

                    `

                    <div class="rental-info">


                        <div>

                            <span>
                                Seller
                            </span>

                            <strong>
                                ${escapeHTML(
                                    product.owner
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Location
                            </span>

                            <strong>
                                ${escapeHTML(
                                    product.location ||
                                    "N/A"
                                )}
                            </strong>

                        </div>

                    </div>



                    <button
                        class="primary-action"
                        onclick="
                            buyProduct(
                                '${escapeJS(
                                    product.name
                                )}'
                            )
                        "
                    >

                        Buy Now

                    </button>

                    `

                }



                <div class="description">

                    <h3>
                        About this equipment
                    </h3>

                    <p>

                        ${escapeHTML(
                            product.description ||
                            "No description available."
                        )}

                    </p>

                </div>


            </div>

        </section>



        <section class="comparison-section">


            <div class="section-heading">

                <p>
                    PURCHASE COMPARISON
                </p>


                <h2>
                    Compare Purchase Prices
                </h2>


                <span>

                    Same model / variant:
                    ${escapeHTML(
                        product.variant
                    )}

                </span>

            </div>



            ${
                lowestPrice !== null

                ?

                `
                <div class="lowest-price">

                    <span>
                        Lowest available purchase price
                    </span>

                    <strong>
                        ₹${formatPrice(
                            lowestPrice
                        )}
                    </strong>

                </div>
                `

                :

                `
                <div class="no-price">

                    No purchase price data
                    available yet.

                </div>
                `
            }



            <div class="comparison-table">

                ${rentoraSellerRow}

                ${externalRows}

            </div>



            <p class="demo-note">

                External prices shown here are
                demo/API-fed data. Live marketplace
                prices require authorized integrations.

            </p>


        </section>

    `;

}


/* =====================================
   RENT
===================================== */

function rentProduct(name) {

    alert(

        `Rental booking for "${name}" will be connected to login, booking and payment in the next module.`

    );

}


/* =====================================
   BUY
===================================== */

function buyProduct(name) {

    alert(

        `Purchase checkout for "${name}" will be connected to login and payment in the next module.`

    );

}


/* =====================================
   LISTING TYPE
===================================== */

function setupListingType() {

    const radios =
        document.querySelectorAll(
            'input[name="listingType"]'
        );


    const rentFields =
        document.getElementById(
            "rentFields"
        );


    const sellFields =
        document.getElementById(
            "sellFields"
        );


    if (
        !radios.length ||
        !rentFields ||
        !sellFields
    ) {

        return;

    }


    function updateFields() {

        const selected =
            document.querySelector(
                'input[name="listingType"]:checked'
            );


        if (!selected) return;


        if (
            selected.value === "rent"
        ) {

            rentFields.classList.remove(
                "hidden"
            );

            sellFields.classList.add(
                "hidden"
            );


            document
                .getElementById("salePrice")
                .value = "";


        } else {

            rentFields.classList.add(
                "hidden"
            );

            sellFields.classList.remove(
                "hidden"
            );


            document
                .getElementById("rentPrice")
                .value = "";


            document
                .getElementById("deposit")
                .value = "";

        }

    }


    radios.forEach(radio => {

        radio.addEventListener(
            "change",
            updateFields
        );

    });


    updateFields();

}


/* =====================================
   OWNER FORM
===================================== */

function setupOwnerForm() {

    const form =
        document.getElementById(
            "ownerForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const selected =
                document.querySelector(
                    'input[name="listingType"]:checked'
                );


            if (!selected) {

                showFormMessage(
                    "Please select Rent or Sell.",
                    true
                );

                return;

            }


            const listingType =
                selected.value;


            const rentPrice =
                document.getElementById(
                    "rentPrice"
                ).value;


            const salePrice =
                document.getElementById(
                    "salePrice"
                ).value;


            /* VALIDATION */

            if (
                listingType === "rent" &&
                Number(rentPrice) <= 0
            ) {

                showFormMessage(
                    "Enter a valid rental price.",
                    true
                );

                return;

            }


            if (
                listingType === "sell" &&
                Number(salePrice) <= 0
            ) {

                showFormMessage(
                    "Enter a valid selling price.",
                    true
                );

                return;

            }


            const data = {

                name:
                    document.getElementById(
                        "name"
                    ).value.trim(),

                brand:
                    document.getElementById(
                        "brand"
                    ).value.trim(),

                model:
                    document.getElementById(
                        "model"
                    ).value.trim(),

                variant:
                    document.getElementById(
                        "variant"
                    ).value.trim(),

                category:
                    document.getElementById(
                        "category"
                    ).value,

                condition:
                    document.getElementById(
                        "condition"
                    ).value,

                listingType,

                /*
                   RENT ONLY
                */

                rentPrice:
                    listingType === "rent"
                    ? Number(rentPrice)
                    : null,

                /*
                   SELL ONLY
                */

                salePrice:
                    listingType === "sell"
                    ? Number(salePrice)
                    : null,

                deposit:
                    listingType === "rent"
                    ? Number(
                        document.getElementById(
                            "deposit"
                        ).value || 0
                    )
                    : null,

                owner:
                    document.getElementById(
                        "owner"
                    ).value.trim(),

                location:
                    document.getElementById(
                        "location"
                    ).value.trim(),

                description:
                    document.getElementById(
                        "description"
                    ).value.trim(),

                image:
                    document.getElementById(
                        "image"
                    ).value.trim()

            };


            try {

                const response =
                    await fetch(
                        `${API}/products`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to list equipment."
                    );

                }


                showFormMessage(
                    "✓ Equipment listed successfully!",
                    false
                );


                form.reset();


                document.querySelector(
                    'input[name="listingType"][value="rent"]'
                ).checked = true;


                setupListingType();


            } catch (error) {

                showFormMessage(
                    error.message,
                    true
                );

            }

        }
    );

}


/* =====================================
   MESSAGE
===================================== */

function showFormMessage(
    message,
    isError
) {

    const box =
        document.getElementById(
            "formMessage"
        );


    if (!box) return;


    box.textContent =
        message;


    box.className =
        isError
        ? "form-message error"
        : "form-message success";

}


/* =====================================
   PRICE FORMAT
===================================== */

function formatPrice(price) {

    return Number(
        price || 0
    ).toLocaleString(
        "en-IN"
    );

}


/* =====================================
   CATEGORY ICON
===================================== */

function getCategoryIcon(category) {

    const icons = {

        Camera: "📷",
        Drone: "🚁",
        Laptop: "💻",
        Projector: "📽️",
        Gaming: "🎮",
        Audio: "🎧",
        Vehicle: "🏍️"

    };


    return (
        icons[category] ||
        "📦"
    );

}


/* =====================================
   SECURITY HELPERS
===================================== */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeJS(value) {

    return String(
        value ?? ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /"/g,
            '\\"'
        )
        .replace(
            /\n/g,
            "\\n"
        )
        .replace(
            /\r/g,
            "\\r"
        );

}