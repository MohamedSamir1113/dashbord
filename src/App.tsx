import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

import Notifications from "./pages/notifications/Notifiations";
import ProtectedRoute from "./routes/ProtectedRoute";
import BrandsList from "./pages/Brands/BrandsList";

import BrandsForm from "./pages/Forms/BrandsForm";
import ProductsForm from "./pages/Forms/ProductsForm";
import ProductsList from "./pages/Products/ProductsList";
import SelectedProduct from "./pages/Products/SelectedProduct";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route
            index
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* brand */}

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products-form"
            element={
              <ProtectedRoute>
                <ProductsForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <SelectedProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/brands"
            element={
              <ProtectedRoute>
                <BrandsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/brands-form"
            element={
              <ProtectedRoute>
                <BrandsForm />
              </ProtectedRoute>
            }
          />

          {/* Ui Elements */}
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/avatars"
            element={
              <ProtectedRoute>
                <Avatars />
              </ProtectedRoute>
            }
          />
          <Route
            path="/badge"
            element={
              <ProtectedRoute>
                <Badges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buttons"
            element={
              <ProtectedRoute>
                <Buttons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/images"
            element={
              <ProtectedRoute>
                <Images />
              </ProtectedRoute>
            }
          />
          <Route
            path="/videos"
            element={
              <ProtectedRoute>
                <Videos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Charts */}
          <Route
            path="/line-chart"
            element={
              <ProtectedRoute>
                <LineChart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bar-chart"
            element={
              <ProtectedRoute>
                <BarChart />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth Layout */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
