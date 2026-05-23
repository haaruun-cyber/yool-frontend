import { Plus } from 'lucide-react';
import { WEEK_DAYS, uid } from '../../../utils/templateContent';
import { DbToolbar } from '../DbToolbar';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];
const DAY_LABEL = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const TAG_COLORS = {
  Breakfast: 'bg-emerald-500/15 text-emerald-400',
  Lunch: 'bg-blue-500/15 text-blue-400',
  Dinner: 'bg-orange-500/15 text-orange-400',
};

export function MealPlannerView({ content, onChange }) {
  const weeklyPlan = content.weeklyPlan || {};
  const meals = content.meals || [];

  const setPlan = (next) => onChange({ ...content, weeklyPlan: next });
  const setMeals = (next) => onChange({ ...content, meals: next });

  const addMealRow = (day) => {
    setPlan({
      ...weeklyPlan,
      [day]: [...(weeklyPlan[day] || []), { id: uid(), text: 'New meal', mealType: 'Lunch', done: false }],
    });
  };

  const addGalleryMeal = () => {
    setMeals([
      ...meals,
      {
        id: uid(),
        title: 'New meal',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=240&fit=crop',
        tags: ['Dinner'],
      },
    ]);
  };

  return (
    <div className="space-y-10">
      <section>
        <DbToolbar title="Weekly Plan" onNew={() => addMealRow('monday')} newLabel="New" />
        <div className="space-y-4">
          {WEEK_DAYS.map((day) => (
            <div key={day}>
              <p className="mb-2 text-sm font-semibold text-ink">{DAY_LABEL[day]}</p>
              <ul className="space-y-1 border-l-2 border-notion-border pl-3">
                {(weeklyPlan[day] || []).map((m) => (
                  <li key={m.id} className="flex flex-wrap items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(m.done)}
                      onChange={(e) => {
                        const list = (weeklyPlan[day] || []).map((x) =>
                          x.id === m.id ? { ...x, done: e.target.checked } : x
                        );
                        setPlan({ ...weeklyPlan, [day]: list });
                      }}
                    />
                    <input
                      value={m.text}
                      onChange={(e) => {
                        const list = (weeklyPlan[day] || []).map((x) =>
                          x.id === m.id ? { ...x, text: e.target.value } : x
                        );
                        setPlan({ ...weeklyPlan, [day]: list });
                      }}
                      className={`min-w-[120px] flex-1 bg-transparent outline-none ${m.done ? 'line-through text-ink-muted' : ''}`}
                    />
                    <select
                      value={m.mealType}
                      onChange={(e) => {
                        const list = (weeklyPlan[day] || []).map((x) =>
                          x.id === m.id ? { ...x, mealType: e.target.value } : x
                        );
                        setPlan({ ...weeklyPlan, [day]: list });
                      }}
                      className={`rounded px-2 py-0.5 text-xs ${TAG_COLORS[m.mealType] || 'bg-notion-hover'}`}
                    >
                      {MEAL_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => addMealRow(day)}
                className="mt-1 flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
              >
                <Plus className="h-3 w-3" /> Add meal
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <DbToolbar title="Meals" onNew={addGalleryMeal} newLabel="New" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-lg border border-notion-border bg-surface">
              <img src={m.image} alt="" className="h-36 w-full object-cover" />
              <div className="p-3">
                <input
                  value={m.title}
                  onChange={(e) => {
                    setMeals(meals.map((x) => (x.id === m.id ? { ...x, title: e.target.value } : x)));
                  }}
                  className="mb-2 w-full bg-transparent font-semibold outline-none"
                />
                <div className="flex flex-wrap gap-1">
                  {(m.tags || []).map((tag, i) => (
                    <span key={i} className="rounded bg-notion-hover px-2 py-0.5 text-xs text-ink-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addGalleryMeal}
          className="mt-3 flex items-center gap-2 text-sm text-ink-muted hover:bg-notion-hover"
        >
          <Plus className="h-4 w-4" /> New page
        </button>
      </section>
    </div>
  );
}
