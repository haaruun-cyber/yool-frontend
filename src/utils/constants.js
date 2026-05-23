export const DOCUMENT_TYPES = [
  { id: 'note', label: 'Note', icon: 'FileText' },
  { id: 'journal', label: 'Journal', icon: 'BookOpen' },
  { id: 'habit_tracker', label: 'Habit tracker', icon: 'Repeat' },
  { id: 'budget_planner', label: 'Budget planner', icon: 'PieChart' },
  { id: 'travel_planner', label: 'Travel planner', icon: 'Plane' },
  { id: 'meal_planner', label: 'Meal planner', icon: 'UtensilsCrossed' },
  { id: 'reading_list', label: 'Reading list', icon: 'Library' },
  { id: 'project_planner', label: 'Project planner', icon: 'Kanban' },
  { id: 'todo_list', label: 'To-do list', icon: 'ListTodo' },
];

export const TEMPLATE_CATEGORIES = [
  { id: 'productivity', label: 'Productivity', match: ['note', 'todo_list', 'project_planner'] },
  { id: 'study', label: 'Study', match: ['reading_list', 'journal'] },
  { id: 'finance', label: 'Finance', match: ['budget_planner'] },
  { id: 'health', label: 'Health', match: ['habit_tracker', 'meal_planner'] },
  { id: 'travel', label: 'Travel', match: ['travel_planner'] },
];

export const docOrderKey = (userId) => `yool:docOrder:${userId || 'anon'}`;
