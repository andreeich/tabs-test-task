import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";

import Box from "./assets/box.svg";
import Dashboard from "./assets/dashboard.svg";
import Bank from "./assets/bank.svg";
import PhoneCall from "./assets/phone-call.svg";
import UserAdd from "./assets/user-add.svg";
import Shop from "./assets/shop.svg";
import ChartPie from "./assets/chart-pie.svg";
import Mail from "./assets/mail.svg";
import Settings from "./assets/settings.svg";
import Book from "./assets/book.svg";
import Cube from "./assets/cube.svg";
import List from "./assets/list.svg";
import ShoppingCart from "./assets/shopping-cart.svg";
import Browser from "./assets/browser.svg";
import Pin from "./assets/pin.svg";
import { useEffect, useState } from "react";

interface IntTab {
	id: string;
	name: string;
	iconSrc: string;
	isPinned: boolean;
}

const tabsData: IntTab[] = [
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

function App() {
	const [tabs, setTabs] = useState<IntTab[]>(() => {
		const savedTabs = localStorage.getItem("tabs");
		return savedTabs ? JSON.parse(savedTabs) : tabsData;
	});
	const [activeTabId, setActiveTabId] = useState<IntTab["id"]>(() => {
		const savedTabId = localStorage.getItem("activeTabId");
		return savedTabId ? savedTabId : tabs[0].id;
	});

	const handlePin = (tabItem: IntTab) => {
		const newTab: IntTab = {
			...tabItem,
			isPinned: !tabItem.isPinned,
		};
		setTabs(tabs.map((t) => (t.id === tabItem.id ? newTab : t)));
	};

	const handleClick = (tabId: IntTab["id"]) => {
		setActiveTabId(tabId);
	};

	useEffect(() => {
		const tabsToSave = JSON.stringify(tabs, null, 2);
		localStorage.setItem("tabs", tabsToSave);
	}, [tabs]);
	useEffect(() => {
		localStorage.setItem("activeTabId", activeTabId);
	}, [activeTabId]);

	return (
		<div className="p-5">
			<Tabs defaultValue={activeTabId} className="w-full">
				<div className="max-w-full overflow-x-scroll">
					<TabsList>
						{tabs.map((t) => (
							<ContextMenu key={t.id}>
								<ContextMenuTrigger>
									<TabsTrigger value={t.id} onClick={() => handleClick(t.id)}>
										<div className="flex-shrink-0">
											<img src={t.iconSrc} alt={t.name} />
										</div>
										{!t.isPinned ? t.name : undefined}
									</TabsTrigger>
								</ContextMenuTrigger>
								<ContextMenuContent>
									<ContextMenuItem onClick={() => handlePin(t)}>
										<img src={Pin} alt="Pin" />
										{t.isPinned ? "Unpin" : "Pin"} anpinnen
									</ContextMenuItem>
								</ContextMenuContent>
							</ContextMenu>
						))}
					</TabsList>
				</div>
				{tabs.map((t) => (
					<TabsContent key={t.id} value={t.id}>
						{t.name}
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}

export default App;
