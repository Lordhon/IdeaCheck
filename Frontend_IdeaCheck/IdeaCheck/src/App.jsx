import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ResetPassword from "./pages/Reset-Password.jsx";
import PrivateRoute from "./componens/PrivateRoute.jsx";
import Main from "./pages/Main.jsx";
import CreateIdea from "./pages/CreateIdea.jsx";
import Account from "./pages/Account.jsx";
import IdeaDetail from "./pages/IdeaDetail.jsx";
import ActivateAccount from "./pages/ActivateAccount.jsx";
import NewPassword from "./pages/ResetPassword.jsx";
import ExpertApplication from "./pages/ExpertApplication.jsx";

import IdeaList from "./pages/ExpertLookIdea.jsx";
import EvaluationsIdea from "./pages/EvaluationsIdea.jsx";
import InvestorCheckIdea from "./pages/IvestorCheckIdea.jsx";
import InvestorApplication from "./pages/InvestorApplication.jsx";
import AdminPage from "./pages/Admin.jsx";
import ModeratorApplicationExpert from "./pages/ModeratorApplication.jsx";
import ModeratorApplicationInvestor from "./pages/ModeratorApplicationsInvestor.jsx";


function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to='/register/'  />} />
                <Route path="/register/" element={<Register />} />
                <Route path="/login/" element={<Login />} />
                <Route path="/reset-password/" element={<ResetPassword />} />
                <Route path="/user/activate/:uid/:token/" element={<ActivateAccount />} />
                <Route path="/user/reset_password/:uid/:token/" element={<NewPassword />} />
                {/* Защищенные маршруты */}
                <Route element={<PrivateRoute />}>
                    <Route path="/IdeaCheck/" element={<Main />} />
                    <Route path="/create-idea/" element={<CreateIdea />} />
                    <Route path="/account/" element={<Account />} />
                    <Route path="/idea/:id/" element={<IdeaDetail />} />

                    <Route path="/expert/application/" element={<ExpertApplication />} />
                    <Route path="/investor/application/" element={<InvestorApplication />} />


                    <Route path="/expert/application/cheking/" element={<ModeratorApplicationExpert />} />
                    <Route path="/investot/application/cheking/" element={<ModeratorApplicationInvestor />} />




                    <Route path="/expert/review/" element={<IdeaList />} />
                    <Route path="/investor/review/" element={<InvestorCheckIdea />} />

                    <Route path="/ideas/evaluations/:id/" element={<EvaluationsIdea />} />

                    

                    <Route path="/admin/" element={<AdminPage />} />


                  













                </Route>

            </Routes>
        </Router>
    );
}

export default App;
