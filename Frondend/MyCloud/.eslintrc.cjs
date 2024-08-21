module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',  // Применимо для React 17+
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off', // Отключаем правило для React 17+
    'no-unused-vars': 'warn', // Убираем ошибки о неиспользуемых переменных, можно настроить на 'error' по необходимости
    'react/prop-types': 'warn', // Включаем предупреждения о пропсах, если используете PropTypes
    'no-undef': 'error' // Ошибка о неопределенных переменных
  },
};
