import React from 'react';
import ReactDOM from 'react-dom';
import Reservation from './components/Reservation';
import Mapper from './components/Mapper';
import BelowMapper from './components/BelowMapper';

ReactDOM.render(<Reservation />, document.getElementById('reservation'));
ReactDOM.render(<Mapper />, document.getElementById('mapper'));
ReactDOM.render(<BelowMapper />, document.getElementById('belowmapper'));
