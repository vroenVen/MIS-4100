import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date?: string;
  subtasks?: SubTask[];
  isRecurring?: boolean;
  recurringDay?: string;
  priority?: number; // AI-generated priority score (1-10)
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface List {
  id: string;
  title: string;
  items: ListItem[];
}

export interface ListItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface RecurringEvent {
  id: string;
  title: string;
  day: string;
  time: string;
}

export interface UserData {
  name: string;
  productivityTime: 'morning' | 'midday' | 'evening' | 'night';
  recurringEvents: RecurringEvent[];
  onboardingComplete: boolean;
  lastCheckInDate?: string;
  todayEnergy?: number;
}

interface AppContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  lists: List[];
  addList: (list: Omit<List, 'id'>) => void;
  updateList: (id: string, updates: Partial<List>) => void;
  deleteList: (id: string) => void;
  calendarView: 'day' | 'week' | 'month';
  setCalendarView: (view: 'day' | 'week' | 'month') => void;
  updateTasks: (tasks: Task[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultUserData: UserData = {
  name: '',
  productivityTime: 'morning',
  recurringEvents: [],
  onboardingComplete: false,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week');

  // Load data from localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem('opal-userdata');
    const savedTasks = localStorage.getItem('opal-tasks');
    const savedLists = localStorage.getItem('opal-lists');
    const savedCalendarView = localStorage.getItem('opal-calendar-view');

    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedLists) {
      setLists(JSON.parse(savedLists));
    }
    if (savedCalendarView) {
      setCalendarView(savedCalendarView as 'day' | 'week' | 'month');
    }
  }, []);

  const updateUserData = (data: Partial<UserData>) => {
    const newUserData = { ...userData, ...data };
    setUserData(newUserData);
    localStorage.setItem('opal-userdata', JSON.stringify(newUserData));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    localStorage.setItem('opal-tasks', JSON.stringify(newTasks));
    return newTasks;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    setTasks(newTasks);
    localStorage.setItem('opal-tasks', JSON.stringify(newTasks));
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    localStorage.setItem('opal-tasks', JSON.stringify(newTasks));
  };

  // const updateTasks = (tasks: string) => {
  //   console.log(tasks);
  //   setTasks(JSON.parse(tasks));
  //   localStorage.setItem('opal-tasks', tasks);
  // };
//   const updateTasks = (tasks: Task[]) => {
//   setTasks(tasks);
//   localStorage.setItem('opal-tasks', JSON.stringify(tasks));
// };

const updateTasks = (newTasks: Task[]) => {
  if (!Array.isArray(newTasks)) return;
  setTasks(newTasks);
};

  const addList = (list: Omit<List, 'id'>) => {
    const newList = { ...list, id: Date.now().toString() };
    const newLists = [...lists, newList];
    setLists(newLists);
    localStorage.setItem('opal-lists', JSON.stringify(newLists));
  };

  const updateList = (id: string, updates: Partial<List>) => {
    const newLists = lists.map(list =>
      list.id === id ? { ...list, ...updates } : list
    );
    setLists(newLists);
    localStorage.setItem('opal-lists', JSON.stringify(newLists));
  };

  const deleteList = (id: string) => {
    const newLists = lists.filter(list => list.id !== id);
    setLists(newLists);
    localStorage.setItem('opal-lists', JSON.stringify(newLists));
  };

  const handleSetCalendarView = (view: 'day' | 'week' | 'month') => {
    setCalendarView(view);
    localStorage.setItem('opal-calendar-view', view);
  };

  return (
    <AppContext.Provider
      value={{
        userData,
        updateUserData,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        updateTasks,
        lists,
        addList,
        updateList,
        deleteList,
        calendarView,
        setCalendarView: handleSetCalendarView,
        
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}