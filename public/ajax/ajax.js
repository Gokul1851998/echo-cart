function addToCart(id) {
  
  $.ajax({
    url: "/addToCart/" + id,
    method: "get",
    success: (response) => {
    
      if (response.status) {

        let cartCount = $("#cartCount").html()
        cartCount = parseInt(cartCount) + 1 
        $("#cartCount").html(cartCount)
        Swal.fire({
          position: "center",
          icon: "success",
          title: " Added ",
          customClass: "swal-wide",
          showConfirmButton: true
      })
      }
    },
  }); 
}

function deleteCart(productId, quantity) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/deleteCart",
        data: {
          productId,
          quantity,
        },
        method: "post",
        success: (response) => {
          location.href = "/cart";
        },
      });
    }
  });
}

function addToWishlist(productId, productName) {
  $.ajax({
    url: "/addTowishlist/" + productId,
    method: "post",
    success: (response) => {
      if (response.status) {
        Swal.fire({
          icon: "success",
          text: productName,
          title: "Item added to wishlist",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please login!!",
        });
      }
    },
  });
}

function deleteWishlist(productId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/deleteWishlist",
        data: {
          productId,
        },
        method: "post",
        success: (response) => {
          $("#productCard").load(location.href + " #productCard>*", "");
          Swal.fire("Deleted!", "Your file has been removed.", "success");
        },
      });
    }
  });
}

function Cartquantity(cartId, Price) {
  $.ajax({
    url: "/Cartquantity/" + cartId,
    method: "get",
    success: (response) => {
      if (response.status) {
        var quantity = document.getElementById(`${cartId}quantity`).innerHTML;
        var quantity = parseInt(quantity);

        document.getElementById(`${cartId}quantity`).innerHTML = quantity + 1;
        document.getElementById(`${cartId}total1`).innerHTML =
          Price * (quantity + 1);
        var prodTotal = parseInt(prodTotal);
        var totalBill = document.getElementById("Total").innerHTML;
        var totalBill = document.getElementById("Totals").innerHTML;
        var total = parseInt(totalBill);
        var price = parseInt(Price);
        document.getElementById("Total").innerHTML = total + price;
        document.getElementById("Totals").innerHTML = total + price;
      } else if (response.error) {
        console.log("hello");
      }
    },
  });
}

function lessCartquantity(cartId, Price) {
  $.ajax({
    url: "/lessCartquantity/" + cartId,
    method: "get",
    success: (response) => {
      if (response.status) {
        var quantity = document.getElementById(`${cartId}quantity`).innerHTML;
        var quantity = parseInt(quantity);
        console.log(quantity, "quantityquantityquantityquantityquantity");

        var Totals = document.getElementById(`${cartId}total1`).innerHTML;
        var Totals = parseInt(Totals);
        document.getElementById(`${cartId}quantity`).innerHTML = quantity - 1;
        document.getElementById(`${cartId}total1`).innerHTML = Totals - Price;
        var totalBill = document.getElementById("Total").innerHTML;
        var totalBill = document.getElementById("Totals").innerHTML;
        var total = parseInt(totalBill);
        var price = parseInt(Price);
        document.getElementById("Total").innerHTML = total - price;
        document.getElementById("Totals").innerHTML = total - price;
        if (quantity == 1) {
          deleteCart(cartId, quantity - 1);
        }
      } else if (response.error) {
        console.log("hello");
      }
    },
  });
}

function deleteAddress(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/deleteAddress/" + id,

        method: "get",
        success: (response) => {
          location.href = "/checkout";
        },
      });
    }
  });
}
