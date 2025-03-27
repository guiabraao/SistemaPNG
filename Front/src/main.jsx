import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'

//Pages
import Login from './Pages/Login/Login.jsx'
import Home from './Pages/Home/Home.jsx'
import Menu from './Pages/Menu/Menu.jsx'
import Regulamento from './Pages/Regulamento/Regulamento.jsx'
import Totw from './Pages/TOTW/Totw.jsx'
import Eventos from './Pages/Eventos/Eventos.jsx'
import Sobre from './Pages/Sobre/Sobre.jsx'

//Classico
import Classico from './Pages/Classico/Classico.jsx'
import Galo from './Pages/Classico/Galo/Galo.jsx'
import Cruzeiro from './Pages/Classico/Cruzeiro/Cruzeiro.jsx'

//Estatisticas
import Estatisticas from './Pages/Estatisticas/Estatisticas.jsx'
import Gols from './Pages/Estatisticas/Gols/Gols.jsx'
import Assistencias from './Pages/Estatisticas/Assistencias/Assist.jsx'

//Play-Offs
import Playoff from './Pages/PlayOffs/Playoff.jsx'
import Classifi from './Pages/PlayOffs/Classificacao/Classifi.jsx'
import Final from './Pages/PlayOffs/Final/Final.jsx'
import PlayoffGols from './Pages/PlayOffs/PlayoffGols/Playoffgols.jsx'
import PlayoffAssit from './Pages/PlayOffs/PlayoffAssist/PlayoffAssist.jsx'
import Premiacao from './Pages/PlayOffs/Premiacao/Premiacao.jsx'


//Components
import Card from './Components/Card/Card.jsx'
import Header from './Components/Header/Header.jsx'
import AppRouter from './Routes/Routes.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
)
