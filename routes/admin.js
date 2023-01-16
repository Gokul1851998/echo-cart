
var express = require('express');
var router = express.Router();

const controller = require('../controllers/adminController')
const adminSession = require('../middleware/auth')
const multer = require('../middleware/multer')   


router.get("/", controller.admin)
// router.get("/home", adminSession.adminSession, controller.home)

//  GET All page


//logout
router.get("/adminlogout",adminSession.adminSession,  controller.adminlogout) 
router.get('/showAllUser',adminSession.adminSession,  controller.showAlluser)
router.get('/view-product',adminSession.adminSession,  controller.viewproduct)
router.get('/addproductpage',adminSession.adminSession,  controller.addproductpage)
router.get("/category",adminSession.adminSession, controller.category)
router.get("/deleteproduct/:id",adminSession.adminSession,  controller.deleteproduct)
router.get('/editproductpage/:id',adminSession.adminSession,  controller.editproductpage)
router.get('/deletecategory/:id',adminSession.adminSession, controller.deletecategory)
router.get('/deletesize/:id',adminSession.adminSession, controller.deletesize) 
router.get('/allCoupons',adminSession.adminSession, controller.allCoupons)
router.get('/coupons',adminSession.adminSession, controller.addCoupon)
router.get('/orders',adminSession.adminSession, controller.orderlist)
router.get('/viewDetails/:id',adminSession.adminSession, controller.viewDetails)   
router.get('/saleReport',adminSession.adminSession, controller.saleReport)
router.get('/delete_coupon',adminSession.adminSession, controller.deleteCoupon)
router.get('/dash',adminSession.adminSession, controller.dashboard)


//-------------------------------------------------------------------------------------------------
// POST METHOD

router.post("/dashboard", controller.adminlogin)


// router.post("/adduser", adminSession.adminSession, controller.adduser)
router.post("/unblockUser/:id", controller.unblockUser)
router.post("/blockUser/:id", controller.blockUser)
router.post('/updateproduct/:id' , multer.uploadImages, multer.resizeImages  ,controller.updateproduct)
router.post('/addcategory',controller.addcategory)
router.post('/addsize',controller.addsize)
router.post('/addCoupon',controller.postAddCoupon)  
router.post('/status_change',controller.statusChange)



router.post("/addproduct", multer.uploadImages, multer.resizeImages ,controller.addproduct)





 module.exports=router