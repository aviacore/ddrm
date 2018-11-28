import Home from './Home';
import { drizzleConnect } from 'drizzle-react';
import { getData } from '../Catalog/actions';

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Core: state.contracts.Core,
    drizzleStatus: state.drizzleStatus,
    data: state.items.data
  };
};

const mapDispatchToProps = dispatch => ({
  getData: () => dispatch(getData())
});

const HomeContainer = drizzleConnect(Home, mapStateToProps, mapDispatchToProps);

export default HomeContainer;
