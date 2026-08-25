import module from 'module';
const require = module.createRequire(import.meta.url);

module.exports = {
  plugins: [require('tailwindcss'), require('autoprefixer')],
};
