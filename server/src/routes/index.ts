import { Router } from 'express'
import { getOrder,createOrder,updateOrder, deleteOrder, orderId, getOrderStatus } from '../controllers/orderController'
import { addToCart, checkout, clearCart, deleteProduct, getcartOrders, getCartProducts, getProduct, updateCart } from '../controllers/productController';
import { getUser,createUser,login, postForgotPassword, checkUser, updatePassword} from '../controllers/userController'
import { checkJwt } from '../middleware/checkJwt';
const  validator = require('../validations/validator');
const router: Router = Router()

router.get('/getorder', [checkJwt], getOrder)
router.post('/createorder', [checkJwt], createOrder)
router.post('/updateorder', [checkJwt], updateOrder)
router.put('/deleteorder', [checkJwt], deleteOrder)
router.get('/orderId/:id', [checkJwt], orderId)
router.get('/orderstatus', [checkJwt], getOrderStatus)

router.get('/product-list', [checkJwt], getProduct)
router.post('/cart', [checkJwt], addToCart)
router.post('/updateCart', [checkJwt], updateCart)
router.get('/getCartProducts', [checkJwt], getCartProducts)
router.put('/deleteProduct', [checkJwt], deleteProduct)
router.post('/checkout', [checkJwt], checkout)
router.put('/clear-cart', [checkJwt], clearCart)
router.get('/getCartDetails', [checkJwt], getcartOrders)
router.post('/payments', [checkJwt], getcartOrders)

router.get('/getuser', getUser)
router.post('/user', [ validator.registerValidator(), validator.validateInput ], createUser)
router.post('/signup', [ validator.registerValidator(), validator.validateInput ], createUser)
router.post('/login', [ validator.loginValidator(), validator.validateInput ], login)
router.post('/forgotPassword', postForgotPassword)
router.post('/resetPassword/:token', checkUser)
router.post('/confirm-reset-password/:token', updatePassword)

export default router
