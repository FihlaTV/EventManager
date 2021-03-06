﻿import models from '../models';
import cloudinary from 'cloudinary';
import {
  cloudinaryConfig,
  errorResponseWithCloudinary,
  invalidParameter,
  confirmParams,
  compareCenters,
  centerEntry,
} from '../util';
import Val from '../middlewares/validator';
import { findById, getAll, update, create } from '../services';

const picValidator = new Val('users', 'changePic');

cloudinary.config(cloudinaryConfig);
const model = models.Centers;

const include = [
  { model: models.Events, as: 'events', limit: 2 },
  { model: models.Facilities, as: 'facilities' },
  {
    model: models.Users,
    as: 'user',
    attributes: { exclude: ['password'] },
  },
];
const attributes = { exclude: ['userId'] };

class Centers {
  // add an event
  addCenter(req, res) {
    const { picture, publicId } = req.body;
    const validateImage = picValidator.validateImage(picture, publicId);
    if (validateImage !== true) {
      return errorResponseWithCloudinary(req, res, 400, validateImage);
    }
    return models.Users.findById(req.decoded.id).then(user => {
      if (!(user.accountType === 'admin' || user.accountType === 'super')) {
        const errorMessage = 'Only an admin can perform this action';
        return errorResponseWithCloudinary(req, res, 403, errorMessage);
      }
      return model.findAll().then(centers => {
        const newEntry = centerEntry(req);
        function createNew() {
          return create(req, res, model, newEntry, attributes, include);
        }
        return compareCenters(req, res, centers, createNew);
      });
      // .catch(error => errorResponseWithCloudinary(req, res, 500, error));
    });
    // .catch(error => errorResponseWithCloudinary(req, res, 500, error));
  }

  // modify a center
  modifyCenter(req, res) {
    if (confirmParams(req, res) === true) {
      const modifiedEntry = centerEntry(req);
      const condition = { id: req.params.id, userId: req.decoded.id };
      return update(req, res, model, modifiedEntry, condition, attributes, include);
    }
    cloudinary.v2.uploader.destroy(req.body.publicId);
    return invalidParameter;
  }

  // get all centers
  getAllCenters(req, res) {
    return getAll(req, res, model, [['name', 'ASC']]);
  }
  // get center details
  getCenterDetails(req, res) {
    if (confirmParams(req, res) === true) {
      return findById(req, res, model, req.params, null, include);
    }
    return invalidParameter;
  }
}

const centerController = new Centers();
export default centerController;
