import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import AssetsList from './AssetsList';
import { fetchContentList } from './actions';

import icon3 from '../../img/icon3.png';
import icon4 from '../../img/icon4.png';

class CatalogContainer extends Component {
  componentDidMount() {
    this.props.fetchContentList();
  }

  render() {
    return (
      <div className="catalog">
        <div className="catalog-wrapper">
          <div className="bg" />
          <div className="list">
            <div className="list-wrapper tile">
              <div className="el header">
                <div className="el-wrapper">
                  <div className="id" />
                  <div className="name">
                    <div className="name-wrapper">
                      <img src={icon3} />
                      <span>Project</span>
                    </div>
                  </div>
                  <div className="price">
                    <div className="price-wrapper">
                      <img src={icon4} />
                      <span>Price</span>
                    </div>
                  </div>
                  <div className="button" />
                </div>
              </div>
              <AssetsList />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchContentList: () => dispatch(fetchContentList())
});

const Catalog = drizzleConnect(CatalogContainer, null, mapDispatchToProps);

export default Catalog;
