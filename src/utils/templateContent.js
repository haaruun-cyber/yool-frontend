const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const COVERS = {
  todo_list:
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=280&fit=crop',
  meal_planner:
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=280&fit=crop',
  travel_planner:
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=280&fit=crop',
  budget_planner:
    'https://images.unsplash.com/photo-1579621970795-87f9d8181a8c?w=1200&h=280&fit=crop',
  journal:
    'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&h=280&fit=crop',
  habit_tracker:
    'https://images.unsplash.com/photo-1476480862126-209bfaa8dfb8?w=1200&h=280&fit=crop',
  project_planner:
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=280&fit=crop',
  reading_list:
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=280&fit=crop',
  note: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=280&fit=crop',
};

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS = { mon: 'Mon', tue: 'Tues', wed: 'Wed', thu: 'Thur', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const emptyDayTodos = () =>
  DAYS.reduce((acc, d) => {
    acc[d] = [{ id: uid(), text: 'To-do', done: false }];
    return acc;
  }, {});

const emptyWeeklyMeals = () =>
  WEEK_DAYS.reduce((acc, d) => {
    acc[d] = [
      { id: uid(), text: 'Overnight Oats', mealType: 'Breakfast', done: false },
      { id: uid(), text: 'Lunch', mealType: 'Lunch', done: false },
      { id: uid(), text: 'Dinner', mealType: 'Dinner', done: false },
    ];
    return acc;
  }, {});

export function getDefaultContent(type) {
  switch (type) {
    case 'todo_list':
      return {
        view: 'weekly_todo',
        weekLabel: 'This week',
        days: {
          ...emptyDayTodos(),
          mon: [
            { id: uid(), text: 'Call Mom', done: true },
            { id: uid(), text: 'Book appt', done: true },
            { id: uid(), text: 'To-do', done: false },
          ],
        },
      };
    case 'meal_planner':
      return {
        view: 'meal_planner',
        weeklyPlan: emptyWeeklyMeals(),
        meals: [
          {
            id: uid(),
            title: 'Salmon and Asparagus',
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=240&fit=crop',
            tags: ['Dinner', 'Healthy'],
          },
          {
            id: uid(),
            title: 'Rainbow Salad',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=240&fit=crop',
            tags: ['Lunch', 'Healthy'],
          },
          {
            id: uid(),
            title: 'Turkey Stir Fry',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=240&fit=crop',
            tags: ['Dinner', 'High protein'],
          },
        ],
      };
    case 'travel_planner':
      return {
        view: 'travel_planner',
        packing: {
          clothing: [
            { id: uid(), text: 'T-shirts', done: false },
            { id: uid(), text: 'Jeans', done: false },
          ],
          toiletries: [
            { id: uid(), text: 'Toothbrush', done: false },
            { id: uid(), text: 'Sunscreen', done: false },
          ],
          electronics: [{ id: uid(), text: 'Phone charger', done: false }],
          documents: [{ id: uid(), text: 'Passport', done: false }],
        },
        itinerary: [
          {
            id: uid(),
            activity: 'Departing flight',
            date: new Date().toISOString(),
            notes: 'Flight Code: AA100',
          },
          {
            id: uid(),
            activity: 'Central park',
            date: new Date().toISOString(),
            notes: '',
          },
          {
            id: uid(),
            activity: "Joe's pizza",
            date: new Date().toISOString(),
            notes: '',
          },
        ],
      };
    case 'budget_planner':
      return {
        view: 'budget_planner',
        income: [
          { id: uid(), item: 'Salary', amount: 3500 },
          { id: uid(), item: 'Side project', amount: 600 },
        ],
        expenses: [
          { id: uid(), item: 'Rent', amount: 1200 },
          { id: uid(), item: 'Groceries', amount: 400 },
          { id: uid(), item: 'Utilities', amount: 150 },
        ],
      };
    case 'journal':
      return {
        view: 'journal',
        entries: [
          {
            id: uid(),
            date: new Date().toISOString(),
            title: 'A Peaceful Forest Walk',
            body: 'Today I took a walk through the forest. The air was crisp and the trees were swaying gently in the breeze.',
            open: true,
          },
        ],
      };
    case 'habit_tracker':
      return {
        view: 'habit_tracker',
        columns: {
          not_started: [{ id: uid(), title: 'Morning run' }],
          in_progress: [{ id: uid(), title: 'Read 20 pages' }],
          done: [{ id: uid(), title: 'Drink water' }],
        },
      };
    case 'project_planner':
      return {
        view: 'project_planner',
        rows: [
          { id: uid(), title: 'wordpress Ecommerce website', status: 'in_progress', deadline: null },
          { id: uid(), title: 'React with node js', status: 'not_started', deadline: null },
        ],
      };
    case 'reading_list':
      return {
        view: 'reading_list',
        books: [
          { id: uid(), title: 'Atomic Habits', author: 'James Clear', status: 'reading' },
          { id: uid(), title: 'Deep Work', author: 'Cal Newport', status: 'want' },
        ],
      };
    default:
      return { view: 'note', body: null };
  }
}

export function normalizeContent(type, raw) {
  const base = getDefaultContent(type);
  if (!raw || typeof raw !== 'object') return base;
  if (raw.view) return { ...base, ...raw };
  if (type === 'journal' && raw.entries) return { ...base, view: 'journal', entries: raw.entries };
  if (type === 'habit_tracker' && raw.habits) {
    return { ...base, view: 'habit_tracker', columns: raw.habits };
  }
  if (type === 'meal_planner' && raw.week) {
    return { ...base, view: 'meal_planner', weeklyPlan: raw.week, meals: raw.meals || base.meals };
  }
  if (type === 'travel_planner' && raw.itinerary) {
    return { ...base, view: 'travel_planner', itinerary: raw.itinerary, packing: raw.packing || base.packing };
  }
  if (type === 'budget_planner' && raw.categories) {
    return base;
  }
  if (type === 'todo_list' && raw.items) {
    return base;
  }
  if (raw.type === 'doc' || raw.content) return raw;
  return { ...base, ...raw };
}

export function isStructuredTemplate(type) {
  return [
    'todo_list',
    'meal_planner',
    'travel_planner',
    'budget_planner',
    'journal',
    'habit_tracker',
    'project_planner',
    'reading_list',
  ].includes(type);
}

export { DAYS, DAY_LABELS, WEEK_DAYS, uid };
