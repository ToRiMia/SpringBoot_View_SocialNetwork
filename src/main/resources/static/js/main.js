function getIndex(list, id) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

let messageAPI = Vue.resource('/message{/id}');

Vue.component('message-form', {
    props: ['messages', 'messageAttr'],
    data: function () {
        return {
            text: '',
            id: ''
        }
    },
    watch: {
        messageAttr: function (newVal, oldVal) {
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template: '<div>' +
        '<input type="text" placeholder="Write your text"' +
        ' v-model="text"/>' +
        '<input type="button" value="Save" @click="save"/>' +
        '</div>',
    methods: {
        save: async function () {
            let message = {id: this.id, text: this.text};

            if (this.id) {
                let response = await fetch('http://localhost:8080/message/' + this.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(message)
                });
                if (response.ok) {
                    let data = await response.json();
                    let index = getIndex(this.messages, data.id);
                    this.messages.splice(index, 1, data);
                    this.text = "";
                    this.id = "";
                } else {
                    alert("Ошибка HTTP: " + response.status);
                }
            } else {
                let response = await fetch('http://localhost:8080/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(message)
                });
                if (response.ok) {
                    let data = await response.json();
                    await this.messages.push(data);
                    this.text = "";
                } else {
                    alert("Ошибка HTTP: " + response.status);
                }
            }
        }
    }
});

Vue.component('message-row', {
    props: ['message', 'editMethod', 'messages'],
    template: '<div>' +
        '<i>{{message.id}}</i> {{message.text}}' +
        '<span style="position: absolute; right: 0">' +
        '<input type="button" value="Edit" @click="edit" />' +
        '<input type="button" value="X" @click="remove"/>' +
        '</span>' +
        '</div>',
    methods: {
        edit: function () {
            this.editMethod(this.message);
        },
        remove: async function () {
            let response = await fetch('http://localhost:8080/message/' + this.message.id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                let index = getIndex(this.messages, this.message.id);
                this.messages.splice(index, 1);
                this.text = "";
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
        }
    }
});

Vue.component('messages-list', {
    props: ['messages'],
    data: function () {
        return {
            message: null
        }
    },
    template: '<div style="position: relative; width: 300px;">' +
        '<message-form :messages="messages" :messageAttr="message"/>' +
        '<message-row  v-for="message in messages" ' +
        ':key="message.id" :message="message" :messages="messages" :editMethod="editMethod" />' +
        '</div>',
    created: function () {
        messageAPI.get().then(result =>
            result.json().then(data =>
                data.forEach(message =>
                    this.messages.push(message))));
    },
    methods: {
        editMethod: function (message) {
            this.message = message;
        }
    }
});

let app = new Vue({
    el: '#app',
    template: '<messages-list :messages="messages"/>',
    data: {
        messages: []
    }
});