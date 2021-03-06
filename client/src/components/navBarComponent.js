import React from 'react';
import Icon from './icon';
import { connect } from 'react-redux';
import { getAll } from '../services';
import {
  setModalTitle,
  setRequired,
  setEventDefaults,
  setCenterDefaults,
  setDataCount,
} from '../actions/pageActions';
import { getEventCenters } from '../actions/centerActions';
import { initialState } from '../reducers/pageReducer';
import PropTypes from 'prop-types';

const mapStateToProps = state => ({
  accountType: state.users.accountType,
});
const mapDispatchToProps = dispatch => ({
  setModalTitle: title => dispatch(setModalTitle(title)),
  setRequired: value => dispatch(setRequired(value)),
  setEventDefaults: data => dispatch(setEventDefaults(data)),
  setCenterDefaults: data => dispatch(setCenterDefaults(data)),
  getEventCenters: centers => dispatch(getEventCenters(centers)),
  setDataCount: count => dispatch(setDataCount(count)),
});

const NavbarList = props => (
  <li className="nav-item">
    <a
      id={props.id}
      onClick={props.setModalProps}
      className="nav-link"
      data-toggle="modal"
      data-target={props.dataTarget}
      href="#"
    >
      {props.body}
      <Icon src="glyphicons-191-plus-sign.png" alt="add" class="invert-color sidebar-toggle" />
    </a>
  </li>
);
class NavBarItem extends React.Component {
  render() {
    const setModalProps = title => {
      this.props.setModalTitle(title);
      this.props.setRequired(true);
      if (title === 'New Event') {
        getAll(this.props, 'eventCenters', 1, 1);
        this.props.setEventDefaults(initialState.eventDefaults);
      } else this.props.setCenterDefaults(initialState.centerDefaults);
    };
    return (
      <nav className="navbar fixed-top navbar-expand-sm navbar-background">
        <a href="#" data-toggle="modal" data-target="#myModalSidebar">
          <Icon
            src="glyphicons-517-menu-hamburger.png"
            class="invert-color sidebar-toggle"
            id="menu-toggle"
          />
        </a>
        <h4 className="appTitle">EventMgr</h4>
        <button
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navBody"
          aria-controls="navBody"
          aria-expanded="false"
        >
          <Icon
            src="glyphicons-517-menu-hamburger.png"
            class="invert-color"
            id="menu-toggle"
            alt="hamburger"
          />
        </button>
        <div className="collapse navbar-collapse collapsible" id="navBody">
          <ul
            className="navbar-nav nav-pills nav-fill my-lg-0 ml-auto justify-content-center"
            id="nav-body"
          >
            <NavbarList
              setModalProps={() => setModalProps('New Event')}
              id="addEvent"
              dataTarget="#addNewEvent"
              body="Add Event"
            />
            {(this.props.accountType === 'admin' || this.props.accountType === 'super') && (
              <NavbarList
                setModalProps={() => setModalProps('New Center')}
                id="addCenter"
                dataTarget="#addNewCenter"
                body="Add Center"
              />
            )}
          </ul>
        </div>
      </nav>
    );
  }
}
export const NavBar = connect(mapStateToProps, mapDispatchToProps)(NavBarItem);

NavbarList.propTypes = {
  id: PropTypes.string,
  setModalProps: PropTypes.func,
  dataTarget: PropTypes.string,
  body: PropTypes.string,
};
NavBarItem.propTypes = {
  setModalTitle: PropTypes.func,
  setRequired: PropTypes.func,
  setEventDefaults: PropTypes.func,
  setCenterDefaults: PropTypes.func,
  accountType: PropTypes.string,
};
