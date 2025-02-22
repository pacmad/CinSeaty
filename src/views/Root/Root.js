import React from "react";
import axios from "axios";
import Moment from "moment";
import "./index.css";
import AppContext from "../../context";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "../Home/Home";
import Contact from "../Contact/Contact";
import Reservation from "../Reservation/Reservation";
import Navbar from "../../components/Navbar/Navbar";
import MovieDetails from "../../components/MovieDetails/MovieDetails";
//import PopUp from "../../components/Pop-up-site/Content";

class Root extends React.Component {
  state = {
    movies: [],
    activeMovie: null,
    activeDate: Moment().format("D.M"),
    isMovieDetailsOpen: false,
    reservation: {
      programme_id: "5d9623e09142db405c99a22d",
      seats: [{
        seat_id: "5d9624c58b7ae53ab4d299e6"
      }, {
        seat_id: "5d9624c58b7ae53ab4d299e8"
      }]
    }
  };

  componentDidMount() {
    axios.get("http://localhost:3001/api/movies").then(res => {
      console.log(res.data);
      this.setState({ movies: res.data });
    });
  }

  activeMovie = e => {
    function check(element) {
      if (
        e.target.textContent === element.title ||
        e.target.alt === element.title
      ) {
        return element;
      }
    }
    let x = this.state.movies.find(check);
    this.setState({
      activeMovie: x
    });
  };

  openMovieDetails = () => {
    this.setState({
      isMovieDetailsOpen: true
    });
  };

  closeMovieDetails = () => {
    this.setState({
      isMovieDetailsOpen: false
    });
  };

  updateValue = (key, val) => {
    this.setState({ [key]: val });
  };

  render() {
    const { isMovieDetailsOpen } = this.state;
    const contextElements = {
      ...this.state,
      openDetails: this.openMovieDetails,
      closeDetails: this.closeMovieDetails,
      activeMovie: this.activeMovie,
      updateValue: this.updateValue
    };
    console.log(contextElements);
    return (
      <BrowserRouter>
        <AppContext.Provider value={contextElements}>
          <Navbar value={this.state.movies} />
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Home
                  openMovieDetails={this.openMovieDetails}
                  closeMovieDetails={this.closeMovieDetails}
                  activeMovie={this.state.activeMovie}
                  activeDate={this.state.activeDate}
                />
              )}
            />
            <Route path="/contact" component={Contact} />
            <Route path="/reservation" component={Reservation} />
          </Switch>
          {isMovieDetailsOpen && (
            <MovieDetails
              openMovieDetails={this.openMovieDetails}
              closeMovieDetails={this.closeMovieDetails}
              activeMovie={this.state.activeMovie}
            />
          )}
        </AppContext.Provider>
      </BrowserRouter>
    );
  }
}

export default Root;
