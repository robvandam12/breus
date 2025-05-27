
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children?: React.ReactNode;
}

export const Header = ({ title, subtitle, icon: Icon, children }: HeaderProps) => {
  return (
    <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
      <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
        <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-6 h-6 text-zinc-600" />}
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
            {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <NotificationCenter />
          {children}
        </div>
      </div>
    </header>
  );
};
