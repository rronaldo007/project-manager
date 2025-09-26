const NAVIGATION_KEY = 'app_navigation_state';

export const saveNavigationState = (state) => {
  try {
    localStorage.setItem(NAVIGATION_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Could not save navigation state:', error);
  }
};

export const loadNavigationState = () => {
  try {
    const saved = localStorage.getItem(NAVIGATION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Could not load navigation state:', error);
    return null;
  }
};

export const clearNavigationState = () => {
  try {
    localStorage.removeItem(NAVIGATION_KEY);
  } catch (error) {
    console.warn('Could not clear navigation state:', error);
  }
};
