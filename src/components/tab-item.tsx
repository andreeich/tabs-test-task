import { TabsTrigger } from "@/components/ui/tabs";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

import type { IntTab } from "@/data/tabs";

export interface IntTabItem {
	tabItem: IntTab;
	className: string;
	onClick: (tabId: IntTab["id"]) => void;
	onPin: (tabItem: IntTab) => void;
}

export const TabItem = ({ tabItem, onClick, onPin, className }: IntTabItem) => {
	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<TabsTrigger
					value={tabItem.id}
					onClick={() => onClick(tabItem.id)}
					className={cn(
						"h-full",
						!tabItem.isPinned ? "w-full" : undefined,
						className,
					)}
					data-pinned={tabItem.isPinned}
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
};
