import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useTaskMemory } from '../hooks/useTaskMemory';
import TasksHeader from '../components/tasks/TasksHeader';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskCard from '../components/tasks/TaskCard';
import TaskListItem from '../components/tasks/TaskListItem';
import TasksEmptyState from '../components/tasks/TasksEmptyState';
import CreateTaskModal from '../components/tasks/CreateTaskModal';

const TasksPage = ({ onTaskSelect }) => {
  const { tasks, loading, fetchTasks, createTask } = useTasks();
  const { viewMode, setViewMode, filters, setFilters } = useTaskMemory();
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters]);

  const handleCreateTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      fetchTasks(filters);
    }
    return result;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <TasksHeader
        tasksCount={tasks.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onCreateTask={() => setShowCreateModal(true)}
      />

      {showFilters && (
        <TaskFilters filters={filters} setFilters={setFilters} />
      )}

      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <TasksEmptyState onCreateTask={() => setShowCreateModal(true)} />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={onTaskSelect}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <TaskListItem
                key={task.id}
                task={task}
                onClick={onTaskSelect}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
};

export default TasksPage;
