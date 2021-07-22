<template>
    <div class="SearchResult">
        {{this.foundNotes}}
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { moduleName, getterTypes, actionTypes} from "../store/modules/notes"

export default {
    methods: { 
        ...mapActions(moduleName, [actionTypes.ACTION_FIND_NOTES]),
        Search(){
            let SearchQuery = this.$route.query.search;
            this[actionTypes.ACTION_FIND_NOTES](SearchQuery);
        }
    },
    created() {
        this.Search();
    },
    computed: {
        ...mapGetters(moduleName, [getterTypes.GETTER_FOUND_NOTES]),
        foundNotes(){
            return this[getterTypes.GETTER_FOUND_NOTES];
        }
    }
}
</script>

<style>

</style>