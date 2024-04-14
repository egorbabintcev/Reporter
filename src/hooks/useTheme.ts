import { ref, watch } from 'vue';

type Theme = 'light' | 'dark';

function getDefaultTheme(): Theme {
  const savedTheme = localStorage.getItem('Reporter_Theme');

  return savedTheme
    ? String(savedTheme) as Theme
    : 'light';
}

const theme = ref<Theme>(getDefaultTheme());
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

mediaQuery.addEventListener('change', () => {
  theme.value = mediaQuery.matches ? 'dark' : 'light';
});

watch(theme, () => {
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  localStorage.setItem('Reporter_Theme', theme.value);
}, { immediate: true });

export default function useTheme() {
  function setTheme(value: typeof theme.value) {
    theme.value = value;
  }

  return {
    theme,

    setTheme,
  };
}
