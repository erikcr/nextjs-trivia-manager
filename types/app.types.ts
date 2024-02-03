import { Tables } from "./database.types";

interface SidebarItem {
  type: string;
  label?: string;
  destination?: string;
  rounds?: Tables<"v002_rounds_stag">[];
}
export interface SidebarList extends Array<SidebarItem> { }
