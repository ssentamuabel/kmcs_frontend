// // import { useState,useContext, useEffect } from 'react'
// // import './styles/App.css';
// // import {Link, useNavigate} from 'react-router-dom'
// // import { RightsProvider, RightsContext } from './contexts/RightsProvider';
// // import  Register from './pages/Register'
// // import  Dashboard from './pages/Dashboard'
// // import SideBar from './components/SideBar';
// // import Programs from './pages/Programs';
// // import Members from './pages/Members';
// // import Messages from './pages/Messages';
// // import Profile from './pages/Profile';
// // import Permissions from './pages/Permissions';
// // import  Login from './pages/Login'

// // import {Routes, Route, Navigate} from 'react-router-dom'
// // import {jwtDecode} from 'jwt-decode';


// // const AUTO_LOGOUT_TIME = 10 * 60 * 1000; // 20 minutes in milliseconds


// // function App() {
// // 	return (
// // 	  <RightsProvider>
// // 		<AppContent />
// // 	  </RightsProvider>
// // 	);
// //   }
  
// //   function AppContent() {
// // 	const navigate = useNavigate()
// // 	const [loggedIn, setLoggedIn] = useState(false);
// // 	const { setRights, rights } = useContext(RightsContext);

// // 	useEffect(() => {
// //         let logoutTimer;

// //         const resetLogoutTimer = () => {
// //             clearTimeout(logoutTimer);
// //             if (loggedIn) {
// //                 logoutTimer = setTimeout(handleLogout, AUTO_LOGOUT_TIME);
// //             }
// //         };

// //         const handleUserActivity = () => {
// //             resetLogoutTimer();
// //         };

// //         // Add event listeners for user activity (e.g., mouse movements, key presses)
// //         window.addEventListener('mousemove', handleUserActivity);
// //         window.addEventListener('keydown', handleUserActivity);

// //         resetLogoutTimer(); // Initialize the timer

// //         return () => {
// //             // Cleanup event listeners and the timer on component unmount
// //             window.removeEventListener('mousemove', handleUserActivity);
// //             window.removeEventListener('keydown', handleUserActivity);
// //             clearTimeout(logoutTimer);
// //         };
// //     }, [loggedIn]);

  
// // 	const handleLogin = ({ jwt }) => {
// // 	  const decodedRights = jwtDecode(jwt);
// // 	  setRights(decodedRights);
// // 	  setLoggedIn(true);

// // 	  if (decodedRights.perm.name === 'student' || decodedRights.perm.name === 'alumnus'){
// // 			navigate('profile')
// // 	}
// // 	};
  
// // 	const handleLogout = () => {
// // 	  setLoggedIn(false);
// // 	  setRights({})
// // 	};
  
// // 	return (
// // 	  <Routes>
// // 		{!loggedIn ? (
// // 		  <>
// // 			<Route path="register" element={<Register />} />
// // 			<Route path="login" element={<Login onLogin={handleLogin} />} />
// // 			<Route path="*" element={<Navigate to="/login" />} />
// // 		  </>
// // 		) : (
// // 		  <Route path="/" element={<SideBar onLogout={handleLogout} />}>
// // 			<Route index element={<Dashboard />} />
// // 			<Route path="members" element={<Members />} />
// // 			<Route path="programs" element={<Programs />} />
// // 			<Route path="messages" element={<Messages />} />
// // 			<Route path="finance" element={<Messages />} />
// // 			<Route path="permissions" element={<Permissions />} />
// // 			<Route path="profile" element={<Profile user={rights.member_id} />} />
// // 			<Route path="*" element={<Navigate to="/members" />} />
// // 		  </Route>
// // 		)}
// // 	  </Routes>
// // 	);
// //   }
  
// //   export default App;

// import { useState, useContext, useEffect } from 'react';
// import './styles/App.css';
// import { Link, useNavigate } from 'react-router-dom';
// import { RightsProvider, RightsContext } from './contexts/RightsProvider';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import SideBar from './components/SideBar';
// import Programs from './pages/Programs';
// import Members from './pages/Members';
// import Messages from './pages/Messages';
// import Profile from './pages/Profile';
// import Permissions from './pages/Permissions';
// import Login from './pages/Login';

// // Finance Pages
// import AccountRegister from './pages/AccountRegister';
// import AccountList from './pages/AccountList';
// import JournalEntryRegister from './pages/JournalEntryRegister';
// import JournalEntryList from './pages/JournalEntryList';

// import { Routes, Route, Navigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import FinanceDashboard from './pages/FinanceDashboard';


// const AUTO_LOGOUT_TIME = 10 * 60 * 1000; // 10 minutes

// function App() {
//   return (
//     <RightsProvider>
//       <AppContent />
//     </RightsProvider>
//   );
// }

// function AppContent() {
//   const navigate = useNavigate();
//   const [loggedIn, setLoggedIn] = useState(false);
//   const { setRights, rights } = useContext(RightsContext);

//   useEffect(() => {
//     let logoutTimer;

//     const resetLogoutTimer = () => {
//       clearTimeout(logoutTimer);
//       if (loggedIn) {
//         logoutTimer = setTimeout(handleLogout, AUTO_LOGOUT_TIME);
//       }
//     };

//     const handleUserActivity = () => resetLogoutTimer();

//     window.addEventListener('mousemove', handleUserActivity);
//     window.addEventListener('keydown', handleUserActivity);

//     resetLogoutTimer();

//     return () => {
//       window.removeEventListener('mousemove', handleUserActivity);
//       window.removeEventListener('keydown', handleUserActivity);
//       clearTimeout(logoutTimer);
//     };
//   }, [loggedIn]);

//   const handleLogin = ({ jwt }) => {
//     const decodedRights = jwtDecode(jwt);
//     setRights(decodedRights);
//     setLoggedIn(true);

//     if (decodedRights.perm.name === 'student' || decodedRights.perm.name === 'alumnus') {
//       navigate('profile');
//     }
//   };

//   const handleLogout = () => {
//     setLoggedIn(false);
//     setRights({});
//   };

//   return (
//     <Routes>
//       {!loggedIn ? (
//         <>
//           <Route path="register" element={<Register />} />
//           <Route path="login" element={<Login onLogin={handleLogin} />} />
//           <Route path="*" element={<Navigate to="/login" />} />
//         </>
//       ) : (
//         <Route path="/" element={<SideBar onLogout={handleLogout} />}>
//           <Route index element={<Dashboard />} />
//           <Route path="members" element={<Members />} />
//           <Route path="programs" element={<Programs />} />
//           <Route path="messages" element={<Messages />} />
//           <Route path="finance">
//             {/* Finance Sub-Routes */}
//             <Route index element={<FinanceDashboard />} />
//             <Route path="accounts" element={<AccountList />} />
//             <Route path="account/new" element={<AccountRegister />} />
//             <Route path="account/edit/:id" element={<AccountRegister />} />
//             <Route path="journal_entries" element={<JournalEntryList />} />
//             <Route path="journal/new" element={<JournalEntryRegister />} />
//             <Route path="journal/edit/:id" element={<JournalEntryRegister />} />
           

          

//           </Route>
//           <Route path="permissions" element={<Permissions />} />
//           <Route path="profile" element={<Profile user={rights.member_id} />} />
//           <Route path="*" element={<Navigate to="/members" />} />
//         </Route>
//       )}
//     </Routes>
//   );
// }

// export default App;

import { useState, useContext, useEffect } from 'react';
import './styles/App.css';
import { Link, useNavigate } from 'react-router-dom';
import { RightsProvider, RightsContext } from './contexts/RightsProvider';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SideBar from './components/SideBar';
import ProtectedRoute from './components/ProtectedRoute';
import ProgramList from './pages/ProgramList';
import ProgramRegister from './pages/ProgramRegister';
import Members from './pages/Members';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Permissions from './pages/Permissions';
import Login from './pages/Login';

// Finance Pages
import AccountRegister from './pages/AccountRegister';
import AccountList from './pages/AccountList';
import JournalEntryRegister from './pages/JournalEntryRegister';
import JournalEntryList from './pages/JournalEntryList';
import FinanceDashboard from './pages/FinanceDashboard';
import JournalEntryView from './pages/JournalEntryView';
import AccountTransactions from './pages/AccountTransactions';
import CashBookReport from './pages/CashBookReport';
import IncomeExpenditureReport from './pages/IncomeExpenditureReport';
import BudgetList from './pages/BudgetList';
import BudgetRegister from './pages/BudgetRegister';
import BudgetDetail from './pages/BudgetDetail';

import ReportsIndex from './pages/ReportsIndex';
import ProgramTransactions from './pages/ProgramTransactions';
import FundSourceTransactions from './pages/FundSourceTransactions';
import DepartmentTransactions from './pages/DepartmentTransactions';

// Inventory / Items Pages
import InventoryDashboard from './pages/InventoryDashboard';
import InventoryItems from './pages/items/InventoryItems';
import ItemRegister from './pages/items/ItemRegister';
import ItemDetail from './pages/items/ItemDetail';
import InventoryJournalList from './pages/InventoryJournalList';
import InventoryJournalRegister from './pages/InventoryJournalRegister';
import ApprovalLevelSetup from './pages/ApprovalLevelSetup';

import { Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AUTO_LOGOUT_TIME = 10 * 60 * 1000;

function App() {
  return (
    <RightsProvider>
      <AppContent />
    </RightsProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const { setRights, rights } = useContext(RightsContext);

  useEffect(() => {
    let logoutTimer;

    const resetLogoutTimer = () => {
      clearTimeout(logoutTimer);
      if (loggedIn) {
        logoutTimer = setTimeout(handleLogout, AUTO_LOGOUT_TIME);
      }
    };

    const handleUserActivity = () => resetLogoutTimer();

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    resetLogoutTimer();

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearTimeout(logoutTimer);
    };
  }, [loggedIn]);

  const handleLogin = ({ jwt }) => {
    const decodedRights = jwtDecode(jwt);
    setRights(decodedRights);
    setLoggedIn(true);

    if (decodedRights.perm.name === 'student' || decodedRights.perm.name === 'alumnus') {
      navigate('profile');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setRights({});
  };

  return (
    <Routes>
      {!loggedIn ? (
        <>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <Route path="/" element={<SideBar onLogout={handleLogout} />}>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />

          <Route element={<ProtectedRoute requiredPerm="program" />}>
            <Route path="programs">
              <Route index element={<ProgramList />} />
              <Route path="new" element={<ProgramRegister />} />
              <Route path=":id/edit" element={<ProgramRegister />} />
            </Route>
          </Route>

          <Route path="messages" element={<Messages />} />

          {/* Finance Routes */}
          <Route element={<ProtectedRoute requiredPerm="finance" />}>
            <Route path="finance">
              <Route index element={<FinanceDashboard />} />
              <Route path="accounts" element={<AccountList />} />
              <Route path="account/new" element={<AccountRegister />} />
              <Route path="account/edit/:id" element={<AccountRegister />} />
              <Route path="account/:id/transactions" element={<AccountTransactions />} />
              <Route path="accounts/:accountId/transactions" element={<AccountTransactions />} />
              <Route path="journal_entries" element={<JournalEntryList />} />
              <Route path="journal/new" element={<JournalEntryRegister />} />
              <Route path="journal/edit/:id" element={<JournalEntryRegister />} />
              <Route path="journal/:id" element={<JournalEntryView />} />
              <Route path="reports/cash-book" element={<CashBookReport />} />
              <Route path="reports/income-expenditure" element={<IncomeExpenditureReport />} />
            </Route>

            {/* Report Routes — these are financial transaction reports, so
                they ride on the same "finance" bit as the Finance module
                itself rather than needing one of their own. */}
            <Route path="reports">
              <Route index element={<ReportsIndex/>} />
              <Route path="program-transactions" element={<ProgramTransactions />} />
              <Route path="fund-source-transactions" element={<FundSourceTransactions />} />
              <Route path="department-transactions" element={<DepartmentTransactions />} />
            </Route>
          </Route>

          {/* Budget + Inventory Routes — Inventory rides on budget_cost,
              same reasoning as the sidebar (see SideBar.js): Items feed
              directly into Budget lines and there's no separate
              permission bit for Inventory on its own yet. */}
          <Route element={<ProtectedRoute requiredPerm="budget_cost" />}>
            <Route path="budgets">
              <Route index element={<BudgetList />} />
              <Route path="new" element={<BudgetRegister />} />
              <Route path=":id" element={<BudgetDetail />} />
            </Route>
            <Route path="budgets/approval-setup" element={<ApprovalLevelSetup />} />

            <Route path="inventory">
              <Route index element={<InventoryDashboard />} />
              <Route path="items" element={<InventoryItems />} />
              <Route path="items/new" element={<ItemRegister />} />
              <Route path="items/:id" element={<ItemDetail />} />
              <Route path="items/:id/edit" element={<ItemRegister />} />
              <Route path="journal" element={<InventoryJournalList />} />
              <Route path="journal/new" element={<InventoryJournalRegister />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute requiredPerm="permission" />}>
            <Route path="permissions" element={<Permissions />} />
          </Route>

          <Route path="profile" element={<Profile user={rights.member_id} />} />
          <Route path="*" element={<Navigate to="/members" />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;

