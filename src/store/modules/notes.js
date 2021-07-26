import axios from 'axios'
import {getCookie} from '../../utils/cookie control/cookie.js';
export const moduleName = 'notesModule';

export const actionTypes = {
    ACTION_PIN_NOTE: 'ACTION_PIN_NOTE',
    ACTION_COPY_NOTE: 'ACTION_COPY_NOTE',
    ACTION_ADD_NOTE: 'ACTION_ADD_NOTE',
    ACTION_EDIT_NOTE: 'ACTION_EDIT_NOTE',
    ACTION_DELETE_NOTE: 'ACTION_DELETE_NOTE',
    ACTION_GET_NOTES: 'ACTION_GET_NOTES',
    ACTION_GET_NOTE: 'ACTION_GET_NOTE',
    ACTION_CLEAR_NOTE: 'ACTION_CLEAR_NOTE',
}

export const getterTypes = {
    GETTER_EDITING_NOTE: 'GETTER_EDITING_NOTE',
    GETTER_NOTE_RESPONSE_ERROR: 'GETTER_NOTE_RESPONSE_ERROR',
    GETTER_NOTE_RESPONSE_SUCCESS: 'GETTER_NOTE_RESPONSE_SUCCESS',
    GETTER_PINNED_NOTES: 'GETTER_PINNED_NOTES',
    GETTER_OTHER_NOTES: 'GETTER_OTHER_NOTES',
    GETTER_PINNED_PAGES_COUNT: 'GETTER_PINNED_PAGES_COUNT',
    GETTER_OTHER_PAGES_COUNT: 'GETTER_OTHER_PAGES_COUNT',
}

export const mutationTypes = {
    MUTATION_NOTE_RESPONSE_ERROR: 'MUTATION_NOTE_RESPONSE_ERROR',
    MUTATION_NOTE_RESPONSE_SUCCESS: 'MUTATION_NOTE_RESPONSE_SUCCESS',
    MUTATION_FOUND_NOTE: 'MUTATION_FIND_NOTE',
    MUTATION_SET_PINNED_NOTES: 'MUTATION_SET_PINNED_NOTES',
    MUTATION_SET_OTHER_NOTES: 'MUTATION_SET_OTHER_NOTES',
    MUTATION_CLEAR_NOTE: 'MUTATION_CLEAR_NOTE',
    MUTATION_CLEAR_RESPONSE: 'MUTATION_CLEAR_RESPONSE'
}

export default {
    moduleName,

    namespaced: true,

    state: () => ({
        editing_note: {},
        pinned_notes: [],
        other_notes: [],
        response_error: '',
        response_success: '',
        pinned_pages: 0,
        other_pages: 0,
    }),

    actions: {
         async [actionTypes.ACTION_ADD_NOTE] ({commit}, note){
            commit (mutationTypes.MUTATION_CLEAR_RESPONSE);
            try{
                const jwt = getCookie('jwt');
                const response = await axios.post(process.env.VUE_APP_NOTES_API+'createNote', {note:note, jwt:jwt});
                commit (mutationTypes.MUTATION_NOTE_RESPONSE_SUCCESS, response);
            }
            catch (err) {
                commit (mutationTypes.MUTATION_NOTE_RESPONSE_ERROR, err);
            }
        }, 

        async [actionTypes.ACTION_PIN_NOTE] ({commit}, noteId){
            commit (mutationTypes.MUTATION_CLEAR_RESPONSE);
            try{
                const jwt = getCookie('jwt');
                const response = await axios.post(process.env.VUE_APP_NOTES_API+'pinNote/'+noteId, {jwt: jwt});
                commit (mutationTypes.MUTATION_NOTE_RESPONSE_SUCCESS, response);
            }
            catch (err) {
                console.log(err);
            }
        },

        async [actionTypes.ACTION_COPY_NOTE] ({commit}, noteId){
            commit (mutationTypes.MUTATION_CLEAR_RESPONSE);
            try{
                const jwt = getCookie('jwt');
                const response = await axios.post(process.env.VUE_APP_NOTES_API+'duplicateNote/'+noteId, {jwt: jwt});
                commit (mutationTypes.MUTATION_NOTE_RESPONSE_SUCCESS, response);
            }
            catch (err) {
                console.log(err);
            }
        },
        
        async [actionTypes.ACTION_DELETE_NOTE] ({commit}, noteId){
            commit (mutationTypes.MUTATION_CLEAR_RESPONSE);  
            try{
                const jwt = getCookie('jwt');
                const response = await axios.post(process.env.VUE_APP_NOTES_API+'deleteNote/'+noteId, {jwt: jwt});
                commit (mutationTypes.MUTATION_NOTE_RESPONSE_SUCCESS, response);
            }
            catch (err) {
                console.log(err);
            }
        },

        async [actionTypes.ACTION_GET_NOTE] ({commit}, noteId){
            commit (mutationTypes.MUTATION_CLEAR_RESPONSE);
            try{
                console.log(noteId);
                if (noteId){
                    const jwt = getCookie('jwt');
                    const response = await axios.post(process.env.VUE_APP_NOTES_API+'getNote/'+noteId, {jwt: jwt});
                    commit (mutationTypes.MUTATION_FOUND_NOTE, response.data);
                }
                else commit(mutationTypes.MUTATION_CLEAR_NOTE);
            }
            catch (err) {
                commit (mutationTypes.MUTATION_NOTE_RESPONSE_ERROR, err);
                commit(mutationTypes.MUTATION_CLEAR_NOTE);
            }
        },

        async [actionTypes.ACTION_EDIT_NOTE] ({commit}, note){
            commit (mutationTypes.MUTATION_CLEAR_RESPONSE);
            try{
                const jwt = getCookie('jwt');
                const response = await axios.post(process.env.VUE_APP_NOTES_API+'editNote', {note:note, jwt:jwt});
                commit (mutationTypes.MUTATION_NOTE_RESPONSE_SUCCESS, response);
            }
            catch (err) {
                commit (mutationTypes.MUTATION_NOTE_RESPONSE_ERROR, err)
            }
        },

        async [actionTypes.ACTION_GET_NOTES] ({commit}, data) {
            commit (mutationTypes.MUTATION_CLEAR_RESPONSE);
            try{
                const jwt = getCookie('jwt');
                const notes = await axios.post(process.env.VUE_APP_NOTES_API+'getNotes/', {jwt: jwt, queryString: data.queryString, pinned: data.pinned, page: data.page});
                if (data.pinned) commit(mutationTypes.MUTATION_SET_PINNED_NOTES, notes.data);
                else commit(mutationTypes.MUTATION_SET_OTHER_NOTES, notes.data);
            }
            catch (err) {
                console.log(err);
            }
        },

        [actionTypes.ACTION_CLEAR_NOTE] ({commit}){
            commit (mutationTypes.MUTATION_CLEAR_RESPONSE);
            commit (mutationTypes.MUTATION_CLEAR_NOTE);
        },
    },

    mutations: {
        [mutationTypes.MUTATION_NOTE_RESPONSE_ERROR] (state, err){
            state.response_success = ''
            state.response_error = err;
        },

        [mutationTypes.MUTATION_NOTE_RESPONSE_SUCCESS] (state, response){
            state.response_error = '';
            state.response_success = response;
        },

        [mutationTypes.MUTATION_FOUND_NOTE] (state, note){
            state.editing_note = note;
        },

        [mutationTypes.MUTATION_SET_PINNED_NOTES] (state, notes){
            state.pinned_notes = notes[0];
            state.pinned_pages = notes[1];
        },

        [mutationTypes.MUTATION_SET_OTHER_NOTES] (state, notes){
            state.other_notes = notes[0];
            state.other_pages = notes[1];
        },

        [mutationTypes.MUTATION_CLEAR_NOTE] (state){
            const cleanNote = {
                id: '',
                name: '',
                text: '',
                tags: [],
                images: [],
                pinned: false, 
            };
            state.editing_note = cleanNote;
        },

        [mutationTypes.MUTATION_CLEAR_RESPONSE] (state){
            state.response_error = '';
            state.response_success = '';
        }
    },

    getters: {
        [getterTypes.GETTER_EDITING_NOTE]: (state) => state.editing_note,
        [getterTypes.GETTER_NOTE_RESPONSE_ERROR]: (state) => state.response_error,
        [getterTypes.GETTER_NOTE_RESPONSE_SUCCESS]: (state) => state.response_success,
        [getterTypes.GETTER_PINNED_NOTES]: (state) => state.pinned_notes,
        [getterTypes.GETTER_OTHER_NOTES]: (state) => state.other_notes,
        [getterTypes.GETTER_PINNED_PAGES_COUNT]: (state) => state.pinned_pages,
        [getterTypes.GETTER_OTHER_PAGES_COUNT]: (state) => state.other_pages
    }
}