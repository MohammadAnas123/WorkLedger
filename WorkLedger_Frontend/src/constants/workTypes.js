import { Hammer, Zap, Droplets, Paintbrush, Package } from "lucide-react";

export const WORK_TYPES = [
  { key: "interior", label: "Interior", icon: Paintbrush, color: "#C4622D" },
  { key: "molding", label: "Molding", icon: Hammer, color: "#3F6B4F" },
  { key: "electric", label: "Electric", icon: Zap, color: "#B8932F" },
  { key: "plumbing", label: "Plumbing", icon: Droplets, color: "#3E6E8C" },
  { key: "other", label: "Other", icon: Package, color: "#8B8478" },
];

export const workTypeMeta = (key) =>
  WORK_TYPES.find((w) => w.key === key) || WORK_TYPES[4];
