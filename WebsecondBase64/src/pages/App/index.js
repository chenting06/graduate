import Login from "../login";
import Register from "../register";
// import { BrowserRouter, Route, Switch } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HashRouter } from "react-router-dom";
// import createHistory from "history/createHashHistory";
import Home from "../home";
import TodayDish from "../todayDish";
import WeeklyDish from "../weeklyDish";
import DetailDish from "../detailDish";
import SearchResult from "../searchResult";
import MyInform from "../myInform";
import AddDish from "../addDish";
import EditDish from "../editDish";
import Cover from "../cover";
import GuessYouLike from "../guessYouLike";
import { addDish } from "../../services/api";
function App() {
  return (
    <div className="App">
      <div className="editRouter">
        <HashRouter>
          <Routes>
            <Route path="/" exact element={<Cover />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/todayDish" element={<TodayDish />} />
            <Route path="/weeklyDish" element={<WeeklyDish />} />
            <Route path="/detail" element={<DetailDish />} />
            <Route path="/searchResult" element={<SearchResult />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/myInform" element={<MyInform />} />
            <Route path="/addDish" element={<AddDish />} />
            <Route path="/editDish" element={<EditDish />} />
            <Route path="/detailDish" element={<DetailDish />} />
            <Route path="/guessYouLike" element={<GuessYouLike />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}

export default App;
