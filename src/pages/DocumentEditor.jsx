import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentApi } from '../services/documentApi';
import { AIAssistantPanel } from '../components/editor/AIAssistantPanel';
import { Loader } from '../components/shared/Loader';
import { TemplateDocument } from '../components/templates/TemplateDocument';
import { useUiStore } from '../store/uiStore';
import { useCollaborationSocket } from '../hooks/useCollaborationSocket';
import { useEffect } from 'react';
import { isStructuredTemplate } from '../utils/templateContent';

export default function DocumentEditor() {
  const { id } = useParams();
  const qc = useQueryClient();
  const aiOpen = useUiStore((s) => s.aiPanelOpen);
  const setAiOpen = useUiStore((s) => s.setAiPanelOpen);
  const socketRef = useCollaborationSocket();

  const { data: doc, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => (await documentApi.get(id)).data,
    enabled: Boolean(id),
  });

  useEffect(() => {
    const s = socketRef.current;
    if (!s || !id) return;
    s.emit('join-document', id, () => {});
    return () => s.emit('leave-document', id);
  }, [id, socketRef]);

  const persist = useMutation({
    mutationFn: (payload) => documentApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] });
      qc.invalidateQueries({ queryKey: ['document', id] });
    },
  });

  const coverUpload = useMutation({
    mutationFn: (file) => documentApi.uploadCover(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['document', id] }),
  });

  if (isLoading || !doc) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <TemplateDocument
        doc={doc}
        onSave={(payload) => persist.mutate(payload)}
        onCoverUpload={(file) => file && coverUpload.mutate(file)}
      />
      <AIAssistantPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        getEditorText={() =>
          isStructuredTemplate(doc.type)
            ? `${doc.title}\n\n${JSON.stringify(doc.content, null, 2)}`
            : `${doc.title}\n\n${typeof doc.content === 'object' ? JSON.stringify(doc.content) : ''}`
        }
      />
    </>
  );
}
