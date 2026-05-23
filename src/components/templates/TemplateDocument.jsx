import { useEffect, useRef, useState } from 'react';
import { COVERS, getDefaultContent, isStructuredTemplate, normalizeContent } from '../../utils/templateContent';
import { PageShell } from './PageShell';
import { WeeklyTodoView } from './views/WeeklyTodoView';
import { MealPlannerView } from './views/MealPlannerView';
import { TravelPlannerView } from './views/TravelPlannerView';
import { BudgetPlannerView } from './views/BudgetPlannerView';
import { JournalView } from './views/JournalView';
import { HabitTrackerView } from './views/HabitTrackerView';
import { ProjectPlannerView } from './views/ProjectPlannerView';
import { ReadingListView } from './views/ReadingListView';
import { RichTextEditor } from '../editor/RichTextEditor';

const DESCRIPTIONS = {
  todo_list: 'Use this page to plan your week. Check off tasks as you go.',
  meal_planner: 'Plan meals for the week and keep your favorite recipes in the gallery.',
  travel_planner: 'Pack smarter and build your trip itinerary in one place.',
  budget_planner: 'Track monthly income and expenses with automatic totals.',
  journal: 'Capture your thoughts with dated, collapsible entries.',
  habit_tracker: 'Move habits across Not started, In progress, and Done.',
  project_planner: 'Track projects with status and deadlines in a table view.',
  reading_list: 'Keep track of books you want to read, are reading, or finished.',
};

export function TemplateDocument({ doc, onSave, onCoverUpload }) {
  const saveTimer = useRef();
  const [title, setTitle] = useState(doc?.title || '');
  const [content, setContent] = useState(() => normalizeContent(doc?.type, doc?.content));

  useEffect(() => {
    if (!doc) return;
    setTitle(doc.title);
    setContent(normalizeContent(doc.type, doc.content));
  }, [doc?._id, doc?.title, doc?.content, doc?.type]);

  const scheduleSave = (nextTitle, nextContent) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onSave({ title: nextTitle, content: nextContent });
    }, 800);
  };

  const handleTitle = (v) => {
    setTitle(v);
    scheduleSave(v, content);
  };

  const handleContent = (next) => {
    setContent(next);
    scheduleSave(title, next);
  };

  if (!doc) return null;

  const cover = doc.coverImage || COVERS[doc.type] || COVERS.note;
  const structured = isStructuredTemplate(doc.type);

  let body = null;
  if (doc.type === 'todo_list') body = <WeeklyTodoView content={content} onChange={handleContent} />;
  else if (doc.type === 'meal_planner') body = <MealPlannerView content={content} onChange={handleContent} />;
  else if (doc.type === 'travel_planner') body = <TravelPlannerView content={content} onChange={handleContent} />;
  else if (doc.type === 'budget_planner') body = <BudgetPlannerView content={content} onChange={handleContent} />;
  else if (doc.type === 'journal') body = <JournalView content={content} onChange={handleContent} />;
  else if (doc.type === 'habit_tracker') body = <HabitTrackerView content={content} onChange={handleContent} />;
  else if (doc.type === 'project_planner') body = <ProjectPlannerView content={content} onChange={handleContent} />;
  else if (doc.type === 'reading_list') body = <ReadingListView content={content} onChange={handleContent} />;
  else {
    const editorVal = content?.type === 'doc' ? content : content?.body ?? content;
    body = (
      <RichTextEditor
        key={doc._id}
        value={editorVal}
        onChange={(json) => handleContent(json)}
      />
    );
  }

  return (
    <PageShell
      docType={doc.type}
      title={title}
      onTitleChange={handleTitle}
      cover={cover}
      onCoverUpload={onCoverUpload}
      description={structured ? DESCRIPTIONS[doc.type] : undefined}
    >
      {body}
    </PageShell>
  );
}

export { getDefaultContent };
