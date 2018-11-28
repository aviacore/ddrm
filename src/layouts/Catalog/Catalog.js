import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import AssetsList from './AssetsList';
import ChosenModal from './ChosenModal';
import { fetchContentList } from './actions';

import LightToggler from '../LightToggler';

import icon3 from '../../img/icon3.png';
import icon4 from '../../img/icon4.png';

class CatalogContainer extends Component {
  componentDidMount() {
    this.props.fetchContentList();
  }

  render() {
    const { chosenContentId, lightTheme } = this.props;

    return (
      <div className={lightTheme ? 'catalog' : 'catalog d-theme'}>
        <div className="catalog-wrapper">
          <div className="bg" />
          <div className="bg" />
          <div className="bg" />
          <div className="list">
            <div className="list-wrapper tile">
              <div className="el header">
                <div className="id" />
                <div className="name">
                  <img src={icon3} />
                </div>
                <div className="price">
                  <img src={icon4} />
                </div>
                <div className="button" />
              </div>

              <AssetsList />
            </div>
          </div>

          <LightToggler />

          {chosenContentId && <ChosenModal />}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchContentList: () => dispatch(fetchContentList())
});

const mapStateToProps = ({ items: { chosenContentId, lightTheme } }) => ({
  chosenContentId,
  lightTheme
});

const Catalog = drizzleConnect(CatalogContainer, mapStateToProps, mapDispatchToProps);

export default Catalog;
