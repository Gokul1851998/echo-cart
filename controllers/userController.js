const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const ProductModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const sizeModel = require("../models/sizeModel");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const wishlistModel = require("../models/wishlistModel");
const addressModel = require("../models/addressModel");
const couponModel = require("../models/couponModel");
const user = require("../middleware/auth");
const crypto = require("crypto");
const { default: mongoose } = require("mongoose");
const { resolveContent } = require("nodemailer/lib/shared");
const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: "rzp_test_LS04j2FVS1akZj",
  key_secret: "pLcS6cFId3QitNuJzTmbHJde",
});

//----------------------------------------- START OTP ----------------------------------------------------------
// Email OTP Verification

var UserName;
var Email;
var Phone;
var Password;
var Password2;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: "techyhost18@gmail.com",
    pass: "yqbhjmaleiilaeyw",
  },
});

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

let x;
//************** END OTP ******************//

module.exports = {
  // User home page
  home: async (req, res) => {
    try {
      const allCategory = await categoryModel.find();
      const todayDeal = await ProductModel.find({ description: "SPECIAL DEAL" });
      if (req.session.userLogin) {
        const user = req.session.user;
        const userId = user._id;
        const userCart = await cartModel.findOne({ userId: userId });
        const userList = await wishlistModel.findOne({ userId: userId });
        if (userCart) {
          var cartCount = userCart.products.length;
        } else {
          var cartCount = 0;
        }
        if (userList) {
          var listCount = userList.productId.length;
        } else {
          var listCount = 0;
        }
        res.render("user/home-page", {
          user,
          cartCount,
          listCount,
          allCategory,
          todayDeal,
        });
      } else {
        res.render("user/home-page", { user: false, allCategory, todayDeal });
      }
    } catch {
      res.redirect('/error');
    }
  },

  // User signin page
  loginPage: (req, res) => {
    if (!req.session.userLogin) {
      let pass = null
      res.render("user/login", { pass });
    } else {
      res.redirect("/");
    }
  },

  signup: (req, res) => {
    req.session.repass = false;
    res.render("user/signup", { repass: req.session.repass, password: false });
  },

  //***********SIGNUP USER ****************/

  // OTP
  otp: async (req, res) => {
    console.log(req.body, "body");

    UserName = req.body.userName;
    Email = req.body.email;

    Phone = req.body.phone;
    Password = req.body.password;
    Password2 = req.body.Cpassword;

    const user = await UserModel.findOne({ email: Email });
    if (Password == Password2) {
      if (!user) {
        // send mail with defined transport object
        var mailOptions = {
          to: req.body.email,
          subject: "Otp for registration is: ",
          html:
            "<h3>OTP for account verification is </h3>" +
            "<h1 style='font-weight:bold;'>" +
            otp +
            "</h1>", // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

          res.render("user/user-otp");
        });
      } else {
        res.redirect("/login");
      }
    } else {
      res.render("user/signup", { password: true });
      // console.log(Password)
      // console.log(Password2)
    }
  },

  resendotp: (req, res) => {
    var mailOptions = {
      to: Email,
      subject: "Otp for registration is: ",
      html:
        "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>", // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      res.render("user/user-otp", { msg: "otp has been sent", x });
    });
  },

  forOtp: async (req, res) => {
    Email = req.body.email;
    //
    console.log(Email, "email");
    const user = await UserModel.find({ email: Email });
    console.log(user);
    if (user) {
      // send mail with defined transport object
      var mailOptions = {
        to: req.body.email,
        subject: "Otp for registration is: ",
        html:
          "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          otp +
          "</h1>", // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.render("user/forgotPass", { user });
      });
    } else {
      res.redirect("/forgotPass");
    }
  },

  forVerfy: async (req, res) => {
    let otp = req.body.otp
    let email = req.body.email
    console.log(req.body);
    if (otp == req.body.otp) {
      res.render('user/setPassword', { email: email })
    } else {
      res.redirect('/for-verifyOtp')
    }
  },

  resetPassword: async (req, res) => {
    let password = req.body.password
    let repassword = req.body.Cpassword
    let email = req.body.email
    if (password == repassword) {
      password = await bcrypt.hash(password, 10);
      await UserModel.findOneAndUpdate({ email: email }, { $set: { password: password } })
      res.redirect('/login')
    }
    else {
      res.redirect('/changePassword')
    }
  },

  verifyotp: (req, res) => {
    console.log(otp);
    if (req.body.otp == otp) {
      console.log("cdbksjdncknasdc");
      const newUser = UserModel({
        userName: UserName,
        email: Email,
        phone: Phone,
        password: Password,
      });
      console.log(req.body.otp, "recived otp");
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          newUser
            .save()
            .then(() => {
              res.redirect("/login");
            })
            .catch((err) => {
              console.log(err);
              res.redirect("/signup");
            });
        });
      });
    } else {
      res.redirect("");
    }
  },

  forgotPass: async (req, res) => {
    res.render("user/forgotPass", { user: null });
  },

  //************** END SIGNUP USER ***************/

  //   signin
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
      $and: [{ email: email }, { status: "Unblocked" }],
    });
    if (!user) {
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.userLogin = false;
      let pass = 'err'
      return res.render("user/login", { pass });
    }
    req.session.user = user;
    req.session.userId = user._id;
    req.session.userLogin = true;
    res.redirect("/");
  },

  userSession: (req, res, next) => {
    if (req.session.userLogin) {
      next();
    } else {
      res.redirect("/login");
    }
  },


  wishlist: async (req, res) => {
    try {
      const allCategory = await categoryModel.find();
      if (req.session.userLogin) {
        let user = req.session.user;
        const userId = user._id;
        const userCart = await cartModel.findOne({ userId: userId });
        const userList = await wishlistModel.findOne({ userId: userId });
        if (userCart) {
          var cartCount = userCart.products.length;
        } else {
          var cartCount = 0;
        }
        if (userList) {
          var listCount = userList.productId.length;
        } else {
          var listCount = 0;
        }
        let list = await wishlistModel
          .findOne({ userId: userId })
          .populate("productId");

        if (list) {
          let wish = list.productId;
          res.render("user/wishlist", {
            wish,
            allCategory,
            listCount,
            cartCount,
            user,
          });
        } else {
          res.redirect("/");
        }
      }
    } catch {
      res.redirect('/error')
    }
  },

  addToWishlist: async (req, res) => {
    if (req.session.userLogin) {
      let productId = req.params.id;
      let userData = req.session.user;
      let userId = userData._id;
      let wishlist = await wishlistModel.findOne({ userId: userId });
      if (wishlist) {
        await wishlistModel
          .findOneAndUpdate(
            { userId: userId },
            { $addToSet: { productId: productId } }
          )
          .then((response) => {
            console.log(" product added to cart successfully");
            res.json({ status: true });
          });
      } else {
        const wish = new wishlistModel({
          userId,
          productId: [productId],
        });
        await wish
          .save()
          .then((response) => {
            console.log(" product added to wishlist");
            res.json({ status: true });
          })
          .catch((err) => {
            console.log(err.message);
            res.json({ status: false });
          });
      }
    } else {
      res.redirect('/')
    }
  },

  deleteWishlist: async (req, res) => {
    let id = req.body.productId;
    let user = req.session.user;
    const userId = user._id;
    if (req.session.userLogin) {
      console.log("----------");
      console.log(userId);
      console.log(id);
      await wishlistModel
        .findOneAndUpdate({ userId }, { $pull: { productId: id } })
        .then(() => {
          res.json({ status: true });
          // res.redirect("/wishlist")
        });
    }
  },

  cart: async (req, res) => {
    try {
      if (req.session.userLogin) {
        const user = req.session.user;
        const userId = user._id;

        const list = await cartModel
          .findOne({ userId: userId })
          .populate("products.productId")
          .sort({ products: -1 });

        const allCategory = await categoryModel.find();
        const userCart = await cartModel.findOne({ userId: userId });
        const userList = await wishlistModel.findOne({ userId: userId });
        const userCoupon = await UserModel.findOne({ _id: userId });
        const applyCoupon = userCoupon.applyCoupon;
        if (list) {
          if (userCart) {
            var cartCount = userCart.products.length;
          } else {
            var cartCount = 0;
          }
          if (userList) {
            var listCount = userList.productId.length;
          } else {
            var listCount = 0;
          }
          const cartProducts = list.products;
          const cartId = list._id;
          if (cartCount == 0) {
            await cartModel.findOneAndRemove({ userId: userId })
          }
          const Total = userCart.cartTotal;

          if (applyCoupon) {
            const usedCouponlen = userCoupon.usedCoupon.length - 1;
            const usedCoupon = userCoupon.usedCoupon[usedCouponlen];
            res.render("user/cart", {
              cartId,
              cartProducts,
              Total,
              user,
              cartCount,
              allCategory,
              listCount,
              list,
              index: 1,
              usedCoupon,
              applyCoupon,
              userCart,
            });
          } else {
            res.render("user/cart", {
              cartId,
              cartProducts,
              Total,
              user,
              cartCount,
              allCategory,
              listCount,
              list,
              index: 1,
              usedCoupon: null,
              applyCoupon,
              userCart,
            });
          }
        } else {
          res.redirect('/shopping')
        }
      } else {
        res.redirect("/");
      }
    } catch {
      res.redirect('/shopping')
    }
  },

  Cartquantity: async (req, res) => {
    try {
      const _id = req.params.id;
      const User = req.session.user;
      const userId = User._id;
      // const product=await productModel.findById()
      const cartData = await cartModel.findOne({ userId: userId });

      if (cartData) {
        let productIndex = cartData.products.findIndex(
          (p) => p.productId == _id
        );

        let prodId = cartData.products[productIndex].productId;
        const product = await ProductModel.findById(prodId);
        var price = product.price;
        var price = parseInt(price);
        var quantity = cartData.products[productIndex].quantity;
        var quantity = parseInt(quantity);
        cartData.products[productIndex].quantity += 1;
        cartData.products[productIndex].total = (quantity + 1) * price;
        var cartTotal = [];
        var sum = 0;
        for (let i = 0; i < cartData.products.length; i++) {
          sum = sum + Number(cartData.products[i].total);
        }
        cartData.cartTotal = sum;
        cartData.save().then((data) => {
          res.json({ status: true });
        });
      } else {
        res.redirect("/404");
      }
    } catch (error) {
      res.redirect("/404");
    }
  },

  lessCartquantity: async (req, res) => {
    try {
      const _id = req.params.id;
      const User = req.session.user;
      const userId = User._id;
      const cartData = await cartModel.findOne({ userId: userId });

      if (cartData) {
        let productIndex = cartData.products.findIndex(
          (p) => p.productId == _id
        );
        let prodId = cartData.products[productIndex].productId;
        const product = await ProductModel.findById(prodId);
        var price = product.price;
        var price = parseInt(price);
        var quantity = cartData.products[productIndex].quantity;
        var quantity = parseInt(quantity);

        cartData.products[productIndex].quantity -= 1;
        cartData.products[productIndex].total -= price;
        var cart = cartData.cartTotal;
        var cartTotal = cart - price;
        cartData.cartTotal = cartTotal;
        cartData.save().then((data) => {
          res.json({ status: true });
        });
      } else {
        res.redirect("/error");
      }
    } catch (error) {
      res.redirect("/error");
    }
  },

  allproducts: async (req, res) => {
    try {
      const pageNum = Number(req.query.page)
      console.log(pageNum)
      const perPage = 12;
      let docCount;
      const allCategory = await categoryModel.find();
      const CountProducts = await ProductModel.find()
      const totalproducts = await ProductModel.find().countDocuments().then((documents) => {
        docCount = documents;
        return ProductModel.find({})
          .skip((pageNum - 1) * perPage)
          .limit(perPage);
      });
      const productCount = CountProducts.length

      if (req.session.userLogin) {
        const user = req.session.user;
        const userId = user._id;
        const userCart = await cartModel.findOne({ userId: userId });
        const userList = await wishlistModel.findOne({ userId: userId });
        if (userCart) {
          var cartCount = userCart.products.length;
        } else {
          var cartCount = 0;
        }
        if (userList) {
          var listCount = userList.productId.length;
        } else {
          var listCount = 0;
        }
        res.render("user/allproducts", {
          totalproducts,
          user,
          cartCount,
          allCategory,
          listCount,
          currentPage: pageNum,
          totalDocuments: docCount,
          pages: Math.ceil(docCount / perPage),
          productCount,
        });
      } else {
        res.render("user/allproducts", {
          totalproducts,
          user: false,
          allCategory,
          currentPage: pageNum,
          totalDocuments: docCount,
          pages: Math.ceil(docCount / perPage),
          productCount,
        });
      }
    } catch {
      res.redirect('/error')
    }
  },

  productpage: async (req, res) => {
    try {
      const allCategory = await categoryModel.find();
      const id = req.params.id;
      const totalproducts = await ProductModel.findById({ _id: id });

      if (req.session.userLogin) {
        const user = req.session.user;
        const userId = user._id;
        const userCart = await cartModel.findOne({ userId: userId });
        const userList = await wishlistModel.findOne({ userId: userId });
        if (userCart) {
          var cartCount = userCart.products.length;
        } else {
          var cartCount = 0;
        }
        if (userList) {
          var listCount = userList.productId.length;
        } else {
          var listCount = 0;
        }
        res.render("user/product-page", {
          totalproducts,
          user,
          cartCount,
          allCategory,
          listCount,
        });
      } else {
        res.render("user/product-page", {
          totalproducts,
          user: false,
          allCategory,
        });
      }
    } catch {
      res.redirect('/error')
    }
  },

  addToCart: async (req, res) => {
    try {
      if (req.session.userLogin) {
        let productId = req.params.id;
        let userData = req.session.user;

        let userId = userData._id;

        let product = await ProductModel.findOne({ _id: productId });
        let total = product.price;

        let cartExist = await cartModel.findOne({ userId: userId });
        console.log(cartExist, "cartExistcartExistcartExist");

        if (cartExist) {
          const productExist = await cartModel.findOne({
            userId,
            "products.productId": productId,
          });

          if (productExist) {
            if (product.category) {
              await cartModel
                .findOneAndUpdate(
                  { userId, "products.productId": productId },
                  {
                    $inc: {
                      "products.$.quantity": 1,
                      "products.$.total": total,
                      cartTotal: total,
                    },
                  }
                )
                .then((response) => {
                  console.log(" product already exist in cart");
                  res.json({ status: true });
                });
            } else {
            }
          } else {
            await cartModel
              .findOneAndUpdate(
                { userId: userId },
                {
                  $push: { products: { productId, total } },
                  $inc: { cartTotal: total },
                }
              )
              .then(() => {
                console.log(" product added to cart successfully");
                res.json({ status: true });
              });
          }
        } else {
          const cartProduct = new cartModel({
            userId,
            products: [{ productId, total }],
            cartTotal: total,
          });
          await cartProduct
            .save()
            .then(() => {
              console.log(" product added to cart successfully");
              res.json({ status: true });
            })
            .catch((err) => {
              console.log(err.message);
              res.json({ status: false });
            });
        }
      } else {
        res.redirect("/login");
      }
    } catch {
      res.redirect('/error')
    }
  },


  deleteCart: async (req, res) => {
    let productId = req.body.productId;
    let quantity = req.body.quantity;

    let userData = req.session.user;
    let userId = userData._id;
    let product = await ProductModel.findOne({ _id: productId });
    let price = product.price;

    await cartModel
      .findOneAndUpdate(
        { userId },
        {
          $pull: { products: { productId } },
          $inc: { cartTotal: -price * quantity },
        }
      )
      .then(() => {
        res.json({ status: true });
      });
  },

  productCategory: async (req, res) => {
    // res.send("You just created a User ...!!!");
    try {
      const id = req.params.id;
      const Category = await categoryModel.findById({ _id: id });
      const products = await ProductModel.find({ category: Category.category });
      const allCategory = await categoryModel.find();
      const totalproducts = await ProductModel.find();
      if (req.session.userLogin) {
        const user = req.session.user;
        const userId = user._id;
        const userCart = await cartModel.findOne({ userId: userId });
        const userList = await wishlistModel.findOne({ userId: userId });
        if (userCart) {
          var cartCount = userCart.products.length;
        } else {
          var cartCount = 0;
        }
        if (userList) {
          var listCount = userList.productId.length;
        } else {
          var listCount = 0;
        }
        res.render("user/categoryproducts", {
          user,
          cartCount,
          allCategory,
          totalproducts,
          products,
          listCount,
          Category,
        });
      } else {
        res.render("user/categoryproducts", {
          user: false,
          allCategory,
          totalproducts,
          products, Category,
        });
      }
    } catch {
      res.redirect('/error')
    }
  },

  checkout: async (req, res) => {
    try {
      if (req.session.userLogin) {
        const allCategory = await categoryModel.find();
        const user = req.session.user;
        const userId = user._id;
        const userAddress = await addressModel.find({ userId: userId });
        const userCart = await cartModel.findOne({ userId: userId });
        const userList = await wishlistModel.findOne({ userId: userId });
        const Total = userCart.cartTotal;
        if (userCart) {
          var cartCount = userCart.products.length;
        } else {
          var cartCount = 0;
        }
        if (userList) {
          var listCount = userList.productId.length;
        } else {
          var listCount = 0;
        }

        res.render("user/checkout", {
          user,
          cartCount,
          allCategory,
          Total,
          userAddress,
          userCart,
          listCount,
        });
      } else {
        res.redirect("/login");
      }
    } catch {
      res.redirect('/error');
    }
  },

  newAddress: async (req, res) => {
    try {
      if (req.session.userLogin) {
        const allCategory = await categoryModel.find();
        const user = req.session.user;
        const userId = user._id;
        console.log(user);
        const userCart = await cartModel.findOne({ userId: userId });
        const userList = await wishlistModel.findOne({ userId: userId });
        if (userCart) {
          var cartCount = userCart.products.length;
        } else {
          var cartCount = 0;
        }
        if (userList) {
          var listCount = userList.productId.length;
        } else {
          var listCount = 0;
        }

        if (user) {
          res.render("user/newAddress", {
            user,
            cartCount,
            listCount,
            allCategory,
          });
        } else {
          res.redirect("/checkout");
        }
      }
    } catch {
      res.redirect('/error')
    }
  },

  addAddress: async (req, res) => {
    try {
      if (req.session.userLogin) {
        // const address = req.body
        const user = req.session.user;
        const userId = user._id;
        console.log(req.body);



        const newAddress = await addressModel({
          userId: userId,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          mobNumber: req.body.phone,
          email: req.body.email,
          homeaddress: req.body.address,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
        });
        newAddress.save().then(() => {
          res.redirect("/checkout");
        });
      }
    } catch {
      res.redirect("/checkout");
    }
  },

  userProfile: async (req, res) => {
    try {
      const allCategory = await categoryModel.find();

      if (req.session.userLogin) {
        const user = req.session.user;
        const userId = user._id;
        const userCart = await cartModel.findOne({ userId: userId });
        const userList = await wishlistModel.findOne({ userId: userId });
        if (userCart) {
          var cartCount = userCart.products.length;
        } else {
          var cartCount = 0;
        }
        if (userList) {
          var listCount = userList.productId.length;
        } else {
          var listCount = 0;
        }

        if (user) {
          res.render("user/userProfile", {
            user,
            cartCount,
            listCount,
            allCategory,
          });
        } else {
          res.redirect("/login");
        }
      }
    } catch {
      res.redirect("/error")
    }
  },

  userOrdering: async (req, res) => {
    //  console.log(req.body);
    const userId = req.body.userId;
    const addressId = req.body.address;
    const Ids = addressId.trim();
    let address = await addressModel.findOne({ _id: Ids });
    const User = await UserModel.findById(userId);
    let cartProducts = await cartModel
      .findOne({ userId: userId })
      .populate("products.productId");
    const product = cartProducts.products;
    let count = cartProducts.products.length;
    let Total = cartProducts.cartTotal;
    const userOrder = {
      Address: {
        firstName: address.firstName,
        lastName: address.lastName,
        mobileNo: address.mobNumber,
        address: address.homeaddress,
        email: address.email,
        city: address.city,
        state: address.state,
        country: address.country,
      },
      userId: userId,
      items: product,
      paymentMethod: req.body.payment,
      totalProduct: count,
      totalAmount: Total,
      orderStatus: "Placed",
    };

    const orderId = await orderModel.create(userOrder);
    if (req.body.payment == "COD") {
      await cartModel.deleteOne({ userId: userId });
      res.json({ codSuccess: true });
    } else {
      var options = {
        amount: Total * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: "" + orderId._id,
      };
      instance.orders.create(options, function (err, order) {
        res.json({ order, userOrder, User });
      });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const userId = req.session.userId;
      await cartModel.deleteOne({ userId: userId });
      let data = req.body;
      console.log(data);

      console.log(
        data["payment[razorpay_order_id]"],
        "payment.razorpay_order_id"
      );

      let hmac = crypto
        .createHmac("sha256", "pLcS6cFId3QitNuJzTmbHJde")
        .update(
          data["payment[razorpay_order_id]"] +
          "|" +
          data["payment[razorpay_payment_id]"]
        )
        .digest("hex");
      const orderId = data["orders[receipt]"];
      console.log(hmac, "hmac");

      if (hmac == data["payment[razorpay_signature]"]) {
        console.log("hiii");
        await orderModel.updateOne(
          { _id: orderId },
          {
            $set: {
              orderStatus: "Placed",
            },
          }
        );
        res.json({ status: true });
      } else {
        res.json({ status: false });
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  orderSuccess: async (req, res) => {
    const allCategory = await categoryModel.find();

    if (req.session.userLogin) {
      const user = req.session.user;
      const userId = user._id;
      const userCart = await cartModel.findOne({ userId: userId });
      const userList = await wishlistModel.findOne({ userId: userId });
      if (userCart) {
        var cartCount = userCart.products.length;
      } else {
        var cartCount = 0;
      }
      if (userList) {
        var listCount = userList.productId.length;
      } else {
        var listCount = 0;
      }
      res.render("user/orderSuccess", {
        user,
        cartCount,
        listCount,
        allCategory,
      });
    } else {
      res.redirect("/orders");
    }
  },

  deleteAddress: async (req, res) => {
    try {
      const id = req.params.id;
      const Ids = id.trim();
      const userId = req.session.userId;
      const user = await addressModel.findOneAndDelete({ _id: Ids });
      console.log(id, "id");
      console.log(userId, "userid");
      console.log(user, "user");

      res.redirect("/checkout");
    } catch (error) {
      console.log(error.message);
    }
  },

  orderList: async (req, res) => {
    const allCategory = await categoryModel.find();
    const user = req.session.user;
    const userId = user._id;
    const userCart = await cartModel.findOne({ userId: userId });
    const userList = await wishlistModel.findOne({ userId: userId });
    if (userCart) {
      var cartCount = userCart.products.length;
    } else {
      var cartCount = 0;
    }
    if (userList) {
      var listCount = userList.productId.length;
    } else {
      var listCount = 0;
    }

    const orders = await orderModel
      .find({ userId: userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });
      console.log(orders)

    if (orders) {
      res.render("user/orders", {
        user,
        cartCount,
        listCount,
        allCategory,
        orders,
      });
    } else {
      res.redirect("/profile");
    }
  },

  addressPage: async (req, res) => {
    const allCategory = await categoryModel.find();
    const user = req.session.user;
    const userId = user._id;
    const userCart = await cartModel.findOne({ userId: userId });
    const userList = await wishlistModel.findOne({ userId: userId });
    const userAddress = await addressModel.find({ userId: userId });
    if (userCart) {
      var cartCount = userCart.products.length;
    } else {
      var cartCount = 0;
    }
    if (userList) {
      var listCount = userList.productId.length;
    } else {
      var listCount = 0;
    }
    if (userAddress) {
      res.render("user/address-page", {
        user,
        cartCount,
        listCount,
        allCategory,
        userAddress,
      });
    } else {
      res.redirect("/profile");
    }
  },

  //-------------------------------------------------------------------------
  // LOG OUT

  logout: (req, res) => {
    req.session.loggedOut = true;
    req.session.destroy();
    res.redirect("/");
  },

  couponVerify: async (req, res) => {
    try {
      const CouponCode = req.body.coupon;
      const amountTotal = req.body.amountTotal;
      let userId = req.session.userId;
      const user = await UserModel.findById(userId);
      let coupon = await couponModel.findOne({ couponId: CouponCode });
      let copdisc = coupon.couponDiscount;
      const cart = await cartModel.findOne({ userId: userId });
      const cartTotal = cart.cartTotal;
      console.log(amountTotal);
      console.log(cartTotal);
      let date = new Date();
      if (user.applyCoupon) {
        let last = amountTotal / (100 - copdisc);
        var original = last * 100;
        console.log("have copen");
        await UserModel.updateOne(
          { _id: userId },
          {
            $set: {
              applyCoupon: false,
            },
          }
        ).then((rss) => {
          console.log(rss, "rss");
        });
        await UserModel.updateOne(
          { _id: userId },
          {
            $pull: {
              usedCoupon: {
                couponId: coupon._id,
                code: coupon.couponId,
              },
            },
          }
        ).then((e) => {
          console.log(e, "eeeeeeee");
        });
        await cartModel
          .updateOne(
            { userId: userId },
            { $set: { discount: 0, cartTotal: original } }
          )
          .then((r) => {
            console.log(r, "upadated copen discout");
          });
        res.json({ removeCoupon: true });
        console.log(user.applyCoupon, "applaycopon");
      } else {
        if (CouponCode == "") {
          res.json(false);
        } else {
          if (!coupon) {
            res.json({ invalid: true });
          }
          console.log("problom");
          let existCoupon = await UserModel.findOne({
            _id: userId,
            "usedCoupon.couponId": coupon._id,
          });
          console.log(existCoupon, "existCouponexistCoupon");
          if (existCoupon) {
            res.json({ exist: true });
          } else {
            if (coupon) {
              let percentage = coupon.couponDiscount;
              if (date <= coupon.couponExpiredDate) {
                if (coupon.Amount <= amountTotal) {
                  discount = (amountTotal * percentage) / 100;
                  let totalLast = amountTotal - discount;
                  await cartModel.updateOne(
                    { userId: userId },
                    {
                      $set: { cartTotal: totalLast, discount: discount },
                    }
                  );
                  await UserModel.updateOne(
                    { _id: userId },
                    {
                      $set: {
                        applyCoupon: true,
                      },
                    }
                  );
                  await UserModel.updateOne(
                    { _id: userId },
                    {
                      $push: {
                        usedCoupon: {
                          couponId: coupon._id,
                          code: coupon.couponId,
                        },
                      },
                    }
                  );

                  res.json({ success: true });
                } else {
                  res.json({ minCart: coupon.minCartAmount });
                }
              } else {
                res.json({ expired: true });
              }
            } else {
              res.json({ invalid: true });
            }
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  viewOrder: async (req, res) => {
    try {
      const allCategory = await categoryModel.find();

      if (req.session.userLogin) {
        const orderId = req.params.id;
        const user = req.session.user;
        const userId = user._id;
        const userCart = await cartModel.findOne({ userId: userId });
        const userList = await wishlistModel.findOne({ userId: userId });
        if (userCart) {
          var cartCount = userCart.products.length;
        } else {
          var cartCount = 0;
        }
        if (userList) {
          var listCount = userList.productId.length;
        } else {
          var listCount = 0;
        }
        const orders = await orderModel
          .find({ _id: orderId })
          .populate("items.productId");
        if (orders) {
          res.render("user/view-Order", {
            user,
            cartCount,
            listCount,
            allCategory,
            orders,
            orderId,
          });
        } else {
          res.redirect("/orders");
        }
      }
    } catch {
      res.redirect('/error')
    }
  },
  cancelOrder: async (req, res) => {
    const orderId = req.params.id;
    console.log(orderId);
    await orderModel.findByIdAndUpdate(
      { _id: orderId },
      { $set: { orderStatus: "Canceled" } }
    );
    res.redirect("/orders");
  },

  changeData: async (req, res) => {
    const userId = req.body.id;
    const email = req.body.email;
    const name = req.body.name;
    const phone = req.body.phone;
    console.log(userId);
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          userName: name,
          email: email,
          phone: phone,
        },
      }
    ).then(() => {
      res.redirect("/profile");
    });
  },

  error: (req, res) => {
    res.render('user/404Page');
  },


  search: async (req, res) => {
    try {
      let search = req.body.search
      let product = await ProductModel.find({
        "$or": [
          { productName: { '$regex': search, '$options': 'i' } },
          { category: { '$regex': search, '$options': 'i' } }
        ]
      })

      const allCategory = await categoryModel.find();
      const todayDeal = await ProductModel.find({ description: "SPECIAL DEAL" });
      if (req.session.userLogin) {
        const user = req.session.user;
        const userId = user._id;
        const userCart = await cartModel.findOne({ userId: userId });
        const userList = await wishlistModel.findOne({ userId: userId });
        if (userCart) {
          var cartCount = userCart.products.length;
        } else {
          var cartCount = 0;
        }
        if (userList) {
          var listCount = userList.productId.length;
        } else {
          var listCount = 0;
        }

        res.render("user/search", {
          user,
          cartCount,
          listCount,
          allCategory,
          todayDeal,
          product,
          search,
        });
      } else {
        res.render("user/search", { user: false, allCategory, todayDeal, product, search });
      }
    } catch {
      res.redirect('/error');
    }

  },


};
