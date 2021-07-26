<template>
<div class="w-100 h-100 my-auto">
    <div
        v-if="!JWT"
        id="WholeForm"
        ref="WholeForm"
        class="login d-flex justify-content-around m-4 mobile"
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
                    :ref="input.id"
                    :type="input.type"
                    :placeholder="input.placeholder"
                    @keyup="CheckEnter"
                />
                <span
                    :id="'error'+input.id"
                    :ref="'error'+input.id"
                    class="input-error"
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
                <span class="mt-3 mb-5 input-error">
                    {{AuthError}}
                </span>
            </p>
        </div>
    </div>
    <div
        v-else
        id="WholeForm"
        class="login d-flex justify-content-around p-5 m-4 mobile border rounded shadow"
    >
        Hi, {{USER}}!
        <b-button @click="LogOut"> logout </b-button>
    </div>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { actionTypes, getterTypes, moduleName } from '../store/modules/auth';
import "../utils/validation/email";
import { VerifyEmail } from '../utils/validation/email';
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

    created(){
        this.UserInputs = this.LoginForm;
        this[actionTypes.ACTION_CHECK_COOKIE]();
        this[actionTypes.ACTION_CLEAR_RESPONSES]();
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
            let Form = this.$refs.WholeForm;
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
            let error = this.$refs['error' + emailField.id][0];
            return VerifyEmail(email, error)
        },
        
        CheckUsername(userField){
            let username = userField.value.trim();
            let error = this.$refs['error' + userField.id][0];
            if (!username){
                error.innerHTML = "this field cannot be empty!";
                return false;
            }
            else {
                error.innerHTML = "";
                return username;
            }
        },
        CheckPassword (passwordField){
            let password = passwordField.value.trim();
            let error = this.$refs['error' + passwordField.id][0];
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
            let error = this.$refs['error' + passwordRepeatField.id][0];
            if (!(password === passwordRepeat)){
                error.innerHTML += "Passwords have to be identical!";
                return true;
            }
            else{
                error.innerHTML = "";
                return password;
            }
        },

        RegisterVerify(){
            let usernameField = this.$refs.RegisterUsername[0].$el;
            let emailField = this.$refs.RegisterEmail[0].$el;
            let passwordField =  this.$refs.RegisterPassword[0].$el;
            let passwordRepeatField = this.$refs.RegisterPasswordRepeat[0].$el;
            
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
            let userField = this.$refs.LoginUsername[0].$el;
            let passwordField = this.$refs.LoginPassword[0].$el;
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
}
.h-100{
    height: calc(100vh - 4rem - 60px) !important;
}
</style>