﻿import express from 'express';
import Centers from '../controllers/centerController';
import val from '../middlewares/validator';


const Validator = new val('centers');
const router = express.Router();

router.post('/', Validator.verify, Centers.addCenter);
router.put('/:id', Validator.verify, Centers.modifyCenter);
router.get('/', Centers.getAllCenters); // no validation required
router.get('/:id', Centers.getCenterDetails); // no validation required

export default router;
