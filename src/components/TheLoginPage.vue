<template>
<div class="w-100 h-100 my-auto">
    <div v-if="!JWT">
        <transition
            :enter-active-class="EnterAnimation"
            :leave-active-class="LeaveAnimation"
        >
            <div
                class = 'login d-flex justify-content-around m-4 mobile'
                v-if = "Animation"
            >
                <div class="p-3 my-auto cursor-default">
                    <p class="h1">Welcome to</p>
                    <p class="h1">MyNotes!</p>
                </div>
                <div class="w-50 border rounded shadow p-4">
                    <p class="mt-2 h4 cursor-default"> {{this.UserInputs.name}} </p>

                    <b-form 
                        class="w-75 mx-auto"
                        @submit="SubmitForm"
                    >
                        <b-form-group
                            v-for="input in this.UserInputs.form"
                            :key="input.placeholder"
                        >
                            <b-form-input
                                v-model="input.data"
                                :placeholder="input.placeholder"
                                :type="input.type"
                                trim
                                required
                                :state="UserInputs.validation(input)"
                            >
                            </b-form-input>
                        </b-form-group>
                        <b-button 
                            class="w-100"
                            variant="outline-primary"
                            type="submit"
                        > {{this.UserInputs.buttonCaption}} </b-button>
                    </b-form>
                    <p class="mt-3 h5 cursor-unset">
                        <a
                            class="badge badge-secondary cursor-pointer p-2"
                            @click="ChangeForm"
                        >
                            {{this.UserInputs.switchMessage}}
                        </a>
                    </p> 
                    <p>
                        <span class="mt-3 mb-5 input_error">
                            {{AuthError}}
                        </span>
                    </p>
                </div>
            </div>
        </transition>
    </div>
    <div
        v-else
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
import { VerifyPasswords } from '../utils/validation/passwords';
import { VerifyEmail } from '../utils/validation/email';
import { VerifyLength } from '../utils/validation/length';
export default {
    data(){
        return{
            RegistrationForm: {
                name: 'Registration',
                form: [
                    {
                        type: "text",
                        placeholder: "Enter your username here",
                        data: '',
                    },
                    {
                        type: "email",
                        placeholder: "And your email here",
                        data: '',
                    },
                    {
                        type: "password",
                        placeholder: "Type in your password",
                        data: '',
                    },
                    {
                        type: "password",
                        placeholder: "Repeat it here",
                        data: '',
                    }
                ],
                buttonCaption: "REGISTER",
                switchMessage: "Have an account? Login",
                validation: this.RegisterValidate,
            },
            LoginForm: {
                name: 'Login',
                form: [
                    {
                        type: "text",
                        placeholder: "Enter your username or email here",
                        data: '',
                    },
                    {
                        type: "password",
                        placeholder: "And the password here",
                        data: '',
                    },
                ],
                buttonCaption: "LOGIN",
                switchMessage: "First time? Register",
                validation: this.LoginValidate,
            },
            UserInputs: {},
            Animation: true,
            EnterAnimation: 'fadeInDown',
            LeaveAnimation: 'fadeOutUp',
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
        },
        LoginData(){
            return {
                username: this.LoginForm.form[0].data,
                password: this.LoginForm.form[1].data,
            }
        },
        RegisterData(){
            return {
                username: this.RegistrationForm.form[0].data,
                email: this.RegistrationForm.form[1].data,
                password: this.RegistrationForm.form[2].data,
            }
        },
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

        ClearForm() {
            for (let input of this.RegistrationForm.form) input.data = '';
            for (let input of this.LoginForm.form) input.data = '';
        },

        RegisterValidate(formInput){
            if (formInput.type == 'email') {
                return VerifyEmail(formInput.data);
            }
            else if (formInput.type == 'password'){
                return VerifyPasswords(this.RegistrationForm.form[2].data, this.RegistrationForm.form[3].data);
            }
            else {
                return VerifyLength(formInput.data);
            }
        },

        LoginValidate(formInput){
            return VerifyLength(formInput.data);
        },

        SubmitForm(){
            if (this.UserInputs.name === this.LoginForm.name) {
                this[actionTypes.ACTION_LOGIN](this.LoginData);
            }
            else this[actionTypes.ACTION_REGISTER](this.RegisterData);
        },

        ChangeForm(){
            if (this.UserInputs.name == this.LoginForm.name){
                this.EnterAnimation = "fadeInUp";
                this.LeaveAnimation = "fadeOutDown";
            } else {
                this.EnterAnimation = "fadeInDown";
                this.LeaveAnimation = "fadeOutUp";
            }
            this.Animation = false;
            setTimeout(() => {
                this.Animation = true; 
                this.UserInputs = this.UserInputs.name == "Login" ? this.RegistrationForm : this.LoginForm;
                this.ClearForm();
            }, 1000);
        },

        LogOut(){
            this[actionTypes.ACTION_LOGOUT]();
            this.ClearForm();
        }
    }
}
</script>

<style lang="scss" scoped>
.h-100{
    height: calc(100vh - 4rem - 60px) !important;
}

@media(max-width:699px){
    .d-flex{
        flex-direction: column;
    }
    .w-50{
        width: 100% !important;
        align-self: center;
    }
}
</style>