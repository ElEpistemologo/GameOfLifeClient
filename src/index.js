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
    this.changementPseudo = this.changementPseudo.bind(this)
    this.changementMotDePasse = this.changementMotDePasse.bind(this)
  }

  // controler la saisie
  connexionUtilisateur(event){
    console.log("Connexion de l'utilisateur: pseudo: "+this.state.pseudo+"; mot de passe: "+this.state.motDePasse)
    event.preventDefault()
    let result = this.props.connexionUtilisateur(this.state.pseudo, this.state.motDePasse)
    if (result) {
      this.setState({pseudo:"", motDePasse:""})
    }
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
          <button onClick={() => this.chargementFormulaireCreationCompte()}>Créer un compte</button>
          <button onClick={() => this.chargementFormulaireConnection()}>Connexion à un compte existant</button>
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
              <input type="text" value={this.state.pseudo} onChange={(event) => this.changementPseudo(event)}/>
            </label>
            <label>
              Mot de passe
              <input type="password" value={this.state.motDePasse} onChange={(event) => this.changementMotDePasse(event)} />
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
                <input type="text" value={this.state.pseudo} onChange={(event) => this.changementPseudo(event)}/>
              </label>
              <label>
                Mot de passe
                <input type="password" value={this.state.motDePasse} onChange={(event) => this.changementMotDePasse(event)} />
              </label>
              <input type="submit" value="Créer le compte"/>      
            </form>
          </div>
          <div>
            <button onClick={() => this.retour()}>Retour</button>
          </div>
      </div>
      )
    }
  }

  chargementFormulaireCreationCompte(event){
    this.setState({formulaireCreationCompte: true, formulaireConnexion: false})
  }
  chargementFormulaireConnection(event){
    this.setState({formulaireCreationCompte: false, formulaireConnexion: true})
  }
  changementPseudo(event){
    this.setState({pseudo: event.target.value})
  }
  changementMotDePasse(event){
    this.setState({motDePasse: event.target.value})
  }
}

// ===================================
// AFFICHAGE ET EDITION DES PARAMETRES
//====================================

class Parametres extends React.Component{

  construireListeConfiguration(){
    let configs = this.props.configurations
    let liste = []
    Object.keys(configs).forEach(function(key) {
      liste.push(<option value={key}>{configs[key]}</option>)
   });
    return liste
  }

  render(){
    let listConfig = this.construireListeConfiguration()
    return(
      <div>
        <form>
          <div>
            <label>Nom:</label>
            <input value={this.props.nom} type="text" onChange={(event) =>  this.props.changementNom(event)}/>
          </div>
          <div>
            <label>Hauteur:</label>
            <input value={this.props.hauteur} type="text" onChange={(event) => this.props.changementHauteur(event)}/>
          </div>
          <div>
            <label>Largeur:</label>
            <input value={this.props.largeur} type="text" onChange={(event) => this.props.changementLargeur(event)}/>
          </div>
          <div>
            <button type= "button" >Visualiser</button>
            <button type= "button" >Remplissage Aléatoire</button>
            <button type= "button" >Vider</button>
          </div>
          <div>
            <button type= "button" >Démarrer</button>
            <button type= "button" >Pause</button>
            <button type= "button" >Stop</button>
          </div>
          <div>
            <button type= "button" onClick={() => this.props.modifierConfiguration()} disabled={!this.props.connexionActive}>Modifier</button>
            <button type= "button" onClick={() => this.props.enregistrerConfiguration()} disabled={!this.props.connexionActive}>Enregistrer</button>
            <button type= "button" onClick={() => this.props.supprimerConfiguration()} disabled={!this.props.connexionActive}>Supprimer</button>
          </div>
          <div>
            <label>Configurations enregistrées:</label>
            <select value = {this.props.identifiant} onChange={(event) => this.props.changerConfigurationActive(event)}>
              {listConfig}
            </select>
          </div>
        </form>
      </div>
    )
  }
}

// ===================================
// CELLULE DE L'AUTOMATE
//====================================

class Cellule extends React.Component {
  render() {
    if ( this.props.value){
      return (<div className="celluleVivante" onClick={this.props.onClick}/>);
    }else{
      return(<div className="celluleMorte" onClick={this.props.onClick}/>);
    }
  }
}

// ===================================
// AUTOMATE
//====================================

class Automate extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      automateEnPause: false
    }
  }

  renderCellule(i, j) {
    return <Cellule value={this.props.etatCourant[i][j]} onClick={() => this.props.handleClick(i, j)} />;
  }

  render() {
    let tableau_lignes_automate = []
    if ( this.props.etatCourant != null ){
      for (let iterateur_hauteur = 0; iterateur_hauteur < this.props.etatCourant[0].length; iterateur_hauteur++){
        let cellules = []
        for (let iterateur_largeur = 0; iterateur_largeur < this.props.etatCourant.length; iterateur_largeur++){
          cellules.push(this.renderCellule(iterateur_largeur,iterateur_hauteur))
        }
        tableau_lignes_automate.push(<div className="board-row"> {cellules} </div>)
      }
    }

    return (
      <div class="automate">
            {tableau_lignes_automate}
      </div>
    );
  }
}

class GameOfLife extends React.Component {

  constructor(props){
    super(props)

    this.state ={
      connexionActive : false,
      pseudo: null,
      nom: "",
      hauteur: "",
      largeur: "",
      identifiant: "",
      configurations: {},
      etatInitial: null,
      etatCourant: null
    }

    this.mettreAJourListeconfiguration = this.mettreAJourListeconfiguration.bind(this)
  }

  async componentDidMount(){
    const utilisateur = await fetch("http://127.0.0.1:5000/session", {
      credentials: 'include'
    })
    const utilisateurInfo = await utilisateur.json();
    console.log("Utilisateur connecté:"+JSON.stringify(utilisateurInfo))
    this.setState({configurations:utilisateurInfo.configurations, pseudo: utilisateurInfo.pseudo}, () => {
      if (this.state.identifiant === ""){
        this.setState({identifiant: Object.keys(this.state.configurations)[0]}, () => this.chargerConfiguration())
      }
    })
    if ( utilisateurInfo.pseudo === "Anonyme"){
      this.setState({connexionActive: false})
    }else{
      this.setState({connexionActive: true})
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
    })
    if ( reponse.status === 200){
      const reponsejson = await reponse.json();
      this.setState({connexionActive: true, pseudo: reponsejson["pseudo"], configurations:reponsejson.configurations})
      return true
    }else{
      return false
    }
  }

  async deconnecterUtilisateur(){
    const reponse = await fetch("http://127.0.0.1:5000/utilisateur/deconnecter",{
      credentials: "include"
    })
    if (reponse.status === 200){
      const reponsejson = await reponse.json();
      this.setState({connexionActive: false, pseudo: reponsejson["pseudo"], configurations:reponsejson.configurations})
    }
  }

  async creationUtilisateur(pseudo, motDePasse){
    let json = JSON.stringify({pseudo: pseudo, mot_de_passe: motDePasse})
    const reponse = await fetch("http://127.0.0.1:5000/utilisateur/creer", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:"include",
      body: json
    })
    if ( reponse.status === 200){
      const reponsejson = await reponse.json();
      this.setState({connexionActive: true, pseudo: reponsejson["pseudo"], configurations:reponsejson.configurations})
      return true
    }else{
      return false
    }
  }

  async enregistrerConfiguration(){
    const config = {
      nom: this.state.nom,
      largeur: this.state.largeur,
      hauteur: this.state.hauteur,
      etat_initial: this.state.etatInitial
    }
    let json = JSON.stringify(config)
    let reponse = await fetch("http://127.0.0.1:5000/configuration/creer", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:"include",
      body: json
    })
    if ( reponse.status === 200){
      let reponse_json = await reponse.json()
      this.mettreAJourListeconfiguration()
      this.setState({identifiant:reponse_json["identifiant"]}, () => this.chargerConfiguration())
    }
  }

  async chargerConfiguration(){
    console.log("chargerConfiguration:"+this.state.identifiant)
    let reponse = await fetch("http://127.0.0.1:5000/configuration/obtenir/"+this.state.identifiant, {
      credentials: 'include'
    })
      const responsejson = await reponse.json()
      if ( reponse.status === 200){
        this.setState({nom:responsejson.Nom, largeur:responsejson.Largeur, hauteur:responsejson.Hauteur})
        this.changerEtatInitial(responsejson.Etat_initial)
      }
  }

  async mettreAJourListeconfiguration(){
    console.log("maj config")
    const utilisateur = await fetch("http://127.0.0.1:5000/session", {
      credentials: 'include'
    })
    const utilisateurInfo = await utilisateur.json()
    this.setState({configurations: utilisateurInfo.configurations})
  }

  async supprimerConfiguration(){
    console.log("supprimer:"+this.state.identifiant)
    let reponse = await fetch("http://127.0.0.1:5000/configuration/supprimer/"+this.state.identifiant, {
      credentials: 'include'
    })
    if ( reponse.status === 200){
      console.log("supression réussie")
      this.mettreAJourListeconfiguration()
      this.setState({identifiant: Object.keys(this.state.configurations)[0]}, () => this.chargerConfiguration())
    }
  }

  async modifierConfiguration(){
    const config = {
      identifiant: this.state.identifiant,
      nom: this.state.nom,
      largeur: this.state.largeur,
      hauteur: this.state.hauteur,
      etat_initial: this.state.etatInitial
    }
    let json = JSON.stringify(config)
    console.log("modifier "+ json)
    let reponse = await fetch("http://127.0.0.1:5000/configuration/modifier", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:"include",
      body: json
    })
    if ( reponse.status === 200){
      this.mettreAJourListeconfiguration()
    }
  }

  changerConfigurationActive(event){
    this.setState({identifiant:event.target.value}, () => this.chargerConfiguration())
  }

  changerEtatInitial(etatInitial){
    this.setState({etatInitial: etatInitial, etatCourant: etatInitial})
  }

  handleClick(i,j){
    if (!this.state.automateEnPause){
      let nouvelAutomate = this.state.etatCourant.slice();
      nouvelAutomate[i][j] = !this.state.etatCourant[i][j];
      this.setState({etatCourant: nouvelAutomate});
    }
  }

  changementNom(event){
    this.setState({nom:event.target.value})
  }
  changementHauteur(event){
    this.setState({hauteur:event.target.value})
  }
  changementLargeur(event){
    this.setState({largeur:event.target.value})
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
          <Parametres nom={this.state.nom}
            identifiant={this.state.identifiant}
            largeur={this.state.largeur}
            hauteur={this.state.hauteur}
            configurations={this.state.configurations} 
            connexionActive={this.state.connexionActive}
            mettreAJourListeconfiguration={this.mettreAJourListeconfiguration}
            changerEtatInitial={(etatInitial) => this.changerEtatInitial(etatInitial)}
            enregistrerConfiguration={() => this.enregistrerConfiguration()}
            modifierConfiguration={() => this.modifierConfiguration()}
            supprimerConfiguration={() => this.supprimerConfiguration()}
            changementNom={(event) => this.changementNom(event)}
            changementHauteur={(event) => this.changementHauteur(event)}
            changementLargeur={(event) => this.changementLargeur(event)}
            changerConfigurationActive={(event) => this.changerConfigurationActive(event)}
          />
        </div>
        <Automate etatInitial={this.state.etatInitial}
            etatCourant={this.state.etatCourant}
            handleClick={(i,j) => this.handleClick(i,j)}
          />
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<GameOfLife />);
