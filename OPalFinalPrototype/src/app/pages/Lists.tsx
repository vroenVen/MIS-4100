import { useState } from "react";
import { useApp, ListItem } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { Plus, Trash2, Circle, CheckCircle2, Pencil, Check, X, ChevronDown, ChevronRight } from "lucide-react";
import { capitalizeFirstLetter } from "../utils/stringHelpers";

export default function Lists() {
  const { userData, lists, addList, updateList, deleteList } = useApp();
  const { theme, darkMode } = useTheme();
  
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set());
  const [newItem, setNewItem] = useState<{ [key: string]: string }>({});
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editListTitle, setEditListTitle] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemText, setEditItemText] = useState("");

  const backgroundColor = darkMode ? theme.surface : theme.background;
  const textColor = darkMode ? theme.surfaceText : theme.text;

  const handleAddList = () => {
    if (newListTitle) {
      addList({
        title: newListTitle,
        items: [],
      });
      setNewListTitle("");
      setShowAddList(false);
    }
  };

  const toggleExpanded = (listId: string) => {
    const newExpanded = new Set(expandedLists);
    if (newExpanded.has(listId)) {
      newExpanded.delete(listId);
    } else {
      newExpanded.add(listId);
    }
    setExpandedLists(newExpanded);
  };

  const addListItem = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    const itemText = newItem[listId];
    
    if (list && itemText) {
      const newItemObj: ListItem = {
        id: Date.now().toString(),
        text: itemText,
        completed: false,
      };
      
      updateList(listId, {
        items: [...list.items, newItemObj],
      });
      
      setNewItem({ ...newItem, [listId]: "" });
    }
  };

  const toggleListItem = (listId: string, itemId: string) => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      const updatedItems = list.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      updateList(listId, { items: updatedItems });
    }
  };

  const deleteListItem = (listId: string, itemId: string) => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      const updatedItems = list.items.filter(item => item.id !== itemId);
      updateList(listId, { items: updatedItems });
    }
  };

  const handleEditList = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      setEditingListId(listId);
      setEditListTitle(list.title);
    }
  };

  const handleSaveListEdit = (listId: string) => {
    if (editListTitle) {
      updateList(listId, { title: editListTitle });
      setEditingListId(null);
      setEditListTitle("");
    }
  };

  const handleEditItem = (listId: string, itemId: string) => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      const item = list.items.find(i => i.id === itemId);
      if (item) {
        setEditingItemId(itemId);
        setEditItemText(item.text);
      }
    }
  };

  const handleSaveItemEdit = (listId: string, itemId: string) => {
    if (editItemText) {
      const list = lists.find(l => l.id === listId);
      if (list) {
        const updatedItems = list.items.map(item =>
          item.id === itemId ? { ...item, text: editItemText } : item
        );
        updateList(listId, { items: updatedItems });
        setEditingItemId(null);
        setEditItemText("");
      }
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{capitalizeFirstLetter(userData.name)}'s Lists</h1>
          <button
            onClick={() => setShowAddList(!showAddList)}
            className="p-2 rounded-lg"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.textOnPrimary,
            }}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {showAddList && (
          <div
            className="p-4 rounded-lg mb-6 space-y-3"
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.textOnSecondary,
            }}
          >
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="List title (e.g., Grocery List)"
              className="w-full px-4 py-2 rounded-lg border-2"
              style={{
                backgroundColor: darkMode ? theme.surface : theme.background,
                color: darkMode ? theme.surfaceText : theme.text,
                borderColor: theme.colors.primary,
              }}
            />

            <div className="flex gap-2">
              <button
                onClick={handleAddList}
                className="flex-1 py-2 rounded-lg font-semibold"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.textOnPrimary,
                }}
              >
                Create List
              </button>
              <button
                onClick={() => {
                  setShowAddList(false);
                  setNewListTitle("");
                }}
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: theme.colors.tertiary,
                  color: theme.textOnTertiary,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {lists.length === 0 ? (
            <div
              className="p-6 rounded-lg text-center"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.textOnSecondary,
              }}
            >
              <p className="opacity-70">No lists yet. Create your first list!</p>
            </div>
          ) : (
            lists.map((list) => {
              const isExpanded = expandedLists.has(list.id);
              const completedCount = list.items.filter(item => item.completed).length;
              
              return (
                <div
                  key={list.id}
                  className="rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: theme.textOnSecondary,
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-lg">
                          {editingListId === list.id ? (
                            <input
                              type="text"
                              value={editListTitle}
                              onChange={(e) => setEditListTitle(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border-2"
                              style={{
                                backgroundColor: darkMode ? theme.surface : theme.background,
                                color: darkMode ? theme.surfaceText : theme.text,
                                borderColor: theme.colors.primary,
                              }}
                            />
                          ) : (
                            list.title
                          )}
                        </div>
                        <div className="text-sm opacity-70 mt-1">
                          {completedCount} / {list.items.length} items completed
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleExpanded(list.id)}
                          className="p-1"
                          style={{ color: theme.textOnSecondary }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditList(list.id)}
                          className="p-1"
                          style={{ color: theme.textOnSecondary }}
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        {editingListId === list.id && (
                          <>
                            <button
                              onClick={() => handleSaveListEdit(list.id)}
                              className="p-1"
                              style={{ color: theme.textOnSecondary }}
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingListId(null);
                                setEditListTitle("");
                              }}
                              className="p-1"
                              style={{ color: theme.textOnSecondary }}
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteList(list.id)}
                          className="p-1"
                          style={{ color: theme.textOnSecondary }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div
                      className="px-4 pb-4 space-y-2"
                      style={{
                        backgroundColor: darkMode ? theme.surface : theme.background,
                      }}
                    >
                      {list.items.length === 0 ? (
                        <div className="text-sm opacity-70 py-2" style={{ color: textColor }}>
                          No items yet
                        </div>
                      ) : (
                        list.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <button
                              onClick={() => toggleListItem(list.id, item.id)}
                              style={{ color: textColor }}
                            >
                              {item.completed ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>
                            <span
                              className={`flex-1 ${item.completed ? 'line-through opacity-60' : ''}`}
                              style={{ color: textColor }}
                            >
                              {editingItemId === item.id ? (
                                <input
                                  type="text"
                                  value={editItemText}
                                  onChange={(e) => setEditItemText(e.target.value)}
                                  className="w-full px-4 py-2 rounded-lg border-2"
                                  style={{
                                    backgroundColor: darkMode ? theme.surface : theme.background,
                                    color: darkMode ? theme.surfaceText : theme.text,
                                    borderColor: theme.colors.primary,
                                  }}
                                />
                              ) : (
                                item.text
                              )}
                            </span>
                            <button
                              onClick={() => deleteListItem(list.id, item.id)}
                              style={{ color: textColor }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditItem(list.id, item.id)}
                              style={{ color: textColor }}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            {editingItemId === item.id && (
                              <>
                                <button
                                  onClick={() => handleSaveItemEdit(list.id, item.id)}
                                  style={{ color: textColor }}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingItemId(null);
                                    setEditItemText("");
                                  }}
                                  style={{ color: textColor }}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        ))
                      )}

                      <div className="flex gap-2 mt-3">
                        <input
                          type="text"
                          value={newItem[list.id] || ""}
                          onChange={(e) => setNewItem({ ...newItem, [list.id]: e.target.value })}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addListItem(list.id);
                            }
                          }}
                          placeholder="Add item"
                          className="flex-1 px-3 py-2 rounded border-2"
                          style={{
                            backgroundColor: theme.colors.secondary,
                            color: theme.textOnSecondary,
                            borderColor: theme.colors.primary,
                          }}
                        />
                        <button
                          onClick={() => addListItem(list.id)}
                          className="px-4 py-2 rounded"
                          style={{
                            backgroundColor: theme.colors.primary,
                            color: theme.textOnPrimary,
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}