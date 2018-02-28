import React, { Component } from 'react';
import eventNameIcon from '../resources/images/glyphicons-619-mixed-buildings.png';
import eventImageIcon from '../resources/images/glyphicons-139-picture.png';
import eventDateIcon from '../resources/images/glyphicons-46-calendar.png';
import eventTimeIcon from '../resources/images/glyphicons-54-alarm.png';
import { FormGroup } from './formGroup';
import { ModalHeader } from './modalHeader';
import { Option } from './selectOption';
import axios from 'axios';
import { Redirect } from 'react-router';
import { logout } from '../reusables';
import { connect } from 'react-redux';
import { setEventDetail } from '../actions/eventActions';

const inputAttrs = (inputType, inputName, placeholder, className, ref, required) => {
  return { inputType, inputName, placeholder, className, ref, required };
};

const mapDispatchToProps = dispatch => {
  return {
    setEventDetail: event => dispatch(setEventDetail(event)),
  };
};

class AddEventComponent extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    const newEvent = new FormData();
    newEvent.append('title', this.name.value);
    newEvent.append('picture', this.picture.files[0]);
    newEvent.append('date', this.date.value);
    newEvent.append('time', this.time.value);
    newEvent.append('description', this.description.value);
    newEvent.append('centerId', this.center.value);
    newEvent.append('token', JSON.parse(localStorage.token).value);

    axios.post('http://localhost:8080/api/v1/events', newEvent)
      .then(res => {
        alert('Successful');
        this.props.history.push(`/dashboard/events/${res.data.data.id}`);
        this.props.setEventDetail(res.data.data);
      }).catch(err => {
        (typeof err.response.data.message !== 'object') && alert(JSON.stringify(err.response.data.message));
        (err.response.status === 403 || err.response.status === 401) && logout('addNewEvent', this.props.history);
        if (typeof err.response.data.message === 'object') {
          let occupiedDates = '';
          err.response.data.message.OccupiedDates.forEach(date => {
            occupiedDates += `${new Date(date).toDateString()}\n`;
          });
          alert(`MESSAGE:\n${err.response.data.message.Sorry}\n\nSELECTED DATES:\n${occupiedDates}`);
          occupiedDates = '';
        }
      });
    event.preventDefault();
  }
  render() {
    const content = (
      <div className="modal fade" role="dialog" id="addNewEvent" tabIndex="-1" aria-labelledby="addNewEventLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content eventModal">
            <ModalHeader id='addNewEventTitle' title='New Event' />
            <div className="modal-body mx-sm-auto col-sm-10">
              <form role="form" onSubmit={this.handleSubmit}>
                <FormGroup image={eventNameIcon} alt='eventname' inputProps={inputAttrs('text', 'eventname', 'Event Name', 'form-control input-sm', input => this.name = input, 'required')} />
                <FormGroup image={eventImageIcon} alt='eventImage' inputProps={inputAttrs('file', 'eventImage', 'Event Image', 'form-control input-sm', input => this.picture = input)} />
                <FormGroup image={eventDateIcon} alt='eventdate' inputProps={inputAttrs('date', 'eventdate', 'Event Date', 'form-control input-sm', input => this.date = input, 'required')} />
                <FormGroup image={eventTimeIcon} alt='eventTime' inputProps={inputAttrs('time', 'eventTime', 'Event Time', 'form-control input-sm', input => this.time = input, 'required')} />
                <div className="form-group">
                  <label htmlFor="description" className="control-label">Description</label>
                  <textarea required name="description" ref={input => this.description = input} rows="2" className="form-control"></textarea>
                </div>
                <div className="form-group">
                  <select required ref={input => this.center = input} className="custom-select-sm">
                    <Option value='' text='Select Center' disabled selected />
                    <Option value="1" text='House on the Rock, Ikeja, Lagos. Capacity: 500' />
                    <Option value="2" text='Christ embassy hall, Ikeja, Lagos. Capacity: 2300' />
                    <Option value="3" text='House on the Rock FCT, Abuja. Capacity: 1200' />
                    <Option value="4" text='National Assembly Conference Hall, Abuja. Capacity: 4500' />
                    <Option value="5" text='National Stadium, Owerri, Imo. Capacity: 85,000' />
                    <Option value="100009" text='Invalid center' />
                  </select>
                  <div className="modal-footer">
                    <button type="submit" className='btn btn-success createEvent'>Save</button>
                    <button className="btn btn-danger" data-dismiss="modal">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
    return content;
  }
}

export const AddEvent = connect(null, mapDispatchToProps)(AddEventComponent);