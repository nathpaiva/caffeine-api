const CapsulesDB = require('../models/Capsules');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const apiCapsules: any = {};


apiCapsules.loadCapsulesToUser = (req: any, res: any) => {
  const id = req.params.userId;
  CapsulesDB.find({
    user_id: id
  }, function (err: any, capsules: any) {
    if (err) {
      res.json({
        success: false,
        message: 'Error to load capsules'
      });
    }
    res.json({
      success: true,
      capsules
    });
  });
};

apiCapsules.loadOneCapsules = (req: any, res: any) => {
  const id = req.params.capsId;
  CapsulesDB.findOne({
    _id: id
  }, function (err: any, capsules: any) {
    if (err) {
      res.json({
        success: false,
        message: 'Error to load capsules'
      });
    }
    res.json({
      success: true,
      capsules
    });
  });
};

apiCapsules.createNewCapsule = (req: any, res: any) => {
  let newCapsuleItem = req.body;

  const errors = validationResult(req);
  if (errors.errors.length) {
    res.status(400).send({
      success: false,
      errors
    });
    return;
  }

  const capsules = new CapsulesDB(newCapsuleItem);

  capsules.save((err: any, data: any) => {
    res.status(200).json({
      success: true,
      data
    });
  });
}

apiCapsules.updateCapsule = (req: any, res: any) => {
  let query = { _id: req.params.capsId },
    mod = req.body;

  const errors = validationResult(req);
  if (errors.errors.length) {
    res.status(400).send({
      success: false,
      errors
    });
    return;
  }

  CapsulesDB.update(query, mod, function (err: any, data: any) {
    res.status(200).json({
      success: true,
      data,
      capsules: mod
    });
  });
}

apiCapsules.deleteCapsule = (req: any, res: any) => {
  var query = { _id: req.params.capsId };

  if (req.params.capsId === 'undefined' || req.params.userId === 'undefined') {
    res.status(400).json({
      success: false
    });
    return;
  }

  CapsulesDB.remove(query, function (err: any, data: any) {

    const id = req.params.userId;

    CapsulesDB.find({
      user_id: id
    }, function (err: any, capsules: any) {
      if (err) {
        res.json({
          success: false,
          message: 'Error to load capsules'
        });
      }
      res.json({
        success: true,
        capsules
      });
    });
    // res.status(200).json({
    //   success: true,
    //   data
    // });
  });
}

module.exports = apiCapsules;
