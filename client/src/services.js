import axios from 'axios';
import toastr from 'toastr';
import { LIMIT } from './constants/actionTypes';
import $ from 'jquery';
import 'bootstrap';
// global.$ = global.jQuery = $;

export const toastSettings = {
  closeButton: true,
  positionClass: 'toast-top-center',
  timeOut: '3500',
  showMethod: 'slideDown',
  hideMethod: 'slideUp',
};

export const apiLink =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://eventmanageronline.herokuapp.com';

/**
 * @description Handle client-side search on HTML table
 *
 * @export
 * @param {any} event - Input control event
 * @param {any} tableId - Index of the table to be searched
 */
export function searchFunction(event, tableId) {
  const input = event.target.value.toUpperCase();
  const table = document.getElementById(tableId);
  const tableRows = table.getElementsByTagName('tr');
  // Loop through all table rows, and hide those who don't match the search query
  for (let i = 0; i < tableRows.length; i++) {
    const col2 = tableRows[i].getElementsByTagName('td')[1];
    const col3 = tableRows[i].getElementsByTagName('td')[2];
    if (col2 && col3) {
      if (
        col2.innerHTML.toUpperCase().indexOf(input) > -1 ||
        col3.innerHTML.toUpperCase().indexOf(input) > -1
      ) {
        tableRows[i].style.display = ''; // show row
      } else {
        tableRows[i].style.display = 'none'; // hide row
      }
    }
  }
}

/**
 * @description - Handles setting of token object and redirection to dashboard
 *
 * @param {object} res - Response from axios request to login endpoint
 * @param {object} history - History object from signinComponent
 */
const signin = (res, history) => {
  const token = {
    value: res.data.data.Token,
    accountType: res.data.data.User.accountType,
    id: res.data.data.User.id,
  };
  localStorage.setItem('token', JSON.stringify(token));
  history.push('/dashboard');
};

/**
 * @description - Handles password recovery http request
 *
 * @export
 * @param {object} data - Request body (email) to be sent to server
 * @param {function} cb - Callback function to reset loading submitButton state
 */
export const recoverPassword = (data, cb) => {
  axios
    .post(`${apiLink}/api/v1/users/password`, data)
    .then(res => {
      toastr.info(res.data.data);
      $('#resetPassword').modal('hide');
      cb('success');
    })
    .catch(err => {
      toastr.error(err.response.data.message || err);
      cb('error');
    });
};
/**
 * @description - Validate for user signup and login
 *
 * @export
 * @param {object} userData - From login/signup form
 * @param {string} context - The content to check: login or signup
 * @returns {bool} - True or validation error message
 */
export const userValidator = (userData, context) => {
  const { username, password, name, confirmPassword } = userData;
  /**
   * @description - A function to validate login details
   *
   * @param {string} usName - Username
   * @param {string} pword - Password
   * @returns {bool} - True or validation error message
   */
  const checkLogin = (usName, pword) => {
    if (usName.trim().length < 4) {
      return 'Username must not be less than 4 characters';
    } else if (pword.trim().length < 6) {
      return 'Password must be up to 6 characters';
    }
    return true;
  };
  const loginStatus = checkLogin(username, password);
  if (context === 'login') {
    return loginStatus;
  }
  if (loginStatus !== true) {
    return loginStatus;
  } else if (name.length < 4) {
    return 'Full name must not be less than 4 characters';
  } else if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return true;
};
/**
 * @description - Clear localstorage and logout user
 *
 * @export
 * @param {string} id - Id of html modal to be closed before logout
 * @param {object} history - History prop from react component
 */
export const logout = (id, history) => {
  localStorage.clear();
  $(`${id}`).modal('hide');
  history.push('/');
};

/**
 * @description - Get center, event or user list
 *
 * @export
 * @param {object} props - Component props
 * @param {string} type - The kind of resource to get: event, center or user?
 */
export const getAll = (props, type, pageNumber, limit) => {
  let dispatchAction;
  const { history } = props;
  const token = JSON.parse(localStorage.token).value;
  if (type === 'centers') {
    dispatchAction = props.populateCenters;
  } else if (type === 'events') {
    dispatchAction = props.populateEvents;
  } else if (type === 'eventCenters') {
    dispatchAction = props.getEventCenters;
  } else {
    dispatchAction = props.populateUserList;
  }
  const url =
    type !== 'eventCenters'
      ? `${apiLink}/api/v1/${type}/?token=${token}&pageNumber=${pageNumber}&limit=${limit || LIMIT}`
      : `${apiLink}/api/v1/centers/?pageNumber=${pageNumber}&limit=${limit || LIMIT}`;
  return axios
    .get(url)
    .then(res => {
      const response = res.data.data;
      props.setDataCount(response.count);
      dispatchAction(response.data);
    })
    .catch(err => {
      const status = err.response ? err.response.status : undefined;
      if (status === 403 || status === 401) history.push('/');
      toastr.error(err);
    });
};
/**
 * @description - Handles deletion of an event
 *
 * @export
 * @param {string} url - Api link to resource to be deleted
 * @param {object} history - History prop from react component
 */
export const deleteResource = (url, history) => {
  axios
    .delete(url)
    .then(res => {
      toastr.success(res.data.data);
      history.push('/dashboard/events');
    })
    .catch(err => {
      toastr.error(err.response ? err.response.data.message : err);
      const status = err.response ? err.response.status : undefined;
      if (status === 403 || status === 401) {
        logout('#addNewEvent', history);
      }
    });
};
/**
 * @description - Handles signup and login to the app
 *
 * @export
 * @param {object} props - Compoinent props
 * @param {object} data - Request body
 * @param {string} context - Signup or login
 * @param {function} cb - Callback function to reset submitButton loading state
 */
export const onboarding = (props, data, context, cb) => {
  const { history, setAccountType } = props;
  const url = context === 'signup' ? `${apiLink}/api/v1/users` : `${apiLink}/api/v1/users/login`;
  axios
    .post(url, data)
    .then(res => {
      const message = context === 'signup' ? 'Signup successfull' : 'Login successfull';
      toastr.success(message);
      signin(res, history);
      setAccountType(res.data.data.User.accountType);
    })
    .catch(err => {
      toastr.error(err.response.data.message || err);
      cb(err.response.data.message || err);
    });
};
/**
 * @description - Hanldes http requests to get one resource
 *
 * @export
 * @param {object} props - Component props
 * @param {number} itemId - Item id to get
 * @param {string} type - Type of resource to get
 * @returns {void} - Or response data (details) for user profile
 */
export const getOne = (props, itemId, type) => {
  let dispatchAction;
  let details;
  if (type === 'centers') {
    dispatchAction = props.setCenterDetails;
  } else if (type === 'events') {
    dispatchAction = props.setEventDetail;
  } else if (type === 'users') {
    dispatchAction = props.setProfileDetails;
  } else {
    dispatchAction = props.getEventCenters;
  }
  const pageTitle = type === 'centers' ? 'centerDetails' : 'manageEvent';
  const { setPage, history } = props;
  return axios
    .get(`${apiLink}/api/v1/${type !== 'eventCenter' ? type : 'centers'}/${itemId}`)
    .then(res => {
      if (type === 'eventCenter') {
        details = [res.data.data];
        props.setDataCount(3);
      } else {
        details = res.data.data;
      }
      dispatchAction(details);
      if (type === 'events' || type === 'centers') {
        setPage(pageTitle);
      }
    })
    .catch(err => {
      toastr.error(err);
      const status = err.response ? err.response.status : undefined;
      const errorMessage = err.response ? err.response.data.message : undefined;
      if (status === 500) {
        toastr.error(errorMessage.name);
      } else {
        toastr.error(errorMessage);
      }
      if (status === 404 || status === 400) history.push(`/dashboard/${type}`);
    });
};
/**
 * @description - Handles all http post and put requests
 *
 * @export
 * @class Transactions
 */
export class Transactions {
  constructor(props, target) {
    this.props = props;
    this.target = target;
  }
  /**
   * @description Method to handle post or put http requests
   *
   * @param {number} itemiId - Id of item resource to update
   * @param {object} data - Request body
   * @param {function} cb - Callback function to reset submitButton loading state
   * @returns {viod} - Or response data if target is user profile related
   * @memberof Transactions
   */
  addOrUpdate(itemiId, data, cb) {
    let http;
    const { modalTitle, history } = this.props;
    const token = JSON.parse(localStorage.token).value;
    let dispatchAction;
    if (this.target === 'facilities') {
      dispatchAction = this.props.populateFacilities;
    } else if (this.target === 'center') {
      dispatchAction = this.props.setCenterDetails;
    } else if (this.target === 'event') {
      dispatchAction = this.props.setEventDetail;
    } else if (
      this.target === 'profilePic' ||
      this.target === 'upgrade' ||
      this.target === 'profile'
    ) {
      dispatchAction = this.props.setProfileDetails;
    }
    // capitalize target string
    const modalType = `${this.target.charAt(0).toUpperCase()}${this.target.slice(1)}`;
    if (this.target === 'profilePic') {
      http = axios.put(`${apiLink}/api/v1/users/changePic`, data);
    } else if (this.target === 'profile') {
      http = axios.put(`${apiLink}/api/v1/users/?token=${token}`, data);
    } else if (this.target === 'facilities') {
      http = axios.post(`${apiLink}/api/v1/facilities/${itemiId}?token=${token}`, data);
    } else if (this.target === 'upgrade') {
      http = axios.put(
        `${apiLink}/api/v1/users/${itemiId}/upgrade/?token=${token}&accountType=${data}`
      );
    } else if (!modalTitle) {
      http = axios.put(`${apiLink}/api/v1/events/approve/${itemiId}?token=${token}`, data);
    } else if (modalTitle === `New ${modalType}` || modalTitle.payload === `New ${modalType}`) {
      http = axios.post(`${apiLink}/api/v1/${this.target}s`, data);
    } else {
      http = axios.put(`${apiLink}/api/v1/${this.target}s/${itemiId}`, data);
    }
    let details;
    return http
      .then(response => {
        details = response.data.data;
        if (this.target === 'facilities') {
          dispatchAction(data.content);
        } else {
          dispatchAction(details);
        }
        if (this.target === 'center' || this.target === 'event') {
          history.push(`/dashboard/${this.target}s/${details.id}`);
          $('#addNewCenter, #addNewEvent, #manageFacilities').modal('hide');
        }
        toastr.success('Action Successful');
        if (cb) {
          cb();
        }
      })
      .catch(err => {
        const message = err.response ? err.response.data.message : undefined;
        if (message && typeof message !== 'object') {
          toastr.error(JSON.stringify(message));
        } else if (message) {
          let occupiedDates = '';
          message.OccupiedDates.forEach(date => {
            occupiedDates += `<li class="list-group-item">${new Date(date).toDateString()}</li>`;
          });
          toastr.options.timeOut = 0;
          const errMessage = `<ul class="list-group">
            <li class="list-group-item">Booked dates on center</li>${occupiedDates}</ul>`;
          toastr.error(errMessage, '&nbsp; Center has been booked');
          occupiedDates = '';
        } else {
          toastr.error(err);
        }
        if (cb) {
          cb('error');
        }
        const status = err.response ? err.response.status : undefined;
        if (status && (status === 403 || status === 401)) {
          logout('#addNewCenter, #addNewEvent, #manageFacilities', history);
        }
      });
  }
  /**
   * @description - Handles image upload
   *
   * @param {formData} imageData
   * @param {function} saveResource - Saves data to db after image upload
   * @param {function} cb - Callback function to reset submitButton loading state
   * @memberof Transactions
   */
  uploadImage(imageData, saveResource, cb) {
    return axios
      .post('https://api.cloudinary.com/v1_1/eventmanager/image/upload', imageData)
      .then(res => saveResource(res))
      .catch(err => {
        const status = err.response && err.response.status;
        // unsuccessful image upload
        toastr.error((status === 400 && 'Invalid image file format') || err);
        cb(err);
      });
  }
}
