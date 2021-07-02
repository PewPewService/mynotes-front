<template>
<div class="w-100 h-100 my-auto">
    <div
        class="login d-flex justify-content-around m-4 mobile animated fadeInDown"
        id="WholeForm"
    >
        <div class="p-3 my-auto cursor-default">
            <p class="h1">Welcome to</p>
            <p class="h1">MyNotes!</p>
        </div>
        <div class="w-50 border rounded shadow p-4">
            <p class="mt-2 h4 cursor-default"> {{this.UserInputs.name}} </p>
            <b-input
                v-for="input in this.UserInputs.form"
                :key="input.placeholder"
                :type="input.type"
                :placeholder="input.placeholder"
                class="w-75 mx-auto mt-2"
            />
            <b-button
                variant="outline-primary"
                class="mt-2 w-75"
                @click="this.UserInputs.buttonFunction"
            >
                {{this.UserInputs.buttonCaption}}
            </b-button>
           <!-- <b-button
                class="mt-3 h5"
                @click="ChangeForm"
            >
                {{this.UserInputs.switchMessage}}
            </b-button>-->
             
             <p class="mt-3 h5 cursor-unset">
                    <a
                        class="badge badge-secondary cursor-pointer p-2"
                        @click="ChangeForm"
                    >
                        {{this.UserInputs.switchMessage}}
                    </a>
            </p> 
        </div>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return{
            RegistrationForm: {
                name: "Registration",
                form: [
                    {
                        type: "text",
                        placeholder: "Enter your username here"
                    },
                    {
                        type: "text",
                        placeholder: "And your email here"
                    },
                    {
                        type: "password",
                        placeholder: "Type in your password"
                    },
                    {
                        type: "password",
                        placeholder: "Repeat it here"
                    }
                ],
                buttonCaption: "REGISTER",
                buttonFunction: this.RegisterVerify,
                switchMessage: "Already have an account? Login"
            },
            LoginForm: {
                name: "Login",
                form: [
                    {
                        type: "text",
                        placeholder: "Enter your username here"
                    },
                    {
                        type: "password",
                        placeholder: "And the password here"
                    },
                ],
                buttonCaption: "LOGIN",
                buttonFunction: this.LoginVerify,
                switchMessage: "First time? Register"
            },
            UserInputs: {},
        }
    },

    created(){
        this.UserInputs = this.LoginForm;
    },

    methods:{
        ChangeForm(){
            let Form = document.getElementById("WholeForm");
            Form.classList.remove("animated", "fadeInDown");
            Form.classList.add("animated", "fadeOutDown");
            setTimeout(() => {
                this.UserInputs = this.UserInputs.name == "Login" ? this.RegistrationForm : this.LoginForm;
                Form.classList.remove("animated", "fadeOutDown");
                Form.classList.add("animated", "fadeInDown");
            }, 500);          
        },

        RegisterVerify(){
            console.log('register');
        },

        LoginVerify(){
            console.log('login');
        }
    }
}
</script>

<style scoped>
@media(max-width:699px){
    .d-flex{
        flex-direction: column;
    }
    .w-50{
        width: 85% !important;
        align-self: center;
    }
}
.h-100{
    height: calc(100vh - 4rem - 60px) !important;
}
</style>