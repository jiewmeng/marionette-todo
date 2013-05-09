var todoApp = {
	models: {},
	collections: {},
	views: {}
};

/**
 * ### Model: Todo
 * 
 * - description
 * - doneOn
 * - dueOn
 * - order
 * - tags: string[]
 * - notes: { note, date }
 */
todoApp.models.Todo = Backbone.Model.extend({});

todoApp.collections.Todos = Backbone.Collection.extend({
	model: todoApp.models.Todo,
	localStorage: new Backbone.LocalStorage("Todos")
});

$(function() {
	/**
	 * # Views Initialization
	 */
	todoApp.views.TodoView = Backbone.Marionette.ItemView.extend({
		template: "#todoView",
		tagName: "li",
		className: "todo"
	});

	todoApp.views.TodosEmptyView = Backbone.Marionette.ItemView.extend({
		template: "#todosEmptyView"
	});

	todoApp.views.TodosView = Backbone.Marionette.CollectionView.extend({
		itemView: todoApp.views.TodoView,
		tagName: "ul",
		id: "todosList",
		emptyView: todoApp.views.TodosEmptyView
	});

	todoApp.views.AddTodoView = Backbone.Marionette.ItemView.extend({
		template: "#addTodoView",
		tagName: "form",
		triggers: {
			"submit": "addTodo"
		},
		initialize: function() {
			this.on("addTodo", function() {
				this.collection.add(
					new todoApp.models.Todo({ description: this.$field.val() }));
				return false;
			});
		},
		onRender: function() {
			this.$field = this.$("#addTodo");
		}
	});

	/** 
	 * # App initialization & startup
	 */
	var App = new Backbone.Marionette.Application();

	// init regions
	App.addInitializer(function() {
		App.addRegions({
			addRegion: "#addRegion",
			listRegion: "#listRegion"
		});
	});

	// render default views (add & view todo list)
	App.addInitializer(function() {
		var todos = new todoApp.collections.Todos();
		todos.add({ description: "default 1" });
		todos.add({ description: "default 2" });
		todos.add({ description: "default 3" });

		var addTodoView = new todoApp.views.AddTodoView({ collection: todos });
		App.addRegion.show(addTodoView);

		var todosView = new todoApp.views.TodosView({ collection: todos });
		App.listRegion.show(todosView);
	});

	App.start();
});