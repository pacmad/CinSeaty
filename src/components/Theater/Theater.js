import React from "react";
import AppContext from "../../context";
import axios from "axios";
import Seat from "./Seat";
import "./Theater.css";
import ReservationTickets from '../ReservationTickets/ReservationTickets'

class Theather extends React.Component {
  state = {
    reservedSeats: [],
    next: false
  }

  printRows = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "I", "J"];
    return rows.map(value => {
      const row = [];
      row[0] = <Seat number={value} className="letter" />;
      for (let i = 1; i < 16; i++) {
        let number = i < 8 ? i : i - 1;
        row[i] = <Seat number={number} coords={value + number} />;
        if (this.state.reservedSeats.includes(value + number)) row[i] = <Seat number={number} coords={value + number} className="taken" />;
        if (i == 8) {
          row[i] = <br />;
        }
      }
      return row;
    });
  }

  componentDidMount() {
    let reservations;
    axios.get("http://localhost:3001/api/reservations").then(res => {
      reservations = [...res.data];
      reservations.forEach(item => {
        item.seats.forEach(item => {
          this.setState({ reservedSeats: [...this.state.reservedSeats, item.seat] });
        });
      });
      //   console.log(this.state.reservedSeats)

    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ next: true });
  }

  render() {
    if (!this.state.next) {
      return (<div className="theatre-container">
        <div className="seats-container">{this.printRows()}</div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <button type="submit" value="confirm" className="theatre-next-button">
            <i className="">Next</i>
          </button>
        </form></div>
      );
    }
    return (
      <AppContext.Consumer>
        {context => (<div><ReservationTickets reservation={{ ...context }} /></div>)}
      </AppContext.Consumer>
    )
  }
}

export default Theather;
