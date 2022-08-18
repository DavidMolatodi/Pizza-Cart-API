document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function () {
    return {

      init() {
       
        axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
          .then((result) => {
            
            this.pizzas = result.data.pizzas
          })
          .then(() => {
            return this.createCart();
          })
          .then((result) => {
            this.cartId = result.data.cart_code;
          });
      },
      featuredPizzas() {
        
        return axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
      },
      postfeaturedPizzas() {
        //Get a list of featured pizzas
        return axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
      },

      createCart() {
        ///api/pizza-cart/create
        return axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
      },

      showCart() {
        const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

        axios
          .get(url)
          .then((result) => {
            this.cart = result.data;
          });
      },

      pizzaImage(pizza) {
        return `https://user-images.githubusercontent.com/34037/167313920-09aeb40f-9952-439b-8e54-a04c02caa427.png`
      },

      message: 'Eating pizzas',
      username: '',
      pizzas: [],
      featuredpizzas: [],
      cartId: '',
      cart: { total: 0 },
      paymentMessage: '',
      payNow: false,
      paymentAmount: 0,

      add(pizza) {
        const params = {
          cart_code: this.cartId,
          pizza_id: pizza.id
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
          .then(() => {
            this.message = "pizza added to the cart"
            this.showCart();
          })
          .then(() => {
            
            return this.featuredPizzas();

          })
          .then(() => {
            return this.postfeaturedPizzas();
          })
          
      },
      remove(pizza) {
        // /api/pizza-cart/remove
        const params = {
          cart_code: this.cartId,
          pizza_id: pizza.id
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
          .then(() => {
            this.message = "pizza from the cart"
            this.showCart();
          })
          .catch(err => alert(err));

      },
      pay(pizza) {
        const params = {
          cart_code: this.cartId,
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
          .then(() => {
            if (!this.paymentAmount) {
              this.paymentMessage = 'No amount entered!'
            }
            else if (this.paymentAmount >= this.cart.total.toFixed(2)) {
              this.paymentMessage = 'Payment Sucessful!'
              //this.message = this.username + "Enjoy your Pizza"
              setTimeout(() => {
                this.cart.total = 0
                this.paymentMessage = '';
                this.paymentAmount = 0;
                this.message = '';
                window.location.reload()
              }, 3000);

            } else {
              this.paymentMessage = 'Sorry: Insufficient Amount!'
              setTimeout(() => {
                this.cart.total = 0 ;
                
              }, 3000);
            }

          })
          .catch(err => alert(err));

      }

    }
  });
})

