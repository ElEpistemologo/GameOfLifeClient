import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Cellule extends React.Component {
  render() {
    if ( this.props.value){
      return (<div className="celluleVivante" onClick={this.props.onClick}/>);
    }else{
      return(<div className="celluleMorte" onClick={this.props.onClick}/>);
    }
  }
}

class Parametres extends React.Component{
  render(){
    return(<div>
      <div>
        Hauteur: {this.props.hauteur}
      </div>
      <div>
        Largeur: {this.props.largeur}
      </div>
      <div>
        Densite: {this.props.densite}
      </div>
    </div>)
  }
}

class Automate extends React.Component {

  constructor(props){
    super(props);
    let hauteur = 6
    let largeur = 6
    let densite = 0.5
    let automate = [[true, false, true, false, true, false],
    [true, true, false, false, true, false],
    [true, false, true, false, true, false],
    [false, false, true, true, false, true],
    [true, true, false, false, true, false],
    [false, true, true, false, false, false]]

    this.state = {
      automate : automate,
      hauteur: hauteur,
      largeur: largeur,
      densite: densite
    }
  }

  handleClick(i,j){
    let nouvelAutomate = this.state.automate.slice();
    nouvelAutomate[i][j] = !this.state.automate[i][j];
    this.setState({automate: nouvelAutomate});
  }

  renderCellule(i, j) {
    return <Cellule value={this.state.automate[i][j]} onClick={() => this.handleClick(i, j)} />;
  }

  render() {
    let tableau_lignes_automate = []
    for (let iterateur_hauteur = 0; iterateur_hauteur < this.state.hauteur; iterateur_hauteur++){
      let cellules = []
      for (let iterateur_largeur = 0; iterateur_largeur < this.state.largeur; iterateur_largeur++){
        cellules.push(this.renderCellule(iterateur_largeur,iterateur_hauteur))
      }
      tableau_lignes_automate.push(<div className="board-row"> {cellules} </div>)
    }

    return (
      <div>
          <Parametres hauteur = {this.state.hauteur} largeur={this.state.largeur} densite={this.state.densite}/>
            {tableau_lignes_automate}
      </div>
      
    );
  }
}

class GameOfLife extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Automate />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<GameOfLife />);
