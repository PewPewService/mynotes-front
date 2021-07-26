<template>
    <div class="p-4">
        <div class="w-75 h-75 border shadow mx-auto my-auto p-4">
            <p class="mt-3 w-75 text mx-auto font-weight-bold h2 mb-5">
                {{ FoundNote.id ? 'Edit the note' : 'Add a note' }}
            </p>
            <p class="mt-3 w-75 text mx-auto text-left font-weight-bold">
                Name of the note:
            </p>
            <b-input
                id="NoteName"
                ref="NoteName"
                placeholder="Enter the name of the note here"
                type="text"
                class="w-75 mx-auto"
                :value="FoundNote.name"
            />
            <span
                id="errorName"
                ref="errorName"
                class="InputError"
            > </span>
            <p class="mt-3 w-75 text-left mx-auto font-weight-bold">
                Text:
            </p>
            <b-textarea 
                id="NoteText"
                ref="NoteText"
                placeholder="And text here"
                class="w-75 mx-auto"
                :value="FoundNote.text"
            >
            </b-textarea>
            <p class="mt-3 w-75 text-left mx-auto font-weight-bold">
                Images:
            </p>


            <b-carousel
                id="carousel-1"
                class="w-75 mx-auto carousel mb-3"
                ref="carousel"
                :hidden="FoundNote.images.length<1 || !FoundNote.id"
                :interval="0"
                no-animation
                :controls="(FoundNote.images.length > 1) ? true : false"
                :indicators="(FoundNote.images.length > 1) ? true : false"
                style="text-shadow: 1px 1px 2px #333;"
            >
                <b-carousel-slide
                    v-for="image in FoundNote.images.length"
                    :key="image"
                    :img-src="FoundNote.images[image-1]"
                    class="carousel-slide"
                >
                    <b-button
                        class="delete-image-button"
                        @click="DeleteImage(image-1)"
                    />
                </b-carousel-slide>
            </b-carousel> 


        <div class="w-75 mx-auto">
            <div class="input-group">
                <div class="custom-file">
                    <input 
                            id="NoteImages"
                            type="file"
                            multiple
                            class="custom-file-input cursor-pointer"
                            ref="NoteImages"
                            aria-describedby="NoteImages"
                            @change="ImageOnload"
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
                v-model="FoundNote.tags"
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
                ref="errorContent"
                class="input-error"
            > </span>
            <b-button
                class="w-75 mx-auto mt-3 mb-5"
                variant="primary"
                @click="VerifyNote"
            >
                {{ FoundNote.id ? 'Edit' : 'Add' }}
            </b-button>
            <p>
                <span class="mt-3 mb-5 input-error">
                    {{NoteResponseError.data}}
                </span>
                <span class="mt-3 mb-5 input-success">
                    {{NoteResponseSuccess.data}}
                </span>
            </p>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { actionTypes, getterTypes, moduleName } from '../store/modules/notes';

export default {
    name: "NoteCreationForm",
    
    async mounted(){
        await this.setFoundNote();
    },

    data(){
        return{
            Note: {
                id: '',
                name: '',
                text: '',
                tags: [],
                images: [],
                pinned: false, 
            },
            /*FoundNote: {
                id: '',
                name: '',
                text: '',
                tags: [],
                images: [],
                pinned: false, 
            },*/
        }
    },
    
    computed: {
        ...mapGetters(moduleName, [
            getterTypes.GETTER_NOTE_RESPONSE_ERROR,
            getterTypes.GETTER_NOTE_RESPONSE_SUCCESS,
            getterTypes.GETTER_EDITING_NOTE,
        ]),
        NoteResponseError(){
            return this[getterTypes.GETTER_NOTE_RESPONSE_ERROR];
        },
        NoteResponseSuccess(){
            return this[getterTypes.GETTER_NOTE_RESPONSE_SUCCESS];
        },
        FoundNote(){
            return this[getterTypes.GETTER_EDITING_NOTE]
        },
    },

    methods: {
        ...mapActions(moduleName, [
            actionTypes.ACTION_ADD_NOTE,
            actionTypes.ACTION_GET_NOTE,
            actionTypes.ACTION_EDIT_NOTE
        ]),

        async setFoundNote(){
            let id = this.$route.query.id;
            await this[actionTypes.ACTION_GET_NOTE] (id ? id : 0);
        },

        ImageOnload(e){
            let name ="";
            for (let file of this.$refs.NoteImages.files){
                name += file.name + " ";
            }
            let nextSibling = e.target.nextElementSibling;
            nextSibling.innerText = name;
        },
        
        async ConfirmAction(message){
            return await this.$bvModal.msgBoxConfirm(message)
            .then(value => {
                return value;
            })
        },

        async DeleteImage(id){
            if ( await this.ConfirmAction('Are you sure you want to delete this image?') ){
                this.FoundNote.images.splice(id,1);
                if (!this.FoundNote.images.length) {
                    this.$refs.carousel.$el.style="display:none";
                }
            }
        },

        async AddOrEditNote(){
            if (this.FoundNote.id){
                this.Note.id = this.FoundNote.id;
                await this[actionTypes.ACTION_EDIT_NOTE] (this.Note);
            }
            else await this[actionTypes.ACTION_ADD_NOTE] (this.Note);
            if (this[getterTypes.GETTER_NOTE_RESPONSE_SUCCESS]) {
                this.$router.push({name: 'Home'});
            }
        },

        async ImagesToBase64(images){
            this.Note.images = this.FoundNote.id ? this.FoundNote.images : [];
            if (images.length) {
                for (let i=0; i<images.length; i++){
                    let reader = new FileReader();
                    reader.onload = (e) =>{
                        this.Note.images.push(e.target.result);
                        if (i==images.length-1) this.AddOrEditNote();
                    }
                    reader.readAsDataURL(images[i]);
                }
            }
            else {
                this.AddOrEditNote ();
            }
            
        },

        CheckName(nameField){
            let name = nameField.value.trim();
            let error = this.$refs.errorName;
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
            let error = this.$refs.errorContent;
            let result = true;
            if (text || imagesField.length) error.innerHTML = ""; 
            else {
                error.innerHTML = "the note's content must not be empty! write text or add images!";
                result = false;
            }
            return result;
        },

        VerifyNote(){
            let NoteNameField = this.$refs.NoteName.$el;
            let NoteTextField = this.$refs.NoteText.$el;
            let NoteImages = this.$refs.NoteImages.files;
            let NoteName = this.CheckName(NoteNameField);
            console.log(this.FoundNote);
            if (!(NoteName && this.CheckContent(NoteTextField, NoteImages))) return;
            this.Note.name = NoteName;
            this.Note.text = NoteTextField.value.trim();
            this.Note.tags = this.FoundNote.tags;
            console.log(this.FoundNote);
            this.ImagesToBase64(NoteImages);
        }
    }
}
</script>

<style lang="scss" scoped>
.delete-image-button{
    @include basic-button();
    background-image: url("../assets/delete.png");
    background-color: $global-error;
}

.custom-file-input.selected:lang(en)::after{
  content: "" !important;
}

.custom-file{
  overflow: hidden;
}

.custom-file-input{
  white-space: nowrap;
}
.custom-file-label{
    padding-right: 6rem;
}

.carousel, .carousel-slide{
    height: 30rem !important;
}
</style>