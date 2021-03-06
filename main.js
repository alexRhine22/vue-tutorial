// PRODUCT COMPONENT OF PAGE
Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true  
    }
  },
  template: 
  `
  <div class="product">
    <div class="product-image">
      <img v-bind:src="image">
    </div>

    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if="inStock">In Stock</p>
      <p v-else>Out of Stock</p>
      <p>Shipping: {{ shipping }}</p>

      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>

      <div v-for="(variant, index) in variants" 
        :key="variant.variantId"
        class="color-box"
        :style="{ backgroundColor: variant.variantColor}"
        @mouseover="updateProduct(index)">
      </div>

      <button v-on:click='addToCart' 
        :disabled="!inStock"
        :class="{ disabledButton: !inStock }">
      Add to Cart
      </button>
    </div>

    <div>
      <h2>Reviews</h2>
      <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
          </li>
        </ul>
      <product-review @review-submitted="addReview"></product-review>    
    </div>
  </div>
  `,
  data() {
    return {
      product: 'Socks', // product name
      brand: 'Vue Mastery', // product brand
      selectedVariant: 0, 
      details: ['80% cotton', '20% polyester', 'Gender-neutral'], // product description array
      variants: [
        {
          variantId: 2234,
          variantColor: 'Green',
          variantImage: './assets/vmSocks-green.jpg',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: 'Blue',
          variantImage: './assets/vmSocks-blue.jpg',
          variantQuantity: 0
        }
      ],
      reviews: [] // array of product reviews
    }
  },
  methods: {
    addToCart: function () {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    updateProduct: function (index) {
      this.selectedVariant = index
    },
    addReview(productReview) {
      this.reviews.push(productReview)
    }
  },
  computed: {
    // title = brand + name of product
    title() {
      return this.brand + ' ' + this.product
    },
    // image = current product variant image 
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if (this.premium) {
        return 'Free' // if the user is a premium user.  shipping is free
      }
      return '$2.99' // non premium user shipping price
    }
  }
});

// PRODUCT REVIEW COMPONENT OF PAGE
Vue.component('product-review', {
  template: 
  `
  <form class="review-form" @submit.prevent="onSubmit">
  <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name" placeholder="name">
  </p>
  
  <p>
    <label for="review">Review:</label>      
    <textarea id="review" v-model="review" required></textarea>
  </p>
  
  <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating">
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>
      
  <p>
    <input type="submit" value="Submit">  
  </p>    

</form>
  `, 
  data() {
    return {
      name: null, // name of product review
      review: null, // product review description
      rating: null // product review rating
    }
  },
  methods: {
    // on submit of product review
    onSubmit() {
      let productReview = {
        name: this.name,
        review: this.review,
        rating: this.rating
      }
      this.$emit('review-submitted', productReview)
      this.name = null
      this.review = null
      this.rating = null
    }
  }
});

// VIEW INSTANCE
var app = new Vue({
  el: '#app',
  data: {
    premium: true, 
    cart: [] 
  },
  methods: {
    // when add to cart button is clicked add product variant id to cart
    updateCart(id) {
      this.cart.push(id)
    }
  }
});
