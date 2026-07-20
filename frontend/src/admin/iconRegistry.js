// Curated icon set for admin-managed majors and university programs.
// Data stores an `iconName` string (serializable) instead of a component
// reference; resolveIcon() maps it back to the actual lucide component.
import {
  Stethoscope,
  Smile,
  Code2,
  Wrench,
  Briefcase,
  Pill,
  Building2,
  Cpu,
  GraduationCap,
  BookOpen,
  Award,
  Globe,
  Users,
  Landmark,
  FlaskConical,
  Palette,
  Scale,
  Calculator,
  Music,
  Leaf,
  Rocket,
  Camera,
} from "lucide-react";

export const ICONS = {
  Stethoscope,
  Smile,
  Code2,
  Wrench,
  Briefcase,
  Pill,
  Building2,
  Cpu,
  GraduationCap,
  BookOpen,
  Award,
  Globe,
  Users,
  Landmark,
  FlaskConical,
  Palette,
  Scale,
  Calculator,
  Music,
  Leaf,
  Rocket,
  Camera,
};

export const ICON_NAMES = Object.keys(ICONS);

export function resolveIcon(name) {
  return ICONS[name] || GraduationCap;
}
