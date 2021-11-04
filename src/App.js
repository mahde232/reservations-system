//React node modules
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Route } from 'react-router-dom';
//My Components
import Navbar from './components/Navbar.component';
import Login from './components/Login.component';
import HomePage from './components/HomePage.component';
import AdminPanel from './components/AdminPanel.component';
import MyBusinesses from './components/MyBusinesses.component';
import AddBusiness from './components/AddBusiness.component';
import DeleteBusiness from './components/DeleteBusiness.component';
import UpdateBusiness from './components/UpdateBusiness.component';
import AddBusinessType from './components/AddBusinessType.component';
import DeleteBusinessType from './components/DeleteBusinessType.component';
import UpdateBusinessType from './components/UpdateBusinessType.component';
import AddUser from './components/AddUser.component';
import DeleteUser from './components/DeleteUser.component';
import UpdateUser from './components/UpdateUser.component';
import BusinessPage from './components/BusinessPage.component';

//css and images
import './App.css';

function App() {
  const history = useHistory();
  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")))

  const logoutHandler = () => {
    if (localStorage.getItem("userLoggedIn")) {
      localStorage.removeItem("userLoggedIn");
      setLoggedInUser(null)
      history.push("/");
    }
  }
  const getIndicationOfLoggedInFromSon = (whoLoggedIn) => {
    setLoggedInUser(whoLoggedIn)
  }

  return (
    <div className="App">
      <Navbar logoutCallback={logoutHandler} loggedInUser={loggedInUser} />
      <div id="main-app-container">
      <Route path="/" exact component={HomePage} />
      <Route path="/login" render={() => <Login informFatherOfLogin={getIndicationOfLoggedInFromSon}/>} />
      <Route path="/AdminPanel" render={() => <AdminPanel/>}/>
      <Route path="/AddBusiness" render={() => <AddBusiness/>}/>
      <Route path="/DeleteBusiness" render={() => <DeleteBusiness/>}/>
      <Route path="/UpdateBusiness" render={() => <UpdateBusiness/>}/>
      <Route path="/AddBusinessType" render={() => <AddBusinessType/>}/>
      <Route path="/DeleteBusinessType" render={() => <DeleteBusinessType/>}/>
      <Route path="/UpdateBusinessType" render={() => <UpdateBusinessType/>}/>
      <Route path="/AddUser" render={() => <AddUser/>}/>
      <Route path="/DeleteUser" render={() => <DeleteUser/>}/>
      <Route path="/UpdateUser" render={() => <UpdateUser/>}/>
      <Route path="/MyBusinesses" render={() => <MyBusinesses/>}/>
      <Route path="/BusinessPage" render={() => <BusinessPage/>}/>
    </div></div>
  );
}

export default App;
