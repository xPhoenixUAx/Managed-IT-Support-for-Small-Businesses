import {
  ClipboardCheck,
  CloudCog,
  CloudUpload,
  Headphones,
  Laptop,
  LifeBuoy,
  MailCheck,
  PanelsTopLeft,
  ShieldCheck,
  Wifi,
  type LucideProps,
} from "lucide-react";

const icons = {
  ClipboardCheck,
  CloudCog,
  CloudUpload,
  Headphones,
  Laptop,
  LifeBuoy,
  MailCheck,
  PanelsTopLeft,
  ShieldCheck,
  Wifi,
};

export function ServiceIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name as keyof typeof icons] ?? LifeBuoy;
  return <Icon aria-hidden="true" {...props} />;
}
