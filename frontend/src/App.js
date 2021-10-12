import './css/App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import AuthContextProvider from './components/contexts/authContext'
import Auth from './components/Auth'
import Test from './components/Test'
import Favorite from './components/Favorite'
import Port from './components/Portfolio'

function App() {

  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/Auth' component={Auth}></Route>
            <Route exact path='/Favorite' component={Favorite}></Route>
            <Route exact path='/Test' component={Test}></Route>
            <Route exact path='/Port' component={Port}></Route>
          </Switch>
        </BrowserRouter>
      </AuthContextProvider>

    </div>
  );
}

export default App;
