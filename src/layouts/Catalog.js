import React, {Component} from 'react';
import { drizzleConnect } from 'drizzle-react';
import { fetchContentList, resetContentChoice, chooseContent } from '../items/actions';

import '../css/styles.css';

class CatalogContainer extends Component {
  constructor(props) {
      super(props);
      
  }

  componentDidMount = () => {
    this.props.fetchContentList();
  }

  render = () => {

    const list = this.props.contentList.map( (el) => {

      const chooseThisContent = () => {

        this.props.chooseContent(el.id);

      }

      return (
        <div className="el tile" onClick={chooseThisContent} key={el.id}>
          <div className="id"><span>{el.id}</span></div>
            <div className="name"><span>{el.name}</span></div>
            <div className="price"><span>{el.price}</span></div>
            <div className="button">
              <div></div>
            </div>
        </div>
      )
    });

    const modal = this.props.chosenContentId && (
      <div className="modal">
        <div className="background" onClick={this.props.resetContentChoice}></div>
        <div className="modal-content tile">
          <div className="modal-content-wrapper">
            Modal Window Here
          </div>
        </div>
      </div>
    );

    return (
      <div className="catalog">
        <div className="catalog-wrapper">
          <div className="bg"></div>
          <div className="bg"></div>
          <div className="bg"></div>
          <div className="list">
            <div className="list-wrapper tile">
              <div className="el header">
                <div className="id"></div>
                <div className="name">
                  <div></div>
                </div>
                <div className="price">
                  <div></div>
                </div>
                <div className="button">
                </div>
              </div>

              {list}

            </div>
          </div>
        
          {modal}
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => ({
  chooseContent: (id) => dispatch(chooseContent(id)),
  fetchContentList: () => dispatch(fetchContentList()),
  resetContentChoice: () => dispatch(resetContentChoice())
});

const mapStateToProps = state => {
  return {
    contentList: state.items.contentList,
    chosenContentId: state.items.chosenContentId
  };
};

const Catalog = drizzleConnect(CatalogContainer, mapStateToProps, mapDispatchToProps);

export default Catalog;