<script>
export default {
    methods:{
        PopUpMessage(error, success, message = ''){
            if (!message) message = error.data ? 
               error.data : success.data;
            let popupBackground = document.querySelector("#Popup");
            let popupMessage = document.querySelector("#PopupMessage");
            popupMessage.innerHTML = message;
            popupBackground.classList.remove("invisible");
            popupBackground.classList.add("animated", "fadeIn");
            setTimeout( () => {
                popupBackground.classList.remove("fadeIn", "animated");
                popupBackground.classList.add("fadeOut", "animated");
                setTimeout(() => {
                popupBackground.classList.remove("animated", "fadeOut");
                popupBackground.classList.add("invisible");
                }, 200);
            }, 1800);
        }
    }
}
</script>