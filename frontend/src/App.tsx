import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth } from "./components/auth/RequireAuth";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import CreateGroup from "./pages/CreateGroup";
import Profile from "./pages/Profile";
import ProfileInformation from "./pages/ProfileInformation";
import PointsRewards from "./pages/PointsRewards";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Products from "./pages/Products";
import Explore from "./pages/Explore";
import BusinessDetail from "./pages/BusinessDetail";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const App = () => (
  <Router>
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow bg-gantry-gray-light pt-16">
            <Routes>
              {/* Public routes */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <RequireAuth>
                  <Index />
                </RequireAuth>
              } />
              <Route path="/groups" element={
                <RequireAuth>
                  <Groups />
                </RequireAuth>
              } />
              <Route path="/groups/create" element={
                <RequireAuth>
                  <CreateGroup />
                </RequireAuth>
              } />
              <Route path="/groups/:id" element={
                <RequireAuth>
                  <GroupDetail />
                </RequireAuth>
              } />
              <Route path="/profile" element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              } />
              <Route path="/profile/information" element={
                <RequireAuth>
                  <ProfileInformation />
                </RequireAuth>
              } />
              <Route path="/points-rewards" element={
                <RequireAuth>
                  <PointsRewards />
                </RequireAuth>
              } />
              <Route path="/orders" element={
                <RequireAuth>
                  <Orders />
                </RequireAuth>
              } />
              <Route path="/orders/:id" element={
                <RequireAuth>
                  <OrderDetail />
                </RequireAuth>
              } />
              <Route path="/products" element={
                <RequireAuth>
                  <Products />
                </RequireAuth>
              } />
              <Route path="/explore" element={
                <RequireAuth>
                  <Explore />
                </RequireAuth>
              } />
              <Route path="/business/:id" element={
                <RequireAuth>
                  <BusinessDetail />
                </RequireAuth>
              } />
              <Route path="/account" element={
                <RequireAuth>
                  <Account />
                </RequireAuth>
              } />
              <Route path="/cart" element={
                <RequireAuth>
                  <Cart />
                </RequireAuth>
              } />
              <Route path="/messages" element={
                <RequireAuth>
                  <Messages />
                </RequireAuth>
              } />
              <Route path="/dashboard" element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } />
              
              {/* Redirect unknown routes to sign-in */}
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
          </main>
          <Navbar />
          <Footer />
        </div>
        <Toaster />
      </AppProvider>
    </AuthProvider>
  </Router>
);

export default App;
