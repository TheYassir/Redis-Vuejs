<script setup>
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
    <body>
        <div class="wrapper">
            <form @submit.prevent="publishMessage">
                <input
                    type="text"
                    name="message"
                    v-model="message"
                    placeholder="Envoyer un message"
                />
                <input type="submit" value="Envoyer" />
            </form>
        </div>
    </body>
</template>
<script>
export default {
    data() {
        return {
            message: '',
        };
    },
    methods: {
        subscribe() {
            // *  Envoyer une requête vers le port 5000 et la bonne route pour souscrire au Server Sent Events
            const event = new EventSource(
                'http://localhost:5000/api/subscribe'
            );

            // Quand tu reçois un message, tu consolelog
            event.onmessage = message => {
                console.log(message.data);
                this.message = JSON.stringify(message.data);
            };
        },

        // *  Publier un message
        async publishMessage() {
            const res = await fetch('http://localhost:5000/api/publish', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ message: this.message }),
            });

            console.log(res);
        },
    },

    mounted() {
        this.subscribe();
    },
};
</script>
