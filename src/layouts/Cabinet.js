import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { fetchPurchasedContentList, changeTheme } from '../items/actions';
import LightToggler from './LightToggler';

import '../css/styles.css';
import iconBalance from '../img/icon4.png';
import icon3 from '../img/icon3.png';
import iconClock from '../img/clock.png';

class CabinetContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.props.fetchPurchasedContentList();
  };

  render = () => {
    const { purchasedContentList, lightTheme, user } = this.props;

    const list = user.purchasedContentList.map(el => {
      return (
        <div className="el">
          <div className="project tile">
            <div className="id">
              <span>{el.id}</span>
            </div>
            <div className="name">
              <span>{el.name}</span>
            </div>
          </div>
          <div className="time tile">
            <div className="time-wrapper">
              <span>{el.time}</span>
            </div>
          </div>
        </div>
      );
    });

    console.log(user.avatarUrl);

    return (
      <div className="cabinet">
        <div className="cabinet-wrapper">
          <div className="page">
            <div className="page-wrapper">
              <div className="sidebar tile">
                <div className="sidebar-wrapper">
                  <div className="avatar">
                    <div style={{ backgroundImage: user.avatarUrl }} />
                  </div>
                  <div className="address">
                    <span>{user.address}</span>
                  </div>
                  <div className="separator" />
                  <div className="balance">
                    <img src={iconBalance} className="icon" />
                    <div className="number">
                      <span>{user.balance}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list tile">
                <div className="list-wrapper">
                  <div className="el header">
                    <div className="project">
                      <div className="header-icon">
                        <img src={icon3} />
                      </div>
                    </div>
                    <div className="time">
                      <div className="time-wrapper header-icon">
                        <img src={iconClock} />
                      </div>
                    </div>
                  </div>

                  {list}
                </div>
              </div>
            </div>
          </div>
          <LightToggler />
        </div>
      </div>
    );
  };
}

const mapDispatchToProps = dispatch => ({
  fetchPurchasedContentList: () => dispatch(fetchPurchasedContentList()),
  changeTheme: () => dispatch(changeTheme())
});

const mapStateToProps = state => {
  return {
    purchasedContentList: state.items.purchasedContentList,
    lightTheme: state.items.lightTheme,
    user: state.items.user
  };
};

const Cabinet = drizzleConnect(CabinetContainer, mapStateToProps, mapDispatchToProps);

export default Cabinet;
