import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// ===================================
// EN-TETE DE CONEXION/CREATION DE COMPTE
//====================================

class EnTete extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      formulaireCreationCompte : false,
      formulaireConnexion : false,
      pseudo: "",
      motDePasse:""
    }
    this.saisieInformationNouvelUtilisateur = this.saisieInformationNouvelUtilisateur.bind(this);
    this.retour = this.retour.bind(this);
  }

  // controler la saisie
  saisieInformationNouvelUtilisateur(event){
    console.log("Création de l'utilisateur: pseudo: "+this.state.pseudo+"; mot de passe: "+this.state.motDePasse)
    event.preventDefault()
  }

  retour(){
    this.setState({formulaireCreationCompte: false, formulaireConnexion: false})
  }

  render(){

    if ( this.props.connexionActive){
      return(
        <div>
          <h4>{this.props.pseudo}</h4>
          <button onClick={this.props.deconnexion}>Déconnexion</button>

        </div>
        )
    } else if ( !this.props.connexionActive && !this.state.formulaireConnexion && !this.state.formulaireCreationCompte){
      return (
        <div>
          <h4>Anonyme</h4>
          <button onClick={() => this.setState({formulaireCreationCompte: true, formulaireConnexion: false})}>Créer un compte</button>
          <button onClick={() => this.setState({formulaireConnexion: true, formulaireCreationCompte: false})}>Connexion à un compte existant</button>
        </div>
      )
    } else if (!this.props.connexionActive && this.state.formulaireConnexion && !this.state.formulaireCreationCompte){
      return(
      <div>
        <h4>Créer un compte</h4>
        <div>
          <form onSubmit= {this.saisieInformationNouvelUtilisateur}>
            <label>
              Pseudo
              <input type="text" value={this.state.pseudo} onChange={(event) => this.setState({pseudo: event.target.value})}/>
            </label>
            <label>
              Mot de passe
              <input type="password" value={this.state.motDePasse} onChange={(event) => this.setState({motDePasse: event.target.value})} />
            </label>
            <input type="submit" value="Créer le compte"/>
          </form>
        </div>
        <div>
          <button onClick={() => this.retour()}>Retour</button>
        </div>
      </div>
      )
    } else if (!this.props.connexionActive && !this.state.formulaireConnexion && this.state.formulaireCreationCompte){
      return(
      <div>
        <h4>Connexion</h4>
          <div>
            <form onSubmit= {this.saisieInformationNouvelUtilisateur}>
              <label>
                Pseudo
                <input type="text" value={this.state.pseudo} onChange={(event) => this.setState({pseudo: event.target.value})}/>
              </label>
              <label>
                Mot de passe
                <input type="password" value={this.state.motDePasse} onChange={(event) => this.setState({motDePasse: event.target.value})} />
              </label>
              <input type="submit" value="Connexion"/>      
            </form>
          </div>
          <div>
            <button onClick={() => this.retour()}>Retour</button>
          </div>
      </div>
      )
    }
  }
}

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
        Nom: {this.props.nom}
      </div>
      <div>
        Hauteur: {this.props.hauteur}
      </div>
      <div>
        Largeur: {this.props.largeur}
      </div>
    </div>)
  }
}

class Automate extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      automate : null,
      hauteur: null,
      largeur: null,
      identifiant: null,
      nom: null
    }
  }

  async componentDidMount(){
    const response = await fetch("http://127.0.0.1:5000/configuration/obtenir/1");
    const responsejson = await response.json();
    let automateConfiguration = responsejson[0]
    this.setState({nom:automateConfiguration.Nom, largeur:automateConfiguration.Largeur, hauteur:automateConfiguration.Hauteur})
    console.log("config retourné par l'API:"+JSON.stringify(automateConfiguration))
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
    if ( this.automate != null ){
      let tableau_lignes_automate = []
    for (let iterateur_hauteur = 0; iterateur_hauteur < this.state.hauteur; iterateur_hauteur++){
      let cellules = []
      for (let iterateur_largeur = 0; iterateur_largeur < this.state.largeur; iterateur_largeur++){
        cellules.push(this.renderCellule(iterateur_largeur,iterateur_hauteur))
      }
      tableau_lignes_automate.push(<div className="board-row"> {cellules} </div>)
    }
    }

    return (
      <div>
          <Parametres nom = {this.state.nom} hauteur = {this.state.hauteur} largeur={this.state.largeur} densite={this.state.densite}/>
            {/* {tableau_lignes_automate} */}
      </div>
      
    );
  }
}

class GameOfLife extends React.Component {

  constructor(props){
    super(props)

  this.state ={
    connexionActive : false
  }

  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <EnTete connexionActive = {this.state.connexionActive}/>
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
