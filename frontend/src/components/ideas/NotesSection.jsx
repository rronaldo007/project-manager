import React from 'react';

const NotesSection = ({ idea, onShowAddNote, canAddNotes }) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Notes ({idea.notes?.length || 0})</h2>
        {canAddNotes && (
          <button
            onClick={onShowAddNote}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Note</span>
          </button>
        )}
      </div>
      <div className="space-y-3">
        {idea.notes && idea.notes.length > 0 ? (
          idea.notes.map((note) => (
            <div key={note.id} className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="font-medium text-white mb-2">{note.title}</h3>
              <p className="text-gray-300 text-sm">{note.content}</p>
              <div className="mt-2 text-xs text-gray-500">
                by {note.author.first_name} {note.author.last_name} • {new Date(note.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400 mb-4">No notes yet</p>
            {canAddNotes && (
              <button
                onClick={onShowAddNote}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                Add First Note
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesSection;
