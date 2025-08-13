const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth } = require("../utils/auth");

//Authentication
router.post("/register", userController.userRegisterCtrl);
router.post("/login", userController.userLoginCtrl);
router.post("/verifyOtp", userController.verifyOtpCtrl);
router.post('/resendOtp', userController.resendOtpCtrl);

//categories
router.get("/categories", userController.getAllCtgrsCtrl); // Protected route to fetch all users
router.post("/selectCategory", auth, userController.selectCtgryCtrl);
router.get("/subCategories", userController.getSubCtgrsCtrl);
router.get("/subCategoryProductsInfo", userController.getSubctrgyProductsInfoCtrl);
router.get("/productDetailInfo", userController.getProductDetailInfoCtrl);

//addToCart
router.post("/checkStockAvailbilityForCheckCart", auth, userController.checkStockAvailbilityForCheckCartCtrl);
router.post("/checkStockAvailbilityForAddToCart", auth, userController.checkStockAvailbilityForAddToCartCtrl);
router.get("/getCartInfoCount", userController.getCartInfoCountCtrl);
router.post("/postDeliveryType", userController.postDeliveryTypeCtrl);
router.delete("/removeItemFromCart", userController.removeItemFromCartCtrl);


//dashboard
router.get("/getAllSubcategories", userController.getAllSubcategoriesCtrl);
router.post("/subCategoryProducts", userController.subCtgryProductsCtrl);
router.get("/getAllsubCategoryProductItems", userController.getSubctrgyProductsItemsCtrl);
router.post("/postStockVariants", userController.postStockVariantsCtrl);
router.get("/getAllSpecifications", userController.getAllSpecificationsCtrl);
router.post("/postProductSpecifications", userController.postProductSpecificationsCtrl);
router.get("/getproductColors", userController.getProductColorCtrl);
router.get("/getproductSizes", userController.getProductSizesCtrl);
router.get("/specificationsInfo", userController.getSpecificationsInfoCtrl);
module.exports = router;