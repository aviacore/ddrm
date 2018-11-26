import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { drizzleConnect } from 'drizzle-react';

import '../css/styles.css';

class HeaderContainer extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    const L = this.props.lightTheme;

    return (
      <header className={`${L ? '' : 'd-theme'}`}>
        <div className="header-wrapper">
          <div className="left">
            <div className="logo" />
          </div>
          <div className="right">
            <div className="nav-buttons">
              <Link to="/" className="link-to-catalog">
                <div className="icon">
                  <svg viewBox="0 0 272 272" version="1.1">
                    <defs />
                    <g id="Главная" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Group-4">
                        <circle id="Oval" fill="#5E77FF" cx="136" cy="136" r="136" />
                        <g
                          id="house-black-silhouette-without-door"
                          transform="translate(53.000000, 46.000000)"
                          fill="#F8F8F8"
                          fill-rule="nonzero">
                          <path
                            d="M163.920246,77.5766409 C166.92939,74.3023393 166.638811,69.2838135 163.271449,66.3703489 L89.083963,2.14563936 C85.7166009,-0.767825261 80.3178908,-0.706793478 77.0214148,2.28322855 L2.58176914,69.7945532 C-0.714706911,72.7845752 -0.876500467,77.7966766 2.22355063,80.9847842 L4.08985823,82.9078208 C7.18612153,86.0959284 12.1908994,86.4760386 15.2611892,83.7542352 L20.8243984,78.8251157 L20.8243984,150.98824 C20.8243984,155.415721 24.4504138,159 28.9221929,159 L57.9389742,159 C62.4107533,159 66.0367687,155.415721 66.0367687,150.98824 L66.0367687,100.503177 L103.047991,100.503177 L103.047991,150.98824 C102.983599,155.412509 106.183215,158.996788 110.654994,158.996788 L141.40551,158.996788 C145.877289,158.996788 149.503304,155.412509 149.503304,150.985028 L149.503304,79.8412413 C149.503304,79.8412413 151.040072,81.1732332 152.9356,82.8216268 C154.827881,84.4668081 158.802375,83.147665 161.811519,79.8701511 L163.920246,77.5766409 Z"
                            id="Shape"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </Link>
              <Link to="/cabinet" className="link-to-cabinet">
                <div className="icon">
                  <svg viewBox="0 0 102 102" version="1.1">
                    <defs />
                    <g id="Главная" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g
                        id="Desktop-HD-Copy-4"
                        transform="translate(-317.000000, -243.000000)"
                        fill="#5E77FF"
                        fill-rule="nonzero">
                        <path
                          d="M367.99915,243 C339.833421,243 317,265.833948 317,293.99949 C317,322.164352 339.833421,345 367.99915,345 C396.164879,345 419,322.164352 419,293.99949 C419,265.833268 396.164879,243 367.99915,243 Z M368.156659,319 L368.156659,318.999315 L367.844363,318.999315 L346,318.999315 C346,302.954464 360.030142,302.95823 363.143557,298.762791 L363.499833,296.84964 C359.125642,294.623167 356.037797,289.255251 356.037797,282.977158 C356.037797,274.706129 361.394562,268 368.000852,268 C374.607143,268 379.963907,274.706129 379.963907,282.977158 C379.963907,289.201832 376.930953,294.53619 372.615062,296.797933 L373.020774,298.972015 C376.436598,302.964052 390,303.224298 390,319 L368.156659,319 Z"
                          id="Shape"
                        />
                      </g>
                    </g>
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  };
}

const mapStateToProps = state => {
  return {
    lightTheme: state.items.lightTheme
  };
};

const Header = drizzleConnect(HeaderContainer, mapStateToProps);

export default Header;
