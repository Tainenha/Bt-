var express = require('express');
var router = express.Router();
const roleSchema = require('../schemas/role');

// GET roles: không yêu cầu đăng nhập
router.get('/', async function (req, res, next) {
  let roles = await roleSchema.find({});
  res.send({
    success: true,
    data: roles
  });
});

// POST role - yêu cầu quyền admin
let { check_authentication, check_authorization } = require("../utils/check_auth");
router.post('/', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  let body = req.body;
  let newRole = new roleSchema({
    name: body.name
  });
  await newRole.save();
  res.status(200).send({
    success: true,
    data: newRole
  });
});

module.exports = router;