import TopicPage from './components/topics/TopicPage';

// Add to your Route definitions
<Route 
  path="/projects/:projectId/topics/:topicId" 
  element={
    <TopicPage 
      canEdit={canEdit}
      onBack={() => navigate(`/projects/${projectId}`)}
      onUpdate={() => {/* refresh logic */}}
      onDelete={() => navigate(`/projects/${projectId}`)}
    />
  } 
/>
