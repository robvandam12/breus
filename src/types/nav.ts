
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  visible: boolean;
  children?: NavItem[];
}
