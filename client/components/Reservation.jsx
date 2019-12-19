import React from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import styled from 'styled-components';

const StyledReservation = styled.div`
  margin: auto;
  width: 300px;
  padding: 15px;
  box-shadow: rgba(153, 153, 153, 0.4) 0px 2px 8px 0px;
  font-family: 'Josefin Sans', sans-serif;
`;

const params = (new URL(document.location)).searchParams;
const restId = parseInt(params.get('restaurantid'), 10) || 92;

class Reservation extends React.Component {
  constructor(props) {
    super(props);

    // set the nearest booking time to now
    const d = new Date();
    let hrs = d.getHours();
    const mins = d.getMinutes();
    let amins;
    if (mins > 30) {
      hrs++;
      amins = '00';
    } else {
      amins = '30';
    }
    const ap = (hrs > 11) ? ' PM' : ' AM';
    hrs = (hrs > 12) ? hrs - 12 : hrs;
    const nxTm = `${hrs}:${amins}${ap}`;

    this.state = {
      findButtonStatus: 'button',
      findResponse: 'No clue what to say',
      bookingsToday: Math.floor(Math.random() * (200)) + 1,
      guests: '',
      time: nxTm,
      bookDate: new Date(),
    };

    //  restaurant number will come in props from Miao
    //  right now is sent from App
    this.restId = restId;
    //  name is the person doing the booking
    this.name = 'Superman';

    this.handleChangeGuests = this.handleChangeGuests.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.submitReservation = this.submitReservation.bind(this);
  }

  handleChangeGuests(event) {
    this.setState({
      findButtonStatus: 'button',
      guests: event.target.value,
    });
  }

  handleChangeDate(date) {
    this.setState({
      findButtonStatus: 'button',
      bookDate: date,
    });
  }

  handleChangeTime(event) {
    this.setState({
      findButtonStatus: 'button',
      time: event.target.value,
    });
  }

  submitReservation() {
    //  reservation data should all be in state
    //  disallow if #guests not specified
    const { guests, bookDate, time } = this.state;
    if (guests === '') {
      const msg = 'Please specify number of guests.';
      this.setState({
        findButtonStatus: 'response',
        findResponse: msg,
      });
      return;
    }
    if (guests > 6) {
      const msg = 'We\'re sorry, this restaurant does not accept online bookings for parties that large.  Please telephone the restaurant instead.';
      this.setState({
        findButtonStatus: 'response',
        findResponse: msg,
      });
      return;
    }
    const booking = {
      restId: this.restId,
      name: this.name,
      guests,
      time: bookDate,
    };
    //  plug time into bookDate
    const arr = time.split(':');
    let hours = parseInt(arr[0], 10);

    if (arr[1].substring(3, 5) === 'PM') {
      hours += 12;
    }
    booking.time.setHours(hours);
    booking.time.setMinutes(arr[1].substring(0, 2));
    booking.time.setSeconds(0);
    //  post to reservation api
    axios.post('/reservation', booking)
      .then(response => {
        const msg = response.data;
        let bk = 0;
        if (msg.substring(0, 5) !== 'Sorry') {
          bk = 1;
        }
        this.setState(state => ({
          findButtonStatus: 'response',
          findResponse: msg,
          bookingsToday: state.bookingsToday + bk,
        }));
      }, () => {
        const msg = 'An error occurred in processing your reservation.  Please try again later';
        this.setState({
          findButtonStatus: 'response',
          findResponse: msg,
        });
      });
  }

  render() {
    const {
      guests, findButtonStatus: fbs, bookDate, time, findResponse, bookingsToday,
    } = this.state;
    const po = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const to = [...Array(32)].map((_, i) => `${(Math.floor(i / 2 + 8 - 1) % 12) + 1}:${i % 2 ? '3' : '0'}0 ${i < 8 ? 'A' : 'P'}M`);

    let guestsText = 'Please select number of guests';
    if (guests !== '') {
      guestsText = `For ${guests}`;
    }

    const FindTableButton = () => (
      <button type="button" id="find-table-button" className="find-table-button" onClick={this.submitReservation}>
        Find a Table
      </button>
    );

    const ResponseBox = ({ response }) => (
      <div className="response-box">
        <p>{response}</p>
      </div>
    );

    return (
      <StyledReservation>
        <div id="reservation">
          <h2 style={{ textAlign: 'center' }}>Make a reservation</h2>
          <hr />
          <p style={{ fontWeight: 'bold' }}>Party size</p>
          <br />
          {/* <StyledSelect> */}
          <select value={guests} onChange={this.handleChangeGuests}>
            <option>{guestsText}</option>
            {po.map(num => <option key={num} value={num}>{num}</option>)}
          </select>
          {/* </StyledSelect> */}
          <hr />
          <p style={{ fontWeight: 'bold' }}>Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time</p>
          <br />
          <DatePicker
            selected={bookDate}
            onChange={this.handleChangeDate}
            placeholderText="Today"
          />
          <select value={time} onChange={this.handleChangeTime}>
            <option>{time}</option>
            {
              to.map(timeOption => (
                <option key={timeOption} value={timeOption}>
                  {timeOption}
                </option>
              ))
            }
          </select>
          <hr />
          {fbs === 'button'
            ? <FindTableButton />
            : <ResponseBox response={findResponse} /> }
          <br />
          <br />
          <img style={{ marginBottom: '-4' }} src="assets/ic_social_proof.png" alt="Rising line chart" />
          <span className="bookings-today">
          &nbsp;&nbsp;Booked&nbsp;
            {bookingsToday}
            &nbsp;times today
          </span>
        </div>
      </StyledReservation>
    );
  }
}

export default Reservation;
