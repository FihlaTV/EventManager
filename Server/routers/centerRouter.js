﻿import express from 'express';
import Centers from '../controllers/centerController';
import Val from '../middlewares/validator';
import Auth from '../middlewares/authenticator';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: 'eventmanager',
  api_key: '789891965151338',
  api_secret: 'ynezeVbgUnGIfNYKj19GvyrflSI',
});

const Validator = new Val('centers');
const router = express.Router();

router.post('/', Validator.verify, Auth.Verify, Centers.addCenter);
router.put('/:id', Validator.verify, Auth.Verify, Centers.modifyCenter);
router.get('/', Centers.getAllCenters); // no validation required
router.get('/:id', Centers.getCenterDetails); // no validation required

export default router;
