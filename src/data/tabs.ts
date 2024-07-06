import Box from "@/assets/box.svg";
import Dashboard from "@/assets/dashboard.svg";
import Bank from "@/assets/bank.svg";
import PhoneCall from "@/assets/phone-call.svg";
import UserAdd from "@/assets/user-add.svg";
import Shop from "@/assets/shop.svg";
import ChartPie from "@/assets/chart-pie.svg";
import Mail from "@/assets/mail.svg";
import Settings from "@/assets/settings.svg";
import Book from "@/assets/book.svg";
import Cube from "@/assets/cube.svg";
import List from "@/assets/list.svg";
import ShoppingCart from "@/assets/shopping-cart.svg";
import Browser from "@/assets/browser.svg";

export interface IntTab {
  id: string;
  name: string;
  iconSrc: string;
  isPinned: boolean;
}

export const tabsData: IntTab[] = [
  {
    id: "1",
    name: "Lagerverwaltung",
    iconSrc: Box,
    isPinned: true,
  },
  {
    id: "2",
    name: "Dashboard",
    iconSrc: Dashboard,
    isPinned: false,
  },
  {
    id: "3",
    name: "Banking",
    iconSrc: Bank,
    isPinned: false,
  },
  {
    id: "4",
    name: "Telefonie",
    iconSrc: PhoneCall,
    isPinned: false,
  },
  {
    id: "5",
    name: "Accounting",
    iconSrc: UserAdd,
    isPinned: false,
  },
  {
    id: "6",
    name: "Verkauf",
    iconSrc: Shop,
    isPinned: false,
  },
  {
    id: "7",
    name: "Statistik",
    iconSrc: ChartPie,
    isPinned: false,
  },
  {
    id: "8",
    name: "Post Office",
    iconSrc: Mail,
    isPinned: false,
  },
  {
    id: "9",
    name: "Administration",
    iconSrc: Settings,
    isPinned: false,
  },
  {
    id: "10",
    name: "Help",
    iconSrc: Book,
    isPinned: false,
  },
  {
    id: "11",
    name: "Warenbestand",
    iconSrc: Cube,
    isPinned: false,
  },
  {
    id: "12",
    name: "Auswahlilsten",
    iconSrc: List,
    isPinned: false,
  },
  {
    id: "13",
    name: "Einkauf",
    iconSrc: ShoppingCart,
    isPinned: false,
  },
  {
    id: "14",
    name: "Rechn",
    iconSrc: Browser,
    isPinned: false,
  },
  {
    id: "15",
    name: "Lagerverwaltung",
    iconSrc: Box,
    isPinned: false,
  },
  {
    id: "16",
    name: "Verkauf",
    iconSrc: Shop,
    isPinned: false,
  },
  {
    id: "17",
    name: "Post Office",
    iconSrc: Mail,
    isPinned: false,
  },
  {
    id: "18",
    name: "Telefonie",
    iconSrc: PhoneCall,
    isPinned: false,
  },
];
