const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const sizeModel = require("../models/sizeModel");
const coupon = require("../models/couponModel")
const bcrypt = require("bcrypt");
const e = require("express");
const db = require("../config/connection")
const fs = require('fs');
const orderModel = require("../models/orderModel");
const moment = require('moment')

module.exports = {

    //-------------------------------------------------------------------------------------------------
    // RENDING PAGES



    //login page
    admin: (req, res) => {

        if (!req.session.adminLogin) {
            let err = false
            res.render('admin/admin-login',{err})
        } else {

            res.redirect('/admin')
        }
    },


    adminlogin: async (req, res) => {
        let email = 'admin@gmail.com';
        let password = 'admin';
        if (req.body.password === password && req.body.email === email) {
            req.session.adminLogin = true
            res.redirect('/admin/dash')
        } else {
            let err = true
            res.render('admin/admin-login',{err})
        }

    },

    dashboard: async (req, res) => {
        req.session.adminLogin = true
        let newOrders = await orderModel.find().sort({ createdAt: -1 }).limit(5)
        let paymentOnline = await orderModel.find({$and:[{ paymentMethod: 'banktransfer' },{orderStatus: {$nin: "Canceled"}}]})
        let paymentCod = await orderModel.find({$and:[{ paymentMethod: 'COD' },{orderStatus: {$nin: "Canceled"}}]})
        let pending = paymentCod.reduce((acc, cur) => acc + cur.totalAmount, 0)
        let onlineCount = paymentOnline.length
        let codCount = paymentCod.length
        let payments = paymentOnline.reduce((acc, cur) => acc + cur.totalAmount, 0)
        let newUsers = await UserModel.find().sort({ createdAt: -1 }).limit(3)
        let liveOrders = await orderModel.find({ orderStatus: { $nin: ["Delivered", "Canceled"] } }).countDocuments()
        let orders = await orderModel.find({ orderStatus: { $nin: "Canceled" } })
        let usersCount = await UserModel.find({ status: 'Unblocked' }).count();
        let totalIncome = orders.reduce((acc, cur) => acc + cur.totalAmount, 0)
        let monthly = (totalIncome / 100000) * 100;
        let canceledOrder = await orderModel.find({ orderStatus: 'Canceled' }).countDocuments()

        let monthlyTtotalIncome = await orderModel.aggregate([
            {
                $match: {
                    orderStatus: "Delivered",
                },
            },
            {
                $project: {
                    totalAmount: true,
                    createdAt: true,
                },
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalIncome: { $sum: "$totalAmount" },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);
        let todayTtotalIncome = await orderModel.aggregate([
            {
                $match: {
                    orderStatus: "Delivered",
                },
            },
            {
                $project: {
                    totalAmount: true,
                    createdAt: true,
                },
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$createdAt" },
                    totalIncome: { $sum: "$totalAmount" },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);
        res.render("admin/dashboard", { usersCount, moment, newUsers, payments, newOrders, totalIncome, liveOrders, onlineCount, codCount, monthly, canceledOrder, pending,monthlyTtotalIncome });
    },


    viewproduct: async (req, res) => {

        const size = await sizeModel.find();
        const category = await categoryModel.find();
        const totalproducts = await ProductModel.find()
        res.render('admin/admin-product', { totalproducts, category, size });
        console.log(totalproducts)

    },


    addproductpage: async (req, res) => {
        const category = await categoryModel.find()
        const size = await sizeModel.find()
        if (category && size) {
            console.log(category);
            console.log(size);
            res.render('admin/admin-addproduct', { category, size })
        }

    },



    //add products
    addproduct: async (req, res) => {
        const { productName, category, size, description, price } = req.body;
        const image = req.body.images;
        const newProduct = ProductModel({
            productName,
            category,
            size,
            price,
            description,
            Image: image
        });
        console.log(newProduct, 'AdGgvbfbsf')

        await newProduct
            .save()
            .then(() => {
                console.log('fewfrgwr');
                res.redirect("/admin/view-product");
            })
            .catch((err) => {
                console.log(err.message);
                console.log('sirughiwrhg');
                res.redirect("/admin/addproductpage");
            });
    },

    blockUser: async (req, res) => {
        const id = req.params.id
        await UserModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Blocked" } })
            .then(() => {
                res.redirect('/admin/showAllUser')
                console.log('test');
            })
    },

    unblockUser: async (req, res) => {
        const id = req.params.id
        await UserModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Unblocked" } })
            .then(() => {
                res.redirect('/admin/showAllUser')
            })
    },

    // Delete and update product
    deleteproduct: async (req, res) => {
        let id = req.params.id;
        await ProductModel.findByIdAndDelete({ _id: id });
        console.log("kokok");
        res.redirect("/admin/view-product")
    },

    editproductpage: async (req, res) => {
        const id = req.params.id;
        const products = await ProductModel.findById({ _id: id })
        const category = await categoryModel.find()
        const size = await sizeModel.find()

        if (products && category && size) {
            res.render('admin/update-product', { products, category, size })
        } else {
            res.redirect('admin/view-product');
        }
    },


    updateproduct: async (req, res) => {
        try {
            const id = req.params.id
            const product = await ProductModel.findById({ _id: id })
            if (req.body.images == '') {
                await ProductModel.updateOne(
                    { _id: id },
                    {
                        $set: {
                            productName: req.body.productName,
                            category: req.body.category,
                            size: req.body.size,
                            description: req.body.description,
                            price: req.body.price,
                        },
                    }
                );
            } else {
                const img = product.Image; 
                const len = img.length;
                for (let i = 0; i < len; i++) {
                    const imgPath = img[i];
                    fs.unlink("./public/images/product/" + imgPath, function () {
                        console.log('success');
                    });
                }


                await ProductModel.updateOne(
                    { _id: id },
                    {
                        $set: {
                            productName: req.body.productName,
                            category: req.body.category,
                            size: req.body.size,
                            description: req.body.description,
                            price: req.body.price,
                            Image: req.body.images
                        },
                    }
                );

            }
            res.redirect("/admin/view-product");
        } catch (error) {
            console.log(error.message);
            console.log('catching');

        }


    },

    //-------------------------------------------------------------------------
    //  Category management

    category: async (req, res) => {
        try {
            const category = await categoryModel.find()
            const size = await sizeModel.find()


            if (size && category) {
                res.render('admin/category', { size, category })
            } else {

            }
        } catch (error) {
            console.log(error);
        }

    },


    addsize: async (req, res) => {
        const size = req.body.size
        const newSize = await sizeModel({ size })
        newSize.save().then(res.redirect('/admin/category'))
    },


    addcategory: async (req, res) => {
        const category = req.body.category
        const newCategory = await categoryModel({ category })
        newCategory.save().then(res.redirect('/admin/category'))
    },
    deletecategory: async (req, res) => {
        let id = req.params.id
        await categoryModel.findByIdAndDelete({ _id: id })
        res.redirect("/admin/category")
    },
    deletesize: async (req, res) => {
        let id = req.params.id
        await sizeModel.findByIdAndDelete({ _id: id })
        res.redirect("/admin/category")
    },

    //-------------------------------------------------------------------------

    // LOG OUT

    adminlogout: (req, res) => {
        req.session.loggedOut = true;
        req.session.destroy()
        res.redirect('/login')

    },
    showAlluser: async (req, res) => {
        const users = await UserModel.find()

        if (req.session.adminLogin) {
            res.render('admin/home', { users })
        }
        else {
            res.redirect('/admin/dashboard')
        }

    },


    addCoupon: (req, res) => {
        res.render('admin/coupons')
    },



    postAddCoupon: async (req, res) => {
        console.log(req.body);
        const newCoupon = coupon({
            couponName: req.body.couponName,
            couponId: req.body.couponId,
            couponDiscount: req.body.couponDiscount,
            couponExpiredDate: req.body.couponExpiredDate,
            Amount: req.body.Amount,

        });
        newCoupon.save().then(res.redirect('/admin/coupons'))

    },
    allCoupons: async (req, res) => {

        try {
            const couponData = await coupon.find()
            if (couponData) {
                res.render('admin/allCoupons', { couponData })
            } else {

            }
        } catch (error) {
            res.redirect('/admin/error')
        }
    },

    deleteCoupon: async (req, res) => {
        try {
            const { id } = req.query;
            console.log(id, "ididid");
            await coupon.deleteOne({ _id: id }).then((rs) => {
                console.log(rs, "rssssssssssss");
            });
        } catch (error) {
            console.log(error.message);
            // res.redirect("/admin_404");
            console.log(error.message);
        }
    },

    orderlist: async (req, res) => {
        const orders = await orderModel.find().populate('userId').sort({ createdAt: -1 });

        res.render('admin/orders', { orders });
    },


    statusChange: async (req, res) => {
        try {
            const statusBody = req.body;
            const order = await orderModel.findById(statusBody.orderId);
            if (order.paymentMethod == "COD") {
                if (statusBody.status == "Delivered") {
                    await orderModel.findByIdAndUpdate(statusBody.orderId, {
                        $set: {
                            orderStatus: statusBody.status,
                            paymentStatus: "Paid",
                        },
                    });
                } else {
                    await orderModel.findByIdAndUpdate(statusBody.orderId, {
                        $set: {
                            orderStatus: statusBody.status,
                            paymentStatus: "Unpaid",
                        },
                    });
                }
            } else {
                await orderModel.findByIdAndUpdate(statusBody.orderId, {
                    $set: {
                        orderStatus: statusBody.status,
                    },
                });
            }

            res.json(true);
        } catch (error) {
            console.log(error.message);

        }
    },

    viewDetails: async (req, res) => {
        try {
            const orderId = req.params.id
            const orders = await orderModel.findOne({ _id: orderId }).populate('items.productId');
            res.render('admin/orderDetail', { orders })
        } catch {
            console.log(error.message);
        }
    },

    saleReport: async (req, res) => {
        let orders;
        let total;
        let sort = req.query;
        if (sort.no == 1) {
            const today = moment().startOf("day");
            orders = await orderModel.find({
                orderStatus: "Placed",
                createdAt: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf("day").toDate(),
                },
            });
            total = orders.reduce((acc, cur) => acc + cur.totalAmount, 0);
        } else if (sort.no == 2) {
            const month = moment().startOf("month");
            orders = await orderModel.find({
                orderStatus: "Placed",
                createdAt: {
                    $gte: month.toDate(),
                    $lte: moment(month).endOf("month").toDate(),
                },
            });
            total = orders.reduce((acc, cur) => acc + cur.totalAmount, 0);
        }
        else if (sort.no == 3) {
            const year = moment().startOf('year')
            orders = await orderModel.find({
                orderStatus: 'Placed',
                createdAt: {
                    $gte: year.toDate(),
                    $lte: moment(year).endOf('year').toDate()
                }
            })
            total = orders.reduce((acc, cur) => acc + cur.totalAmount, 0);
        }
        else {
            orders = await orderModel.find()
            total = orders.reduce((acc, cur) => acc + cur.totalAmount, 0);
        }


        res.render("admin/salesReport", { orders, total, number: req.query.no });
    },

};