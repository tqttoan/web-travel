const getCartList = () => {
  const cartItem = localStorage.getItem("cartItem");
  return cartItem ? JSON.parse(cartItem) : [];
};

const saveCartList = (cartItem) => {
  localStorage.setItem("cartItem", JSON.stringify(cartItem));
};

const removeFromCart = (productId) => {
  let cartItem = getCartList();
  cartItem = cartItem.filter((item) => String(item.id) !== String(productId)); // Use the correct property for comparison
  saveCartList(cartItem);
  location.reload();
};

const clearCartItems = () => {
  localStorage.removeItem("cartItem");
  location.reload();
};

// update quantity of cart when users add new tour to cart
const updateQuantityCart = () => {
  let newCartList = getCartList();
  const cartQuantityIcons = document.querySelectorAll(".head__cart-quantity");
  if (cartQuantityIcons) {
    cartQuantityIcons.forEach((cartQuantityIcon) => {
      cartQuantityIcon.innerHTML = `<div class="cart__quantity">${newCartList.length}</div>`;
    });
  }
};

// format currency
const formatCurrency = (amount, locale = "vi-VN") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const cartList = getCartList();

const btnBook = document.querySelectorAll(".btn--book");
const cartListContainer = document.querySelector(".cart__list");

// Insert tour into cart list with local storage
if (btnBook.length) {
  btnBook.forEach((bnt) => {
    bnt.addEventListener("click", () => {
      const tour = {};
      const parentNode = bnt.parentElement.parentElement;

      tour.id = parentNode.querySelector(".id").textContent;
      const existedTour = cartList.find((item) => item.id == tour.id);
      if (existedTour) {
        existedTour.quantity++;
      } else {
        tour.img = parentNode
          .querySelector(".item-one__img img")
          .getAttribute("src");
        tour.name = parentNode.querySelector(
          ".item-one__name span"
        ).textContent;
        tour.prices = parseInt(
          parentNode
            .querySelector(".item-prices span")
            .textContent.replace(/[^0-9]/g, "")
        );
        tour.quantity = 1;

        cartList.unshift(tour);
      }

      saveCartList(cartList);
      alert("Add your cart successfull!");
      updateQuantityCart();
    });
  });
}

// Show shopping cart list: empty cart and not empty cart
if (cartListContainer) {
  if (cartList.length > 0) {
    let cartListHTML = `<div class="cart__list-box">
    <div class="list__group list__group-action">
      <div class="sum-tour"><span>Total:</span> ${cartList.length} tour</div>
      <div class="btn-delete-all">
        <button type="button">Delete all</button>
      </div>
    </div>
    <div class="list_hidden list__group list__group-header">
      <div class="list__items-tour">Tour</div>
      <div class=" list__items-content">
        <div class="list__items">Name</div>
        <div class="list__items">Price "VND"</div>
        <div class="list__items">Quantity</div>
        <div class="list__items">Sum "VND"</div>
        <div class="list__items">Action</div>
      </div>
    </div>`;

    cartList.forEach((cartItem) => {
      cartListHTML += `<div class="list__group list__group-item">
      <div class="id" style="display: none">${cartItem.id}</div>
      <div class="list__items-tour">
        <img src="${cartItem.img}" alt="" />
      </div>
      <div class="list__items-content">
        <div class="list__items list__items-name">${cartItem.name}</div>
        <div class="list__items list__items-price">${formatCurrency(
          cartItem.prices
        )}</div>
        <div class="list__items list__items-quantity">${cartItem.quantity}</div>
        <div class="list__items list__items-sum list__items--hidden">
          ${formatCurrency(cartItem.prices * cartItem.quantity)}
        </div>
        <div class="list__items items-button">
          <button class="btn--confirm" onclick="confirmTour(${
            cartItem.id
          })">Confirm</button>
        </div>
      </div>
      <i class="fa-solid fa-xmark btn-delete-item"></i>
    </div>`;
    });

    cartListHTML += `</div>`;
    cartListContainer.innerHTML = cartListHTML;
  } else {
    const emptyCart = `<div class="cart-empty">
        <img src="./assets/images/empty-cart-logo.jpg" alt="" />
        <p>
          Your shopping cart is currently empty.
          <a href="./book.html">Add to cart now.</a>
        </p>
      </div>`;
    cartListContainer.innerHTML = emptyCart;
  }
}

// Delete all tour in cart list
const btnDeleteAll = document.querySelector(".btn-delete-all button");
if (btnDeleteAll) {
  btnDeleteAll.addEventListener("click", () => {
    if (cartList.length === 0) {
      alert("Your cart is currently empty!");
      return;
    }
    if (confirm("Are you sure you want to delete all items in your cart?")) {
      clearCartItems();
    }
  });
}

// Delete a item from cart
const bntDeleteItem = document.querySelectorAll(".btn-delete-item");
if (bntDeleteItem) {
  bntDeleteItem.forEach((btnItem) => {
    btnItem.addEventListener("click", () => {
      let tourId = btnItem.parentElement.firstElementChild.textContent;
      btnItem.parentElement.classList.add("activeDelete");
      setTimeout(function () {
        removeFromCart(tourId);
      }, 900);
    });
  });
}

// Show confirmation message when user clicks confirm button in the cart
const confirmTour = (idTour) => {
  const userLogedIn = localStorage.getItem("userLogedIn");
  if (userLogedIn) {
    alert(
      "You have successfully confirmed. Please check your email. If after about 30 minutes you have not received an email, please contact us immediately."
    );
    removeFromCart(idTour);
  } else {
    alert(
      "You have not logged in. Please try again after logging in successfully."
    );
    window.location = "./login.html";
  }
};

// called on all pages to show quantity of cart
updateQuantityCart();
