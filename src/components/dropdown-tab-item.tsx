import { TabsTrigger } from "@/components/ui/tabs";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/icon";

import type { IntTabItem } from "@/components/tab-item";
import type { IntTab } from "@/data/tabs";

export interface IntDropdownTabItem extends IntTabItem {
	onDelete: (id: IntTab["id"]) => void;
}

export function DropdownTabItem({
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
					<button type="button" onClick={() => onDelete(tabItem.id)}>
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
