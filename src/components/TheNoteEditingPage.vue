<template>
    <div class="p-4">
        <div class="w-75 h-75 border shadow mx-auto my-auto p-4">
            <p class="mt-3 w-75 text mx-auto font-weight-bold h2 mb-5">
                {{ FoundNote.id ? 'Edit the note' : 'Add a note' }}
            </p>
            <b-form @submit="CreateForm">
                <b-form-group
                    label="Name of the note:"
                    label-for="NoteName"
                    class="mt-3 w-75 text mx-auto text-left font-weight-bold"
                >
                    <b-form-input
                        id="NoteName"
                        v-model="FoundNote.name"
                        placeholder="Enter the name of the note here"
                        type="text"
                        class="w-100 mx-auto"
                        required
                        trim
                    />
                </b-form-group>
                <b-form-group
                    label="Text:"
                    label-for="NoteText"
                    class="mt-3 w-75 text mx-auto text-left font-weight-bold"
                >
                    <b-form-textarea 
                        id="NoteText"
                        v-model="FoundNote.text"
                        placeholder="And text here"
                        class="w-100 mx-auto"
                        trim
                    />
                </b-form-group>
                <b-form-group
                    label="Images:"
                    label-for="NoteImages"
                    class="mt-3 w-75 text mx-auto text-left font-weight-bold"
                >
                    <b-carousel
                        id="carousel-1"
                        class="w-100 mx-auto carousel mb-3"
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
                            :img-src="connectionString(FoundNote.images[image-1])"
                            class="carousel-slide"
                        >
                            <b-button
                                class="delete-image-button"
                                @click="DeleteImage(image-1)"
                            />
                        </b-carousel-slide>
                    </b-carousel> 


                    <div class="w-100 mx-auto">
                        <div class="input-group">
                            <div class="custom-file">
                                <input 
                                    id="NoteImages"
                                    type="file"
                                    multiple
                                    class="custom-file-input cursor-pointer"
                                    ref="NoteImages"
                                    aria-describedby="NoteImages"
                                    accept='image/jpg, image/jpeg, image/png'
                                    @change="ImageOnload"
                                >
                                <label
                                    class="custom-file-label mx-auto"
                                    for="NoteImages"
                                >Select images</label>
                            </div>
                        </div>
                    </div>
                </b-form-group>
                <b-form-group
                    label="Tags:"
                    label-for="NoteTags"
                    class="mt-3 w-75 text mx-auto text-left font-weight-bold"
                >
                    <b-form-tags
                        id="NoteTags"
                        v-model="FoundNote.tags"
                        class="w-100 mx-auto"
                        :input-attrs="{ 'aria-describedby': 'tags-remove-on-delete-help' }"
                        separator=" "
                        placeholder="Enter new tags separated by space"
                        remove-on-delete
                        no-add-on-enter
                    />
                    <b-form-text
                        id="tags-remove-on-delete-help"
                        class="mt-2"
                    />
                </b-form-group>

                <b-button
                    class="w-75 mx-auto mt-3 mb-5"
                    variant="primary"
                    type="submit"
                >
                    {{ FoundNote.id ? 'Edit' : 'Add' }}
                </b-button>    
            </b-form>


            
            <p>
                <span class="mt-3 mb-5 input_error">
                    {{NoteResponseError.data}}
                </span>
                <span class="mt-3 mb-5 input_success">
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
    name: "TheNoteEditingPage",

    data(){
        return{
            images: [],
            deletedImages: [],
        }
    },
    
    computed: {
        ...mapGetters(moduleName, [
            getterTypes.GETTER_NOTE_RESPONSE_ERROR,
            getterTypes.GETTER_NOTE_RESPONSE_SUCCESS,
            getterTypes.GETTER_EDITING_NOTE,
            getterTypes.GETTER_CONNECTION_STRING,
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
                this.deletedImages.push(this.FoundNote.images[id]);
                this.FoundNote.images.splice(id,1);
            }
        },

        async AddOrEditNote(form){
            if (this.FoundNote.id) {
                await this[actionTypes.ACTION_EDIT_NOTE] (form);
            }
            else await this[actionTypes.ACTION_ADD_NOTE] (form);
            if (this[getterTypes.GETTER_NOTE_RESPONSE_SUCCESS]) {
                this.$router.push({name: 'Home'});
            }
        },

        CreateForm(){
            let images = this.$refs.NoteImages.files;
            let form = new FormData;
            form.append('id', this.FoundNote.id);
            form.append('name', this.FoundNote.name);
            form.append('text', this.FoundNote.text);
            for (let tag of this.FoundNote.tags){
                form.append('tags', tag); 
            }
            for (let image of images) {
                form.append('images', image);
            }
            if (this.FoundNote.id){
                form.append('leftImages', this.FoundNote.images);
                form.append('deletedImages', this.deletedImages);
                form.append('pinned', this.FoundNote.pinned);
            }
            this.AddOrEditNote(form);
        },
        connectionString(image){
            return this[getterTypes.GETTER_CONNECTION_STRING] + image;
        },
    },
    
    async mounted(){
        await this.setFoundNote();
    },
}
</script>

<style lang="scss" scoped>
.delete-image-button{
    @include basic-button();
    background-image: url($delete_icon);
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