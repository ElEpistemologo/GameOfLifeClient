import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// ===================================
// EN-TETE DE CONNEXION/CREATION DE COMPTE
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
    this.connexionUtilisateur = this.connexionUtilisateur.bind(this);
    this.creationUtilisateur = this.creationUtilisateur.bind(this);
    this.retour = this.retour.bind(this);
  }

  // controler la saisie
  connexionUtilisateur(event){
    console.log("Connexion de l'utilisateur: pseudo: "+this.state.pseudo+"; mot de passe: "+this.state.motDePasse)
    event.preventDefault()
    this.props.connexionUtilisateur(this.state.pseudo, this.state.motDePasse)
  }

  creationUtilisateur(event){
    console.log("Création de l'utilisateur: pseudo: "+this.state.pseudo+"; mot de passe: "+this.state.motDePasse)
    event.preventDefault()
    this.props.creationUtilisateur(this.state.pseudo, this.state.motDePasse)
  }

  retour(){
    this.setState({formulaireCreationCompte: false, formulaireConnexion: false})
  }

  render(){

    if ( this.props.connexionActive){
      return(
        <div>
          <h4>{this.props.pseudo}</h4>
          <button onClick={this.props.deconnecterUtilisateur}>Déconnexion</button>
        </div>
        )
    } else if ( !this.props.connexionActive && !this.state.formulaireConnexion && !this.state.formulaireCreationCompte){
      return (
        <div>
          <h4>{this.props.pseudo}</h4>
          <button onClick={() => this.setState({formulaireCreationCompte: true, formulaireConnexion: false})}>Créer un compte</button>
          <button onClick={() => this.setState({formulaireConnexion: true, formulaireCreationCompte: false})}>Connexion à un compte existant</button>
        </div>
      )
    } else if (!this.props.connexionActive && this.state.formulaireConnexion && !this.state.formulaireCreationCompte){
      return(
      <div>
        <h4>Connexion</h4>
        <div>
          <form onSubmit= {this.connexionUtilisateur}>
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
    } else if (!this.props.connexionActive && !this.state.formulaireConnexion && this.state.formulaireCreationCompte){
      return(
      <div>
        <h4>Création de compte</h4>
          <div>
            <form onSubmit= {this.creationUtilisateur}>
              <label>
                Pseudo
                <input type="text" value={this.state.pseudo} onChange={(event) => this.setState({pseudo: event.target.value})}/>
              </label>
              <label>
                Mot de passe
                <input type="password" value={this.state.motDePasse} onChange={(event) => this.setState({motDePasse: event.target.value})} />
              </label>
              <input type="submit" value="créer le compte"/>      
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
      sope: null,
      pseudo: "Anonyme"
    }
  }

  async componentDidMount(){

    // récupération de la configuration de base à afficher dans le formulaire
    const response = await fetch("http://127.0.0.1:5000/configuration/obtenir/1");
    const responsejson = await response.json();
    this.setState({nom:responsejson.Nom, largeur:responsejson.Largeur, hauteur:responsejson.Hauteur})
    console.log("Configuration de base chargée:" + JSON.stringify(responsejson))
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
      connexionActive : false,
      pseudo: null
    }

  }

  async componentDidMount(){
    const utilisateur = await fetch("http://127.0.0.1:5000/session", {
      credentials: 'include'
    })
    const utilisateurInfo = await utilisateur.json();
    console.log("Utilisateur connecté:"+JSON.stringify(utilisateurInfo))

    // si l'utilsiateur est anonyme
    if ( utilisateurInfo.pseudo === "Anonyme"){
      this.setState({pseudo: utilisateurInfo.pseudo, connexionActive: false})
    }else{
      this.setState({pseudo: utilisateurInfo.pseudo, connexionActive: true})
    }
  }

  async connexionUtilisateur(pseudo, motDePasse){
    let json = JSON.stringify({pseudo: pseudo, mot_de_passe: motDePasse})
    const reponse = await fetch("http://127.0.0.1:5000/utilisateur/connecter", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:"include",
      body: json
    });
    if ( reponse.status === 200){
      const reponsejson = await reponse.json();
      this.setState({connexionActive: true, pseudo: reponsejson["pseudo"]})
    }
  }

  async deconnecterUtilisateur(){
    await fetch("http://127.0.0.1:5000/utilisateur/deconnecter",{
      credentials: "include"
    })
    this.setState({connexionActive: false, pseudo: "Anonyme"})
  }
  
  creationUtilisateur(pseudo, motDePasse){

  }


  render() {
    return (
      <div className="game">
        <div className="game-board">
          <EnTete connexionActive = {this.state.connexionActive} 
          connexionUtilisateur={(pseudo, motDePasse) => this.connexionUtilisateur(pseudo, motDePasse)}
          creationUtilisateur={(pseudo, motDePasse) => this.creationUtilisateur(pseudo, motDePasse)}
          pseudo={this.state.pseudo}
          deconnecterUtilisateur={() => this.deconnecterUtilisateur()}
          />
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
