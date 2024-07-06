import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDebounceCallback } from "usehooks-ts";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import { type IntTab, tabsData } from "./data/tabs";
import Pin from "./assets/pin.svg";

function App() {
	const [tabs, setTabs] = useState<IntTab[]>(() => {
		const savedTabs = localStorage.getItem("tabs");
		return savedTabs ? JSON.parse(savedTabs) : tabsData;
	});
	const [overflowIndex, setOverflowIndex] = useState<number | undefined>(
		undefined,
	);

	// rearrange tabs so that pinned ones will the first
	const pinnedTabs = tabs.filter((t) => t.isPinned);
	const unpinnedTabs = tabs.filter((t) => !t.isPinned);
	const fullTabs = pinnedTabs.concat(unpinnedTabs);

	// getting tab search param
	const location = useLocation();
	const navigate = useNavigate();
	const tabSearch = location.search
		.split("?")
		.splice(1)
		.find((tab) => tab.match("tab"))
		?.split("=");

	// used for visible tab container
	const tabsContainerRef = useRef();
	// used for invisible tab container that is used for calculating tab widths
	const absoluteTabsContainerRef = useRef();

	// handles tab pinning
	const handlePin = (tabItem: IntTab) => {
		const newTab: IntTab = {
			...tabItem,
			isPinned: !tabItem.isPinned,
		};
		setTabs(tabs.map((t) => (t.id === tabItem.id ? newTab : t)));
	};

	// handles click to tab
	const handleClick = (tabId: IntTab["id"]) => {
		navigate({
			pathname: "/",
			search: `tab=${tabId}`,
		});
	};

	// calculating tabs that should be visible
	function calcVisibleTabs() {
		const tabsContainerWidth = tabsContainerRef.current?.offsetWidth;
		let index = 0;
		let tabsWidth = 0;
		const renderedTabs =
			absoluteTabsContainerRef.current?.querySelectorAll("span[data-state]");
		// searching for last tab index that is not overflowing a container
		for (const [i, t] of renderedTabs?.entries()) {
			if (tabsWidth + t?.offsetWidth >= tabsContainerWidth) {
				index = i;
				break;
			} else {
				tabsWidth += t?.offsetWidth;
			}
		}
		// if index was not found don't change overflowIndex
		if (index !== 0) setOverflowIndex(index);
	}
	const debouncedCalcVisibleTabs = useDebounceCallback(calcVisibleTabs, 100);

	// saving tabs to localStorage on change
	useEffect(() => {
		const tabsToSave = JSON.stringify(tabs, null, 2);
		localStorage.setItem("tabs", tabsToSave);
	}, [tabs]);

	// changing overflowIndex to control showed and hidden tabs based on container width
	useEffect(() => {
		debouncedCalcVisibleTabs();

		window.addEventListener("resize", debouncedCalcVisibleTabs);

		return () => {
			window.removeEventListener("resize", debouncedCalcVisibleTabs);
		};
	}, []);

	return (
		<div className="p-5">
			<Tabs
				defaultValue={tabSearch ? tabSearch[1] : tabs[0].id}
				className="w-full"
			>
				<div className=" flex ">
					<div
						ref={tabsContainerRef}
						className="w-full overflow-hidden relative"
					>
						<TabsList>
							{fullTabs.slice(0, overflowIndex).map((t) => (
								<ContextMenu key={t.id}>
									<ContextMenuTrigger>
										<TabsTrigger
											value={t.id}
											onClick={() => handleClick(t.id)}
											className="h-full"
										>
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
						<TabsList
							ref={absoluteTabsContainerRef}
							className="absolute invisible"
						>
							{fullTabs.map((t) => (
								<ContextMenu key={t.id}>
									<ContextMenuTrigger>
										<TabsTrigger value={t.id} className="h-full">
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
					<DropdownMenu>
						<span>
							<DropdownMenuTrigger asChild>
								<button className="bg-background-blue text-sm text-white px-2.5 py-2.5 h-full inline-flex items-center justify-center focus-visible:outline-none">
									<svg
										width="9"
										height="6"
										viewBox="0 0 9 6"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M4.5 0.45L0 4.95L1.05 6L4.5 2.55L7.95 6L9 4.95L4.5 0.45Z"
											fill="currentColor"
										/>
									</svg>
									<span className="sr-only">More tabs</span>
								</button>
							</DropdownMenuTrigger>
						</span>
						<DropdownMenuContent sideOffset={0}>
							<ScrollArea className="max-h-[50vh] h-80">
								<TabsList className="flex-col items-stretch px-4">
									{fullTabs.slice(overflowIndex)?.map((t) => (
										<DropdownMenuItem
											key={t.id}
											onClick={() => handleClick(t.id)}
										>
											<TabsTrigger
												value={t.id}
												className="h-full !border-none !bg-transparent justify-start p-0"
											>
												<img src={t.iconSrc} alt={t.name} />
												{t.name}
											</TabsTrigger>
										</DropdownMenuItem>
									))}
								</TabsList>
							</ScrollArea>
						</DropdownMenuContent>
					</DropdownMenu>
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
