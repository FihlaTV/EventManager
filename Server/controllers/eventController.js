﻿import models from '../models';
import val from '../middlewares/validator';

const validator = new val('events');
const model = models.Events;


class Events {
    // add an event
    addEvent(req, res) {
        return model.findAll()
            .then(events => { // destructuring
                const { title, date, time, description, userId, picture, centerId } = req.body;
                const timestamp = new Date(`${date} ${time}`);
                const day = timestamp.getDate();
                const month = timestamp.getMonth();
                const year = timestamp.getFullYear();
                console.log(`Time stamp generated: ${timestamp}`);

                if (events.length !== 0) {
                    const occupiedDates = [];
                    events.forEach(event => {
                        const eventDate = event.date;
                        const eventDay = eventDate.getDate();
                        const eventMonth = eventDate.getMonth();
                        const eventYear = eventDate.getFullYear();

                        if (event.centerId === parseInt(centerId)) {
                            occupiedDates.push(eventDate);
                        }
                        if (event.centerId === parseInt(centerId) && eventDay === day && eventMonth === month
                            && eventYear === year) {
                            // forbidden
                            const errorMessage = {
                                Sorry: `Selected date is already occupied for centerId: ${centerId}`,
                                OccupiedDates: occupiedDates,
                            };
                            return validator.response(res, 'err', 403, errorMessage);
                        }
                    });
                }
                const newEntry = { title, date: timestamp, description, picture, userId, centerId };
                return model.create(newEntry)
                     .then(created => validator.response(res, 'success', 201, created))
                     .catch(error => validator.response(res, 'error', 500, error));

            }).catch(error => validator.response(res, 'error', 500, error));
    }

    // modify an event
    modifyEvent(req, res) {
        // get event with same index as parameter and change the value
        if (validator.confirmParams(req, res)) { // destructuring
            const { title, date, time, description, picture, userId, centerId } = req.body;
            const modifiedEntry = { title, date, time, description, userId, centerId };
            return model.update(modifiedEntry, { where: { id: req.params.id, userId: userId } })
               .then(updatedEvent => {
                   if (updatedEvent[0] === 1) {
                       return validator.response(res, 'success', 202, 'Update successful');
                   }
                   // trying to update an event whose id does not exist
                   // and or which doesnt belong to the user
                   return validator.response(res, 'error', 403, 'Invalid transaction');
               })
               .catch(error => validator.response(res, 'error', 500, error));
        }
        return validator.invalidParameter;
    }

    // delete an event
    deleteEvent(req, res) {
        // get recipe where index is same as id parameter and delete
        if (validator.confirmParams(req, res)) {
            return model.destroy({ where: { id: req.params.id } }) // userId: req.decoded
                .then(destroyed => {
                    if (destroyed) {
                        return validator.response(res, 'success', 200, 'Successfully deleted');
                    }
                    // Event does not exist or User not priviledged to delete
                    return validator.response(res, 'err', 400, 'Invalid transaction');
                })
                .catch(error => validator.response(res, 'error', 500, error));
        }
        return validator.invalidParameter;
    }

    // Get all events
    getEvents(req, res) {
        // gets all users' details excluding password
        return model.findAll()
            .then(allEvents => {
                if (allEvents.length !== 0) {
                    return validator.response(res, 'success', 200, allEvents);
                }
                return validator.response(res, 'error', 200, 'No events available');
            }).catch(error => validator.response(res, 'error', 500, error));
    }
}

const events = new Events();
export default events;
