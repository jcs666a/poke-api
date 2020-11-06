import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      searchValue: '',
      notFound: false,
      image: '',
      data: null,
      isLoading: false
    };
  }

  setVal = ({target}) => {
    this.setState({
      notFound: false,
      searchValue: target.value,
      data: null
    });
  }

  searchPokemon = async () => {
    const { searchValue } = this.state;
    if(searchValue) {
      this.setState({
        isLoading: true
      });

      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchValue}`, (res)=>(res));
        this.setState({
          image: data.sprites.other['official-artwork'].front_default,
          data: data,
          isLoading: false
        });
      } catch(e) {
        this.setState({
          notFound: true,
          data: null,
          isLoading: false
        });
      }
    }
  }

  render() {
    const {
      isLoading,
      notFound,
      searchValue,
      image,
      data
    } = this.state;

    return (
      <div className="App">
        <div className="header">
          <h1>Catch them all</h1>
          <input type="text" readOnly={isLoading} onKeyUp={({key}) => (key === 'Enter' && this.searchPokemon())} onChange={this.setVal} value={searchValue} />
          <button disabled={isLoading} onClick={this.searchPokemon}>Catch</button>
        </div>

        {isLoading && <h3>Cargando...</h3>}

        {!data && !notFound && !isLoading && <h3>No Pokemon captured yet</h3>}

        {notFound && !isLoading && <h3>Pokemon not found</h3>}

        {!notFound && data && !isLoading &&
          <div className="pokemon-container">
            <h3>{data.name} <span>id: {data.id}</span></h3>
            <img src={image} alt={data.name} />
            <div>
              <h4>Abilities</h4>
              <ul>
                {data.abilities.map(({ability}) => (<li key={`ability-${ability.name}`}>{ability.name}</li>))}
              </ul>
            </div>
            <div>
              <h4>Moves</h4>
              <ul>
                {data.moves.map(({move}) => (<li key={`move-${move.name}`}>{move.name}</li>))}
              </ul>
            </div>
          </div>
        }

      </div>
    );
  }
}

export default App;
