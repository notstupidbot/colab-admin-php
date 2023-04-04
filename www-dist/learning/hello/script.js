class HelloWorld extends React.Component {
  render() {
    return React.createElement("h1", { ...this.props }, React.createElement("i", { className: "bi bi-code" }), " ", `Hello ${this.props.frameworkname} world!!!`);
  }
}
class HelloWorld2 extends React.Component {
  render() {
    return React.createElement("div", { className: "dark:text-slate-400 p-4" }, React.createElement(HelloWorld, { id: "ember", frameworkname: "Ember.js", title: "A framework for creating ambitius web applications" }), React.createElement(HelloWorld, { id: "backbone", frameworkname: "Backbone.js", title: "Backbone.js gives structure to web applications..." }), React.createElement(HelloWorld, { id: "angular", frameworkname: "Angular.js", title: "Superheroic Java Script MVW Framework" }));
  }
}
const contentEl = document.getElementById("content");
ReactDOM.render(
  React.createElement(HelloWorld2, null),
  contentEl
);
