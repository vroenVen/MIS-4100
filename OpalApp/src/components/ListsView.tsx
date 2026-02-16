import { useState, useEffect } from 'react';
import { Plus, Check, X, ChevronRight } from 'lucide-react';

interface ListItem {
  id: string;
  text: string;
  completed: boolean;
}

interface List {
  id: string;
  name: string;
  items: ListItem[];
  createdAt: number;
}

export function ListsView() {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [showCreateList, setShowCreateList] = useState(false);
  const [listName, setListName] = useState('');
  const [itemText, setItemText] = useState('');
  const [userName, setUserName] = useState('My');

  useEffect(() => {
    const savedLists = localStorage.getItem('lists');
    if (savedLists) {
      setLists(JSON.parse(savedLists));
    }

    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName + "'s");
    }
  }, []);

  const saveLists = (updatedLists: List[]) => {
    setLists(updatedLists);
    localStorage.setItem('lists', JSON.stringify(updatedLists));
  };

  const handleCreateList = () => {
    if (listName.trim()) {
      const newList: List = {
        id: Date.now().toString(),
        name: listName,
        items: [],
        createdAt: Date.now()
      };
      saveLists([...lists, newList]);
      setListName('');
      setShowCreateList(false);
    }
  };

  const handleDeleteList = (listId: string) => {
    saveLists(lists.filter(list => list.id !== listId));
    if (selectedList?.id === listId) {
      setSelectedList(null);
    }
  };

  const handleAddItem = () => {
    if (selectedList && itemText.trim()) {
      const newItem: ListItem = {
        id: Date.now().toString(),
        text: itemText,
        completed: false
      };
      const updatedLists = lists.map(list =>
        list.id === selectedList.id
          ? { ...list, items: [...list.items, newItem] }
          : list
      );
      saveLists(updatedLists);
      setSelectedList({ ...selectedList, items: [...selectedList.items, newItem] });
      setItemText('');
    }
  };

  const handleToggleItem = (itemId: string) => {
    if (selectedList) {
      const updatedItems = selectedList.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      const updatedLists = lists.map(list =>
        list.id === selectedList.id ? { ...list, items: updatedItems } : list
      );
      saveLists(updatedLists);
      setSelectedList({ ...selectedList, items: updatedItems });
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (selectedList) {
      const updatedItems = selectedList.items.filter(item => item.id !== itemId);
      const updatedLists = lists.map(list =>
        list.id === selectedList.id ? { ...list, items: updatedItems } : list
      );
      saveLists(updatedLists);
      setSelectedList({ ...selectedList, items: updatedItems });
    }
  };

  if (selectedList) {
    const completedCount = selectedList.items.filter(item => item.completed).length;
    
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setSelectedList(null)}
            className="text-blue-600 mb-2 flex items-center gap-1 hover:gap-2 transition-all"
          >
            ← Back to Lists
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedList.name}</h1>
          <p className="text-gray-600">
            {completedCount} of {selectedList.items.length} items completed
          </p>
        </div>

        {/* Progress */}
        {selectedList.items.length > 0 && (
          <div className="mb-6 bg-white rounded-xl p-4 shadow-sm">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${(completedCount / selectedList.items.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Add Item Input */}
        <div className="mb-4 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add item..."
              value={itemText}
              onChange={(e) => setItemText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          {selectedList.items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No items yet. Add your first item!</p>
            </div>
          ) : (
            selectedList.items.map(item => (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-4 shadow-sm ${
                  item.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleItem(item.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      item.completed
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-300 hover:border-green-600'
                    }`}
                  >
                    {item.completed && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-6">
        <div className="text-sm font-semibold text-blue-600 mb-1">OPAL</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{userName} Lists</h1>
        <p className="text-gray-600">Organize your items and groceries</p>
      </div>

      <div className="space-y-3 mb-20">
        {lists.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No lists yet. Create your first list!</p>
          </div>
        ) : (
          lists.map(list => {
            const completedCount = list.items.filter(item => item.completed).length;
            const totalCount = list.items.length;
            
            return (
              <div
                key={list.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedList(list)}
                    className="flex-1 text-left"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{list.name}</h3>
                    <p className="text-sm text-gray-600">
                      {totalCount === 0 ? 'No items' : `${completedCount}/${totalCount} completed`}
                    </p>
                    {totalCount > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-green-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${(completedCount / totalCount) * 100}%` }}
                        />
                      </div>
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedList(list)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create List Button */}
      <button
        onClick={() => setShowCreateList(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create List Modal */}
      {showCreateList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Create New List</h3>
            <input
              type="text"
              placeholder="List name (e.g., Grocery List)"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateList(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}