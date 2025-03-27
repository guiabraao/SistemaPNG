import { Router, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Menu from "../Pages/Menu/Menu";
import Estatisticas from "../Pages/Estatisticas/Estatisticas";
import Gols from "../Pages/Estatisticas/Gols/Gols";
import Assistencias from '../Pages/Estatisticas/Assistencias/Assist';
import Regulamento from '../Pages/Regulamento/Regulamento'
import Totw from '../Pages/TOTW/Totw'
import Classico from "../Pages/Classico/Classico";
import Eventos from '../Pages/Eventos/Eventos'
import Sobre from '../Pages/Sobre/Sobre'
import Playoff from "../Pages/PlayOffs/Playoff";
import Classifi from '../Pages/PlayOffs/Classificacao/Classifi'
import Final from '../Pages/PlayOffs/Final/Final'
import PlayoffGols from '../Pages/PlayOffs/PlayoffGols/Playoffgols'
import PlayoffAssit from '../Pages/PlayOffs/PlayoffAssist/PlayoffAssist'
import Premiacao from '../Pages/PlayOffs/Premiacao/Premiacao'
import Galo from '../Pages/Classico/Galo/Galo'
import Cruzeiro from '../Pages/Classico/Cruzeiro/Cruzeiro'
import SelecaoPlayoff from '../Pages/PlayOffs/Selecao/Selecao'
import Times from '../Pages/PlayOffs/Times/Times'
import Time1 from "../Pages/PlayOffs/Times/Time1/Time1"
import Time2 from "../Pages/PlayOffs/Times/Time2/Time2"
import Time3 from "../Pages/PlayOffs/Times/Time3/Time3"



function AppRouter()  {
    return(
        <Routes>

            <Route path='/' element={ <Home/>} ></Route>

            <Route path='/menu' element={ <Menu/>} ></Route>

            <Route path='/estatisticas' element={ <Estatisticas /> } ></Route>
            <Route path='/artilhariaGeral' element={ <Gols /> } ></Route>
            <Route path='/assistenciaGeral' element={ <Assistencias /> } ></Route>

            <Route path='/eventos' element={ <Eventos /> } ></Route>

            <Route path='/totw' element={ <Totw /> } ></Route>

            <Route path='/playoff' element={ <Playoff /> } ></Route>
            <Route path='/playoffClassifi' element={ <Classifi /> } ></Route>
            <Route path='/playoffFinal' element={ <Final /> } ></Route>
            <Route path='/playoffGols' element={ <PlayoffGols /> } ></Route>
            <Route path='/playoffAssist' element={ <PlayoffAssit /> } ></Route>
            <Route path='/playoffPremiacao' element={ <Premiacao /> } ></Route>
            <Route path='/playoffSelecao' element={ <SelecaoPlayoff /> } ></Route>

            <Route path='/playoffTimes' element={ <Times /> } ></Route>
            <Route path='/playoffTime1' element={ <Time1 /> } ></Route>
            <Route path='/playoffTime2' element={ <Time2 /> } ></Route>
            <Route path='/playoffTime3' element={ <Time3 /> } ></Route>

            <Route path='/classico' element={ <Classico /> } ></Route>
            <Route path='/classicoGalo' element={ <Galo /> } ></Route>
            <Route path='/classicoCruzeiro' element={ <Cruzeiro /> } ></Route>

            <Route path='/regulamento' element={ <Regulamento /> } ></Route>

            <Route path='/sobre' element={ <Sobre /> } ></Route>

        </Routes>
    )
}

export default AppRouter
