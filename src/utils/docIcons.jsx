import {
  BookOpen,
  FileText,
  Kanban,
  Library,
  ListTodo,
  PieChart,
  Plane,
  Repeat,
  UtensilsCrossed,
} from 'lucide-react';

const map = {
  note: FileText,
  journal: BookOpen,
  habit_tracker: Repeat,
  budget_planner: PieChart,
  travel_planner: Plane,
  meal_planner: UtensilsCrossed,
  reading_list: Library,
  project_planner: Kanban,
  todo_list: ListTodo,
};

export function DocumentTypeIcon({ type, className }) {
  const Cmp = map[type] || FileText;
  return <Cmp className={className} />;
}
