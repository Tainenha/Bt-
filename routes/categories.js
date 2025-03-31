var express = require('express');
var router = express.Router();
let categorySchema = require('../schemas/category')

// Thêm khai báo middleware và constants
let { check_authentication, check_authorization } = require("../utils/check_auth");
let constants = require('../utils/constants');

/* GET categories listing. */
router.get('/', async function(req, res, next) {
  let categories = await categorySchema.find({})
  res.status(200).send({
    success:true,
    data:categories
  });
});

router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categorySchema.findById(id)
    res.status(200).send({
      success:true,
      data:category
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

// POST cần quyền mod
router.post('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async function(req, res, next) {
  try {
    let body = req.body;
    let newCategory = new categorySchema({
      name: body.name
    });
    await newCategory.save()
    res.status(200).send({
      success:true,
      data:newCategory
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

// PUT cần quyền mod
router.put('/:id', check_authentication, check_authorization(constants.MOD_PERMISSION), async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categorySchema.findById(id);
    if(category){
      let body = req.body;
      if(body.name){
        category.name = body.name;
      }
      await category.save()
      res.status(200).send({
        success:true,
        data:category
      });
    } else {
      res.status(404).send({
        success:false,
        message:"ID không tồn tại"
      });
    }
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

// DELETE cần quyền admin
router.delete('/:id', check_authentication, check_authorization(['admin']), async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categorySchema.findById(id);
    if(category){
      category.isDeleted = true
      await category.save()
      res.status(200).send({
        success:true,
        data:category
      });
    } else {
      res.status(404).send({
        success:false,
        message:"ID không tồn tại"
      });
    }
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

module.exports = router;