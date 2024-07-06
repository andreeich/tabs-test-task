import { forwardRef, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDebounceCallback } from "usehooks-ts";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

import { type IntTab, tabsData } from "./data/tabs";

interface IntTabItem {
	tabItem: IntTab;
	onClick: (tabId: IntTab["id"]) => void;
	onPin: (tabItem: IntTab) => void;
}

const TabItem = forwardRef<HTMLButtonElement, IntTabItem>(
	({ tabItem, onClick, onPin, ...props }, ref) => {
		return (
			<ContextMenu>
				<ContextMenuTrigger>
					<TabsTrigger
						value={tabItem.id}
						onClick={() => onClick(tabItem.id)}
						className={cn("h-full", !tabItem.isPinned ? "w-full" : undefined)}
						data-pinned={tabItem.isPinned}
						ref={ref}
						{...props}
					>
						<div className="flex-shrink-0">
							<Icon variant={tabItem.iconName} />
						</div>
						{!tabItem.isPinned ? tabItem.name : undefined}
					</TabsTrigger>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onClick={() => onPin(tabItem)}>
						<Icon variant="pin" />
						{tabItem.isPinned ? "Unpin" : "Pin"} anpinnen
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		);
	},
);
TabItem.displayName = "TabItem";

interface IntDropdownTabItem extends IntTabItem {
	onDelete: (id: IntTab["id"]) => void;
}

function DropdownTabItem({
	tabItem,
	onClick,
	onPin,
	onDelete,
}: IntDropdownTabItem) {
	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<DropdownMenuItem
					key={tabItem.id}
					onClick={() => onClick(tabItem.id)}
					className="justify-between"
				>
					<TabsTrigger
						value={tabItem.id}
						className="h-full !border-none !bg-transparent justify-start p-0"
					>
						<Icon variant={tabItem.iconName} />
						{tabItem.name}
					</TabsTrigger>
					<button onClick={() => onDelete(tabItem.id)}>
						<Icon variant="x" />
						<span className="sr-only">Delete</span>
					</button>
				</DropdownMenuItem>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onClick={() => onPin(tabItem)}>
					<Icon variant="pin" />
					{tabItem.isPinned ? "Unpin" : "Pin"} anpinnen
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

function App() {
	const [tabs, setTabs] = useState<IntTab[]>(() => {
		const savedTabs = localStorage.getItem("tabs");
		return savedTabs ? (JSON.parse(savedTabs) as IntTab[]) : tabsData;
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

	const handleDropEnd = (result: any) => {
		const { destination, source, draggableId } = result;

		if (!destination) return;

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		)
			return;

		const tab = unpinnedTabs[source.index];
		const newTabs = Array.from(unpinnedTabs);
		newTabs.splice(source.index, 1);
		newTabs.splice(destination.index, 0, tab);

		setTabs(pinnedTabs.concat(newTabs));
	};

	const handleDelete = (id: IntTab["id"]) => {
		const newTabs = fullTabs.filter((tab) => tab.id !== id);
		setTabs(newTabs);
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
		<div className="flex h-screen">
			<aside className="w-[92px]" />
			<div className="flex flex-col w-full h-full">
				<div className="h-[69px]" />
				<Tabs
					defaultValue={tabSearch ? parseInt(tabSearch[1]) : tabs[0].id}
					className="w-full h-full flex flex-col"
				>
					<div className="flex border-y border-border-default">
						<div
							ref={tabsContainerRef}
							className="w-full overflow-hidden relative flex"
						>
							<DragDropContext onDragEnd={handleDropEnd}>
								<TabsList>
									{pinnedTabs.map((t) => (
										<TabItem
											key={t.id}
											tabItem={t}
											onClick={handleClick}
											onPin={handlePin}
										/>
									))}
								</TabsList>
								<Droppable droppableId="tabs" direction="horizontal">
									{(provided) => (
										<TabsList
											ref={provided.innerRef}
											{...provided.droppableProps}
											className="w-full justify-start"
										>
											{unpinnedTabs
												.slice(0, overflowIndex - pinnedTabs.length)
												.map((t, i) => (
													<Draggable
														key={t.id}
														draggableId={t.id.toString()}
														index={i}
													>
														{(provided) => (
															<TabItem
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																tabItem={t}
																onClick={handleClick}
																onPin={handlePin}
															/>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</TabsList>
									)}
								</Droppable>
							</DragDropContext>

							<TabsList
								ref={absoluteTabsContainerRef}
								className="absolute invisible"
							>
								{fullTabs.map((t) => (
									<TabItem
										key={t.id}
										tabItem={t}
										onClick={handleClick}
										onPin={handlePin}
									/>
								))}
							</TabsList>
						</div>
						<DropdownMenu>
							<span>
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="bg-background-blue text-sm text-white px-2.5 py-2.5 h-full inline-flex items-center justify-center focus-visible:outline-none"
									>
										<svg
											width="9"
											height="6"
											viewBox="0 0 9 6"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<title>More tabs</title>
											<path
												d="M4.5 0.45L0 4.95L1.05 6L4.5 2.55L7.95 6L9 4.95L4.5 0.45Z"
												fill="currentColor"
											/>
										</svg>
									</button>
								</DropdownMenuTrigger>
							</span>
							<DropdownMenuContent sideOffset={0}>
								<ScrollArea className="max-h-[50vh] h-fit">
									<TabsList className="flex-col items-stretch px-4">
										{fullTabs.slice(overflowIndex)?.map((t) => (
											<DropdownTabItem
												key={t.id}
												tabItem={t}
												onClick={handleClick}
												onPin={handlePin}
												onDelete={handleDelete}
											/>
										))}
									</TabsList>
								</ScrollArea>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="p-5 bg-background-active h-full">
						{tabs.map((t) => (
							<TabsContent
								key={t.id}
								value={t.id}
								className="w-full h-full mt-0"
							>
								{t.name}
							</TabsContent>
						))}
					</div>
				</Tabs>
			</div>
		</div>
	);
}

export default App;
