<template>
    <div class="w-75 h-75 border shadow mx-auto my-auto">
        <p class="mt-3 w-75 text mx-auto font-weight-bold h2 mb-5">
            Edit the note
        </p>
        <p class="mt-3 w-75 text mx-auto text-left font-weight-bold">
            Name:
        </p>
        <b-input
            id="NoteName"
            type="text" 
            placeholder="Enter the name of the note here"
            class="w-75 mx-auto"
            :value="EditingNote.name"
        />
        <p class="mt-3 w-75 text-left mx-auto font-weight-bold">
            Text:
        </p>
        <b-textarea
            id="NoteText"
            placeholder="And text here"
            class="w-75 mx-auto"
            :value="EditingNote.text"
        >
        </b-textarea>
        <p class="mt-3 w-75 text-left mx-auto font-weight-bold">
            Images:
        </p>

        <b-carousel
            class="w-75 mx-auto carousel"
            id="carousel-1"
            :hidden="EditingNote.images.length<1"
            :interval="0"
            no-animation
            :controls="(EditingNote.images.length > 1) ? true : false"
            :indicators="(EditingNote.images.length > 1) ? true : false"
            style="text-shadow: 1px 1px 2px #333;"
        >
            <b-carousel-slide
                class="carousel-slide"
                v-for="image in EditingNote.images.length"
                :key="image"
                :img-src="EditingNote.images[image-1]"
            >
                <b-button
                    class="DeleteImageButton"
                    @click="DeleteImage(image-1)"
                />
            </b-carousel-slide>
        </b-carousel>

       <div class="w-75 mt-3 mx-auto">
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
            v-model="EditingNote.tags"
            separator=" "
            placeholder="Enter new tags separated by space"
            remove-on-delete
            no-add-on-enter
        />
        <b-form-text
            id="tags-remove-on-delete-help"
            class="mt-2"
        />
        
        <b-button
            class="w-75 mx-auto mt-3 mb-5"
            variant="primary"
            @click="VerifyNote"
        >
            Save
        </b-button>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { actionTypes, getterTypes, moduleName } from '../store/modules/notes';

export default {
    name: "NoteCreationForm",
    mounted(){
        this.setFoundNote();
        this.ImagesEventListener();
    },

    data(){
        return{
            EditingNote: {
                id: '',
                name: '',
                text: '',
                tags: [],
                images: [],
                addedImages: []
            }
        }
    },
    
    computed: {
        ...mapGetters(moduleName, [
                getterTypes.GETTER_NOTE_RESPONSE,
                getterTypes.GETTER_EDITING_NOTE,
        ]),
        NoteResponse(){
            return this[getterTypes.GETTER_NOTE_RESPONSE];
        },
        FoundNote(){
            return this[getterTypes.GETTER_EDITING_NOTE];
        }
    },

    methods: {
        ...mapActions(moduleName, [ actionTypes.ACTION_EDIT_NOTE, actionTypes.ACTION_GET_NOTE ]),

        async ImagesToBase64(){
            this.EditingNote.addedImages = [];
            let images = document.querySelector("#NoteImages").files;
            if (images.length){
                for (let i=0; i<images.length; i++){
                    let reader = new FileReader();
                    reader.onload = (e) =>{
                        this.EditingNote.addedImages.push(e.target.result);
                        if (i==images.length-1) this[actionTypes.ACTION_EDIT_NOTE] (this.EditingNote);
                    }
                    reader.readAsDataURL(images[i]);
                }
            }
            else {
                this[actionTypes.ACTION_EDIT_NOTE] (this.EditingNote);
            }
        },

        async VerifyNote(){
            let NoteName = document.querySelector("#NoteName").value;
            let NoteText = document.querySelector("#NoteText").value;
            this.EditingNote.name = NoteName;
            this.EditingNote.text = NoteText;
            this.ImagesToBase64();
        },
        ImagesEventListener(){
            document.querySelector('.custom-file-input').addEventListener('change', function (e) {
                let name ="";
                for (let file of document.getElementById("NoteImages").files){
                    name += file.name + " ";
                }
                let nextSibling = e.target.nextElementSibling;
                nextSibling.innerText = name;
            });
        },

        async setFoundNote(){
            await this[actionTypes.ACTION_GET_NOTE] (this.$route.query.id);
            this.EditingNote = this.FoundNote;
        },
        DeleteImage(id){
            if (confirm('r u sure?')){
                this.EditingNote.images.splice(id,1);
                if (!this.EditingNote.images.length) {
                    document.querySelector('.carousel').style="display:none";
                }
            }
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

.DeleteImageButton{
    height: 2rem;
    width: 2rem;
    background-image: url("../assets/delete.png");
    background-size: contain;
    background-color: red;
}

.carousel, .carousel-slide{
    height: 30rem !important;
}

</style>
