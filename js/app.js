; (function () {
	const todos = [
		{
			id: 1,
			title: '吃饭',
			completed: false
		},
		{
			id: 2,
			title: '睡觉',
			completed: true
		},
		{
			id: 3,
			title: '写代码',
			completed: false
		},
	]
	Vue.directive('focus', {
		inserted: function(el, binding) {
			el.focus()
		}
	})
	Vue.directive('todo-focus', {
		update: function(el, binding) {
			if (binding.value) {
				el.focus()
			}
		}
	})
	window.app = new Vue({
		el: '#app',
		data: {
			todos: JSON.parse(window.localStorage.getItem('todos') || '[]'),
			currentEditing: null,
			filterText: ''
		},
		computed: {
			remainingCount: {
				get() {
					return this.todos.filter(item => !item.completed).length
				}
			},

			toggleAllStatus: {
				get() {
					return this.todos.every(item => item.completed)
				},
				set() {
					const checked = !this.toggleAllStatus
					this.todos.forEach(item => {
						item.completed = checked
					})
				}
			},

			filterTodos: {
				get() {
					switch (this.filterText) {
						case 'active':
							return this.todos.filter(item => !item.completed)
							break
						case 'completed':
							return this.todos.filter(item => item.completed)
							break
						default:
							return this.todos
					}
				}
			}
		},
		watch: {
			todos: {
				handler(val) {
					window.localStorage.setItem('todos', JSON.stringify(val))
				},
				deep: true
			}
		},
		methods: {
			handleNewTodoKeyDown(e) {
				const target = e.target
				const value = e.target.value.trim()
				const todos = this.todos
				if (!value.length) {
					return
				}
				todos.push({
					id: todos.length ? todos[todos.length - 1].id + 1 : 1,
					title: value,
					completed: false
				})
				target.value = ''
			},

			handleRemoveClick(index, e) {
				this.todos.splice(index, 1)
			},

			handleGetEditingDblclick(item) {
				this.currentEditing = item
			},

			handleSaveEdit(item, index, e) {
				const target = e.target
				const value = target.value.trim()
				if (!value.length) {
					return this.todos.splice(index, 1)
				}
				item.title = value
				this.currentEditing = null
			},

			handleCancelEdit() {
				this.currentEditing = null
			},

			handleClearAllCompleted() {
				for (let i = 0; i < this.todos.length; i++) {
					if (this.todos[i].completed) {
						this.todos.splice(i--, 1)
					}
				}
			}
		}
	})

	//初始化
	handleHashChange()

	window.onhashchange = handleHashChange

	function handleHashChange() {
		app.filterText = window.location.hash.substr(2)
	}
})();
