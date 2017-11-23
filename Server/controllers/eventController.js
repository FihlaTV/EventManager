﻿import models from '../models/events';
import val from '../middlewares/validator';

const validator = new val('events');

class Events {

    addEvent(req, res) {
        try {
            // implement check for if such event already exists
            for (let i = 0; i < models.length; i++) {
                if (models[i].title === req.body.title && models[i].date === req.body.date
                    && models[i].venue === req.body.venue) {
                    return validator.response(res, 'error', 401, 'Event already Exists');
                }
            }
            models.push(req.body);
            return validator.response(res, 'success', 201, req.body);
        } catch (e) {
            return validator.response(res, 'error', 500, 'An error occured');
        }
    }

    modifyEvent(req, res) {
        if (validator.confirmParams(req, res)) {
            let eventid = req.params.id;
            models.forEach(event => {
                if (parseInt(eventid) === models.indexOf(event)) {
                    event = req.body;
                    return validator.response(res, 'success', 201, event);
                }
            });
            return validator.response(res, 'error', 400, 'No such event found');
        }
        return validator.confirmParams(req, res);
    }
}
const events = new Events();
export default events;
