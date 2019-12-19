//  not clear why these two are necessary
import React from 'react';
import Mapper from './Mapper';
import Reservation from './Reservation';

const params = (new URL(document.location)).searchParams;
const restId = parseInt(params.get('restaurantid'), 10) || 1;

class App extends React.Component {
  constructor() {
    super();

    //  restId will come in props from Miao
    this.restId = restId;
  }

  render() {
    return (
      <div className="app">
        <Reservation />
        <Mapper />
      </div>
    );
  }
}

export default App;
