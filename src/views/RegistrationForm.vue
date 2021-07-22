<template>
<div class="w-100 h-100 my-auto">
    <div
        class="login d-flex justify-content-around m-4 mobile"
        id="WholeForm"
        v-if="!JWT"
    >
        <div class="p-3 my-auto cursor-default">
            <p class="h1">Welcome to</p>
            <p class="h1">MyNotes!</p>
        </div>
        <div class="w-50 border rounded shadow p-4">
            <p class="mt-2 h4 cursor-default"> {{this.UserInputs.name}} </p>

            <div
                v-for="input in this.UserInputs.form"
                :key="input.id"
                class="w-75 mx-auto mt-2"
            >
                <b-input
                    :id="input.id"
                    :type="input.type"
                    :placeholder="input.placeholder"
                    @keyup="CheckEnter"
                />
                <span
                    :id="'error'+input.id"
                    class="InputError"
                > </span>
            </div>

            <b-button
                variant="outline-primary"
                class="mt-2 w-75"
                @click="this.UserInputs.buttonFunction"
            >
                {{this.UserInputs.buttonCaption}}
            </b-button>
             
             <p class="mt-3 h5 cursor-unset">
                    <a
                        class="badge badge-secondary cursor-pointer p-2"
                        @click="ChangeForm"
                    >
                        {{this.UserInputs.switchMessage}}
                    </a>
            </p> 
            <p>
            <span class="mt-3 mb-5 InputError">
                {{AuthError}}
            </span>
        </p>
        </div>
    </div>
    <div
        class="login d-flex justify-content-around m-4 mobile"
        id="WholeForm"
        v-else
    >
        Hi, {{USER}}!
        <input type="button" @click="LogOut" value="logout">
    </div>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { actionTypes, getterTypes, moduleName } from '../store/modules/auth';
export default {
    data(){
        return{
            RegistrationForm: {
                name: "Registration",
                form: [
                    {
                        id:"RegisterUsername",
                        type: "text",
                        placeholder: "Enter your username here",
                    },
                    {
                        id:"RegisterEmail",
                        type: "text",
                        placeholder: "And your email here",
                    },
                    {
                        id:"RegisterPassword",
                        type: "password",
                        placeholder: "Type in your password",
                    },
                    {
                        id:"RegisterPasswordRepeat",
                        type: "password",
                        placeholder: "Repeat it here",
                    }
                ],
                buttonCaption: "REGISTER",
                buttonFunction: this.RegisterVerify,
                switchMessage: "Have an account? Login"
            },
            LoginForm: {
                name: "Login",
                form: [
                    {
                        id: "LoginUsername",
                        type: "text",
                        placeholder: "Enter your username here",
                    },
                    {
                        id: "LoginPassword",
                        type: "password",
                        placeholder: "And the password here",
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
        this[actionTypes.ACTION_CHECK_COOKIE]();
        this[actionTypes.ACTION_CLEAR_RESPONSES]();
    },

    computed: {
        ...mapGetters(moduleName, [
            getterTypes.GETTER_AUTH_ERROR,
            getterTypes.GETTER_JWT,
            getterTypes.GETTER_USER,
        ]),
        AuthError(){
            return this[getterTypes.GETTER_AUTH_ERROR];
        },
        JWT(){
            return this[getterTypes.GETTER_JWT];
        },
        USER(){
            return this[getterTypes.GETTER_USER];
        }
    },

    methods:{
        ...mapActions(moduleName, [
            actionTypes.ACTION_REGISTER,
            actionTypes.ACTION_LOGIN,
            actionTypes.ACTION_LOGOUT,
            actionTypes.ACTION_CHECK_COOKIE,
            actionTypes.ACTION_CLEAR_RESPONSES,
        ]),

        CheckEnter(e){
            if (e.keyCode == 13){
                if (this.UserInputs == this.LoginForm) this.LoginVerify()
                else this.RegisterVerify();
            }
        },

        ChangeForm(){
            let fadeIn = "";
            let fadeOut = "";
            if (this.UserInputs.name == "Login"){
                fadeIn = "fadeInDown";
                fadeOut = "fadeOutDown";
            } else {
                fadeIn = "fadeInUp";
                fadeOut = "fadeOutUp";
            }
            let Form = document.getElementById("WholeForm"); 
            Form.classList.remove("animated", "fadeInDown", "fadeInUp");
            Form.classList.add("animated", fadeOut);
            setTimeout(() => {
                this[actionTypes.ACTION_CLEAR_RESPONSES]();
                this.UserInputs = this.UserInputs.name == "Login" ? this.RegistrationForm : this.LoginForm;
                Form.classList.remove("animated", "fadeOutDown", "fadeOutUp");
                Form.classList.add("animated", fadeIn);
            }, 500);          
        },

        CheckEmail(emailField){
            let email = emailField.value.trim();
            let error = document.querySelector('#error'+emailField.id);
            if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                error.innerHTML = "invalid email!";
                return false;
            }
            else {
                error.innerHTML = "";
                return email;
            }
        },
        CheckUsername(userField){
            let username = userField.value.trim();
            let error = document.querySelector("#error"+userField.id);
            if (!username){
                error.innerHTML = "this field cannot be empty!";
                return false;
            }
            /*else if (username.length > 15){
                error.innerHTML = "username should be 15 characters or less!";
                return false;
            }*/
            else {
                error.innerHTML = "";
                return username;
            }
        },
        CheckPassword (passwordField){
            let password = passwordField.value.trim();
            let error = document.querySelector("#error"+passwordField.id);
            if (!password){
                error.innerHTML = "this field cannot be empty!"
                return false;
            }
            else {
                error.innerHTML = "";
                return password;
            }
        },

        CheckPasswords(passwordField, passwordRepeatField){
            let password = this.CheckPassword(passwordField);
            let passwordRepeat = this.CheckPassword(passwordRepeatField);
            let error = document.querySelector("#error"+passwordRepeatField.id);
            if (!(password === passwordRepeat)){
                error.innerHTML+=" passwords have to be identical!";
                return true;
            }
            else{
                error.innerHTML = "";
                return password;
            }
        },

        RegisterVerify(){
            let usernameField = document.querySelector("#RegisterUsername");
            let emailField = document.querySelector("#RegisterEmail");
            let passwordField = document.querySelector("#RegisterPassword");
            let passwordRepeatField = document.querySelector("#RegisterPasswordRepeat");
            
            let username = this.CheckUsername(usernameField);
            let email = this.CheckEmail(emailField);
            let password = this.CheckPasswords(passwordField, passwordRepeatField);
            if (!(username && email && password)) return;
            let user = {
                username: username,
                email: emailField.value.trim(),
                password: password
            }
            this[actionTypes.ACTION_REGISTER] (user);
        },

        LoginVerify(){
            let userField = document.querySelector("#LoginUsername");
            let passwordField = document.querySelector("#LoginPassword");
            let username = this.CheckUsername(userField);
            let password = this.CheckPassword(passwordField);
            if (!(username && password)) return;

            let userData = {username: username, password: password};
            this[actionTypes.ACTION_LOGIN] (userData);
        },

        LogOut(){
            this[actionTypes.ACTION_LOGOUT]();
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
        width: 100% !important;
        align-self: center;
    }
    .w-75{
        width: 100% !important;
    }
}
.h-100{
    height: calc(100vh - 4rem - 60px) !important;
}
</style>