<template>
    <div class="w-75 h-75 border shadow mx-auto my-auto">
        <p class="mt-3 w-75 text mx-auto font-weight-bold h2 mb-5">
            Add a note
        </p>
        <p class="mt-3 w-75 text mx-auto text-left font-weight-bold">
            Name of the note:
        </p>
        <b-input
            id="NoteName"
            placeholder="Enter the name of the note here"
            type="text"
            class="w-75 mx-auto"
        />
        <span
            id="errorName"
            class="InputError"
        > </span>
        <p class="mt-3 w-75 text-left mx-auto font-weight-bold">
            Text:
        </p>
        <b-textarea 
            id="NoteText"
            placeholder="And text here"
            class="w-75 mx-auto"
        >
        </b-textarea>
        <p class="mt-3 w-75 text-left mx-auto font-weight-bold">
            Images:
        </p>

       <div class="w-75 mx-auto">
           <div class="input-group">
               <div class="custom-file">
                   <input 
                        id="NoteImages"
                        type="file"
                        multiple
                        class="custom-file-input cursor-pointer"
                        aria-describedby="NoteImages"
                    >
                    <label
                        class="custom-file-label mx-auto"
                        for="NoteImages"
                    >Select images</label>
                </div>
            </div>
        </div>

        <p class="mt-3 w-75 text-left mx-auto font-weight-bold">
            Tags:
        </p>
        <b-form-tags
            class="w-75 mx-auto"
            :input-attrs="{ 'aria-describedby': 'tags-remove-on-delete-help' }"
            v-model="AddingNote.tags"
            separator=" "
            placeholder="Enter new tags separated by space"
            remove-on-delete
            no-add-on-enter
        />
        <b-form-text
            id="tags-remove-on-delete-help"
            class="mt-2"
        />

        <span
            id="errorContent"
            class="InputError"
        > </span>
        <b-button
            class="w-75 mx-auto mt-3 mb-5"
            variant="primary"
            @click="VerifyNote"
        >
            Add
        </b-button>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { actionTypes, getterTypes, moduleName } from '../store/modules/notes';

export default {
    name: "NoteCreationForm",
    mounted(){
        document.querySelector('.custom-file-input').addEventListener('change', function (e) {
            let name ="";
            for (let file of document.getElementById("NoteImages").files){
                name += file.name + " ";
            }
            let nextSibling = e.target.nextElementSibling; 
            nextSibling.innerText = name;
        });
    },

    data(){
        return{
            AddingNote: {
                id: '',
                name: '',
                text: '',
                tags: [],
                images: []
            }
        }
    },
    
    computed: {
        ...mapGetters(moduleName, [ getterTypes.GETTER_NOTE_RESPONSE ]),
        NoteResponse(){
            return this[getterTypes.GETTER_NOTE_RESPONSE];
        }
    },

    methods: {
        ...mapActions(moduleName, [ actionTypes.ACTION_ADD_NOTE ]),

        async ImagesToBase64(images){
            this.AddingNote.images = [];
            if (images.length) {
                for (let i=0; i<images.length; i++){
                    let reader = new FileReader();
                    reader.onload = (e) =>{
                        this.AddingNote.images.push(e.target.result);
                        if (i==images.length-1) this[actionTypes.ACTION_ADD_NOTE] (this.AddingNote);
                    }
                    reader.readAsDataURL(images[i]);
                }
            }
            else {
                this[actionTypes.ACTION_ADD_NOTE] (this.AddingNote);
            }
            
        },

        CheckName(nameField){
            let name = nameField.value.trim();
            let error = document.querySelector('#errorName');
            if (!name) {
                error.innerHTML = "the name of the note must not be empty!";
                return false;
            }
            else {
                error.innerHTML = "";
                return name;
            }
        },

        CheckContent(textField, imagesField){
            let text = textField.value.trim();
            let error = document.querySelector("#errorContent");
            let result = true;
            if (text || imagesField.length) error.innerHTML = ""; 
            else {
                error.innerHTML = "the note's content must not be empty! write text or add images!";
                result = false;
            }
            return result;
        },

        async VerifyNote(){
            let NoteNameField = document.querySelector("#NoteName");
            let NoteTextField = document.querySelector("#NoteText");
            let NoteImages = document.querySelector("#NoteImages").files;
            let NoteName = this.CheckName(NoteNameField);
            if (!(NoteName && this.CheckContent(NoteTextField, NoteImages))) return;
            this.AddingNote.name = NoteName;
            this.AddingNote.text = NoteTextField.value.trim();
            this.ImagesToBase64(NoteImages);
        }
    }
}
</script>

<style scoped>
@media(max-width:699px){
    .w-75{
        width: 90% !important;
    }
}

.custom-file-input.selected:lang(en)::after {
  content: "" !important;
}

.custom-file {
  overflow: hidden;
}

.custom-file-input {
  white-space: nowrap;
}
.custom-file-label{
    padding-right: 6rem;
}
</style>