// variables
const openCart = document.querySelector(".open-cart");
const closeCart = document.querySelector(".close__cart");
const clearCart = document.querySelector(".clear__cart");
const cartTotal = document.querySelector(".cart__total");
const cartContent = document.querySelector(".cart__centent");
const productDom = document.querySelector(".productDom");
const arrivalsDom = document.querySelector(".arrivals-dom");
const cartOverlay = document.querySelector(".cart__overlay");
const cartDom = document.querySelector(".cart");
const itemsTotal = document.querySelector(".cart-items-total");

// active searhform
let searchForm = document.querySelector(".form-search");
document.querySelector("#search-btn").onclick = () => {
  searchForm.classList.toggle("active");
  navbar.classList.remove("active");
};
// active navbar

let navbar = document.querySelector(".navbar");
document.querySelector("#menu-btn").onclick = () => {
  navbar.classList.toggle("active");
  searchForm.classList.remove("active");
};

// active navbar and searh form when scroll
let section = document.querySelectorAll("section");
let navlinks = document.querySelectorAll(".header .navbar a");
window.onscroll = () => {
  searchForm.classList.remove("active");
  navbar.classList.remove("active");
  cartOverlay.classList.remove("show");
  cartDom.classList.remove("show");
  if (scrollY > 0) {
    document.querySelector(".header").classList.add("active");
  } else {
    document.querySelector(".header").classList.remove("active");
  }

  section.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 200;
    let hight = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + hight) {
      navlinks.forEach((link) => {
        link.classList.remove("active");
        document
          .querySelector(".header .navbar a[href*=" + id + "]")
          .classList.add("active");
      });
    }
  });
};
// active navbar and searh form when scroll

window.onload = () => {
  searchForm.classList.remove("active");
  navbar.classList.remove("active");
  if (scrollY > 0) {
    document.querySelector(".header").classList.add("active");
  } else {
    document.querySelector(".header").classList.remove("active");
  }
};

// swiper
var swiper = new Swiper(".home-slider", {
  spaceBetween: 20,
  effect: "fade",
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  autoplay: {
    delay: 5500,
    disableOnInteraction: false,
  },
});
// swiper
var swiper = new Swiper(".products-slider", {
  spaceBetween: 20,
  loop: true,
  grabCursor: true,
  autoplay: {
    delay: 5500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    991: {
      slidesPerView: 3,
    },
  },
});

// cart
let cart = [];
let iconsDom = [];
// UI
class UI {
  // displayProudcts
  displayProudcts(obj) {
    let result = "";
    let result2 = "";

    obj.forEach(({ image, title, id, price }) => {
      if (id <= 5) {
        result += `      
      <div class="swiper-slide box">
      <div class="icons">
          <a  class="fas fa-shopping-cart addtocart"  data-id=${id}></a>
          <a href="" class="fas fa-eye"></a>
          <a href="" class="fas fa-share"></a>

      </div>
      <div class="image">
          <img src=${image} alt="">
      </div>
      <div class="content">
          <h3>${title} </h3>
          <div class="price">$${price} <span>$99.99</span> </div>
      </div>
  </div>
      `;
      }

      if (id > 5) {
        result2 += `
      <div class="box" data-aos="fade-right">
      <div class="icons">
          <a  class="fas fa-shopping-cart addtocart"  data-id=${id}></a>
          <a href="" class="fas fa-eye"></a>
          <a href="" class="fas fa-share"></a>

      </div>
      <div class="image">
          <img src=${image} alt="">
      </div>
      <div class="content">
          <h3>${title} </h3>
          <div class="price">$${price} <span>$99.99</span> </div>
      </div>
  </div>
      `;
      }
    });
    productDom.innerHTML = result;
    arrivalsDom.innerHTML = result2;
  }
  // getButtons
  geticons() {
    const icons = [...document.querySelectorAll(".addtocart")];
    iconsDom = icons;
    icons.forEach((icon) => {
      const id = icon.dataset.id;
      icon.addEventListener("click", (e) => {
        e.preventDefault();
        // get product from products
        const cartItem = { ...Storage.getProudcts(id), amount: 1 };
        // add product to cart
        cart = [...cart, cartItem];
        // store the product in local storage
        Storage.saveCart(cart);
        // setItems
        this.setItemsValue(cart);
        // display the item in cart
        this.addToCart(cartItem);
      });
    });
  }
  // setItemsValue
  setItemsValue(cart) {
    let tempTotal = 0;
    let itemTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemTotal += item.amount;
    });
    itemsTotal.innerText = itemTotal;
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
  }
  // addToCart;
  addToCart({ title, price, id, image }) {
    let div = document.createElement("div");
    div.classList.add("cart__item");
    div.innerHTML = `
  
    <img src=${image} alt="">
    <div>
      <h3>${title}</h3>
      <h3 class="price">$${price}</h3>
    </div>
    <div>
      <span class="increase" data-id=${id}> <i class="fa fa-chevron-up"></i></span>

      <p>1</p>
      <span class="decrease" data-id=${id}> <i class="fa fa-chevron-down"></i></span>

    </div>

    <div>
      <span class="remove__item" data-id=${id}>
       <i  class="fa fa-trash"></i>
      </span>
    </div>
    
      `;
    cartContent.appendChild(div);
  }
  // show
  show() {
    cartDom.classList.add("show");
    cartOverlay.classList.add("show");
  }

  // hide
  hide() {
    cartDom.classList.remove("show");
    cartOverlay.classList.remove("show");
  }
  // populate
  populate(cart) {
    cart.forEach((item) => this.addToCart(item));
  }
  // setApp
  setApp() {
    cart = Storage.getCart();
    this.setItemsValue(cart);
    this.populate(cart);
    openCart.addEventListener("click", this.show);
    closeCart.addEventListener("click", this.hide);
  }
  // cartLogic
  cartLogic() {
    // Clear Cart
    clearCart.addEventListener("click", () => {
      this.clearCart();
      this.hide();
    });

    // Cart Functionality
    cartContent.addEventListener("click", (e) => {
      const target = e.target.closest("span");
      const targetElement = target.classList.contains("remove__item");
      if (!target) return;

      if (targetElement) {
        const id = parseInt(target.dataset.id);
        this.removeItem(id);
        cartContent.removeChild(target.parentElement.parentElement);
      } else if (target.classList.contains("increase")) {
        const id = parseInt(target.dataset.id, 10);
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount++;
        Storage.saveCart(cart);
        this.setItemsValue(cart);
        target.nextElementSibling.innerText = tempItem.amount;
      } else if (target.classList.contains("decrease")) {
        const id = parseInt(target.dataset.id, 10);
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount--;

        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setItemsValue(cart);
          target.previousElementSibling.innerText = tempItem.amount;
        } else {
          this.removeItem(id);
          cartContent.removeChild(target.parentElement.parentElement);
        }
      }
    });
  }
  // clearCart
  clearCart() {
    const cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
  }
  // removeItem
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setItemsValue(cart);
    Storage.saveCart(cart);


  }
  // singleButton
  singleButton(id) {
    return iconsDom.find((icon) => parseInt(icon.dataset.id) === id);
  }
}

// products

class Products {
  async getProducts() {
    try {
      const results = await fetch("products.json");
      const data = await results.json();
      let product = data.items;
      console.log(product);
      return product;
    } catch (error) {
      console.log(err);
    }
  }
}

// storage

class Storage {
  static saveProduct(obj) {
    localStorage.setItem("proudcts", JSON.stringify(obj));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getProudcts(id) {
    const proudcts = JSON.parse(localStorage.getItem("proudcts"));
    return proudcts.find((item) => item.id === parseInt(id));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = new Products();
  const ui = new UI();
  ui.setApp();
  const productObje = await products.getProducts();
  ui.displayProudcts(productObje);
  Storage.saveProduct(productObje);
  ui.geticons();
  ui.cartLogic();
});
