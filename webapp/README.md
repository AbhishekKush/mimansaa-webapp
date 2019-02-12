# webapp

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

#Naming conventions
Here are a few conventions coming from the Vue.js official styleguide that you need to structure well your project:

Component names should always be multi-word, except for root “App” components. Use “UserCard” or “ProfileCard” instead of “Card” for example.
Each component should be in its own file.
Filenames of single-file components should either be always PascalCase or always kebab-case. Use “UserCard.vue” or “user-card.vue”.
Components that are only used once per page should begin with the prefix “The”, to denote that there can be only one. For example for a navbar or a footer you should use “TheNavbar.vue” or “TheFooter.vue”.
Child components should include their parent name as a prefix. For example if you would like a “Photo” component used in the “UserCard” you will name it “UserCardPhoto”. It’s for better readability since files in a folder are usually order alphabetically.
Always use full name instead of abbreviation in the name of your components. For example don’t use “UDSettings”, use instead “UserDashboardSettings”.
