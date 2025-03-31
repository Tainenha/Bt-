var express = require('express');
var router = express.Router();
var userControllers = require('../controllers/users')
let { check_authentication, check_authorization } = require("../utils/check_auth");
let constants = require('../utils/constants');

/* GET users listing - chỉ cho mod (loại trừ user hiện tại) */
router.get('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
    try {
      let users = await userControllers.getAllUsers();
      // Lọc bỏ user đang đăng nhập
      users = users.filter(u => u._id.toString() !== req.user._id.toString());
      res.send({
        success: true,
        data: users
      });
    } catch (error) {
      next(error)
    }
});

// GET user theo id (loại trừ nếu id trùng với user đăng nhập)
router.get('/:id', check_authentication, check_authorization(constants.MOD_PERMISSION), async function(req, res, next) {
    try {
      if(req.params.id === req.user._id.toString()){
          return res.status(403).send({ success: false, message: "Không được xem chi tiết tài khoản của chính bạn" });
      }
      let user = await userControllers.getUserById(req.params.id);
      if(user){
          res.status(200).send({
            success: true,
            data: user
          });
      } else {
          res.status(404).send({
            success: false,
            message: "Không tìm thấy user"
          });
      }
    } catch(error) {
      next(error)
    }
});

// POST: tạo user - cần quyền admin
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userControllers.createAnUser(
      body.username,
      body.password,
      body.email,
      body.role
    )
    res.status(200).send({
      success: true,
      message: newUser
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

// PUT: cập nhật user - cần quyền admin
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body;
    let updatedUser = await userControllers.updateAnUser(req.params.id, body);
    res.status(200).send({
      success: true,
      message: updatedUser
    });
  } catch (error) {
    next(error)
  }
});

// DELETE: xóa user - cần quyền admin
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let deleteUser = await userControllers.deleteAnUser(req.params.id);
    res.status(200).send({
      success: true,
      message: deleteUser
    });
  } catch (error) {
    next(error)
  }
});

module.exports = router;