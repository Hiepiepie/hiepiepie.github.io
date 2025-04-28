import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import PortfolioView from "../views/PortfolioView.vue";
import PnLView from "../views/PnLView.vue";
import WhaleWatchView from "../views/WhaleWatchView.vue";
import LoginView from "../views/LoginView.vue";
import SignUpView from "../views/SignUpView.vue";
import SettingsView from "../views/SettingsView.vue";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/portfolio",
    name: "portfolio",
    component: PortfolioView,
  },
  {
    path: "/pnl",
    name: "pnl",
    component: PnLView,
  },
  {
    path: "/whalewatch",
    name: "whalewatch",
    component: WhaleWatchView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
