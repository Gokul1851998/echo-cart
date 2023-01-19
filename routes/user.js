const express = require('express')
const router = express.Router()



const controller = require('../controllers/userController')
const userSession = require('../middleware/auth')







//-------------------------------------------------------------------------------------------------
//get 
router.get('/',controller.home)
router.get('/login', controller.loginPage)
router.get('/signup', controller.signup)
router.get('/wishlist',controller.wishlist) 

router.get('/cart',controller.cart)
router.get('/shopping', controller.allproducts) 
router.get('/product-page/:id', controller.productpage) 
// router.get('/add-to-cart/:id',controller.addcart) 
router.get('/addToCart/:id',controller.addToCart)
router.get('/productCategory/:id',controller.productCategory)
router.get('/forgotPass',controller.forgotPass) 
router.get('/logout',controller.logout)
router.get('/checkout', controller.checkout)
router.get('/newAddress', controller.newAddress) 
router.get('/Cartquantity/:id',controller.Cartquantity) 
router.get('/lessCartquantity/:id',controller.lessCartquantity)
router.get('/profile',controller.userProfile)
router.get('/deleteAddress/:id',controller.deleteAddress)
router.get('/orders',controller.orderList)
router.get('/address-page/:id',controller.addressPage)
// router.get("/removeCart/:cartId",controller.removeCart);
router.get('/viewOrder/:id',controller.viewOrder) 
router.get('/cancelOrder/:id',controller.cancelOrder)
router.get('/orderSuccess',controller.orderSuccess)
router.get('/error',controller.error) 








//-------------------------------------------------------------------------------------------------
//post
router.post('/signup', controller.signup)
router.post('/', controller.login)
router.post('/addToWishlist/:id' , controller.addToWishlist)
router.post('/user-otp',controller.otp)
router.post('/resendotp',controller.resendotp)
router.post('/verifyotp',controller.verifyotp)

router.post('/deleteCart', controller.deleteCart)
router.post('/for-otp', controller.forOtp)
router.post('/for-verifyOtp', controller.forVerfy)
router.post('/resetPassword',controller.resetPassword)
router.post('/added',controller.addAddress)
router.post('/deleteWishlist',controller.deleteWishlist);

router.post('/user_order',controller.userOrdering)
router.post('/verify_payment',controller.verifyPayment)
router.post("/coupon_verify", controller.couponVerify);
router.post("/changeData", controller.changeData);
router.post('/search', controller.search)

// router.post('/deleteCart',controller.deleteCart) 




module.exports = router